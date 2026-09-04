import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clipboard, CreditCard, Mail, MapPin, ShieldCheck, Truck, Warehouse } from "lucide-react";
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
  note: "",
  terms: false,
};
const FORM_STORAGE_KEY = "ossau-bois-order-form";
const SUBMITTED_STORAGE_KEY = "ossau-bois-order-submitted";
const WORDPRESS_API_URL = (import.meta.env.VITE_WORDPRESS_API_URL || "").replace(/\/+$/, "");
const WORDPRESS_API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY || "";

function buildOrderPayload(form, lines, subtotal, shipping, total) {
  return {
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
      note: form.note || "",
    },
    items: lines.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
    })),
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
  return `OB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function Order() {
  const { lines, subtotal, shipping, total, count, clear } = useCart();
  const [form, setForm] = useState(() => ({ ...initialForm, ...readStoredValue(FORM_STORAGE_KEY, {}) }));
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
          <span className="section-kicker">DEMANDE ENREGISTRÉE</span>
          <h1 className="page-title">Votre commande est en attente de virement</h1>
          <p>Merci {submitted.firstName}. Votre demande a bien été enregistrée sous la référence <strong>{submitted.reference}</strong>. Un récapitulatif sera envoyé à {submitted.email}.</p>
          <div className="order-transfer-confirmation">
            <div><CreditCard size={21} /><div><strong>Prochaine étape : effectuer le virement</strong><span>Indiquez la référence {submitted.reference} dans le libellé du virement.</span></div></div>
            <p>Les coordonnées bancaires définitives et le montant à régler figurent dans l’e-mail de confirmation transmis par OSSAU BOIS.</p>
          </div>
          <div className="order-confirmation-actions"><Link to="/" className="btn btn-primary">Retour à l’accueil <ArrowRight size={16} /></Link><Link to="/contact" className="order-text-link">Une question ? Nous contacter</Link></div>
        </div>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section className="section order-page">
        <div className="order-empty"><ShoppingBagIcon /><h1 className="page-title">Votre panier est vide</h1><p>Ajoutez au moins une référence avant de renseigner votre commande.</p><Link to="/catalogue" className="btn btn-primary">Voir le catalogue <ArrowRight size={16} /></Link></div>
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
        throw new Error("La connexion WordPress n'est pas configurée.");
      }

      const response = await fetch(`${WORDPRESS_API_URL}/wp-json/ossau/v1/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${WORDPRESS_API_KEY}`,
        },
        body: JSON.stringify(buildOrderPayload(form, lines, subtotal, shipping, total)),
      });

      const text = await response.text();
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { message: text || "Erreur inconnue" };
      }

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Erreur ${response.status}`);
      }

      localStorage.removeItem(FORM_STORAGE_KEY);
      setSubmitted({
        ...form,
        reference: payload.reference || createOrderReference(),
        orderId: payload.order_id || null,
      });
      clear();
    } catch (error) {
      setSubmitError(error.message || "Impossible d’envoyer la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section order-page">
      <div className="order-breadcrumbs"><Link to="/">Accueil</Link><span aria-hidden="true">›</span><Link to="/panier">Panier</Link><span aria-hidden="true">›</span><strong>Commande</strong></div>
      <div className="order-heading"><div><span className="section-kicker">FINALISER VOTRE DEMANDE</span><h1 className="page-title">Vos coordonnées pour le virement</h1><p>Renseignez les informations nécessaires à la préparation de votre commande et à la livraison de votre combustible.</p></div><ShieldCheck size={48} strokeWidth={1.1} /></div>
      <form className="order-layout" onSubmit={submit}>
        <div className="order-form-column">
          <section className="order-form-section">
            <div className="order-section-heading"><span>01</span><div><h2>Vos coordonnées</h2><p>Ces informations serviront à vous envoyer la confirmation de commande.</p></div></div>
            <div className="order-form-grid">
              <label className="field"><span>Prénom *</span><input required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" /></label>
              <label className="field"><span>Nom *</span><input required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" /></label>
              <label className="field"><span>Adresse e-mail *</span><input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" /></label>
              <label className="field"><span>Téléphone *</span><input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" /></label>
              <label className="field order-field-full"><span>Entreprise <small>facultatif</small></span><input value={form.company} onChange={(event) => update("company", event.target.value)} autoComplete="organization" /></label>
            </div>
          </section>

          <section className="order-form-section">
            <div className="order-section-heading"><span>02</span><div><h2>Réception de la commande</h2><p>Choisissez le mode de réception souhaité. Nous confirmerons les modalités avec vous.</p></div></div>
            <div className="order-delivery-options">
              <label className={`order-delivery-option${form.delivery === "home" ? " active" : ""}`}><input type="radio" name="delivery" value="home" checked={form.delivery === "home"} onChange={(event) => update("delivery", event.target.value)} /><Truck size={21} /><span><strong>Livraison sur palette</strong><small>À l’adresse indiquée · 6 à 8 jours ouvrés</small></span></label>
              <label className={`order-delivery-option${form.delivery === "pickup" ? " active" : ""}`}><input type="radio" name="delivery" value="pickup" checked={form.delivery === "pickup"} onChange={(event) => update("delivery", event.target.value)} /><Warehouse size={21} /><span><strong>Retrait à Phalsbourg</strong><small>Sur rendez-vous · véhicule adapté requis</small></span></label>
            </div>
            {form.delivery === "home" && <div className="order-form-grid order-address-grid"><label className="field order-field-full"><span>Adresse *</span><input required value={form.address} onChange={(event) => update("address", event.target.value)} autoComplete="street-address" placeholder="Numéro et rue" /></label><label className="field"><span>Code postal *</span><input required value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} autoComplete="postal-code" /></label><label className="field"><span>Ville *</span><input required value={form.city} onChange={(event) => update("city", event.target.value)} autoComplete="address-level2" /></label></div>}
            {form.delivery === "pickup" && <div className="order-pickup-note"><MapPin size={18} /><span><strong>Point de retrait</strong>{COMPANY.warehouse.address}, {COMPANY.warehouse.city}. Un rendez-vous sera confirmé avant votre déplacement.</span></div>}
            <label className="field order-note-field"><span>Information utile <small>facultatif</small></span><textarea rows="3" value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="Accès, présence sur place, précision pour le transporteur..." /></label>
          </section>

          <section className="order-form-section order-payment-section">
            <div className="order-section-heading"><span>03</span><div><h2>Paiement par virement bancaire</h2><p>Votre commande sera préparée après réception et vérification du virement.</p></div></div>
            <div className="order-transfer-note"><CreditCard size={22} /><div><strong>Un paiement clair, sans saisie bancaire en ligne</strong><p>Après validation, nous vous envoyons les coordonnées bancaires et le montant exact à régler par e-mail.</p></div></div>
            <label className="order-checkbox"><input type="checkbox" checked={form.terms} onChange={(event) => update("terms", event.target.checked)} required /><span>J’ai lu et j’accepte les <Link to="/conditions-generales-de-vente">conditions générales de vente</Link>. *</span></label>
          </section>
          {submitError && (
            <div className="order-form-error" role="alert">
              {submitError}
            </div>
          )}
          <div className="order-form-actions"><Link to="/panier" className="order-back-link"><ArrowLeft size={16} /> Retour au panier</Link><button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Envoi..." : "Valider ma demande"} <ArrowRight size={17} /></button></div>
        </div>

        <aside className="order-sidebar">
          <div className="order-summary-box"><div className="order-summary-title"><h2>Votre commande</h2><span>{count} article{count > 1 ? "s" : ""}</span></div><div className="order-summary-lines">{lines.map(({ product, qty, lineTotal }) => <div className="order-summary-line" key={product.id}><span><strong>{qty} ×</strong> {product.name}</span><b>{formatPrice(lineTotal)}</b></div>)}</div><div className="summary-row"><span>Sous-total</span><strong>{formatPrice(subtotal)}</strong></div><div className="summary-row"><span>Livraison</span><strong>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</strong></div><div className="summary-total"><span>Total TTC</span><strong>{formatPrice(total)}</strong></div></div>
          <div className="order-bank-box"><span className="section-kicker">RÈGLEMENT</span><h2>Virement bancaire</h2><p>Les coordonnées bancaires sont communiquées après validation afin d’associer votre règlement à la bonne commande.</p><div className="order-bank-row"><Clipboard size={16} /><span>Référence à rappeler<br /><strong>Votre référence de commande</strong></span></div><div className="order-bank-row"><Mail size={16} /><span>Confirmation par e-mail<br /><strong>{COMPANY.email}</strong></span></div></div>
          <div className="order-reassurance"><ShieldCheck size={18} /><span>Vos données sont utilisées uniquement pour traiter votre commande.</span></div>
        </aside>
      </form>
    </section>
  );
}

function ShoppingBagIcon() {
  return <div className="order-empty-icon"><CreditCard size={30} /></div>;
}
