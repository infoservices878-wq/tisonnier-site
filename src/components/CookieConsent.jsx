import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("AM Holzbrennstoffe UG-cookie");
    if (stored) setChoice(stored);

    const openSettings = () => setChoice(null);
    window.addEventListener("AM Holzbrennstoffe UG:manage-cookies", openSettings);
    return () => window.removeEventListener("AM Holzbrennstoffe UG:manage-cookies", openSettings);
  }, []);

  if (choice !== null) return null;

  const save = (value) => {
    localStorage.setItem("AM Holzbrennstoffe UG-cookie", value);
    setChoice(value);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie-Einwilligung">
      <p>
        Wir verwenden Cookies für den Betrieb dieser Website und – mit Ihrer Einwilligung – zur Reichweitenmessung.
        Nicht erforderliche Cookies können Sie akzeptieren oder ablehnen. <Link to="/datenschutz">Mehr erfahren</Link>
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost-light" onClick={() => save("rejected")}>
          Ablehnen
        </button>
        <button type="button" className="btn btn-primary" onClick={() => save("accepted")}>
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
