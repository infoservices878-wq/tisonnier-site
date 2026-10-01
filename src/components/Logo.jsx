import { Link } from "react-router-dom";

export default function Logo({ className = "", textOnly = false }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="Zur Startseite">
      <span className="logo-brand" aria-label="AM Holzbrennstoffe UG">
        <strong>AM</strong>
        <span>Holzbrennstoffe UG</span>
      </span>
    </Link>
  );
}
