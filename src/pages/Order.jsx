import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clipboard, CreditCard, Mail, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { COMPANY } from "../data/legalContent";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  postalCode: "",
  city: "",
  delivery: "home",
  deliveryDay: "",
  deliveryWindow: "",
  note: "",
  terms: false,
};
const FORM_STORAGE_KEY = "ossau-bois-order-form";
const SUBMITTED_STORAGE_KEY = "ossau-bois-order-submitted";
const ORDER_REFERENCE_COUNTER_KEY = "ossau-bois-next-order-reference";
const ORDER_REFERENCE_START = 30000;
const WORDPRESS_API_URL = (import.meta.env.VITE_WORDPRESS_API_URL || "").replace(/\/+$/, "");
const WORDPRESS_API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY || "";
const DELIVERY_DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const DELIVERY_WINDOWS = [
  { value: "08-12", label: "Vormittag", detail: "8:00–12:00" },
  { value: "14-18", label: "Nachmittag", detail: "14:00–18:00" },
  { value: "08-10", label: "Früher Vormittag", detail: "8:00–10:00" },
  { value: "14-16", label: "Früher Nachmittag", detail: "14:00–16:00" },
];

function buildOrderPayload(form, lines, subtotal, shipping, total, reference) {
  const billing = {
    first_name: form.firstName,
    last_name: form.lastName,
    company: form.company || "",
    address_1: form.address,
    postcode: form.postalCode,
    city: form.city,
    country: "DE",
    email: form.email,
    phone: form.phone,
  };

  return {
    reference,
    customer: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company || "",
      address: form.address || "",
      postalCode: form.postalCode || "",
      city: form.city || "",
      deliveryMode: form.delivery,
      deliveryDay: form.deliveryDay,
      deliveryWindow: form.deliveryWindow,
      note: form.note || "",
    },
    billing,
    shipping: {
      first_name: form.firstName,
      last_name: form.lastName,
      company: form.company || "",
      address_1: form.address,
      postcode: form.postalCode,
      city: form.city,
      country: "DE",
    },
    items: lines.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
    })),
    meta_data: [
      { key: "_ossau_order_reference", value: reference },
      { key: "_ossau_delivery_mode", value: form.delivery },
      { key: "_ossau_delivery_day", value: form.deliveryDay },
      { key: "_ossau_delivery_window", value: form.deliveryWindow },
      { key: "_ossau_customer_note", value: form.note || "" },
    ],
    totals: {
      subtotal,
      shipping,
      total,
    },
  };
}

