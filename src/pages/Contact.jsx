import { useState } from "react";
import { ArrowRight, Clock3, MapPin, Phone, Mail, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY } from "../data/legalContent";

const WORDPRESS_API_URL = (import.meta.env.VITE_WORDPRESS_API_URL || "").replace(/\/+$/, "");
const WORDPRESS_API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY || "";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      if (!WORDPRESS_API_URL || !WORDPRESS_API_KEY) {
        throw new Error("Das Kontaktformular ist nicht konfiguriert.");
      }

      const response = await fetch(`${WORDPRESS_API_URL}/wp-json/ossau/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${WORDPRESS_API_KEY}`,
        },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Ihre Nachricht konnte nicht gesendet werden.");
      }

      setSent(true);
    } catch (error) {
      setSubmitError(error.message || "Ihre Nachricht konnte nicht gesendet werden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="page-hero page-hero-dark"><div><span className="section-kicker">WIR SIND FÜR SIE DA</span><h1 className="page-title">Sprechen wir über Ihre nächste Lieferung.</h1><p>Fragen zu einem Produkt oder zur Lieferung? Teilen Sie uns die wichtigsten Angaben mit.</p></div><Mail size={58} strokeWidth={1.1} /></div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-panel"><span className="section-kicker">DIREKTER KONTAKT</span><div className="contact-line"><Mail size={18} strokeWidth={1.6} /><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></div>{COMPANY.phone && <div className="contact-line"><Phone size={18} strokeWidth={1.6} /><span><a href={COMPANY.phoneHref}>{COMPANY.phone}</a><small>{COMPANY.phoneNotice}</small></span></div>}<div className="contact-line"><MapPin size={18} strokeWidth={1.6} /><span>{COMPANY.address}, {COMPANY.city}, {COMPANY.country}</span></div>{COMPANY.hours && <div className="contact-line"><Clock3 size={18} strokeWidth={1.6} /><span>{COMPANY.hours}</span></div>}</div>
          <div className="contact-next"><strong>Für eine schnelle Antwort</strong><p>{COMPANY.responseTime} Nennen Sie bitte das gewünschte Produkt, Ihren Ort und Hinweise zur Zufahrt.</p><Link to="/livraison">Lieferinformationen <ArrowRight size={15} /></Link></div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          {sent ? (
            <div className="empty-state">
              <Check size={28} strokeWidth={1.4} />
              <p>Ihre Nachricht wurde gesendet. Unser Team meldet sich schnellstmöglich bei Ihnen.</p>
            </div>
          ) : (
            <>
              <label className="field">
                <span>Name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="field">
                <span>E-Mail</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="field">
                <span>Nachricht</span>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              {submitError && <div className="order-form-error" role="alert">{submitError}</div>}
              <button className="btn btn-primary btn-block checkout-action-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Wird gesendet..." : "Nachricht senden"} <ArrowRight size={16} /></button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
