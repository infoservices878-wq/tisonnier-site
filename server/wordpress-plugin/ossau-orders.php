<?php
/**
 * Plugin Name: AM Holzbrennstoffe UG - Commandes API
 * Description: Crée les commandes WooCommerce envoyées depuis le formulaire AM Holzbrennstoffe UG.
 * Version: 1.14.0
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/ossau-invoices.php';

add_filter( 'allowed_http_origins', function ( $origins ) {
	$frontend_url = defined( 'OSSAU_FRONTEND_URL' ) ? untrailingslashit( OSSAU_FRONTEND_URL ) : '';
	$frontend_origin = $frontend_url
		? wp_parse_url( $frontend_url, PHP_URL_SCHEME ) . '://' . wp_parse_url( $frontend_url, PHP_URL_HOST )
		: '';

	if ( $frontend_origin && ! in_array( $frontend_origin, $origins, true ) ) {
		$origins[] = $frontend_origin;
	}

	return $origins;
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'ossau/v1', '/command', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_create_order',
		'permission_callback' => 'ossau_order_api_permission',
	) );

	register_rest_route( 'ossau/v1', '/contact', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_send_contact_message',
		'permission_callback' => 'ossau_order_api_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/register', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_register_customer',
		'permission_callback' => 'ossau_public_auth_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/login', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_login_customer',
		'permission_callback' => 'ossau_public_auth_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/forgot-password', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_forgot_password',
		'permission_callback' => 'ossau_public_auth_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/reset-password', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_reset_password',
		'permission_callback' => 'ossau_public_auth_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/verify-email', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_verify_email',
		'permission_callback' => 'ossau_public_auth_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/me', array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => 'ossau_get_current_customer',
		'permission_callback' => 'ossau_auth_session_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/logout', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_logout_customer',
		'permission_callback' => 'ossau_auth_session_permission',
	) );

	register_rest_route( 'ossau/v1', '/auth/orders', array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => 'ossau_get_customer_orders',
		'permission_callback' => 'ossau_auth_session_permission',
	) );
} );

function ossau_order_api_permission( WP_REST_Request $request ) {
	if ( ! defined( 'OSSAU_ORDER_API_TOKEN' ) || ! OSSAU_ORDER_API_TOKEN ) {
		return new WP_Error( 'ossau_api_not_configured', 'Le jeton API des commandes n’est pas configuré.', array( 'status' => 500 ) );
	}

	$authorization = $request->get_header( 'authorization' );
	$token = preg_replace( '/^Bearer\\s+/i', '', (string) $authorization );

	return hash_equals( OSSAU_ORDER_API_TOKEN, $token );
}

function ossau_auth_rate_limit_key() {
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	return 'ossau_auth_attempts_v2_' . md5( $ip );
}

function ossau_public_auth_permission() {
	$key = ossau_auth_rate_limit_key();
	$attempts = (int) get_transient( $key );

	if ( $attempts >= 10 ) {
		return new WP_Error( 'auth_rate_limited', 'Trop de tentatives. Veuillez reessayer dans quelques minutes.', array( 'status' => 429 ) );
	}

	return true;
}

function ossau_record_auth_failure() {
	$key = ossau_auth_rate_limit_key();
	$attempts = (int) get_transient( $key );
	set_transient( $key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
}

function ossau_auth_token_from_request( WP_REST_Request $request ) {
	$authorization = $request->get_header( 'authorization' );
	return preg_replace( '/^Bearer\s+/i', '', (string) $authorization );
}

function ossau_auth_session_key( $token ) {
	return 'ossau_session_' . hash( 'sha256', $token );
}

function ossau_get_authenticated_customer( WP_REST_Request $request ) {
	$token = ossau_auth_token_from_request( $request );
	if ( ! $token ) {
		return new WP_Error( 'auth_required', 'Connexion requise.', array( 'status' => 401 ) );
	}

	$user_id = (int) get_transient( ossau_auth_session_key( $token ) );
	$user = $user_id ? get_user_by( 'id', $user_id ) : false;
	if ( ! $user ) {
		return new WP_Error( 'invalid_session', 'Votre session a expire. Veuillez vous reconnecter.', array( 'status' => 401 ) );
	}

	return $user;
}

function ossau_auth_session_permission( WP_REST_Request $request ) {
	$user = ossau_get_authenticated_customer( $request );
	return is_wp_error( $user ) ? $user : true;
}

function ossau_customer_name( WP_User $user ) {
	$name = trim( $user->first_name . ' ' . $user->last_name );
	return $name ?: $user->display_name;
}

function ossau_customer_payload( WP_User $user, $token = null ) {
	$payload = array(
		'id'    => $user->ID,
		'name'  => ossau_customer_name( $user ),
		'email' => $user->user_email,
	);

	if ( $token ) {
		$payload['token'] = $token;
	}

	return $payload;
}

function ossau_issue_customer_session( WP_User $user ) {
	$token = wp_generate_password( 64, false, false );
	set_transient( ossau_auth_session_key( $token ), $user->ID, 14 * DAY_IN_SECONDS );
	return $token;
}

function ossau_auth_success_response( WP_User $user ) {
	$token = ossau_issue_customer_session( $user );
	delete_transient( ossau_auth_rate_limit_key() );

	return new WP_REST_Response( array(
		'success' => true,
		'user'    => ossau_customer_payload( $user, $token ),
	), 200 );
}

function ossau_pending_registration_key( $key ) {
	return 'ossau_pending_registration_' . hash( 'sha256', $key );
}

function ossau_encrypt_pending_password( $password ) {
	$iv = random_bytes( openssl_cipher_iv_length( 'aes-256-cbc' ) );
	$encrypted = openssl_encrypt( $password, 'aes-256-cbc', wp_salt( 'auth' ), OPENSSL_RAW_DATA, $iv );
	return base64_encode( $iv . $encrypted );
}

function ossau_decrypt_pending_password( $encrypted ) {
	$encoded = base64_decode( $encrypted, true );
	$iv_length = openssl_cipher_iv_length( 'aes-256-cbc' );
	if ( false === $encoded || strlen( $encoded ) <= $iv_length ) {
		return false;
	}

	return openssl_decrypt( substr( $encoded, $iv_length ), 'aes-256-cbc', wp_salt( 'auth' ), OPENSSL_RAW_DATA, substr( $encoded, 0, $iv_length ) );
}

function ossau_send_verification_email( $email, $name, $key ) {
	$frontend_url = defined( 'OSSAU_FRONTEND_URL' ) ? untrailingslashit( OSSAU_FRONTEND_URL ) : '';

	if ( ! $frontend_url ) {
		return false;
	}

	$verify_url = add_query_arg(
		array( 'key' => $key, 'email' => $email ),
		$frontend_url . '/verification-email'
	);
	$message = sprintf(
		'<p>Bonjour %s,</p><p>Merci pour la creation de votre espace client AM Holzbrennstoffe UG. Confirmez votre adresse e-mail pour activer votre compte et acceder a votre tableau de bord.</p><p><a href="%s">Confirmer mon adresse e-mail</a></p><p>Ce lien est valable pendant 48 heures. Si vous n etes pas a l origine de cette inscription, vous pouvez ignorer cet e-mail.</p>',
		esc_html( $name ),
		esc_url( $verify_url )
	);

	$sent = wp_mail( $email, 'Confirmez votre adresse e-mail - AM Holzbrennstoffe UG', $message, ossau_order_email_headers() );
	if ( ! $sent ) {
		error_log( sprintf( '[AM Holzbrennstoffe UG] Echec de l envoi de verification vers %s.', $email ) );
	}

	return $sent;
}

function ossau_customer_username( $email ) {
	$base = sanitize_user( strstr( $email, '@', true ), true );
	$base = $base ?: 'client';
	$username = $base;
	$suffix = 2;

	while ( username_exists( $username ) ) {
		$username = $base . $suffix;
		$suffix++;
	}

	return $username;
}

function ossau_register_customer( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	$name = trim( sanitize_text_field( $data['name'] ?? '' ) );
	$email = sanitize_email( $data['email'] ?? '' );
	$password = (string) ( $data['password'] ?? '' );

	if ( ! $name || ! is_email( $email ) || strlen( $password ) < 8 ) {
		ossau_record_auth_failure();
		return new WP_Error( 'invalid_registration', 'Renseignez votre nom, une adresse e-mail valide et un mot de passe de 8 caracteres minimum.', array( 'status' => 422 ) );
	}

	if ( email_exists( $email ) ) {
		ossau_record_auth_failure();
		return new WP_Error( 'email_exists', 'Cette adresse e-mail est deja enregistree. Connectez-vous.', array( 'status' => 409 ) );
	}

	$key = wp_generate_password( 64, false, false );
	set_transient( ossau_pending_registration_key( $key ), array(
		'name'     => $name,
		'email'    => $email,
		'password' => ossau_encrypt_pending_password( $password ),
	), 2 * DAY_IN_SECONDS );

	if ( ! ossau_send_verification_email( $email, $name, $key ) ) {
		delete_transient( ossau_pending_registration_key( $key ) );
		return new WP_Error( 'verification_email_failed', 'Votre compte n a pas pu etre finalise. Veuillez reessayer.', array( 'status' => 500 ) );
	}

	return new WP_REST_Response( array(
		'success'              => true,
		'verification_required' => true,
		'message'              => 'Un e-mail de confirmation vient de vous etre envoye.',
	), 201 );
}

function ossau_login_customer( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	$email = sanitize_email( $data['email'] ?? '' );
	$password = (string) ( $data['password'] ?? '' );
	$user = $email ? get_user_by( 'email', $email ) : false;
	if ( $user && '0' === get_user_meta( $user->ID, 'ossau_email_verified', true ) ) {
		return new WP_Error( 'email_not_verified', 'Confirmez votre adresse e-mail depuis le message reçu avant de vous connecter.', array( 'status' => 403 ) );
	}
	$authenticated_user = $user ? wp_authenticate( $user->user_login, $password ) : new WP_Error( 'invalid_login' );

	if ( is_wp_error( $authenticated_user ) ) {
		ossau_record_auth_failure();
		return new WP_Error( 'invalid_login', 'E-mail ou mot de passe incorrect.', array( 'status' => 401 ) );
	}

	return ossau_auth_success_response( $authenticated_user );
}

function ossau_verify_email( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	$key = sanitize_text_field( $data['key'] ?? '' );
	$email = sanitize_email( $data['email'] ?? '' );
	$registration = get_transient( ossau_pending_registration_key( $key ) );

	if ( ! is_array( $registration ) || empty( $registration['email'] ) || ! hash_equals( strtolower( $registration['email'] ), strtolower( $email ) ) ) {
		return new WP_Error( 'invalid_verification_key', 'Ce lien de confirmation est invalide ou expire.', array( 'status' => 400 ) );
	}

	if ( email_exists( $registration['email'] ) ) {
		delete_transient( ossau_pending_registration_key( $key ) );
		return new WP_Error( 'email_exists', 'Cette adresse e-mail est deja enregistree. Connectez-vous.', array( 'status' => 409 ) );
	}

	$password = ossau_decrypt_pending_password( $registration['password'] ?? '' );
	if ( false === $password ) {
		return new WP_Error( 'invalid_registration', 'Les donnees de creation du compte sont invalides. Veuillez recommencer.', array( 'status' => 400 ) );
	}

	$username = ossau_customer_username( $registration['email'] );
	$user_id = function_exists( 'wc_create_new_customer' )
		? wc_create_new_customer( $registration['email'], $username, $password )
		: wp_create_user( $username, $password, $registration['email'] );
	if ( is_wp_error( $user_id ) ) {
		return new WP_Error( 'registration_failed', $user_id->get_error_message(), array( 'status' => 422 ) );
	}

	$name_parts = preg_split( '/\s+/', $registration['name'], 2 );
	wp_update_user( array(
		'ID'           => $user_id,
		'display_name' => $registration['name'],
		'nickname'     => $registration['name'],
		'first_name'   => $name_parts[0],
		'last_name'    => $name_parts[1] ?? '',
	) );
	update_user_meta( $user_id, 'ossau_email_verified', '1' );
	delete_transient( ossau_pending_registration_key( $key ) );

	return new WP_REST_Response( array(
		'success' => true,
		'message' => 'Votre adresse e-mail est confirmee. Vous pouvez maintenant vous connecter.',
	), 200 );
}

function ossau_forgot_password( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	$email = sanitize_email( $data['email'] ?? '' );

	if ( is_email( $email ) ) {
		$user = get_user_by( 'email', $email );
		if ( $user ) {
			$key = get_password_reset_key( $user );
			$frontend_url = defined( 'OSSAU_FRONTEND_URL' ) ? untrailingslashit( OSSAU_FRONTEND_URL ) : '';
			if ( ! is_wp_error( $key ) && $frontend_url ) {
				$reset_url = add_query_arg(
					array( 'key' => $key, 'login' => $user->user_login ),
					$frontend_url . '/reinitialisation'
				);
				$subject = 'Reinitialisez votre mot de passe AM Holzbrennstoffe UG';
				$message = sprintf(
					'<p>Bonjour,</p><p>Une demande de reinitialisation de votre mot de passe a ete faite pour votre compte AM Holzbrennstoffe UG.</p><p><a href="%s">Choisir un nouveau mot de passe</a></p><p>Ce lien est valable pendant une duree limitee. Si vous n etes pas a l origine de cette demande, vous pouvez ignorer cet e-mail.</p>',
					esc_url( $reset_url )
				);
				wp_mail( $user->user_email, $subject, $message, ossau_order_email_headers() );
			}
		}
	}

	return new WP_REST_Response( array(
		'success' => true,
		'message' => 'Si un compte correspond a cette adresse, un e-mail de reinitialisation vient d etre envoye.',
	), 200 );
}

function ossau_reset_password( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	$key = sanitize_text_field( $data['key'] ?? '' );
	$login = sanitize_text_field( $data['login'] ?? '' );
	$password = (string) ( $data['password'] ?? '' );

	if ( strlen( $password ) < 8 ) {
		return new WP_Error( 'invalid_password', 'Le mot de passe doit contenir au moins 8 caracteres.', array( 'status' => 422 ) );
	}

	$user = check_password_reset_key( $key, $login );
	if ( is_wp_error( $user ) ) {
		return new WP_Error( 'invalid_reset_key', 'Ce lien de reinitialisation est invalide ou expire.', array( 'status' => 400 ) );
	}

	wp_set_password( $password, $user->ID );
	delete_user_meta( $user->ID, 'user_activation_key' );

	return new WP_REST_Response( array(
		'success' => true,
		'message' => 'Votre mot de passe a ete modifie. Vous pouvez maintenant vous connecter.',
	), 200 );
}

function ossau_get_current_customer( WP_REST_Request $request ) {
	$user = ossau_get_authenticated_customer( $request );
	return new WP_REST_Response( array(
		'success' => true,
		'user'    => ossau_customer_payload( $user ),
	), 200 );
}

function ossau_logout_customer( WP_REST_Request $request ) {
	$token = ossau_auth_token_from_request( $request );
	delete_transient( ossau_auth_session_key( $token ) );

	return new WP_REST_Response( array( 'success' => true ), 200 );
}

function ossau_get_customer_orders( WP_REST_Request $request ) {
	$user = ossau_get_authenticated_customer( $request );
	if ( is_wp_error( $user ) ) {
		return $user;
	}

	if ( ! function_exists( 'wc_get_orders' ) ) {
		return new WP_Error( 'woocommerce_missing', 'WooCommerce doit être activé.', array( 'status' => 500 ) );
	}

	$orders = wc_get_orders( array(
		'billing_email' => $user->user_email,
		'limit'         => 50,
		'orderby'       => 'date',
		'order'         => 'DESC',
		'return'        => 'objects',
	) );

	$payload = array_map( function ( $order ) {
		$items = array();
		foreach ( $order->get_items( 'line_item' ) as $item ) {
			$items[] = array(
				'name'     => $item->get_name(),
				'quantity' => (int) $item->get_quantity(),
			);
		}

		return array(
			'id'       => $order->get_id(),
			'reference' => $order->get_meta( '_ossau_order_reference' ) ?: $order->get_order_number(),
			'status'   => $order->get_status(),
			'total'    => $order->get_total(),
			'currency' => $order->get_currency(),
			'date'     => $order->get_date_created() ? $order->get_date_created()->date( 'c' ) : '',
			'items'    => $items,
		);
	}, $orders );

	return new WP_REST_Response( array(
		'success' => true,
		'orders'  => $payload,
	), 200 );
}

function ossau_next_order_reference() {
	global $wpdb;

	$option_name = 'amhug_order_reference_sequence';
	$existing = get_option( $option_name, null );

	if ( null === $existing ) {
		if ( add_option( $option_name, '135', '', false ) ) {
			return 134;
		}
	}

	$wpdb->query(
		$wpdb->prepare(
			"UPDATE {$wpdb->options} SET option_value = LAST_INSERT_ID(GREATEST(CAST(option_value AS UNSIGNED), 134) + 1) WHERE option_name = %s",
			$option_name
		)
	);

	return max( 134, (int) $wpdb->get_var( 'SELECT LAST_INSERT_ID()' ) - 1 );
}

function ossau_order_email_headers( $reply_to = '' ) {
	$reply_to = sanitize_email( $reply_to );
	if ( ! is_email( $reply_to ) ) {
		$reply_to = 'info@amholzbrennstoffeug.de';
	}

	return array(
		'Content-Type: text/html; charset=UTF-8',
		'From: AM Holzbrennstoffe UG <info@amholzbrennstoffeug.de>',
		'Reply-To: ' . $reply_to,
	);
}

function ossau_order_transfer_details( $reference ) {
	$bank = ossau_invoice_bank_details();

	return sprintf(
		'<div style="margin-top:28px;padding:20px;background:#f7f4ee;border:1px solid #e6e1d8;border-left:4px solid #b8451f;"><div style="font-size:12px;color:#6f6a60;text-transform:uppercase;margin-bottom:10px;">Informationen zur Überweisung</div><div style="font-size:14px;line-height:1.9;color:#24241f;"><strong>Kontoinhaber:</strong> %s<br><strong>IBAN:</strong> %s<br><strong>BIC:</strong> %s</div><p style="margin:14px 0 0;color:#6f6a60;font-size:12px;line-height:1.5;">Bitte geben Sie die Bestellnummer <strong>%s</strong> als Verwendungszweck an.</p></div>',
		esc_html( $bank['holder'] ),
		esc_html( $bank['iban'] ),
		esc_html( $bank['bic'] ),
		esc_html( $reference )
	);
}

function ossau_send_contact_message( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	$name = sanitize_text_field( $data['name'] ?? '' );
	$email = sanitize_email( $data['email'] ?? '' );
	$message = sanitize_textarea_field( $data['message'] ?? '' );

	if ( ! $name || ! is_email( $email ) || ! $message ) {
		return new WP_Error( 'invalid_contact_message', 'Veuillez renseigner votre nom, une adresse e-mail valide et votre message.', array( 'status' => 422 ) );
	}

	$recipient = defined( 'OSSAU_CONTACT_EMAIL' ) && is_email( OSSAU_CONTACT_EMAIL )
		? OSSAU_CONTACT_EMAIL
		: 'info@amholzbrennstoffeug.de';
	$subject = sprintf( '[AM Holzbrennstoffe UG] Nouveau message de %s', $name );
	$email_html = sprintf(
		'<!doctype html><html><body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#24241f;"><div style="max-width:640px;margin:0 auto;padding:28px 16px;"><div style="background:#2e3b26;padding:28px 32px;color:#fff;"><div style="font-size:12px;letter-spacing:1.6px;color:#d4a84b;font-weight:700;">AM HOLZBRENNSTOFFE UG</div><h1 style="font-size:25px;line-height:1.25;margin:12px 0 0;color:#fff;">Nouveau message de contact</h1></div><div style="background:#fff;padding:30px 32px;"><p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Un visiteur a envoyé un message depuis le formulaire du site.</p><div style="padding:16px;background:#f7f4ee;border-left:4px solid #b8451f;margin-bottom:24px;line-height:1.7;"><strong>Nom :</strong> %s<br><strong>E-mail :</strong> <a style="color:#2e3b26;" href="mailto:%s">%s</a></div><div style="font-size:12px;color:#6f6a60;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div><div style="padding:18px;background:#f9f8f5;border:1px solid #e6e1d8;white-space:pre-wrap;font-size:15px;line-height:1.6;">%s</div></div><div style="padding:18px 32px;color:#6f6a60;font-size:12px;line-height:1.5;">Repondez directement a cet e-mail pour contacter le client.</div></div></div></body></html>',
		esc_html( $name ),
		esc_attr( $email ),
		esc_html( $email ),
		esc_html( $message )
	);
	$headers = array(
		'Content-Type: text/html; charset=UTF-8',
		'From: AM Holzbrennstoffe UG <info@amholzbrennstoffeug.de>',
		'Reply-To: ' . $email,
	);

	if ( ! wp_mail( $recipient, $subject, $email_html, $headers ) ) {
		return new WP_Error( 'contact_email_failed', 'Le message n a pas pu etre envoye. Veuillez reessayer.', array( 'status' => 500 ) );
	}

	return new WP_REST_Response( array(
		'success' => true,
		'message' => 'Votre message a bien ete envoye.',
	), 201 );
}

function ossau_order_email( WC_Order $order, $reference, $recipient, $is_internal = false, $attachments = array() ) {
	if ( ! is_email( $recipient ) ) {
		return false;
	}

	$customer_name = trim( $order->get_formatted_billing_full_name() ) ?: ( $is_internal ? 'Client AM Holzbrennstoffe UG' : 'Kunde von AM Holzbrennstoffe UG' );
	$delivery_mode = $is_internal ? 'Livraison sur palette a l adresse indiquee' : 'Palettenlieferung an die angegebene Adresse';
	$item_rows = '';

	foreach ( $order->get_items( 'line_item' ) as $item ) {
		$item_rows .= sprintf(
			'<tr><td style="padding:12px 0;border-bottom:1px solid #e6e1d8;color:#24241f;">%s <span style="color:#6f6a60;">x %d</span></td><td style="padding:12px 0;border-bottom:1px solid #e6e1d8;text-align:right;color:#24241f;font-weight:700;">%s</td></tr>',
			esc_html( $item->get_name() ),
			(int) $item->get_quantity(),
			wp_kses_post( $order->get_formatted_line_subtotal( $item ) )
		);
	}

	$heading = $is_internal ? 'Nouvelle commande a preparer' : 'Ihre Bestellung ist verbindlich bestätigt';
	$intro = $is_internal
		? sprintf( 'Une nouvelle commande vient d etre enregistree au nom de <strong>%s</strong>.', esc_html( $customer_name ) )
		: sprintf( 'Guten Tag %s,<br>vielen Dank für Ihre Bestellung bei AM Holzbrennstoffe UG. Mit Eingang Ihrer Bestellung ist der Kaufvertrag zustande gekommen. Bitte überweisen Sie den Gesamtbetrag innerhalb von 7 Kalendertagen nach Zugang dieser Bestätigung. Die Bankverbindung, der Verwendungszweck und die Zahlungsreferenz finden Sie unten. Nach Zahlungseingang bereiten wir Ihre Bestellung vor.', esc_html( $customer_name ) );
	$formatted_billing_address = wp_kses_post( $order->get_formatted_billing_address() );
	$contact = implode( '<br>', array_filter( array(
		esc_html( $order->get_billing_email() ),
		esc_html( $order->get_billing_phone() ),
		$formatted_billing_address,
	), static function ( $line ) {
		return '' !== trim( (string) $line );
	} ) );
	$subject = $is_internal
		? sprintf( '[AM Holzbrennstoffe UG] Nouvelle commande %s', $reference )
		: sprintf( '[AM Holzbrennstoffe UG] Vertragsbestätigung %s', $reference );
	$transfer_details = $is_internal ? '' : ossau_order_transfer_details( $reference );
	$delivery_day = sanitize_text_field( $order->get_meta( '_ossau_delivery_day' ) );
	$delivery_window = sanitize_key( $order->get_meta( '_ossau_delivery_window' ) );
	$delivery_window_labels = array(
		'08-12' => '8:00–12:00',
		'14-18' => '14:00–18:00',
		'08-10' => '8:00–10:00',
		'14-16' => '14:00–16:00',
	);
	$delivery_preferences = array();
	if ( $delivery_day ) {
		$delivery_preferences[] = ( $is_internal ? 'jour souhaité : ' : 'Wunschtag: ' ) . $delivery_day;
	}
	if ( isset( $delivery_window_labels[ $delivery_window ] ) ) {
		$delivery_preferences[] = ( $is_internal ? 'créneau souhaité : ' : 'Zeitfenster: ' ) . $delivery_window_labels[ $delivery_window ];
	}
	if ( $delivery_preferences ) {
		$delivery_mode .= ' · ' . implode( ' · ', $delivery_preferences );
	}

	$invoice_link = $is_internal ? '' : sprintf(
		'<p style="margin:18px 0 0;"><a style="display:inline-block;padding:12px 18px;background:#2e3b26;color:#fff;text-decoration:none;font-weight:700;" href="%s">Rechnung als PDF herunterladen</a></p>',
		esc_url( ossau_invoice_download_url( $order ) )
	);
	$message = sprintf(
		'<!doctype html><html><body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#24241f;"><div style="max-width:640px;margin:0 auto;padding:28px 16px;"><div style="background:#2e3b26;padding:28px 32px;color:#fff;"><div style="font-size:12px;letter-spacing:1.6px;color:#d4a84b;font-weight:700;">AM HOLZBRENNSTOFFE UG</div><h1 style="font-size:25px;line-height:1.25;margin:12px 0 0;color:#fff;">%s</h1></div><div style="background:#fff;padding:30px 32px;"><p style="font-size:16px;line-height:1.6;margin:0 0 24px;">%s</p><div style="padding:16px;background:#f7f4ee;border-left:4px solid #b8451f;margin-bottom:24px;"><div style="font-size:12px;color:#6f6a60;text-transform:uppercase;letter-spacing:1px;">Reference de commande</div><strong style="display:block;font-size:21px;margin-top:5px;color:#24241f;">%s</strong></div><table style="width:100%%;border-collapse:collapse;font-size:14px;"><thead><tr><th style="text-align:left;padding-bottom:9px;color:#6f6a60;font-size:12px;text-transform:uppercase;letter-spacing:.8px;">Articles</th><th style="text-align:right;padding-bottom:9px;color:#6f6a60;font-size:12px;text-transform:uppercase;letter-spacing:.8px;">Montant</th></tr></thead><tbody>%s</tbody><tfoot><tr><td style="padding-top:16px;font-weight:700;font-size:16px;">Total TTC</td><td style="padding-top:16px;text-align:right;font-weight:700;font-size:18px;">%s</td></tr></tfoot></table>%s%s<div style="margin-top:28px;padding-top:20px;border-top:1px solid #e6e1d8;font-size:14px;line-height:1.6;"><strong>Mode de reception :</strong> %s<br><strong>Coordonnees client :</strong><br>%s</div></div><div style="padding:18px 32px;color:#6f6a60;font-size:12px;line-height:1.5;">AM Holzbrennstoffe UG · info@amholzbrennstoffeug.de<br>Conservez la reference %s dans le libelle de votre virement.</div></div></div></body></html>',
		esc_html( $heading ),
		$intro,
		esc_html( $reference ),
		$item_rows,
		wp_kses_post( $order->get_formatted_order_total() ),
		$transfer_details,
		$invoice_link,
		esc_html( $delivery_mode ),
		$contact,
		esc_html( $reference )
	);

	if ( ! $is_internal ) {
		$message = str_replace(
			array( 'Reference de commande', 'Articles', 'Montant', 'Total TTC', 'Mode de reception :', 'Coordonnees client :' ),
			array( 'Bestellnummer', 'Artikel', 'Betrag', 'Gesamtbetrag inkl. MwSt.', 'Lieferart:', 'Ihre Kontaktdaten:' ),
			$message
		);
		$message = str_replace(
			sprintf( 'Conservez la reference %s dans le libelle de votre virement.', esc_html( $reference ) ),
			sprintf( 'Bitte geben Sie bei der Überweisung die Bestellnummer %s als Verwendungszweck an.', esc_html( $reference ) ),
			$message
		);
	}

	$reply_to = $is_internal ? $order->get_billing_email() : 'info@amholzbrennstoffeug.de';
	return wp_mail( $recipient, $subject, $message, ossau_order_email_headers( $reply_to ), $attachments );
}

function ossau_send_order_emails( WC_Order $order, $reference ) {
	$admin_sent = (bool) $order->get_meta( '_ossau_admin_email_sent' );
	$customer_sent = (bool) $order->get_meta( '_ossau_customer_email_sent' );
	$invoice_path = ossau_try_generate_order_invoice( $order, $reference );
	if ( ! $invoice_path ) {
		error_log( sprintf( '[AM Holzbrennstoffe UG] Echec de la generation de la facture de la commande %d.', $order->get_id() ) );
	}

	if ( ! $admin_sent ) {
		if ( ossau_order_email( $order, $reference, 'info@amholzbrennstoffeug.de', true ) ) {
			$order->update_meta_data( '_ossau_admin_email_sent', gmdate( 'c' ) );
		} else {
			error_log( sprintf( '[AM Holzbrennstoffe UG] Echec de l e-mail interne pour la commande %d.', $order->get_id() ) );
		}
	}

	if ( ! $customer_sent ) {
		if ( ossau_order_email( $order, $reference, $order->get_billing_email(), false, $invoice_path ? array( $invoice_path ) : array() ) ) {
			$order->update_meta_data( '_ossau_customer_email_sent', gmdate( 'c' ) );
		} else {
			error_log( sprintf( '[AM Holzbrennstoffe UG] Echec de l e-mail client pour la commande %d.', $order->get_id() ) );
		}
	}

	$order->save();
}

function ossau_process_order_emails_async( $order_id, $reference ) {
	$order = wc_get_order( absint( $order_id ) );
	if ( $order ) {
		try {
			ossau_send_order_emails( $order, sanitize_text_field( $reference ) );
		} catch ( Throwable $error ) {
			error_log( sprintf( '[AM Holzbrennstoffe UG] Echec du traitement asynchrone de la commande %d : %s', $order->get_id(), $error->getMessage() ) );
		}
	}
}
add_action( 'ossau_process_order_emails_async', 'ossau_process_order_emails_async', 10, 2 );

function ossau_queue_order_emails( $order_id, $reference ) {
	$args = array( absint( $order_id ), sanitize_text_field( $reference ) );

	try {
		if ( function_exists( 'as_enqueue_async_action' ) ) {
			$action_id = as_enqueue_async_action( 'ossau_process_order_emails_async', $args, 'amhug-orders' );
			if ( $action_id ) {
				return true;
			}
		}
	} catch ( Throwable $error ) {
		error_log( sprintf( '[AM Holzbrennstoffe UG] Impossible de planifier les e-mails de la commande %d via Action Scheduler : %s', absint( $order_id ), $error->getMessage() ) );
	}

	$scheduled = wp_schedule_single_event( time() + 5, 'ossau_process_order_emails_async', $args );
	if ( ! is_wp_error( $scheduled ) && false !== $scheduled ) {
		return true;
	}

	error_log( sprintf( '[AM Holzbrennstoffe UG] Impossible de planifier les e-mails de la commande %d.', absint( $order_id ) ) );
	return false;
}

function ossau_create_order( WP_REST_Request $request ) {
	if ( ! function_exists( 'wc_create_order' ) ) {
		return new WP_Error( 'woocommerce_missing', 'WooCommerce doit être activé.', array( 'status' => 500 ) );
	}

	$data = $request->get_json_params();
	$customer = isset( $data['customer'] ) && is_array( $data['customer'] ) ? $data['customer'] : array();
	$billing = isset( $data['billing'] ) && is_array( $data['billing'] ) ? $data['billing'] : array();
	$items = isset( $data['items'] ) && is_array( $data['items'] ) ? $data['items'] : array();

	if ( empty( $items ) || empty( $billing['first_name'] ) || empty( $billing['last_name'] ) || ! is_email( $billing['email'] ?? '' ) ) {
		return new WP_Error( 'invalid_order', 'Les produits et les coordonnées client sont requis.', array( 'status' => 422 ) );
	}

	$order = wc_create_order();
	$shipping = isset( $data['shipping'] ) && is_array( $data['shipping'] ) ? $data['shipping'] : $billing;
	$order->set_address( $billing, 'billing' );
	$order->set_address( $shipping, 'shipping' );
	$order->set_payment_method( 'bacs' );
	$order->set_payment_method_title( 'Virement bancaire' );

	foreach ( $items as $item ) {
		$name = sanitize_text_field( $item['name'] ?? '' );
		$quantity = max( 1, absint( $item['qty'] ?? 1 ) );
		$price = max( 0, (float) ( $item['price'] ?? 0 ) );
		$product = wc_get_product( absint( $item['id'] ?? 0 ) );

		if ( $product ) {
			$order->add_product( $product, $quantity, array( 'subtotal' => $price * $quantity, 'total' => $price * $quantity ) );
			continue;
		}

		$order_item = new WC_Order_Item_Product();
		$order_item->set_name( $name ?: 'Produit AM Holzbrennstoffe UG' );
		$order_item->set_quantity( $quantity );
		$order_item->set_subtotal( $price * $quantity );
		$order_item->set_total( $price * $quantity );
		$order->add_item( $order_item );
	}

	$reference = sprintf( 'AMHUG%s-%d', wp_date( 'y' ), ossau_next_order_reference() );
	$order->set_shipping_total( max( 0, (float) ( $data['totals']['shipping'] ?? 0 ) ) );
	$order->update_meta_data( '_ossau_order_reference', $reference );
	$order->update_meta_data( '_ossau_delivery_mode', sanitize_key( $customer['deliveryMode'] ?? '' ) );
	$delivery_days = array( 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' );
	$delivery_windows = array( '08-12', '14-18', '08-10', '14-16' );
	$delivery_day = sanitize_text_field( $customer['deliveryDay'] ?? '' );
	$delivery_window = sanitize_key( $customer['deliveryWindow'] ?? '' );
	$order->update_meta_data( '_ossau_delivery_day', in_array( $delivery_day, $delivery_days, true ) ? $delivery_day : '' );
	$order->update_meta_data( '_ossau_delivery_window', in_array( $delivery_window, $delivery_windows, true ) ? $delivery_window : '' );
	$order->set_customer_note( sanitize_textarea_field( $customer['note'] ?? '' ) );
	$order->calculate_totals();
	$order->update_status( 'pending' );
	$order->save();
	$emails_queued = ossau_queue_order_emails( $order->get_id(), $reference );
	$bank = ossau_invoice_bank_details();
	$tax_totals = $order->get_tax_totals();
	$order_items = array();
	foreach ( $order->get_items( 'line_item' ) as $order_item ) {
		$order_items[] = array(
			'name'     => $order_item->get_name(),
			'quantity' => (int) $order_item->get_quantity(),
			'total'    => (float) $order_item->get_total() + (float) $order_item->get_total_tax(),
		);
	}

	return new WP_REST_Response( array(
		'success'  => true,
		'order_id' => $order->get_id(),
		'reference' => $reference,
		'emails_queued' => $emails_queued,
		'admin_email_sent' => (bool) $order->get_meta( '_ossau_admin_email_sent' ),
		'customer_email_sent' => (bool) $order->get_meta( '_ossau_customer_email_sent' ),
		'invoice_url' => ossau_invoice_download_url( $order ),
		'bank_transfer' => $bank,
		'order_subtotal' => (float) $order->get_subtotal() + (float) $order->get_subtotal_tax(),
		'order_shipping' => (float) $order->get_shipping_total() + (float) $order->get_shipping_tax(),
		'order_tax' => (float) $order->get_total_tax(),
		'order_total' => (float) $order->get_total(),
		'order_items' => $order_items,
		'order_tax_lines' => array_values( array_map( static function ( $tax ) {
			return array( 'label' => $tax->label, 'amount' => (float) $tax->amount );
		}, $tax_totals ) ),
	), 201 );
}
