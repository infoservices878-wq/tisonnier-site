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
  phone: "",
  phoneHref: "",
  hours: "",
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
    html: "Die Produktdarstellung im Online-Shop stellt kein verbindliches Angebot dar. Ein Vertrag kommt erst mit unserer Auftragsbestätigung zustande. Preise, Lieferkosten und die jeweils geltende Umsatzsteuer werden vor Abschluss der Bestellung ausgewiesen.",
  },
  {
    title: "3. Lieferung",
    html: "Die Lieferung erfolgt an die bei der Bestellung angegebene Adresse. Der Kunde stellt sicher, dass die Zufahrt für das vereinbarte Lieferfahrzeug geeignet ist. Erkennbare Transportschäden sind bei Lieferung zu dokumentieren und uns zeitnah mitzuteilen.",
  },
  {
    title: "4. Widerrufsrecht",
    html: "Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht zu. Einzelheiten, Fristen und Ausnahmen richten sich nach den gesetzlichen Vorschriften und werden im Bestellprozess beziehungsweise in der Auftragsbestätigung mitgeteilt.",
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
