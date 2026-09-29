import FaqSection from "../components/FaqSection";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark"><div><span className="section-kicker">HILFEBEREICH</span><h1 className="page-title">Antworten vor Ihrer Bestellung.</h1><p>Lieferung, Lagerung und Zahlung: Hier finden Sie die wichtigsten Informationen.</p></div><MessageCircle size={58} strokeWidth={1.1} /></div>
      <FaqSection />
      <div className="faq-contact"><div><span className="section-kicker">Noch eine Frage?</span><h2>Unser Team hilft Ihnen gerne weiter.</h2></div><Link to="/contact" className="btn btn-primary checkout-action-button">Kontakt aufnehmen</Link></div>
    </section>
  );
}
