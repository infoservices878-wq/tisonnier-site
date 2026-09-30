# Installation WordPress

1. Créez le dossier `wp-content/plugins/ossau-orders` sur le serveur WordPress.
2. Copiez-y `ossau-orders.php` et `ossau-invoices.php`, puis activez **AM Holzbrennstoffe UG - Commandes API** dans l’administration WordPress.
3. Ajoutez dans `wp-config.php`, avant la ligne `/* That's all, stop editing! */` :

```php
define( 'OSSAU_ORDER_API_TOKEN', 'la-meme-valeur-que-VITE_WORDPRESS_API_KEY' );
define( 'OSSAU_FRONTEND_URL', 'https://amholzbrennstoffeug.de' );
define( 'OSSAU_CONTACT_EMAIL', 'info@amholzbrennstoffeug.de' );
define( 'OSSAU_BANK_ACCOUNT_HOLDER', 'HIER KONTOINHABER EINTRAGEN' );
define( 'OSSAU_BANK_IBAN', 'DE00 0000 0000 0000 0000 00' );
define( 'OSSAU_BANK_BIC', 'PLATZHALTER' );
```

`OSSAU_FRONTEND_URL` doit correspondre a l URL publique du site React. Les e-mails de mot de passe oublie contiennent un lien vers `/reinitialisation` sur ce domaine, jamais vers l interface WordPress. Cette page transmet ensuite la demande a l API WordPress pour modifier le mot de passe du compte.

Les trois valeurs ci-dessus sont des exemples volontairement invalides. Le plugin utilise par défaut les coordonnées de règlement renseignées dans `ossau_order_transfer_details()` et ignore les valeurs de démonstration; des constantes valides dans `wp-config.php` peuvent remplacer ces coordonnées. Remplacez la configuration par le compte à utiliser avant la mise en production. N'utilisez jamais un IBAN inventé.

Le jeton `VITE_WORDPRESS_API_KEY` est livré dans le code JavaScript du navigateur et peut être lu par les visiteurs. Il ne constitue donc pas un secret. Pour bloquer réellement les commandes forgées et protéger les prix, faites transiter les requêtes par un backend privé qui conserve le jeton côté serveur.

La version 1.5.0 ajoute la route privee `/wp-json/ossau/v1/auth/orders`. Elle renvoie uniquement les commandes associees a l adresse e-mail du compte connecte. Le dashboard React l utilise pour afficher le suivi de la derniere commande et l historique client. Les commandes existantes sont retrouvees par leur adresse de facturation.

Les coordonnées bancaires de l'e-mail de confirmation sont lues dans `OSSAU_BANK_ACCOUNT_HOLDER`, `OSSAU_BANK_IBAN` et `OSSAU_BANK_BIC`.

La version 1.7.0 corrige la limitation des tentatives d authentification : les requetes autorisees ne sont plus comptees, seuls les echecs de connexion ou de creation de compte declenchent la protection temporaire.

La version 1.9.0 active la verification d adresse e-mail. Apres une inscription, aucun compte WordPress et aucun jeton de connexion ne sont crees avant confirmation. Les donnees d attente sont conservees temporairement et le mot de passe y est chiffre. Un lien valable 48 heures est envoye a l adresse saisie et pointe vers `/verification-email` sur le site. Le compte WordPress est cree uniquement apres validation du lien. Les comptes existants restent utilisables.

La version 1.10.0 met l'envoi des e-mails de commande en file d'attente pour que la page de confirmation n'attende pas le serveur SMTP. Vérifiez WooCommerce > État > Actions planifiées pour le statut des envois. Les échecs d'envoi sont également consignés dans le journal PHP de WordPress.

La version 1.8.1 corrige l encodage du lien de verification et journalise les echecs `wp_mail`. Si le client ne recoit pas le message alors que l inscription indique une reussite, configurez un plugin SMTP WordPress avec `info@amholzbrennstoffeug.de` comme adresse d expedition, puis testez l envoi vers une adresse externe. Verifiez aussi les dossiers spam et les enregistrements DNS SPF, DKIM et DMARC du domaine `amholzbrennstoffeug.de`.

Le plugin crée des commandes WooCommerce avec les coordonnées de facturation et de livraison renseignées. La référence retournée est `OB-année-30000`, puis `OB-année-30001`, etc. Elle est stockée dans la méta `_ossau_order_reference`.

À chaque création de commande, deux e-mails HTML sont envoyés automatiquement :

- `info@amholzbrennstoffeug.de` reçoit la nouvelle commande complète ;
- l'adresse saisie par le client reçoit une confirmation avec sa référence, ses articles, son total et ses coordonnées.

Chaque commande reçoit aussi une facture PDF générée depuis les données enregistrées dans WooCommerce (adresses, articles, taxes, livraison, référence et échéance). Le PDF est joint à l'e-mail du client et accessible depuis la page de confirmation par un lien signé. Le fichier est conservé dans un répertoire privé sous `wp-content/uploads/ossau-invoices-private`; ne supprimez pas ce répertoire si vous voulez préserver le téléchargement des factures déjà envoyées.

Pour garantir la bonne réception des e-mails (notamment chez Gmail, Outlook et Orange), configurez l'envoi SMTP de WordPress avec une adresse d'expédition `info@amholzbrennstoffeug.de`. Le plugin utilise déjà cette adresse comme expéditeur et adresse de réponse.

Le formulaire de contact utilise également ce plugin : chaque message est envoyé à `info@amholzbrennstoffeug.de` et l'adresse du client est définie comme adresse de réponse. Vous pouvez définir une autre boîte de réception dans `wp-config.php` si nécessaire :

```php
define( 'OSSAU_CONTACT_EMAIL', 'info@amholzbrennstoffeug.de' );
```

Si une ancienne extension ou un ancien extrait de code fournit déjà la route `ossau/v1/command`, remplacez-le par ce plugin afin d’éviter deux implémentations de la même route.
