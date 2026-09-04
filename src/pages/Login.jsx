import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function Login() {
  const { account, authError, login, register, logout } = useAccount();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (event) => {
    event.preventDefault();
    mode === "register" ? await register(form) : await login(form);
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
          <div className="form-heading"><span className="section-kicker">{mode === "login" ? "Connexion" : "Nouveau compte"}</span><h2>{mode === "login" ? "Bienvenue dans votre espace" : "Créez votre espace client"}</h2><p>{mode === "login" ? "Utilisez l’adresse e-mail associée à votre compte client." : "Enregistrez vos coordonnées pour retrouver vos favoris et simplifier vos prochaines visites."}</p></div>
          {mode === "register" && <label className="field"><span>Nom complet</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>}
          <label className="field"><span>Adresse e-mail</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="vous@exemple.fr" required /></label>
          <label className="field"><span>Mot de passe</span><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Votre mot de passe" minLength={6} required /></label>
          {authError && <p className="form-error" role="alert">{authError}</p>}
          <button type="submit" className="btn btn-primary btn-block">{mode === "login" ? "Se connecter" : "Créer mon compte"} <ArrowRight size={16} /></button>
          <button type="button" className="account-text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Nouveau client ? Créer un compte" : "Déjà client ? Se connecter"}</button>
        </form>
        <aside className="account-aside"><LockKeyhole size={24} /><h2>Un espace pensé pour vos achats réguliers</h2><p>Conservez vos informations et gagnez du temps lors de vos prochaines commandes de granulés, briquettes ou bois de chauffage.</p><div className="account-aside-line"><ShieldCheck size={17} /><span>Données traitées dans le respect de votre confidentialité.</span></div><Link to="/contact" className="account-aside-link">Besoin d’aide ? Nous contacter <ArrowRight size={15} /></Link></aside>
      </div>
    </section>
  );
}
