import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, LockKeyhole, Package, RefreshCw, ShieldCheck, Truck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function Login() {
  const { account, authError, isAuthenticating, orders, isLoadingOrders, loadOrders, login, register, forgotPassword, logout } = useAccount();
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
    const latestOrder = orders[0];
    const activeOrders = orders.filter((order) => !["completed", "cancelled", "refunded", "failed"].includes(order.status)).length;
    const formatPrice = (order) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: order.currency || "EUR" }).format(Number(order.total || 0));
    const formatDate = (date) => date ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)) : "Date non disponible";
    const statusLabels = { pending: "En attente de virement", processing: "En préparation", "on-hold": "En attente de validation", completed: "Terminée", cancelled: "Annulée", refunded: "Remboursée", failed: "Échec du paiement" };
    const statusLabel = statusLabels[latestOrder?.status] || "Commande reçue";
    const statusIcon = latestOrder?.status === "completed" ? <CheckCircle2 size={20} /> : latestOrder?.status === "processing" ? <Truck size={20} /> : <Clock3 size={20} />;

    return (
      <section className="section account-page">
        <div className="account-hero"><div><span className="section-kicker">TABLEAU DE BORD CLIENT</span><h1 className="page-title">Bonjour {account.name}.</h1><p>Suivez vos approvisionnements, retrouvez vos commandes et préparez votre prochaine saison de chauffe.</p></div><UserRound size={58} strokeWidth={1.1} /></div>
        <div className="account-dashboard-top"><div><span className="section-kicker">Votre compte</span><h2>{account.email}</h2><p>Client Ossau Bois depuis votre espace personnel.</p></div><div className="account-dashboard-actions"><Link to="/favoris" className="btn btn-primary">Mes favoris <ArrowRight size={16} /></Link><button type="button" className="account-text-button" onClick={logout}>Se déconnecter</button></div></div>
        <div className="account-metrics"><div><Package size={20} /><span>Commandes</span><strong>{orders.length}</strong></div><div><Truck size={20} /><span>En cours</span><strong>{activeOrders}</strong></div><div><ShieldCheck size={20} /><span>Compte sécurisé</span><strong>Actif</strong></div></div>
        <div className="account-dashboard-heading"><div><span className="section-kicker">Suivi des approvisionnements</span><h2>Vos commandes</h2></div><button type="button" className="account-refresh" onClick={() => loadOrders()} disabled={isLoadingOrders} aria-label="Actualiser les commandes" title="Actualiser les commandes"><RefreshCw size={17} className={isLoadingOrders ? "is-spinning" : ""} /></button></div>
        {isLoadingOrders ? <div className="account-orders-empty"><Clock3 size={25} /><p>Chargement de votre historique...</p></div> : latestOrder ? <div className="account-latest-order"><div className="account-latest-icon">{statusIcon}</div><div className="account-latest-main"><span className="section-kicker">Dernière commande</span><h3>{latestOrder.reference}</h3><p>{latestOrder.items?.length || 0} référence(s) · passée le {formatDate(latestOrder.date)}</p><div className="account-order-status"><span>{statusLabel}</span><strong>{formatPrice(latestOrder)}</strong></div></div></div> : <div className="account-orders-empty"><Package size={25} /><h3>Aucune commande pour le moment</h3><p>Vos prochaines commandes apparaîtront ici dès leur enregistrement.</p><Link to="/catalogue" className="btn btn-primary">Découvrir le catalogue <ArrowRight size={16} /></Link></div>}
        {orders.length > 0 && <div className="account-history"><div className="account-dashboard-heading"><div><span className="section-kicker">Historique</span><h2>Les dernières commandes</h2></div></div><div className="account-order-list">{orders.map((order) => <div className="account-order-row" key={order.id}><div className="account-order-reference"><Package size={18} /><div><strong>{order.reference}</strong><span>{formatDate(order.date)}</span></div></div><span className={`account-status account-status-${order.status}`}>{statusLabels[order.status] || "Commande reçue"}</span><strong className="account-order-total">{formatPrice(order)}</strong></div>)}</div></div>}
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
