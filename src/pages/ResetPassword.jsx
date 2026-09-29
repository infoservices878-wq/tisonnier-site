import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

function PasswordField({ label, value, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="field">
      <span>{label}</span>
      <span className="password-field">
        <input type={isVisible ? "text" : "password"} value={value} onChange={onChange} minLength={8} required autoComplete="new-password" />
        <button type="button" className="password-toggle" onClick={() => setIsVisible((visible) => !visible)} aria-label={isVisible ? "Passwort ausblenden" : "Passwort anzeigen"} title={isVisible ? "Passwort ausblenden" : "Passwort anzeigen"}>
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}

export default function ResetPassword() {
  const { authError, isAuthenticating, resetPassword } = useAccount();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const key = searchParams.get("key") || "";
  const login = searchParams.get("login") || "";
  const hasResetLink = Boolean(key && login);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen enthalten.");
      return;
    }
    if (password !== confirmation) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      return;
    }

    const success = await resetPassword({ key, login, password });
    if (success) setSubmitted(true);
  };

  return (
    <section className="section account-page">
      <div className="account-hero">
        <div>
          <span className="section-kicker">KUNDENBEREICH AM HOLZBRENNSTOFFE UG</span>
          <h1 className="page-title">Wählen Sie ein neues Passwort.</h1>
          <p>Ihre Anfrage wird sicher auf der Website von AM Holzbrennstoffe UG verarbeitet.</p>
        </div>
        <LockKeyhole size={58} strokeWidth={1.1} />
      </div>
      <div className="account-layout">
        <form className="account-form" onSubmit={submit}>
          {submitted ? (
            <div className="form-heading">
              <span className="section-kicker">PASSWORT GEÄNDERT</span>
              <h2>Sie können sich jetzt wieder anmelden.</h2>
              <p>Ihr neues Passwort ist für Ihr Kundenkonto aktiv.</p>
              <Link to="/connexion" className="btn btn-primary btn-block">Anmelden <ArrowRight size={16} /></Link>
            </div>
          ) : !hasResetLink ? (
            <div className="form-heading">
              <span className="section-kicker">UNGÜLTIGER LINK</span>
              <h2>Dieser Link kann nicht verwendet werden.</h2>
              <p>Fordern Sie auf der Anmeldeseite einen neuen Link zum Zurücksetzen an.</p>
              <Link to="/connexion" className="btn btn-primary btn-block">Zur Anmeldung <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <>
              <div className="form-heading"><span className="section-kicker">PASSWORT ZURÜCKSETZEN</span><h2>Neues Passwort festlegen</h2><p>Wählen Sie mindestens 8 Zeichen und bestätigen Sie diese.</p></div>
              <PasswordField label="Neues Passwort" value={password} onChange={(event) => setPassword(event.target.value)} />
              <PasswordField label="Passwort bestätigen" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
              {(error || authError) && <p className="form-error" role="alert">{error || authError}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={isAuthenticating}>{isAuthenticating ? "Wird verarbeitet..." : "Passwort ändern"} <ArrowRight size={16} /></button>
            </>
          )}
        </form>
        <aside className="account-aside"><ShieldCheck size={24} /><h2>Vertrauliches Zurücksetzen</h2><p>Der per E-Mail erhaltene Link ist persönlich und zeitlich begrenzt. Ihr neues Passwort wird direkt in Ihrem Kundenkonto gespeichert.</p></aside>
      </div>
    </section>
  );
}
