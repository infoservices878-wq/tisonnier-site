import { Link } from "react-router-dom";
import { ChevronRight, Truck, Award, Package } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import FaqSection from "../components/FaqSection";

function ValueStrip() {
  const items = [
    { icon: Truck, title: "Palettenlieferung", text: "Mit Ladebordwand bis zur Zufahrt" },
    { icon: Award, title: "Klare Produktdaten", text: "Zertifikate und Daten auf einen Blick" },
    { icon: Package, title: "Planbare Zustellung", text: "Bestätigung vor der Lieferung" },
  ];
  return <div className="value-strip">{items.map((it) => <div className="value-item" key={it.title}><it.icon size={22} strokeWidth={1.5} /><div><strong>{it.title}</strong><span>{it.text}</span></div></div>)}</div>;
}

export default function Home() {
  const featured = PRODUCTS.slice(0, 6);
  return <>
    <section className="hero"><div className="hero-scene"><img src="/optimized/hero-production.jpg" alt="Industrielle Verarbeitung von Holz" fetchPriority="high" decoding="async" /><div className="hero-scene-overlay" aria-hidden="true" /></div><div className="hero-content"><p className="hero-kicker">Brennstoffe für Privat- und Gewerbekunden</p><h1 className="hero-title">Wärme, auf die Sie sich verlassen können.</h1><p className="hero-sub">Pellets, Briketts, Brennholz und Kohle mit klaren Produktinformationen, zuverlässiger Palettenlogistik und persönlichem Service.</p><div className="hero-actions"><Link to="/katalog" className="btn btn-primary">Zum Katalog</Link><Link to="/ueber-uns" className="btn btn-ghost-light">Über uns</Link></div></div></section>
    <ValueStrip />
    <section className="section"><h2 className="section-title">Der passende Brennstoff für Ihr Heizsystem</h2><div className="cat-tiles cat-tiles-primary">{CATEGORIES.slice(0, 2).map((c) => <Link key={c.id} to={`/katalog/${c.slug}`} className="cat-tile"><img src={c.image} alt="" loading="lazy" /><span className="cat-tile-overlay"><strong>{c.name}</strong><span>Produkte ansehen <span aria-hidden="true">→</span></span></span></Link>)}</div><div className="cat-tiles cat-tiles-secondary">{CATEGORIES.slice(2).map((c) => <Link key={c.id} to={`/katalog/${c.slug}`} className="cat-tile"><img src={c.image} alt="" loading="lazy" /><span className="cat-tile-overlay"><strong>{c.name}</strong><span>Produkte ansehen <span aria-hidden="true">→</span></span></span></Link>)}</div></section>
    <section className="section"><div className="section-head-row"><h2 className="section-title">Unser Sortiment im Überblick</h2><Link to="/katalog" className="link-btn">Zum gesamten Katalog <ChevronRight size={16} strokeWidth={1.7} /></Link></div><div className="product-grid">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>
    <section className="section fulfillment-section"><div className="fulfillment-image"><img src="/optimized/delivery-truck.jpg" alt="Lieferfahrzeug von AM Holzbrennstoffe UG" loading="lazy" decoding="async" /></div><div className="fulfillment-content"><p className="fulfillment-kicker">Palettenversand</p><h2 className="fulfillment-title">Ihr Brennstoff kommt sicher bei Ihnen an</h2><p className="fulfillment-lede">Wir organisieren jede Bestellung so, dass die Lieferung genauso transparent bleibt wie die Produktauswahl.</p><div className="fulfillment-details"><div><strong>Palettenlieferung</strong><span>Bis an den Rand einer befestigten Zufahrt, je nach Zugangsbedingungen mit Ladebordwand.</span></div><div><strong>Planbare Bestellung</strong><span>Sie erhalten vor der Zustellung eine schriftliche Bestätigung und Lieferinformation.</span></div></div><Link to="/kontakt" className="btn btn-primary">Kontakt aufnehmen</Link></div></section>
    <section className="section steps-section"><div className="steps-section-inner"><p className="steps-kicker">Einfach bestellen</p><div className="steps-intro"><h2 className="section-title">In vier Schritten zur Lieferung</h2><p className="steps-lede">Vergleichen Sie Brennstoffe, geben Sie Ihre Lieferadresse an, bestätigen Sie Ihre Bestellung und bezahlen Sie bequem per Überweisung.</p></div><div className="steps">{[{ n: "01", title: "Brennstoff auswählen", text: "Vergleichen Sie Format, Verpackung und Produktdaten für Ihr Heizsystem." }, { n: "02", title: "Lieferung vorbereiten", text: "Geben Sie Ihre Adresse und wichtige Hinweise für die Spedition an." }, { n: "03", title: "Bestellung bestätigen", text: "Sie erhalten eine schriftliche Zusammenfassung mit allen Bestelldetails." }, { n: "04", title: "Betrag überweisen", text: "Überweisen Sie den Rechnungsbetrag mit der angegebenen Referenz. So kann Ihre Bestellung nach Zahlungseingang umgehend bearbeitet werden." }].map((s) => <div className="step" key={s.n}><span className="step-n">{s.n}</span><h3 className="step-title">{s.title}</h3><p className="step-text">{s.text}</p></div>)}</div></div></section>
    <FaqSection limit={4} showAllLink title="Häufige Fragen" />
  </>;
}
