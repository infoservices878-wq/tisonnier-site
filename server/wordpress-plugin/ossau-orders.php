<?php
/**
 * Plugin Name: Ossau Bois - Commandes API
 * Description: Crée les commandes WooCommerce envoyées depuis le formulaire Ossau Bois.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', function () {
	register_rest_route( 'ossau/v1', '/command', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ossau_create_order',
		'permission_callback' => 'ossau_order_api_permission',
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

	return new WP_REST_Response( array(
		'success'  => true,
		'order_id' => $order->get_id(),
		'reference' => $reference,
	), 201 );
}
