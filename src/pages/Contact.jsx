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
        throw new Error("Le formulaire de contact n'est pas configuré.");
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
        throw new Error(payload.message || "Votre message n'a pas pu être envoyé.");
      }

      setSent(true);
    } catch (error) {
      setSubmitError(error.message || "Votre message n'a pas pu être envoyé.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="page-hero page-hero-dark"><div><span className="section-kicker">NOUS SOMMES À VOTRE ÉCOUTE</span><h1 className="page-title">Parlons de votre prochain approvisionnement.</h1><p>Une question sur un produit, une livraison ou un retrait ? Donnez-nous les informations utiles, nous vous répondrons clairement.</p></div><Mail size={58} strokeWidth={1.1} /></div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-panel"><span className="section-kicker">Coordonnées directes</span><div className="contact-line"><Mail size={18} strokeWidth={1.6} /><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></div><div className="contact-line"><Phone size={18} strokeWidth={1.6} /><a href={COMPANY.phoneHref}>{COMPANY.phone}</a></div><div className="contact-line"><MapPin size={18} strokeWidth={1.6} /><span>Point de retrait sur rendez-vous uniquement</span></div><div className="contact-line"><Clock3 size={18} strokeWidth={1.6} /><span>{COMPANY.hours}</span></div></div>
          <div className="contact-next"><strong>Pour une réponse rapide</strong><p>Indiquez le produit concerné, votre commune et le mode de réception envisagé.</p><Link to="/livraison">Voir les modalités <ArrowRight size={15} /></Link></div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          {sent ? (
            <div className="empty-state">
              <Check size={28} strokeWidth={1.4} />
              <p>Votre message a bien été envoyé. Notre équipe vous répondra dans les meilleurs délais.</p>
            </div>
          ) : (
            <>
              <label className="field">
                <span>Nom</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              {submitError && <div className="order-form-error" role="alert">{submitError}</div>}
              <button className="btn btn-primary btn-block checkout-action-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Envoi..." : "Envoyer le message"} <ArrowRight size={16} /></button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