function readStoredValue(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function createOrderReference() {
  const storedValue = Number.parseInt(localStorage.getItem(ORDER_REFERENCE_COUNTER_KEY), 10);
  const number = Number.isInteger(storedValue) && storedValue >= ORDER_REFERENCE_START
    ? storedValue
    : ORDER_REFERENCE_START;

  return `OB-${new Date().getFullYear()}-${number}`;
}

function saveNextOrderReference(reference) {
  const match = String(reference).match(/^OB-\d{4}-(\d+)$/);
  const number = match ? Number.parseInt(match[1], 10) : ORDER_REFERENCE_START;

  localStorage.setItem(ORDER_REFERENCE_COUNTER_KEY, String(number + 1));
}

export default function Order() {
  const { lines, subtotal, shipping, total, count, clear } = useCart();
  const [form, setForm] = useState(() => ({ ...initialForm, ...readStoredValue(FORM_STORAGE_KEY, {}), delivery: "home" }));
  const [submitted, setSubmitted] = useState(() => readStoredValue(SUBMITTED_STORAGE_KEY, null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!submitted) localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
  }, [form, submitted]);

  useEffect(() => {
    if (submitted) localStorage.setItem(SUBMITTED_STORAGE_KEY, JSON.stringify(submitted));
  }, [submitted]);

  useEffect(() => {
    if (submitted && count > 0) {
      localStorage.removeItem(SUBMITTED_STORAGE_KEY);
      setSubmitted(null);
    }
  }, [count, submitted]);

  if (submitted) {
    return (
      <section className="section order-page">
        <div className="order-confirmation">
          <div className="order-confirmation-icon"><Check size={34} /></div>
          <span className="section-kicker">VERTRAG GESCHLOSSEN</span>
          <h1 className="page-title">Ihre Bestellung ist verbindlich eingegangen</h1>
          <p>Vielen Dank, {submitted.firstName}. Mit Eingang Ihrer Bestellung ist der Kaufvertrag zustande gekommen. Die Vertragsbestätigung und Zahlungsdaten senden wir an {submitted.email}. Bitte überweisen Sie den Gesamtbetrag innerhalb von 7 Kalendertagen nach Erhalt der Bestätigung.</p>
          {(submitted.deliveryDay || submitted.deliveryWindow) && <p className="order-preference-confirmation">Ihr Zustellwunsch: {[submitted.deliveryDay, DELIVERY_WINDOWS.find((timeWindow) => timeWindow.value === submitted.deliveryWindow)?.detail].filter(Boolean).join(" · ")}. Wir stimmen die Zustellung mit der Spedition ab.</p>}
          <div className="order-transfer-confirmation">
            <div><CreditCard size={21} /><div><strong>Überweisung innerhalb von 7 Kalendertagen</strong><span>Geben Sie die Referenz {submitted.reference} im Verwendungszweck an.</span></div></div>
            <p>Die Bankverbindung und der genaue Zahlbetrag stehen in der Vertragsbestätigung von AM Holzbrennstoffe UG.</p>
          </div>
          <div className="order-confirmation-actions"><Link to="/" className="btn btn-primary">Zur Startseite <ArrowRight size={16} /></Link><Link to="/contact" className="order-text-link">Fragen? Kontakt aufnehmen</Link></div>
        </div>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section className="section order-page">
        <div className="order-empty"><ShoppingBagIcon /><h1 className="page-title">Ihr Warenkorb ist leer</h1><p>Fügen Sie mindestens ein Produkt hinzu, bevor Sie Ihre Bestellung anfragen.</p><Link to="/catalogue" className="btn btn-primary">Katalog ansehen <ArrowRight size={16} /></Link></div>
      </section>
    );
  }

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    setIsSubmitting(true);

    try {
      if (!WORDPRESS_API_URL || !WORDPRESS_API_KEY) {
        throw new Error("Die WordPress-Verbindung ist nicht konfiguriert.");
      }

      const reference = createOrderReference();
      const response = await fetch(`${WORDPRESS_API_URL}/wp-json/ossau/v1/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${WORDPRESS_API_KEY}`,
        },
        body: JSON.stringify(buildOrderPayload(form, lines, subtotal, shipping, total, reference)),
      });

      const text = await response.text();
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { message: text || "Unbekannter Fehler" };
      }

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Fehler ${response.status}`);
      }

      localStorage.removeItem(FORM_STORAGE_KEY);
      const savedReference = payload.reference || reference;
      saveNextOrderReference(savedReference);
      setSubmitted({
        ...form,
        reference: savedReference,
        orderId: payload.order_id || null,
      });
      clear();
    } catch (error) {
      setSubmitError(error.message || "Die Bestellung konnte nicht gesendet werden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section order-page">
      <div className="order-breadcrumbs"><Link to="/">Startseite</Link><span aria-hidden="true">›</span><Link to="/panier">Warenkorb</Link><span aria-hidden="true">›</span><strong>Bestellung</strong></div>
      <div className="order-heading"><div><span className="section-kicker">BESTELLUNG VERBINDLICH ABSCHLIESSEN</span><h1 className="page-title">Ihre Daten für die Lieferung</h1><p>Prüfen Sie Ihre Angaben und den Gesamtbetrag. Mit dem Absenden schließen Sie einen verbindlichen Kaufvertrag.</p></div><ShieldCheck size={48} strokeWidth={1.1} /></div>
      <form className="order-layout" onSubmit={submit}>
        <div className="order-form-column">
          <section className="order-form-section">
            <div className="order-section-heading"><span>01</span><div><h2>Ihre Kontaktdaten</h2><p>Diese Angaben verwenden wir für die Auftragsbestätigung.</p></div></div>
            <div className="order-form-grid">
              <label className="field"><span>Vorname *</span><input required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" /></label>
              <label className="field"><span>Nachname *</span><input required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" /></label>
              <label className="field"><span>E-Mail-Adresse *</span><input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" /></label>
              <label className="field"><span>Telefon *</span><input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" /></label>
              <label className="field order-field-full"><span>Unternehmen <small>optional</small></span><input value={form.company} onChange={(event) => update("company", event.target.value)} autoComplete="organization" /></label>
            </div>
          </section>

          <section className="order-form-section">
            <div className="order-section-heading"><span>02</span><div><h2>Lieferadresse</h2><p>Ihre Bestellung wird auf Palette an die angegebene Adresse versendet. Die Lieferdetails erhalten Sie vorab.</p></div></div>
            <div className="order-delivery-options">
              <div className="order-delivery-option active"><Truck size={21} /><span><strong>Palettenlieferung · {shipping === 0 ? "kostenlos" : formatPrice(shipping)}</strong><small>An die angegebene Adresse · Richtwert 6 bis 8 Werktage</small></span></div>
            </div>
            <div className="order-form-grid order-address-grid"><label className="field order-field-full"><span>Adresse *</span><input required value={form.address} onChange={(event) => update("address", event.target.value)} autoComplete="street-address" placeholder="Hausnummer und Straße" /></label><label className="field"><span>Postleitzahl *</span><input required value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} autoComplete="postal-code" /></label><label className="field"><span>Ort *</span><input required value={form.city} onChange={(event) => update("city", event.target.value)} autoComplete="address-level2" /></label></div>
            <label className="field order-note-field"><span>Zusätzliche Hinweise <small>optional</small></span><textarea rows="3" value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="Zufahrt, Anwesenheit vor Ort, Hinweise für die Spedition ..." /></label>
          </section>

          <section className="order-form-section">
            <div className="order-section-heading"><span>03</span><div><h2>Wunschtermin</h2><p>Wählen Sie unverbindlich einen bevorzugten Wochentag und ein Zeitfenster. Wir stimmen die Zustellung mit der Spedition ab.</p></div></div>
            <div className="order-preference-group">
              <span className="order-preference-label">Wunschtag <small>optional</small></span>
              <div className="order-day-options" role="group" aria-label="Bevorzugter Liefertag">
                {DELIVERY_DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`order-day-option${form.deliveryDay === day ? " selected" : ""}`}
                    aria-pressed={form.deliveryDay === day}
                    onClick={() => update("deliveryDay", form.deliveryDay === day ? "" : day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <fieldset className="order-preference-group order-window-fieldset">
              <legend className="order-preference-label">Wunschzeitfenster <small>optional</small></legend>
              <div className="order-window-options">
                {DELIVERY_WINDOWS.map((timeWindow) => (
                  <label className={`order-window-option${form.deliveryWindow === timeWindow.value ? " selected" : ""}`} key={timeWindow.value}>
                    <input type="radio" name="deliveryWindow" value={timeWindow.value} checked={form.deliveryWindow === timeWindow.value} onChange={() => update("deliveryWindow", timeWindow.value)} />
                    <span className="order-window-radio" aria-hidden="true" />
                    <span className="order-window-copy"><strong>{timeWindow.label}</strong><small>{timeWindow.detail}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="order-preference-note">Die Zeitangaben sind unverbindliche Wünsche und hängen von der Tourenplanung der Spedition ab.</p>
          </section>

          <section className="order-form-section order-payment-section">
            <div className="order-section-heading"><span>04</span><div><h2>Zahlung per Banküberweisung</h2><p>Der Kaufvertrag kommt mit Eingang Ihrer Bestellung zustande. Das Zahlungsziel beträgt 7 Kalendertage ab Zugang der Vertragsbestätigung.</p></div></div>
            <div className="order-transfer-note"><CreditCard size={22} /><div><strong>Bankverbindung direkt mit der Vertragsbestätigung</strong><p>Sie erhalten Zahlbetrag, Bankverbindung und Zahlungsreferenz per E-Mail. Bitte geben Sie die Referenz im Verwendungszweck an.</p><Link to="/zahlung" className="order-text-link">Zahlungsablauf ansehen</Link></div></div>
            <label className="order-checkbox"><input type="checkbox" checked={form.terms} onChange={(event) => update("terms", event.target.checked)} required /><span>Ich habe die <Link to="/conditions-generales-de-vente">Allgemeinen Geschäftsbedingungen</Link> gelesen und akzeptiere sie. *</span></label>
          </section>
          {submitError && (
            <div className="order-form-error" role="alert">
              {submitError}
            </div>
          )}
          <div className="order-summary-box order-final-summary">
            <div className="order-summary-title"><h2>Ihre zahlungspflichtige Bestellung</h2><span>{count} Artikel</span></div>
            <div className="order-summary-lines">{lines.map(({ product, qty, lineTotal }) => <div className="order-summary-line" key={product.id}><span><strong>{qty} ×</strong> {product.name}</span><b>{formatPrice(lineTotal)}</b></div>)}</div>
            <div className="summary-row"><span>Zwischensumme</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="summary-row"><span>Lieferung</span><strong>{shipping === 0 ? "Kostenlos" : formatPrice(shipping)}</strong></div>
            <div className="summary-total"><span>Gesamt inkl. MwSt.</span><strong>{formatPrice(total)}</strong></div>
          </div>
          <div className="order-form-actions"><Link to="/panier" className="order-back-link"><ArrowLeft size={16} /> Zurück zum Warenkorb</Link><button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Wird übermittelt..." : "Zahlungspflichtig bestellen"} <ArrowRight size={17} /></button></div>
        </div>

        <aside className="order-sidebar">
          <div className="order-bank-box"><span className="section-kicker">ZAHLUNG</span><h2>Banküberweisung</h2><p>Mit der Vertragsbestätigung erhalten Sie Bankverbindung und Zahlungsreferenz. Das Zahlungsziel beträgt 7 Kalendertage ab Zugang der E-Mail.</p><div className="order-bank-row"><Clipboard size={16} /><span>Verwendungszweck<br /><strong>Ihre Bestellreferenz</strong></span></div><div className="order-bank-row"><Mail size={16} /><span>Vertragsbestätigung per E-Mail<br /><strong>{COMPANY.email}</strong></span></div></div>
          <div className="order-reassurance"><ShieldCheck size={18} /><span>Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Bestellung verwendet.</span></div>
        </aside>
      </form>
    </section>
  );
}

function ShoppingBagIcon() {
  return <div className="order-empty-icon"><CreditCard size={30} /></div>;
}
