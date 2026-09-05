<?php
/**
 * Plugin Name: Ossau Bois - Commandes API
 * Description: Crée les commandes WooCommerce envoyées depuis le formulaire Ossau Bois.
 * Version: 1.8.0
 */

defined( 'ABSPATH' ) || exit;

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

function ossau_email_verification_key( $user_id ) {
	return 'ossau_email_verification_' . absint( $user_id );
}

function ossau_send_verification_email( WP_User $user ) {
	$key = wp_generate_password( 64, false, false );
	set_transient( ossau_email_verification_key( $user->ID ), hash( 'sha256', $key ), 2 * DAY_IN_SECONDS );
	$frontend_url = defined( 'OSSAU_FRONTEND_URL' ) ? untrailingslashit( OSSAU_FRONTEND_URL ) : '';

	if ( ! $frontend_url ) {
		return false;
	}

	$verify_url = add_query_arg(
		array( 'key' => $key, 'email' => rawurlencode( $user->user_email ) ),
		$frontend_url . '/verification-email'
	);
	$message = sprintf(
		'<p>Bonjour %s,</p><p>Merci pour la creation de votre espace client Ossau Bois. Confirmez votre adresse e-mail pour activer votre compte et acceder a votre tableau de bord.</p><p><a href="%s">Confirmer mon adresse e-mail</a></p><p>Ce lien est valable pendant 48 heures. Si vous n etes pas a l origine de cette inscription, vous pouvez ignorer cet e-mail.</p>',
		esc_html( ossau_customer_name( $user ) ),
		esc_url( $verify_url )
	);

	return wp_mail( $user->user_email, 'Confirmez votre adresse e-mail - Ossau Bois', $message, ossau_order_email_headers() );
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

	$username = ossau_customer_username( $email );
	$user_id = function_exists( 'wc_create_new_customer' )
		? wc_create_new_customer( $email, $username, $password )
		: wp_create_user( $username, $password, $email );

	if ( is_wp_error( $user_id ) ) {
		ossau_record_auth_failure();
		return new WP_Error( 'registration_failed', $user_id->get_error_message(), array( 'status' => 422 ) );
	}

	$name_parts = preg_split( '/\s+/', $name, 2 );
	wp_update_user( array(
		'ID'           => $user_id,
		'display_name' => $name,
		'nickname'     => $name,
		'first_name'   => $name_parts[0],
		'last_name'    => $name_parts[1] ?? '',
	) );
	update_user_meta( $user_id, 'ossau_email_verified', '0' );
	$user = get_user_by( 'id', $user_id );

	if ( ! ossau_send_verification_email( $user ) ) {
		wp_delete_user( $user_id );
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
	$user = $email ? get_user_by( 'email', $email ) : false;
	$stored_key = $user ? get_transient( ossau_email_verification_key( $user->ID ) ) : false;

	if ( ! $user || ! $stored_key || ! hash_equals( $stored_key, hash( 'sha256', $key ) ) ) {
		return new WP_Error( 'invalid_verification_key', 'Ce lien de confirmation est invalide ou expire.', array( 'status' => 400 ) );
	}

	update_user_meta( $user->ID, 'ossau_email_verified', '1' );
	delete_transient( ossau_email_verification_key( $user->ID ) );

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
				$subject = 'Reinitialisez votre mot de passe Ossau Bois';
				$message = sprintf(
					'<p>Bonjour,</p><p>Une demande de reinitialisation de votre mot de passe a ete faite pour votre compte Ossau Bois.</p><p><a href="%s">Choisir un nouveau mot de passe</a></p><p>Ce lien est valable pendant une duree limitee. Si vous n etes pas a l origine de cette demande, vous pouvez ignorer cet e-mail.</p>',
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

	$option_name = 'ossau_order_reference_sequence';
	$existing = get_option( $option_name, null );

	if ( null === $existing ) {
		if ( add_option( $option_name, '30001', '', false ) ) {
			return 30000;
		}
	}

	$wpdb->query(
		$wpdb->prepare(
			"UPDATE {$wpdb->options} SET option_value = LAST_INSERT_ID(CAST(option_value AS UNSIGNED) + 1) WHERE option_name = %s",
			$option_name
		)
	);

	return max( 30000, (int) $wpdb->get_var( 'SELECT LAST_INSERT_ID()' ) - 1 );
}

function ossau_order_email_headers() {
	return array(
		'Content-Type: text/html; charset=UTF-8',
		'From: Ossau Bois <info@ossau-bois.com>',
		'Reply-To: info@ossau-bois.com',
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
		: 'info@ossau-bois.com';
	$subject = sprintf( '[Ossau Bois] Nouveau message de %s', $name );
	$email_html = sprintf(
		'<!doctype html><html><body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#24241f;"><div style="max-width:640px;margin:0 auto;padding:28px 16px;"><div style="background:#2e3b26;padding:28px 32px;color:#fff;"><div style="font-size:12px;letter-spacing:1.6px;color:#d4a84b;font-weight:700;">OSSAU BOIS</div><h1 style="font-size:25px;line-height:1.25;margin:12px 0 0;color:#fff;">Nouveau message de contact</h1></div><div style="background:#fff;padding:30px 32px;"><p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Un visiteur a envoyé un message depuis le formulaire du site.</p><div style="padding:16px;background:#f7f4ee;border-left:4px solid #b8451f;margin-bottom:24px;line-height:1.7;"><strong>Nom :</strong> %s<br><strong>E-mail :</strong> <a style="color:#2e3b26;" href="mailto:%s">%s</a></div><div style="font-size:12px;color:#6f6a60;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div><div style="padding:18px;background:#f9f8f5;border:1px solid #e6e1d8;white-space:pre-wrap;font-size:15px;line-height:1.6;">%s</div></div><div style="padding:18px 32px;color:#6f6a60;font-size:12px;line-height:1.5;">Repondez directement a cet e-mail pour contacter le client.</div></div></div></body></html>',
		esc_html( $name ),
		esc_attr( $email ),
		esc_html( $email ),
		esc_html( $message )
	);
	$headers = array(
		'Content-Type: text/html; charset=UTF-8',
		'From: Ossau Bois <info@ossau-bois.com>',
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

function ossau_order_email( WC_Order $order, $reference, $recipient, $is_internal = false ) {
	if ( ! is_email( $recipient ) ) {
		return false;
	}

	$customer_name = trim( $order->get_formatted_billing_full_name() ) ?: 'Client Ossau Bois';
	$delivery_mode = 'pickup' === $order->get_meta( '_ossau_delivery_mode' ) ? 'Retrait a Phalsbourg' : 'Livraison a domicile';
	$item_rows = '';

	foreach ( $order->get_items( 'line_item' ) as $item ) {
		$item_rows .= sprintf(
			'<tr><td style="padding:12px 0;border-bottom:1px solid #e6e1d8;color:#24241f;">%s <span style="color:#6f6a60;">x %d</span></td><td style="padding:12px 0;border-bottom:1px solid #e6e1d8;text-align:right;color:#24241f;font-weight:700;">%s</td></tr>',
			esc_html( $item->get_name() ),
			(int) $item->get_quantity(),
			wp_kses_post( $order->get_formatted_line_subtotal( $item ) )
		);
	}

	$heading = $is_internal ? 'Nouvelle commande a preparer' : 'Votre commande est enregistree';
	$intro = $is_internal
		? sprintf( 'Une nouvelle commande vient d etre enregistree au nom de <strong>%s</strong>.', esc_html( $customer_name ) )
		: sprintf( 'Bonjour %s,<br>Merci pour votre commande. Nous la verifierons et vous contacterons rapidement pour la suite.', esc_html( $customer_name ) );
	$contact = sprintf(
		'%s<br>%s<br>%s',
		esc_html( $order->get_billing_email() ),
		esc_html( $order->get_billing_phone() ),
		nl2br( esc_html( $order->get_formatted_billing_address() ) )
	);
	$subject = $is_internal
		? sprintf( '[Ossau Bois] Nouvelle commande %s', $reference )
		: sprintf( '[Ossau Bois] Confirmation de votre commande %s', $reference );
	$transfer_details = $is_internal ? '' : sprintf(
		'<div style="margin-top:28px;padding:20px;background:#f7f4ee;border:1px solid #e6e1d8;border-left:4px solid #b8451f;"><div style="font-size:12px;color:#6f6a60;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Informations pour votre virement</div><p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#24241f;">Pour régler cette commande, veuillez effectuer le virement sur le compte utilisé pour les encaissements Ossau Bois. Le titulaire bancaire affiché est <strong>AURORA RIGGI</strong> : il s agit du titulaire du compte de règlement associé à l activité Ossau Bois, même si le nom commercial indiqué sur le site est différent.</p><div style="padding-top:14px;border-top:1px solid #e6e1d8;font-size:14px;line-height:1.9;color:#24241f;"><strong>Titulaire du compte :</strong> AURORA RIGGI<br><strong>IBAN :</strong> FR76 1723 8000 0100 4593 7703 827<br><strong>BIC :</strong> SCSYFRP2<br><strong>RIB :</strong> 17238 00001 00459377038 27</div><p style="margin:14px 0 0;color:#6f6a60;font-size:12px;line-height:1.5;">Merci d indiquer la référence <strong>%s</strong> dans le libellé du virement. En cas de doute, contactez-nous avant d effectuer le règlement.</p></div>',
		esc_html( $reference )
	);

	$message = sprintf(
		'<!doctype html><html><body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#24241f;"><div style="max-width:640px;margin:0 auto;padding:28px 16px;"><div style="background:#2e3b26;padding:28px 32px;color:#fff;"><div style="font-size:12px;letter-spacing:1.6px;color:#d4a84b;font-weight:700;">OSSAU BOIS</div><h1 style="font-size:25px;line-height:1.25;margin:12px 0 0;color:#fff;">%s</h1></div><div style="background:#fff;padding:30px 32px;"><p style="font-size:16px;line-height:1.6;margin:0 0 24px;">%s</p><div style="padding:16px;background:#f7f4ee;border-left:4px solid #b8451f;margin-bottom:24px;"><div style="font-size:12px;color:#6f6a60;text-transform:uppercase;letter-spacing:1px;">Reference de commande</div><strong style="display:block;font-size:21px;margin-top:5px;color:#24241f;">%s</strong></div><table style="width:100%%;border-collapse:collapse;font-size:14px;"><thead><tr><th style="text-align:left;padding-bottom:9px;color:#6f6a60;font-size:12px;text-transform:uppercase;letter-spacing:.8px;">Articles</th><th style="text-align:right;padding-bottom:9px;color:#6f6a60;font-size:12px;text-transform:uppercase;letter-spacing:.8px;">Montant</th></tr></thead><tbody>%s</tbody><tfoot><tr><td style="padding-top:16px;font-weight:700;font-size:16px;">Total TTC</td><td style="padding-top:16px;text-align:right;font-weight:700;font-size:18px;">%s</td></tr></tfoot></table>%s<div style="margin-top:28px;padding-top:20px;border-top:1px solid #e6e1d8;font-size:14px;line-height:1.6;"><strong>Mode de reception :</strong> %s<br><strong>Coordonnees client :</strong><br>%s</div></div><div style="padding:18px 32px;color:#6f6a60;font-size:12px;line-height:1.5;">OSSAU BOIS · info@ossau-bois.com<br>Conservez la reference %s dans le libelle de votre virement.</div></div></div></body></html>',
		esc_html( $heading ),
		$intro,
		esc_html( $reference ),
		$item_rows,
		wp_kses_post( $order->get_formatted_order_total() ),
		$transfer_details,
		esc_html( $delivery_mode ),
		$contact,
		esc_html( $reference )
	);

	return wp_mail( $recipient, $subject, $message, ossau_order_email_headers() );
}

function ossau_send_order_emails( WC_Order $order, $reference ) {
	$admin_sent = (bool) $order->get_meta( '_ossau_admin_email_sent' );
	$customer_sent = (bool) $order->get_meta( '_ossau_customer_email_sent' );

	if ( ! $admin_sent && ossau_order_email( $order, $reference, 'info@ossau-bois.com', true ) ) {
		$order->update_meta_data( '_ossau_admin_email_sent', gmdate( 'c' ) );
	}

	if ( ! $customer_sent && ossau_order_email( $order, $reference, $order->get_billing_email() ) ) {
		$order->update_meta_data( '_ossau_customer_email_sent', gmdate( 'c' ) );
	}

	$order->save();
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
		$order_item->set_name( $name ?: 'Produit Ossau Bois' );
		$order_item->set_quantity( $quantity );
		$order_item->set_subtotal( $price * $quantity );
		$order_item->set_total( $price * $quantity );
		$order->add_item( $order_item );
	}

	$reference = sprintf( 'OB-%s-%d', wp_date( 'Y' ), ossau_next_order_reference() );
	$order->set_shipping_total( max( 0, (float) ( $data['totals']['shipping'] ?? 0 ) ) );
	$order->update_meta_data( '_ossau_order_reference', $reference );
	$order->update_meta_data( '_ossau_delivery_mode', sanitize_key( $customer['deliveryMode'] ?? '' ) );
	$order->set_customer_note( sanitize_textarea_field( $customer['note'] ?? '' ) );
	$order->calculate_totals();
	$order->update_status( 'pending' );
	$order->save();
	ossau_send_order_emails( $order, $reference );

	return new WP_REST_Response( array(
		'success'  => true,
		'order_id' => $order->get_id(),
		'reference' => $reference,
		'admin_email_sent' => (bool) $order->get_meta( '_ossau_admin_email_sent' ),
		'customer_email_sent' => (bool) $order->get_meta( '_ossau_customer_email_sent' ),
	), 201 );
}
