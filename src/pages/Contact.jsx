import { useState } from "react";
import { MapPin, Phone, Mail, Check } from "lucide-react";
import { COMPANY } from "../data/legalContent";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section">
      <h1 className="page-title">Contact</h1>
      <p className="page-lede">Une question sur un produit, une livraison ou un retrait ? Écrivez-nous.</p>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-line"><Mail size={18} strokeWidth={1.6} /><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></div>
          <div className="contact-line"><Phone size={18} strokeWidth={1.6} /><a href={COMPANY.phoneHref}>{COMPANY.phone}</a></div>
          <div className="contact-line"><MapPin size={18} strokeWidth={1.6} /><span>Point de retrait sur rendez-vous uniquement</span></div>
          <p className="page-lede" style={{ marginTop: 16 }}>Horaires : {COMPANY.hours}</p>
        </div>
        <form className="contact-form" onSubmit={submit}>
          {sent ? (
            <div className="empty-state">
              <Check size={28} strokeWidth={1.4} />
              <p>Merci, votre message a bien été pris en compte dans cette démonstration.</p>
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
              <button className="btn btn-primary btn-block" type="submit">Envoyer</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
