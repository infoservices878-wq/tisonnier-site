import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="Retour à l'accueil">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2C13 2 8 8 8 13.5C8 17.09 10.24 20 13 20C15.76 20 18 17.09 18 13.5C18 8 13 2 13 2Z" fill="var(--ember)" />
        <path d="M13 9C13 9 10.5 12.5 10.5 15.2C10.5 17.03 11.6 18.5 13 18.5C14.4 18.5 15.5 17.03 15.5 15.2C15.5 12.5 13 9 13 9Z" fill="var(--paper)" opacity="0.85" />
      </svg>
      <span className="logo-word">OSSAU BOIS</span>
    </Link>
  );
}
