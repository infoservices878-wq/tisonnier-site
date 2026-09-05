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
        <button type="button" className="password-toggle" onClick={() => setIsVisible((visible) => !visible)} aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"} title={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
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
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const success = await resetPassword({ key, login, password });
    if (success) setSubmitted(true);
  };

  return (
    <section className="section account-page">
      <div className="account-hero">
        <div>
          <span className="section-kicker">ESPACE CLIENT OSSAU BOIS</span>
          <h1 className="page-title">Choisissez un nouveau mot de passe.</h1>
          <p>Votre demande est traitée de manière sécurisée. Vous resterez sur le site Ossau Bois.</p>
        </div>
        <LockKeyhole size={58} strokeWidth={1.1} />
      </div>
      <div className="account-layout">
        <form className="account-form" onSubmit={submit}>
          {submitted ? (
            <div className="form-heading">
              <span className="section-kicker">Mot de passe modifié</span>
              <h2>Vous pouvez vous reconnecter.</h2>
              <p>Votre nouveau mot de passe est actif sur votre compte client.</p>
              <Link to="/connexion" className="btn btn-primary btn-block">Se connecter <ArrowRight size={16} /></Link>
            </div>
          ) : !hasResetLink ? (
            <div className="form-heading">
              <span className="section-kicker">Lien invalide</span>
              <h2>Ce lien ne peut pas être utilisé.</h2>
              <p>Demandez un nouveau lien de réinitialisation depuis la page de connexion.</p>
              <Link to="/connexion" className="btn btn-primary btn-block">Retour à la connexion <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <>
              <div className="form-heading"><span className="section-kicker">Réinitialisation</span><h2>Définissez votre nouveau mot de passe</h2><p>Choisissez au moins 8 caractères, puis confirmez-les.</p></div>
              <PasswordField label="Nouveau mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} />
              <PasswordField label="Confirmer le mot de passe" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
              {(error || authError) && <p className="form-error" role="alert">{error || authError}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={isAuthenticating}>{isAuthenticating ? "Validation..." : "Modifier mon mot de passe"} <ArrowRight size={16} /></button>
            </>
          )}
        </form>
        <aside className="account-aside"><ShieldCheck size={24} /><h2>Une réinitialisation confidentielle</h2><p>Le lien reçu par e-mail est personnel et temporaire. Votre nouveau mot de passe est enregistré directement sur votre compte client.</p></aside>
      </div>
    </section>
  );
}
