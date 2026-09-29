import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section not-found-page">
      <div className="not-found-mark"><SearchX size={34} /></div>
      <span className="section-kicker">ERREUR 404</span>
      <h1 className="page-title">Diese Seite wurde nicht gefunden.</h1>
      <p className="page-lede">Der Link wurde möglicherweise geändert. Auf der Startseite finden Sie unser Sortiment und alle wichtigen Informationen.</p>
      <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> Zur Startseite</Link>
    </section>
  );
}
