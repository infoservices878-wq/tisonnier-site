import { ArrowRight, Check, Clock3, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Delivery() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div><span className="section-kicker">RÉCEPTION SIMPLE ET ANTICIPÉE</span><h1 className="page-title">Une livraison pensée pour votre accès</h1><p>Chaque commande est expédiée sur palette à l’adresse indiquée, avec des modalités claires confirmées avant le passage du transporteur.</p></div>
        <Truck size={58} strokeWidth={1.1} />
      </div>
      <div className="service-grid">
        <article className="service-card service-card-featured"><Truck size={24} /><span className="service-card-label">À domicile</span><h2>Livraison sur palette</h2><p>Le transporteur dépose la palette au bord de votre accès carrossable, avec hayon selon les conditions du site.</p><ul><li><Check size={16} /> Délai indicatif : 6 à 8 jours ouvrés</li><li><Check size={16} /> Créneau communiqué avant passage</li><li><Check size={16} /> Prévoir un moyen de déplacer la palette</li></ul></article>
        <article className="service-card"><ShieldCheck size={24} /><span className="service-card-label">Suivi de commande</span><h2>Un envoi suivi et documenté</h2><p>Nous préparons votre commande avec soin et vous transmettons les informations utiles avant l’expédition.</p><ul><li><Check size={16} /> Confirmation écrite de la commande</li><li><Check size={16} /> Créneau communiqué avant livraison</li><li><Check size={16} /> Assistance en cas d’anomalie à réception</li></ul></article>
      </div>
      <div className="delivery-timeline"><div><span>01</span><div><strong>Choisissez votre référence</strong><p>Comparez les formats et conditionnements dans le catalogue.</p></div></div><div><span>02</span><div><strong>Renseignez votre adresse</strong><p>Indiquez les informations nécessaires à une expédition adaptée.</p></div></div><div><span>03</span><div><strong>Recevez la confirmation</strong><p>Le créneau et les informations pratiques vous sont envoyés par écrit.</p></div></div></div>
      <div className="delivery-return"><div><Clock3 size={22} /><div><h2>Un incident à la réception ?</h2><p>Notez les réserves sur le bon de livraison et contactez-nous sous 48 heures avec des photos.</p></div></div><Link to="/contact" className="btn btn-primary checkout-action-button">Nous contacter <ArrowRight size={16} /></Link></div>
    </section>
  );
}
