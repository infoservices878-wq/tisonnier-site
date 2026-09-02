import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <h1 className="page-title">Page introuvable</h1>
      <p className="page-lede">La page demandée n&apos;existe pas ou a été déplacée.</p>
      <Link to="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
    </section>
  );
}
