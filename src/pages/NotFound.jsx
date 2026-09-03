import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section not-found-page">
      <div className="not-found-mark"><SearchX size={34} /></div>
      <span className="section-kicker">ERREUR 404</span>
      <h1 className="page-title">Cette page n&apos;est pas dans notre catalogue.</h1>
      <p className="page-lede">Le lien a peut-être changé. Revenez à l&apos;accueil pour retrouver les combustibles et les informations utiles.</p>
      <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> Retour à l&apos;accueil</Link>
    </section>
  );
}
