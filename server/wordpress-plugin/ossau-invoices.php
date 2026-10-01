<?php

defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', function () {
	register_rest_route( 'ossau/v1', '/invoice/(?P<order_id>\d+)', array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => 'ossau_download_order_invoice',
		'permission_callback' => '__return_true',
	) );
} );

function ossau_invoice_company_details() {
	return array(
		'name'          => 'AM Holzbrennstoffe UG (haftungsbeschränkt)',
		'address'       => 'Dünnenriede 3',
		'city'          => '30853 Langenhagen',
		'country'       => 'Deutschland',
		'manager'       => 'Andreas Müller',
		'register_court' => 'Amtsgericht Hannover',
		'register_number' => 'HRB 223515',
		'email'         => 'info@amholzbrennstoffeug.de',
		'phone'         => '+41 265190382',
	);
}

function ossau_invoice_bank_details() {
	$holder = defined( 'OSSAU_BANK_ACCOUNT_HOLDER' ) ? trim( OSSAU_BANK_ACCOUNT_HOLDER ) : 'ELIAS ALAIN DOMINIQUE PECRIAUX';
	$iban = defined( 'OSSAU_BANK_IBAN' ) ? trim( OSSAU_BANK_IBAN ) : 'DE97 2022 0800 0048 4084 08';
	$bic = defined( 'OSSAU_BANK_BIC' ) ? trim( OSSAU_BANK_BIC ) : 'SXPYDKKKXXX';
	$iban_compact = strtoupper( preg_replace( '/[^A-Z0-9]/i', '', $iban ) );
	$is_demo_data = 'DE' . str_repeat( '0', 22 ) === $iban_compact
		|| false !== stripos( $holder, 'HIER KONTOINHABER' )
		|| false !== stripos( $bic, 'PLATZHALTER' );

	if ( ! $holder || ! $iban || ! $bic || $is_demo_data ) {
		$holder = 'ELIAS ALAIN DOMINIQUE PECRIAUX';
		$iban = 'DE97 2022 0800 0048 4084 08';
		$bic = 'SXPYDKKKXXX';
	}

	return array(
		'holder' => sanitize_text_field( $holder ),
		'iban'   => sanitize_text_field( $iban ),
		'bic'    => sanitize_text_field( $bic ),
	);
}

