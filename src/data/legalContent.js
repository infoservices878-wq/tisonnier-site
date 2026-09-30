/** Unternehmensdaten, abgeglichen mit öffentlich zugänglichen Registerangaben. */

export const COMPANY = {
  name: "AM Holzbrennstoffe UG (haftungsbeschränkt)",
  legalForm: "Unternehmergesellschaft (haftungsbeschränkt)",
  capital: "10.000,00 €",
  address: "Dünnenriede 3",
  city: "30853 Langenhagen",
  country: "Deutschland",
  registerCourt: "Amtsgericht Hannover",
  registerNumber: "HRB 223515",
  manager: "Andreas Müller",
  purpose: "Herstellung und Handel von Brennholz und Zubehör",
  registerUrl: "https://www.companyhouse.de/AM-Holzbrennstoffe-UG-Langenhagen",
  email: "info@amholzbrennstoffeug.de",
  phone: "+41 265190382",
  phoneHref: "tel:+41265190382",
  hours: "Mo–Fr 08:00–12:00 und 13:30–17:00 Uhr",
  responseTime: "Richtwert: Antwort innerhalb eines Werktages (vor Livegang bestätigen).",
};

export const MENTIONS_SECTIONS = [
  {
    title: "Angaben gemäß § 5 DDG",
    html: `<strong>${COMPANY.name}</strong><br />${COMPANY.address}<br />${COMPANY.city}<br />${COMPANY.country}`,
  },
  { title: "Vertreten durch", html: `Geschäftsführer: ${COMPANY.manager}` },
  {
    title: "Registereintrag",
    html: `Registergericht: ${COMPANY.registerCourt}<br />Handelsregisternummer: ${COMPANY.registerNumber}<br />Stammkapital: ${COMPANY.capital}`,
  },
  { title: "Unternehmensgegenstand", html: `${COMPANY.purpose}.` },
  { title: "Kontakt", html: `E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>` },
  {
    title: "Verbraucherstreitbeilegung",
    html: "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
  },
];

export const PRIVACY_SECTIONS = [
  {
    title: "1. Verantwortlicher",
    html: `${COMPANY.name}<br />${COMPANY.address}<br />${COMPANY.city}<br />E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>`,
  },
  {
    title: "2. Verarbeitung personenbezogener Daten",
    html: "Bei einer Kontaktanfrage verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse und den Inhalt Ihrer Nachricht. Bei Bestellungen verarbeiten wir die Daten, die für Vertragsabwicklung, Lieferung und Kundenkommunikation erforderlich sind.",
  },
  {
    title: "3. Zwecke und Rechtsgrundlagen",
    html: "Die Verarbeitung erfolgt zur Beantwortung von Anfragen, zur Vertragsanbahnung und -erfüllung sowie zur Erfüllung gesetzlicher Pflichten. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b, c und f DSGVO; bei einwilligungsbedürftigen Diensten Art. 6 Abs. 1 lit. a DSGVO.",
  },
  {
    title: "4. Speicherdauer",
    html: "Wir speichern personenbezogene Daten nur so lange, wie dies für den jeweiligen Zweck oder aufgrund gesetzlicher Aufbewahrungspflichten erforderlich ist.",
  },
  {
    title: "5. Ihre Rechte",
    html: `Sie haben nach Maßgabe der DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren. Für Anliegen schreiben Sie bitte an <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>.`,
  },
  {
    title: "6. Cookies",
    html: "Nicht erforderliche Cookies oder vergleichbare Technologien werden nur nach Ihrer Einwilligung eingesetzt. Ihre Auswahl können Sie jederzeit über die Datenschutzeinstellungen ändern.",
  },
];

