import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
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
        <form className="account-form" onSubmit={(event) => event.preventDefault()}>
          <div className="form-heading"><span className="section-kicker">Connexion</span><h2>Bienvenue dans votre espace</h2><p>Utilisez l’adresse e-mail associée à votre compte client.</p></div>
          <label className="field"><span>Adresse e-mail</span><input type="email" placeholder="vous@exemple.fr" required /></label>
          <label className="field"><span>Mot de passe</span><input type="password" placeholder="Votre mot de passe" required /></label>
          <button type="submit" className="btn btn-primary btn-block">Se connecter <ArrowRight size={16} /></button>
          <button type="button" className="account-text-button">Mot de passe oublié ?</button>
        </form>
        <aside className="account-aside"><LockKeyhole size={24} /><h2>Un espace pensé pour vos achats réguliers</h2><p>Conservez vos informations et gagnez du temps lors de vos prochaines commandes de granulés, briquettes ou bois de chauffage.</p><div className="account-aside-line"><ShieldCheck size={17} /><span>Données traitées dans le respect de votre confidentialité.</span></div><Link to="/contact" className="account-aside-link">Besoin d’aide ? Nous contacter <ArrowRight size={15} /></Link></aside>
      </div>
    </section>
  );
}