function ossau_invoice_pdf_string( $value ) {
	$value = wp_strip_all_tags( (string) $value );
	$value = html_entity_decode( $value, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$value = str_replace( array( "\r", "\n", "\t" ), ' ', $value );
	$value = preg_replace( '/\s+/', ' ', trim( $value ) );

	if ( function_exists( 'iconv' ) ) {
		$converted = iconv( 'UTF-8', 'Windows-1252//TRANSLIT', $value );
		if ( false !== $converted ) {
			$value = $converted;
		}
	}

	return $value;
}

function ossau_invoice_pdf_color( $hex ) {
	$hex = ltrim( $hex, '#' );
	return array(
		hexdec( substr( $hex, 0, 2 ) ) / 255,
		hexdec( substr( $hex, 2, 2 ) ) / 255,
		hexdec( substr( $hex, 4, 2 ) ) / 255,
	);
}

function ossau_invoice_pdf_rect( &$stream, $x, $top, $width, $height, $color ) {
	$rgb = ossau_invoice_pdf_color( $color );
	$stream .= sprintf( "q %.3f %.3f %.3f rg %.2f %.2f %.2f %.2f re f Q\n", $rgb[0], $rgb[1], $rgb[2], $x, 842 - $top - $height, $width, $height );
}

function ossau_invoice_pdf_line( &$stream, $x1, $top1, $x2, $top2, $color, $width = 0.6 ) {
	$rgb = ossau_invoice_pdf_color( $color );
	$stream .= sprintf( "q %.3f %.3f %.3f RG %.2f w %.2f %.2f m %.2f %.2f l S Q\n", $rgb[0], $rgb[1], $rgb[2], $width, $x1, 842 - $top1, $x2, 842 - $top2 );
}

function ossau_invoice_pdf_text( &$stream, $value, $x, $top, $size = 10, $bold = false, $color = '24241f' ) {
	$rgb = ossau_invoice_pdf_color( $color );
	$font = $bold ? 'F2' : 'F1';
	$text = str_replace( array( '\\', '(', ')' ), array( '\\\\', '\\(', '\\)' ), ossau_invoice_pdf_string( $value ) );
	$stream .= sprintf( "BT /%s %.2f Tf %.3f %.3f %.3f rg %.2f %.2f Td (%s) Tj ET\n", $font, $size, $rgb[0], $rgb[1], $rgb[2], $x, 842 - $top - $size, $text );
}

function ossau_invoice_pdf_text_right( &$stream, $value, $right, $top, $size = 10, $bold = false, $color = '24241f' ) {
	$plain = ossau_invoice_pdf_string( $value );
	ossau_invoice_pdf_text( $stream, $value, $right - strlen( $plain ) * $size * 0.51, $top, $size, $bold, $color );
}

function ossau_invoice_pdf_wrap( $value, $max_chars ) {
	$value = ossau_invoice_pdf_string( $value );
	return explode( "\n", wordwrap( $value, $max_chars, "\n", true ) );
}

function ossau_invoice_pdf_page_header( &$stream, $reference, $continuation = false ) {
	ossau_invoice_pdf_text( $stream, 'AM HOLZBRENNSTOFFE UG', 40, 30, 16, true, '2e3b26' );
	ossau_invoice_pdf_text( $stream, 'Dünnenriede 3 · 30853 Langenhagen · Deutschland', 40, 52, 8.5, false, '6f6a60' );
	ossau_invoice_pdf_text( $stream, $continuation ? 'FACTURE · SUITE' : 'FACTURE', 390, 28, 17, true, '24241f' );
	ossau_invoice_pdf_text_right( $stream, $reference, 555, 52, 11, true, '6f6a60' );
	ossau_invoice_pdf_line( $stream, 40, 76, 555, 76, '2e3b26', 1.4 );
}

function ossau_invoice_pdf_address_lines( WC_Order $order, $kind ) {
	$getter = 'get_' . $kind . '_';
	$lines = array();
	$company = $order->{$getter . 'company'}();
	$name = trim( $order->{$getter . 'first_name'}() . ' ' . $order->{$getter . 'last_name'}() );
	$address_1 = $order->{$getter . 'address_1'}();
	$address_2 = $order->{$getter . 'address_2'}();
	$postal_code = $order->{$getter . 'postcode'}();
	$city = $order->{$getter . 'city'}();
	$country_code = $order->{$getter . 'country'}();

	foreach ( array( $company, $name, $address_1, $address_2, trim( $postal_code . ' ' . $city ) ) as $line ) {
		if ( $line ) {
			$lines[] = $line;
		}
	}

	$woocommerce = WC();
	$countries = $woocommerce && $woocommerce->countries ? $woocommerce->countries->get_countries() : array();
	if ( $country_code && isset( $countries[ $country_code ] ) ) {
		$lines[] = $countries[ $country_code ];
	}

	return $lines;
}

function ossau_invoice_money( $amount, $currency ) {
	return html_entity_decode( wp_strip_all_tags( wc_price( $amount, array( 'currency' => $currency ) ) ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
}

function ossau_invoice_pdf_document( WC_Order $order, $reference ) {
	$company = ossau_invoice_company_details();
	$bank = ossau_invoice_bank_details();
	$created = $order->get_date_created();
	$created_timestamp = $created ? $created->getTimestamp() : current_time( 'timestamp' );
	$invoice_date = wp_date( 'd.m.Y', $created_timestamp );
	$due_date = wp_date( 'd.m.Y', strtotime( '+7 days', $created_timestamp ) );
	$currency = $order->get_currency();
	$pages = array();
	$stream = '';
	$y = 0;

	ossau_invoice_pdf_page_header( $stream, $reference );
	ossau_invoice_pdf_text( $stream, 'FACTURÉ À', 40, 101, 8, true, '8b857b' );
	ossau_invoice_pdf_text( $stream, 'LIVRÉ À', 310, 101, 8, true, '8b857b' );
	$billing = ossau_invoice_pdf_address_lines( $order, 'billing' );
	$shipping = ossau_invoice_pdf_address_lines( $order, 'shipping' );
	foreach ( $billing as $index => $line ) {
		ossau_invoice_pdf_text( $stream, $line, 40, 120 + ( $index * 16 ), 10, 0 === $index, '24241f' );
	}
	foreach ( $shipping as $index => $line ) {
		ossau_invoice_pdf_text( $stream, $line, 310, 120 + ( $index * 16 ), 10, 0 === $index, '24241f' );
	}

	ossau_invoice_pdf_rect( $stream, 40, 207, 515, 48, 'f6f0e2' );
	$metadata = array(
		array( 'N° DE FACTURE', $reference, 55 ),
		array( 'DATE', $invoice_date, 225 ),
		array( 'À PAYER AVANT LE', $due_date, 395 ),
	);
	foreach ( $metadata as $field ) {
		ossau_invoice_pdf_text( $stream, $field[0], $field[2], 218, 7.5, true, '8b857b' );
		ossau_invoice_pdf_text( $stream, $field[1], $field[2], 235, 11, true, '24241f' );
	}

	$draw_table_header = static function ( &$page_stream, $top ) {
		ossau_invoice_pdf_text( $page_stream, 'DÉSIGNATION', 40, $top, 8, true, '8b857b' );
		ossau_invoice_pdf_text_right( $page_stream, 'QTÉ', 384, $top, 8, true, '8b857b' );
		ossau_invoice_pdf_text_right( $page_stream, 'PRIX UNITAIRE', 470, $top, 8, true, '8b857b' );
		ossau_invoice_pdf_text_right( $page_stream, 'TOTAL', 555, $top, 8, true, '8b857b' );
		ossau_invoice_pdf_line( $page_stream, 40, $top + 15, 555, $top + 15, 'd8d2c7' );
	};
	$draw_table_header( $stream, 276 );
	$y = 301;

	foreach ( $order->get_items( 'line_item' ) as $item ) {
		$quantity = max( 1, (int) $item->get_quantity() );
		$line_total = (float) $item->get_subtotal() + (float) $item->get_subtotal_tax();
		$unit_total = $line_total / $quantity;
		$product = $item->get_product();
		$description = ossau_invoice_pdf_wrap( $item->get_name(), 56 );
		$sku = $product ? $product->get_sku() : '';
		$row_height = max( 29, count( $description ) * 13 + ( $sku ? 14 : 0 ) + 10 );

		if ( $y + $row_height > 660 ) {
			$pages[] = $stream;
			$stream = '';
			ossau_invoice_pdf_page_header( $stream, $reference, true );
			$draw_table_header( $stream, 99 );
			$y = 124;
		}

		foreach ( $description as $line_index => $line ) {
			ossau_invoice_pdf_text( $stream, $line, 40, $y + ( $line_index * 13 ), 9.5, 0 === $line_index, '24241f' );
		}
		if ( $sku ) {
			ossau_invoice_pdf_text( $stream, 'Référence ' . $sku, 40, $y + ( count( $description ) * 13 ), 8, false, '8b857b' );
		}
		ossau_invoice_pdf_text_right( $stream, (string) $quantity, 384, $y, 9.5 );
		ossau_invoice_pdf_text_right( $stream, ossau_invoice_money( $unit_total, $currency ), 470, $y, 9.5 );
		ossau_invoice_pdf_text_right( $stream, ossau_invoice_money( $line_total, $currency ), 555, $y, 9.5, true );
		$y += $row_height;
		ossau_invoice_pdf_line( $stream, 40, $y - 5, 555, $y - 5, 'e6e1d8', 0.4 );
	}

	$tax_total = (float) $order->get_total_tax();
	// get_subtotal_tax() exists on line items, not on WC_Order.
	$gross_subtotal = (float) $order->get_subtotal() + (float) $order->get_cart_tax();
	$gross_shipping = (float) $order->get_shipping_total() + (float) $order->get_shipping_tax();
	$gross_discount = (float) $order->get_discount_total() + (float) $order->get_discount_tax();
	$gross_total = (float) $order->get_total();
	$taxes = $order->get_tax_totals();
	$summary_height = 140 + ( $gross_discount > 0 ? 20 : 0 ) + ( count( $taxes ) * 18 );
	if ( $y + $summary_height + 245 > 785 ) {
		$pages[] = $stream;
		$stream = '';
		ossau_invoice_pdf_page_header( $stream, $reference, true );
		$y = 105;
	}

	$summary_y = $y + 14;
	$summary_row = static function ( &$page_stream, $label, $amount, $top, $bold = false ) use ( $currency ) {
		ossau_invoice_pdf_text( $page_stream, $label, 340, $top, $bold ? 10 : 9.5, $bold, '24241f' );
		ossau_invoice_pdf_text_right( $page_stream, ossau_invoice_money( $amount, $currency ), 555, $top, $bold ? 10 : 9.5, $bold, '24241f' );
	};
	$summary_row( $stream, 'Sous-total', $gross_subtotal, $summary_y );
	$summary_y += 19;
	if ( $gross_discount > 0 ) {
		$summary_row( $stream, 'Rabais', -$gross_discount, $summary_y );
		$summary_y += 19;
	}
	$summary_row( $stream, 'Livraison', $gross_shipping, $summary_y );
	$summary_y += 19;
	foreach ( $order->get_items( 'fee' ) as $fee ) {
		$summary_row( $stream, $fee->get_name(), (float) $fee->get_total() + (float) $fee->get_total_tax(), $summary_y );
		$summary_y += 19;
	}
	$summary_row( $stream, 'Montant net', $gross_total - $tax_total, $summary_y );
	$summary_y += 19;
	if ( $taxes ) {
		foreach ( $taxes as $tax ) {
			$summary_row( $stream, $tax->label, (float) $tax->amount, $summary_y );
			$summary_y += 18;
		}
	} elseif ( $tax_total > 0 ) {
		$summary_row( $stream, 'TVA incluse', $tax_total, $summary_y );
		$summary_y += 18;
	}
	ossau_invoice_pdf_rect( $stream, 340, $summary_y + 3, 215, 38, 'edf5dc' );
	ossau_invoice_pdf_text( $stream, 'TOTAL À PAYER', 352, $summary_y + 15, 10, true, '24241f' );
	ossau_invoice_pdf_text_right( $stream, ossau_invoice_money( $gross_total, $currency ), 545, $summary_y + 13, 13, true, '24241f' );
	$payment_y = $summary_y + 58;

	if ( $payment_y + 175 > 785 ) {
		$pages[] = $stream;
		$stream = '';
		ossau_invoice_pdf_page_header( $stream, $reference, true );
		$payment_y = 100;
	}

	ossau_invoice_pdf_rect( $stream, 40, $payment_y, 515, 151, 'f8f6f1' );
	ossau_invoice_pdf_rect( $stream, 40, $payment_y, 5, 151, '2e3b26' );
	ossau_invoice_pdf_text( $stream, 'Paiement par virement bancaire', 58, $payment_y + 16, 13, true, '24241f' );
	ossau_invoice_pdf_text( $stream, 'Merci de virer le montant total dans les 7 jours calendaires et', 58, $payment_y + 38, 8.5, false, '6f6a60' );
	ossau_invoice_pdf_text( $stream, 'd’indiquer la référence de la facture comme motif du paiement.', 58, $payment_y + 51, 8.5, false, '6f6a60' );
	ossau_invoice_pdf_text( $stream, 'IBAN', 58, $payment_y + 72, 7, true, '8b857b' );
	ossau_invoice_pdf_text( $stream, $bank['iban'] . ' · BIC ' . $bank['bic'], 58, $payment_y + 85, 9, true, '24241f' );
	ossau_invoice_pdf_text( $stream, 'BÉNÉFICIAIRE', 58, $payment_y + 105, 7, true, '8b857b' );
	ossau_invoice_pdf_text( $stream, $bank['holder'], 58, $payment_y + 118, 9, true, '24241f' );
	ossau_invoice_pdf_text( $stream, 'RÉFÉRENCE À INDIQUER', 340, $payment_y + 72, 7, true, '8b857b' );
	ossau_invoice_pdf_text( $stream, $reference, 340, $payment_y + 85, 9, true, '24241f' );
	ossau_invoice_pdf_text( $stream, 'MONTANT', 340, $payment_y + 105, 7, true, '8b857b' );
	ossau_invoice_pdf_text( $stream, ossau_invoice_money( $gross_total, $currency ), 340, $payment_y + 118, 9, true, '24241f' );

	$delivery_y = $payment_y + 166;
	ossau_invoice_pdf_text( $stream, 'Traitement : 1 à 2 jours ouvrables après réception du paiement, puis livraison en 3 à 5 jours ouvrables.', 40, $delivery_y, 8, false, '6f6a60' );
	$delivery_day = sanitize_text_field( $order->get_meta( '_ossau_delivery_day' ) );
	$delivery_window = sanitize_key( $order->get_meta( '_ossau_delivery_window' ) );
	$window_labels = array(
		'08-12' => '8:00–12:00',
		'14-18' => '14:00–18:00',
		'08-10' => '8:00–10:00',
		'14-16' => '14:00–16:00',
	);
	$delivery_preference = array();
	if ( $delivery_day ) {
		$delivery_preference[] = 'Livraison souhaitée : ' . $delivery_day;
	}
	if ( isset( $window_labels[ $delivery_window ] ) ) {
		$delivery_preference[] = 'Créneau souhaité : ' . $window_labels[ $delivery_window ];
	}
	if ( $delivery_preference ) {
		ossau_invoice_pdf_text( $stream, implode( ' · ', $delivery_preference ), 40, $delivery_y + 15, 8, false, '6f6a60' );
	}

	$pages[] = $stream;
	$page_count = count( $pages );
	foreach ( $pages as $page_index => &$page_stream ) {
		ossau_invoice_pdf_line( $page_stream, 40, 795, 555, 795, 'e6e1d8', 0.5 );
		$footer_left = sprintf( '%s · %s · %s · %s', $company['name'], $company['address'], $company['city'], $company['country'] );
		$footer_right = sprintf( '%s · %s · %s · %s', $company['register_court'], $company['register_number'], $company['phone'], $company['email'] );
		ossau_invoice_pdf_text( $page_stream, $footer_left, 40, 803, 6.6, false, '8b857b' );
		ossau_invoice_pdf_text( $page_stream, $footer_right, 40, 814, 6.6, false, '8b857b' );
		ossau_invoice_pdf_text_right( $page_stream, sprintf( '%d / %d', $page_index + 1, $page_count ), 555, 814, 7, false, '8b857b' );
	}
	unset( $page_stream );

	$objects = array();
	$objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
	$kids = array();
	foreach ( $pages as $index => $page_stream ) {
		$page_object = 3 + ( $index * 2 );
		$content_object = $page_object + 1;
		$kids[] = $page_object . ' 0 R';
		$objects[] = sprintf( '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 %d 0 R /F2 %d 0 R >> >> /Contents %d 0 R >>', 3 + ( $page_count * 2 ), 4 + ( $page_count * 2 ), $content_object );
		$objects[] = sprintf( "<< /Length %d >>\nstream\n%sendstream", strlen( $page_stream ), $page_stream );
	}
	$objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
	$objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
	$objects[1] = sprintf( '<< /Type /Pages /Kids [%s] /Count %d >>', implode( ' ', $kids ), $page_count );

	$pdf = "%PDF-1.4\n%âãÏÓ\n";
	$offsets = array( 0 );
	foreach ( $objects as $index => $object ) {
		$offsets[] = strlen( $pdf );
		$pdf .= sprintf( "%d 0 obj\n%s\nendobj\n", $index + 1, $object );
	}
	$xref_offset = strlen( $pdf );
	$pdf .= sprintf( "xref\n0 %d\n0000000000 65535 f \n", count( $objects ) + 1 );
	for ( $index = 1; $index < count( $offsets ); $index++ ) {
		$pdf .= sprintf( "%010d 00000 n \n", $offsets[ $index ] );
	}
	$pdf .= sprintf( "trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF", count( $objects ) + 1, $xref_offset );

	return $pdf;
}

function ossau_invoice_private_directory() {
	$uploads = wp_upload_dir();
	$directory = trailingslashit( $uploads['basedir'] ) . 'ossau-invoices-private';
	if ( ! wp_mkdir_p( $directory ) ) {
		return false;
	}

	$index_file = trailingslashit( $directory ) . 'index.php';
	if ( ! file_exists( $index_file ) ) {
		if ( false === @file_put_contents( $index_file, "<?php\n// Silence is golden.\n", LOCK_EX ) ) {
			error_log( sprintf( '[AM Holzbrennstoffe UG] Impossible de securiser le repertoire de factures : %s', $directory ) );
			return false;
		}
	}
	$htaccess_file = trailingslashit( $directory ) . '.htaccess';
	if ( ! file_exists( $htaccess_file ) ) {
		if ( false === @file_put_contents( $htaccess_file, "Options -Indexes\n<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n", LOCK_EX ) ) {
			error_log( sprintf( '[AM Holzbrennstoffe UG] Impossible de proteger le repertoire de factures : %s', $directory ) );
			return false;
		}
	}

	return $directory;
}

function ossau_invoice_file_path( WC_Order $order ) {
	$reference = $order->get_meta( '_ossau_order_reference' );
	$directory = ossau_invoice_private_directory();
	if ( ! $directory || ! $reference ) {
		return false;
	}

	$filename = hash_hmac( 'sha256', $order->get_id() . '|' . $reference, wp_salt( 'auth' ) ) . '.pdf';
	return trailingslashit( $directory ) . $filename;
}

function ossau_generate_order_invoice( WC_Order $order, $reference ) {
	$path = ossau_invoice_file_path( $order );
	if ( ! $path ) {
		return false;
	}
	if ( is_file( $path ) && @filesize( $path ) > 0 ) {
		return $path;
	}

	$pdf = ossau_invoice_pdf_document( $order, $reference );
	if ( 0 !== strpos( $pdf, '%PDF-' ) ) {
		error_log( sprintf( '[AM Holzbrennstoffe UG] Le contenu de la facture de la commande %d est invalide.', $order->get_id() ) );
		return false;
	}
	if ( false === @file_put_contents( $path, $pdf, LOCK_EX ) ) {
		error_log( sprintf( '[AM Holzbrennstoffe UG] Impossible d ecrire la facture de la commande %d dans %s.', $order->get_id(), $path ) );
		return false;
	}

	$order->update_meta_data( '_ossau_invoice_created_at', gmdate( 'c' ) );
	$order->save();
	return $path;
}

function ossau_try_generate_order_invoice( WC_Order $order, $reference ) {
	try {
		return ossau_generate_order_invoice( $order, $reference );
	} catch ( Throwable $error ) {
		error_log( sprintf( '[AM Holzbrennstoffe UG] Exception pendant la generation de la facture de la commande %d : %s', $order->get_id(), $error->getMessage() ) );
		return false;
	}
}

function ossau_invoice_signature( $order_id, $reference ) {
	return hash_hmac( 'sha256', absint( $order_id ) . '|' . sanitize_text_field( $reference ), wp_salt( 'auth' ) );
}

function ossau_invoice_download_url( WC_Order $order ) {
	$reference = $order->get_meta( '_ossau_order_reference' );
	return add_query_arg(
		array(
			'reference' => rawurlencode( $reference ),
			'signature' => ossau_invoice_signature( $order->get_id(), $reference ),
		),
		rest_url( 'ossau/v1/invoice/' . $order->get_id() )
	);
}

function ossau_download_order_invoice( WP_REST_Request $request ) {
	$order = wc_get_order( absint( $request['order_id'] ) );
	$reference = $order ? $order->get_meta( '_ossau_order_reference' ) : '';
	$provided_reference = sanitize_text_field( $request->get_param( 'reference' ) );
	$provided_signature = sanitize_text_field( $request->get_param( 'signature' ) );

	if ( ! $order || ! $reference || ! hash_equals( $reference, $provided_reference ) || ! hash_equals( ossau_invoice_signature( $order->get_id(), $reference ), $provided_signature ) ) {
		return new WP_Error( 'invoice_not_found', 'Cette facture n’est pas disponible.', array( 'status' => 404 ) );
	}

	$path = ossau_invoice_file_path( $order );
	if ( ! $path ) {
		return new WP_Error( 'invoice_not_found', 'Cette facture n’est pas disponible.', array( 'status' => 404 ) );
	}
	if ( ! is_file( $path ) || @filesize( $path ) <= 0 ) {
		$path = ossau_try_generate_order_invoice( $order, $reference );
	}
	$invoice_size = $path && is_file( $path ) ? @filesize( $path ) : false;
	if ( ! $path || false === $invoice_size || $invoice_size <= 0 ) {
		return new WP_Error( 'invoice_not_found', 'Cette facture n’est pas disponible.', array( 'status' => 404 ) );
	}

	nocache_headers();
	header( 'Content-Type: application/pdf' );
	header( 'Content-Disposition: attachment; filename="Facture-' . sanitize_file_name( $reference ) . '.pdf"' );
	header( 'Content-Length: ' . $invoice_size );
	header( 'X-Content-Type-Options: nosniff' );
	readfile( $path );
	exit;
}
