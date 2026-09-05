import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function Login() {
  const { account, authError, isAuthenticating, login, register, forgotPassword, logout } = useAccount();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [resetSent, setResetSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (mode === "register") {
      await register(form);
    } else if (mode === "forgot-password") {
      setResetSent(await forgotPassword(form.email));
    } else {
      await login(form);
    }
  };

  if (account) {
    return (
      <section className="section account-page">
        <div className="account-hero"><div><span className="section-kicker">ESPACE CLIENT OSSAU BOIS</span><h1 className="page-title">Bonjour {account.name}.</h1><p>Votre espace est prêt. Retrouvez vos favoris et préparez votre prochaine commande avec les informations du site.</p></div><UserRound size={58} strokeWidth={1.1} /></div>
        <div className="account-connected"><ShieldCheck size={24} /><div><span className="section-kicker">Compte connecté</span><h2>{account.email}</h2><p>Vos favoris sont conservés sur cet appareil.</p><div><Link to="/favoris" className="btn btn-primary">Voir mes favoris <ArrowRight size={16} /></Link><button type="button" className="account-text-button" onClick={logout}>Se déconnecter</button></div></div></div>
      </section>
    );
  }

  return (
    <section className="section account-page">
      <div className="account-hero">
        <div>
          <span className="section-kicker">ESPACE CLIENT OSSAU BOIS</span>
          <h1 className="page-title">Retrouvez vos commandes en un seul endroit.</h1>
          <p>Connectez-vous pour suivre vos demandes, retrouver vos références habituelles et préparer votre prochain approvisionnement.</p>
        </div>
        <UserRound size={58} strokeWidth={1.1} />
      </div>
      <div className="account-layout">
        <form className="account-form" onSubmit={submit}>
          <div className="form-heading"><span className="section-kicker">{mode === "login" ? "Connexion" : mode === "register" ? "Nouveau compte" : "Réinitialisation"}</span><h2>{mode === "login" ? "Bienvenue dans votre espace" : mode === "register" ? "Créez votre espace client" : "Mot de passe oublié ?"}</h2><p>{mode === "login" ? "Utilisez l’adresse e-mail associée à votre compte client." : mode === "register" ? "Enregistrez vos coordonnées pour retrouver vos favoris et simplifier vos prochaines visites." : "Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation."}</p></div>
          {resetSent && <p className="account-form-success" role="status">Si un compte correspond à cette adresse, un e-mail de réinitialisation vient d’être envoyé.</p>}
          {mode === "register" && <label className="field"><span>Nom complet</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>}
          <label className="field"><span>Adresse e-mail</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="vous@exemple.fr" required /></label>
          {mode !== "forgot-password" && <label className="field"><span>Mot de passe</span><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Votre mot de passe" minLength={8} required /></label>}
          {authError && <p className="form-error" role="alert">{authError}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={isAuthenticating}>{isAuthenticating ? "Validation..." : mode === "login" ? "Se connecter" : mode === "register" ? "Créer mon compte" : "Recevoir le lien"} <ArrowRight size={16} /></button>
          {mode === "login" && <button type="button" className="account-text-button" disabled={isAuthenticating} onClick={() => { setResetSent(false); setMode("forgot-password"); }}>Mot de passe oublié ?</button>}
          <button type="button" className="account-text-button" disabled={isAuthenticating} onClick={() => { setResetSent(false); setMode(mode === "register" ? "login" : "register"); }}>{mode === "register" ? "Déjà client ? Se connecter" : "Nouveau client ? Créer un compte"}</button>
          {mode === "forgot-password" && <button type="button" className="account-text-button" disabled={isAuthenticating} onClick={() => { setResetSent(false); setMode("login"); }}>Retour à la connexion</button>}
        </form>
        <aside className="account-aside"><LockKeyhole size={24} /><h2>Un espace pensé pour vos achats réguliers</h2><p>Conservez vos informations et gagnez du temps lors de vos prochaines commandes de granulés, briquettes ou bois de chauffage.</p><div className="account-aside-line"><ShieldCheck size={17} /><span>Données traitées dans le respect de votre confidentialité.</span></div><Link to="/contact" className="account-aside-link">Besoin d’aide ? Nous contacter <ArrowRight size={15} /></Link></aside>
      </div>
    </section>
  );
}
