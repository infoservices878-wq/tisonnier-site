import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function VerifyEmail() {
  const { authError, isAuthenticating, verifyEmail } = useAccount();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const hasVerified = useRef(false);
  const key = searchParams.get("key") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (hasVerified.current) return;
    if (!key || !email) {
      setStatus("invalid");
      return;
    }

    hasVerified.current = true;
    verifyEmail({ key, email }).then((success) => setStatus(success ? "verified" : "invalid"));
  }, [key, email]);

  return (
    <section className="section account-page">
      <div className="account-hero">
        <div>
          <span className="section-kicker">KUNDENBEREICH AM HOLZBRENNSTOFFE UG</span>
          <h1 className="page-title">Bestätigung Ihrer E-Mail-Adresse.</h1>
          <p>Ihre Anfrage wird auf der Website von AM Holzbrennstoffe UG verarbeitet.</p>
        </div>
        <MailCheck size={58} strokeWidth={1.1} />
      </div>
      <div className="account-layout">
        <div className="account-form">
          {status === "pending" && <div className="form-heading"><span className="section-kicker">BESTÄTIGUNG LÄUFT</span><h2>Wir bestätigen Ihre Adresse.</h2><p>{isAuthenticating ? "Einen Moment bitte ..." : "Bitte warten Sie."}</p></div>}
          {status === "verified" && <div className="form-heading"><CheckCircle2 className="account-verification-icon" size={30} /><span className="section-kicker">ADRESSE BESTÄTIGT</span><h2>Ihr Konto ist aktiviert.</h2><p>Sie können sich jetzt in Ihrem Kundenbereich anmelden.</p><Link to="/connexion" className="btn btn-primary btn-block">Anmelden <ArrowRight size={16} /></Link></div>}
          {status === "invalid" && <div className="form-heading"><span className="section-kicker">UNGÜLTIGER LINK</span><h2>Diese Bestätigung ist nicht mehr verfügbar.</h2><p>{authError || "Der Link ist ungültig oder abgelaufen. Sie können ein neues Konto mit einer gültigen Adresse erstellen."}</p><Link to="/connexion" className="btn btn-primary btn-block">Zur Anmeldung <ArrowRight size={16} /></Link></div>}
        </div>
        <aside className="account-aside"><ShieldCheck size={24} /><h2>Bestätigte Adresse, sicheres Konto</h2><p>Die Bestätigung Ihrer Adresse schützt Ihr Konto und ermöglicht AM Holzbrennstoffe UG, Ihnen wichtige Informationen zu Ihren Bestellungen zu senden.</p></aside>
      </div>
    </section>
  );
}
