import { Link } from "react-router-dom";

export default function Logo({ className = "", textOnly = false }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="Retour à l'accueil">
      {textOnly ? <span className="logo-word">OSSAU BOIS</span> : <img className="logo-image" src="/unnamed.webp" alt="Ossau Bois" />}
    </Link>
  );
}
