import FaqSection from "../components/FaqSection";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark"><div><span className="section-kicker">CENTRE D&apos;AIDE</span><h1 className="page-title">Les réponses avant de passer commande.</h1><p>Livraison, stockage, retrait ou paiement : retrouvez les informations les plus demandées par nos clients.</p></div><MessageCircle size={58} strokeWidth={1.1} /></div>
      <FaqSection />
      <div className="faq-contact"><div><span className="section-kicker">Une question particulière ?</span><h2>Notre équipe peut vous orienter.</h2></div><Link to="/contact" className="btn btn-primary checkout-action-button">Nous contacter</Link></div>
    </section>
  );
}
