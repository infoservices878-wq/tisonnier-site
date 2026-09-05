# Installation WordPress

1. Créez le dossier `wp-content/plugins/ossau-orders` sur le serveur WordPress.
2. Copiez-y `ossau-orders.php`, puis activez **Ossau Bois - Commandes API** dans l’administration WordPress.
3. Ajoutez dans `wp-config.php`, avant la ligne `/* That's all, stop editing! */` :

```php
define( 'OSSAU_ORDER_API_TOKEN', 'la-meme-valeur-que-VITE_WORDPRESS_API_KEY' );
```

Le plugin crée des commandes WooCommerce avec les coordonnées de facturation et de livraison renseignées. La référence retournée est `OB-année-30000`, puis `OB-année-30001`, etc. Elle est stockée dans la méta `_ossau_order_reference`.

Si une ancienne extension ou un ancien extrait de code fournit déjà la route `ossau/v1/command`, remplacez-le par ce plugin afin d’éviter deux implémentations de la même route.