export const CGV_SECTIONS = [
  {
    title: "1. Geltungsbereich",
    html: `Diese Allgemeinen Geschäftsbedingungen gelten für den Verkauf von Brennholz, Pellets, Briketts, Anzündhilfen und weiteren festen Brennstoffen durch ${COMPANY.name}.`,
  },
  {
    title: "2. Vertragsschluss und Preise",
     html: `<p>Die Produktdarstellung im Online-Shop stellt kein verbindliches Angebot dar. Mit dem Klick auf die Schaltfläche „Zahlungspflichtig bestellen“ geben Sie eine verbindliche Bestellung ab. Der Kaufvertrag kommt zustande, sobald Ihre Bestellung erfolgreich bei uns eingegangen ist. Wir bestätigen den Eingang und den Vertragsschluss unverzüglich per E-Mail.</p><p>Der Gesamtpreis einschließlich Umsatzsteuer und Lieferkosten wird unmittelbar vor Abgabe der Bestellung angezeigt. Der vollständige Kaufpreis ist innerhalb von 7 Kalendertagen ab Zugang der Vertragsbestätigung per Banküberweisung zu zahlen. Maßgeblich ist der Eingang des Betrags auf unserem Konto. Bankverbindung und Zahlungsreferenz teilen wir in der Vertragsbestätigung mit. Die Vorbereitung und der Versand beginnen nach Zahlungseingang.</p><p>Geht die Zahlung nicht innerhalb dieser Frist ein, erinnern wir Sie an die Zahlung und setzen eine angemessene Nachfrist. Erst wenn diese erfolglos abläuft, können wir unter den gesetzlichen Voraussetzungen, insbesondere nach § 323 BGB, vom Vertrag zurücktreten. Die gesetzlichen Regeln zum Zahlungsverzug, insbesondere § 286 BGB, bleiben unberührt.</p><p>Bei Verbraucherverträgen im elektronischen Geschäftsverkehr gestalten wir die Bestellsituation nach § 312j BGB. Die Schaltfläche „Zahlungspflichtig bestellen“ weist ausdrücklich auf die Zahlungspflicht hin.</p>`,
  },
  {
    title: "3. Lieferung",
    html: "Die Lieferung erfolgt an die bei der Bestellung angegebene Adresse. Der Kunde stellt sicher, dass die Zufahrt für das vereinbarte Lieferfahrzeug geeignet ist. Erkennbare Transportschäden sind bei Lieferung zu dokumentieren und uns zeitnah mitzuteilen.",
  },
  {
    title: "4. Widerrufsrecht",
    html: `<p>Verbrauchern steht bei Fernabsatzverträgen grundsätzlich ein gesetzliches Widerrufsrecht zu. Sofern keine gesetzliche Ausnahme greift, können Sie den Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen. Die Frist beginnt an dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht Beförderer ist, die Ware erhalten.</p><p>Um Ihr Widerrufsrecht auszuüben, informieren Sie uns mit einer eindeutigen Erklärung (zum Beispiel per E-Mail oder Brief) über Ihren Entschluss, den Vertrag zu widerrufen. Richten Sie die Erklärung an ${COMPANY.name}, ${COMPANY.address}, ${COMPANY.city}, E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>. Zur Fristwahrung genügt es, die Erklärung vor Ablauf der Widerrufsfrist abzusenden.</p><p>Im Widerrufsfall erstatten wir erhaltene Zahlungen einschließlich der Kosten der günstigsten angebotenen Standardlieferung unverzüglich und spätestens binnen 14 Tagen ab Eingang Ihrer Widerrufserklärung. Wir verwenden dasselbe Zahlungsmittel wie bei der ursprünglichen Zahlung, sofern nichts anderes vereinbart wurde. Bei Waren können wir die Erstattung zurückhalten, bis wir die Ware zurückerhalten haben oder Sie den Nachweis der Rücksendung erbracht haben, je nachdem, welches der frühere Zeitpunkt ist.</p><p>Sie senden die Ware unverzüglich und spätestens binnen 14 Tagen ab Mitteilung des Widerrufs zurück. Die unmittelbaren Rücksendekosten tragen Sie nur, soweit wir Sie vor Vertragsschluss darüber informiert haben. Bei Speditionsware stimmen Sie den Rücktransport bitte vorab mit uns ab; maßgeblich sind die im Bestellprozess erteilten Informationen. Ihre gesetzlichen Gewährleistungsrechte bleiben unberührt.</p><p>Das Widerrufsrecht besteht nicht, soweit eine gesetzliche Ausnahme greift. Im Zweifel kontaktieren Sie uns vor der Rücksendung.</p><h3>Muster-Widerrufsformular</h3><p>Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen und an uns senden:</p><p>An ${COMPANY.name}, ${COMPANY.address}, ${COMPANY.city}, E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></p><p>Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden Waren: ______________<br>Bestellt am / erhalten am: ______________<br>Name des Verbrauchers: ______________<br>Anschrift des Verbrauchers: ______________<br>Datum: ______________</p>`,
  },
  {
    title: "5. Gewährleistung und Haftung",
    html: "Es gelten die gesetzlichen Mängelhaftungsrechte. Schadensersatzansprüche sind – außer bei Vorsatz, grober Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit sowie bei zwingender gesetzlicher Haftung – ausgeschlossen oder beschränkt.",
  },
  {
    title: "6. Anwendbares Recht",
    html: "Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.",
  },
];
