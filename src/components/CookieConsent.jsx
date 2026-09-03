import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("OSSAU BOIS-cookie");
    if (stored) setChoice(stored);

    const openSettings = () => setChoice(null);
    window.addEventListener("OSSAU BOIS:manage-cookies", openSettings);
    return () => window.removeEventListener("OSSAU BOIS:manage-cookies", openSettings);
  }, []);

  if (choice !== null) return null;

  const save = (value) => {
    localStorage.setItem("OSSAU BOIS-cookie", value);
    setChoice(value);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentement cookies">
      <p>
        Nous utilisons des cookies pour le fonctionnement du site et, avec votre accord,
        pour mesurer l&apos;audience. Vous pouvez accepter ou refuser les cookies non essentiels. <Link to="/politique-de-confidentialite">En savoir plus</Link>
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost-light" onClick={() => save("rejected")}>
          Refuser
        </button>
        <button type="button" className="btn btn-primary" onClick={() => save("accepted")}>
          Accepter
        </button>
      </div>
    </div>
  );
}
