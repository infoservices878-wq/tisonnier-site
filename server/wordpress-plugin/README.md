# Installation WordPress

1. Créez le dossier `wp-content/plugins/ossau-orders` sur le serveur WordPress.
2. Copiez-y `ossau-orders.php`, puis activez **Ossau Bois - Commandes API** dans l’administration WordPress.
3. Ajoutez dans `wp-config.php`, avant la ligne `/* That's all, stop editing! */` :

```php
define( 'OSSAU_ORDER_API_TOKEN', 'la-meme-valeur-que-VITE_WORDPRESS_API_KEY' );
define( 'OSSAU_FRONTEND_URL', 'https://www.ossau-bois.com' );
```

`OSSAU_FRONTEND_URL` doit correspondre a l URL publique du site React. Les e-mails de mot de passe oublie contiennent un lien vers `/reinitialisation` sur ce domaine, jamais vers l interface WordPress. Cette page transmet ensuite la demande a l API WordPress pour modifier le mot de passe du compte.

La version 1.5.0 ajoute la route privee `/wp-json/ossau/v1/auth/orders`. Elle renvoie uniquement les commandes associees a l adresse e-mail du compte connecte. Le dashboard React l utilise pour afficher le suivi de la derniere commande et l historique client. Les commandes existantes sont retrouvees par leur adresse de facturation.

La version 1.6.0 ajoute les coordonnees de virement dans l e-mail de confirmation client. Le message precise que le compte est au nom de AURORA RIGGI, titulaire du compte de reglement associe a l activite Ossau Bois.

Le plugin crée des commandes WooCommerce avec les coordonnées de facturation et de livraison renseignées. La référence retournée est `OB-année-30000`, puis `OB-année-30001`, etc. Elle est stockée dans la méta `_ossau_order_reference`.

À chaque création de commande, deux e-mails HTML sont envoyés automatiquement :

- `info@ossau-bois.com` reçoit la nouvelle commande complète ;
- l'adresse saisie par le client reçoit une confirmation avec sa référence, ses articles, son total et ses coordonnées.

Pour garantir la bonne réception des e-mails (notamment chez Gmail, Outlook et Orange), configurez l'envoi SMTP de WordPress avec une adresse d'expédition `info@ossau-bois.com`. Le plugin utilise déjà cette adresse comme expéditeur et adresse de réponse.

Le formulaire de contact utilise également ce plugin : chaque message est envoyé à `info@ossau-bois.com` et l'adresse du client est définie comme adresse de réponse. Vous pouvez définir une autre boîte de réception dans `wp-config.php` si nécessaire :

```php
define( 'OSSAU_CONTACT_EMAIL', 'info@ossau-bois.com' );
```

Si une ancienne extension ou un ancien extrait de code fournit déjà la route `ossau/v1/command`, remplacez-le par ce plugin afin d’éviter deux implémentations de la même route.
