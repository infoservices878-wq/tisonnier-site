import { ArrowRight, Check, Clock3, MapPin, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY } from "../data/legalContent";

export default function Delivery() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div><span className="section-kicker">RÉCEPTION SIMPLE ET ANTICIPÉE</span><h1 className="page-title">Une livraison pensée pour votre accès</h1><p>Choisissez la livraison sur palette ou le retrait à Phalsbourg. Dans les deux cas, les modalités sont confirmées avant votre déplacement.</p></div>
        <Truck size={58} strokeWidth={1.1} />
      </div>
      <div className="service-grid">
        <article className="service-card service-card-featured"><Truck size={24} /><span className="service-card-label">À domicile</span><h2>Livraison sur palette</h2><p>Le transporteur dépose la palette au bord de votre accès carrossable, avec hayon selon les conditions du site.</p><ul><li><Check size={16} /> Délai indicatif : 6 à 8 jours ouvrés</li><li><Check size={16} /> Créneau communiqué avant passage</li><li><Check size={16} /> Prévoir un moyen de déplacer la palette</li></ul></article>
        <article className="service-card"><MapPin size={24} /><span className="service-card-label">À l&apos;entrepôt</span><h2>Retrait à Phalsbourg</h2><p>Réservez votre créneau avant de venir et prévoyez un véhicule adapté au poids de la palette.</p><ul><li><Check size={16} /> {COMPANY.warehouse.address}</li><li><Check size={16} /> Paiement possible sur place</li><li><Check size={16} /> Retrait après confirmation uniquement</li></ul></article>
      </div>
      <div className="delivery-timeline"><div><span>01</span><div><strong>Choisissez votre référence</strong><p>Comparez les formats et conditionnements dans le catalogue.</p></div></div><div><span>02</span><div><strong>Indiquez votre mode de réception</strong><p>Livraison ou retrait : nous vérifions les modalités avec vous.</p></div></div><div><span>03</span><div><strong>Recevez la confirmation</strong><p>Le créneau et les informations pratiques vous sont envoyés par écrit.</p></div></div></div>
      <div className="delivery-return"><div><Clock3 size={22} /><div><h2>Un incident à la réception ?</h2><p>Notez les réserves sur le bon de livraison et contactez-nous sous 48 heures avec des photos.</p></div></div><Link to="/contact" className="btn btn-primary checkout-action-button">Nous contacter <ArrowRight size={16} /></Link></div>
    </section>
  );
}
