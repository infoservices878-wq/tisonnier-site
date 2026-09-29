import { Link } from "react-router-dom";

export default function Logo({ className = "", textOnly = false }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="Zur Startseite">
      {textOnly ? <span className="logo-word">AM Holzbrennstoffe UG</span> : <img className="logo-image" src="/unnamed.webp" alt="AM Holzbrennstoffe UG" />}
    </Link>
  );
}
