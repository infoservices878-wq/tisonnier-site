import { Link } from "react-router-dom";

export default function Logo({ className = "", src = "/unnamed.png" }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="Zur Startseite">
      <img className="logo-image" src={src} alt="Holzbrennstoffe" decoding="async" />
    </Link>
  );
}
