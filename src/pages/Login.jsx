import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Eye, EyeOff, LockKeyhole, Package, RefreshCw, ShieldCheck, Truck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

function PasswordField({ label, value, onChange, placeholder }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="field">
      <span>{label}</span>
      <span className="password-field">
        <input type={isVisible ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} minLength={8} required autoComplete="current-password" />
        <button type="button" className="password-toggle" onClick={() => setIsVisible((visible) => !visible)} aria-label={isVisible ? "Passwort ausblenden" : "Passwort anzeigen"} title={isVisible ? "Passwort ausblenden" : "Passwort anzeigen"}>
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}

export default function Login() {
  const { account, authError, isAuthenticating, orders, isLoadingOrders, loadOrders, login, register, forgotPassword, logout } = useAccount();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [resetSent, setResetSent] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (mode === "register") {
      const payload = await register(form);
      setVerificationSent(Boolean(payload?.verification_required));
    } else if (mode === "forgot-password") {
      setResetSent(await forgotPassword(form.email));
    } else {
      await login(form);
    }
  };

  if (account) {
    const latestOrder = orders[0];
    const activeOrders = orders.filter((order) => !["completed", "cancelled", "refunded", "failed"].includes(order.status)).length;
    const formatPrice = (order) => new Intl.NumberFormat("de-DE", { style: "currency", currency: order.currency || "EUR" }).format(Number(order.total || 0));
    const formatDate = (date) => date ? new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date)) : "Datum nicht verfügbar";
    const statusLabels = { pending: "Überweisung ausstehend", processing: "In Vorbereitung", "on-hold": "Bestätigung ausstehend", completed: "Abgeschlossen", cancelled: "Storniert", refunded: "Erstattet", failed: "Zahlung fehlgeschlagen" };
    const statusLabel = statusLabels[latestOrder?.status] || "Bestellung eingegangen";
    const statusIcon = latestOrder?.status === "completed" ? <CheckCircle2 size={20} /> : latestOrder?.status === "processing" ? <Truck size={20} /> : <Clock3 size={20} />;

    return (
      <section className="section account-page">
        <div className="account-hero"><div><span className="section-kicker">KUNDENKONTO</span><h1 className="page-title">Hallo {account.name}.</h1><p>Behalten Sie Bestellungen im Blick und bereiten Sie Ihren nächsten Brennstoffkauf vor.</p></div><UserRound size={58} strokeWidth={1.1} /></div>
        <div className="account-dashboard-top"><div><span className="section-kicker">Ihr Konto</span><h2>{account.email}</h2><p>Ihr Kundenbereich bei AM Holzbrennstoffe UG.</p></div><div className="account-dashboard-actions"><Link to="/favoris" className="btn btn-primary">Meine Favoriten <ArrowRight size={16} /></Link><button type="button" className="account-text-button" onClick={logout}>Abmelden</button></div></div>
        <div className="account-metrics"><div><Package size={20} /><span>Bestellungen</span><strong>{orders.length}</strong></div><div><Truck size={20} /><span>In Bearbeitung</span><strong>{activeOrders}</strong></div><div><ShieldCheck size={20} /><span>Sicheres Konto</span><strong>Aktiv</strong></div></div>
        <div className="account-dashboard-heading"><div><span className="section-kicker">BESTELLÜBERSICHT</span><h2>Ihre Bestellungen</h2></div><button type="button" className="account-refresh" onClick={() => loadOrders()} disabled={isLoadingOrders} aria-label="Bestellungen aktualisieren" title="Bestellungen aktualisieren"><RefreshCw size={17} className={isLoadingOrders ? "is-spinning" : ""} /></button></div>
        {isLoadingOrders ? <div className="account-orders-empty"><Clock3 size={25} /><p>Ihre Bestellhistorie wird geladen ...</p></div> : latestOrder ? <div className="account-latest-order"><div className="account-latest-icon">{statusIcon}</div><div className="account-latest-main"><span className="section-kicker">LETZTE BESTELLUNG</span><h3>{latestOrder.reference}</h3><p>{latestOrder.items?.length || 0} Produkt(e) · bestellt am {formatDate(latestOrder.date)}</p><div className="account-order-status"><span>{statusLabel}</span><strong>{formatPrice(latestOrder)}</strong></div></div></div> : <div className="account-orders-empty"><Package size={25} /><h3>Noch keine Bestellung</h3><p>Ihre nächsten Bestellungen erscheinen hier, sobald sie gespeichert sind.</p><Link to="/catalogue" className="btn btn-primary">Katalog entdecken <ArrowRight size={16} /></Link></div>}
        {orders.length > 0 && <div className="account-history"><div className="account-dashboard-heading"><div><span className="section-kicker">HISTORIE</span><h2>Ihre letzten Bestellungen</h2></div></div><div className="account-order-list">{orders.map((order) => <div className="account-order-row" key={order.id}><div className="account-order-reference"><Package size={18} /><div><strong>{order.reference}</strong><span>{formatDate(order.date)}</span></div></div><span className={`account-status account-status-${order.status}`}>{statusLabels[order.status] || "Bestellung eingegangen"}</span><strong className="account-order-total">{formatPrice(order)}</strong></div>)}</div></div>}
      </section>
    );
  }

  return (
    <section className="section account-page">
      <div className="account-hero">
        <div>
          <span className="section-kicker">KUNDENBEREICH AM HOLZBRENNSTOFFE UG</span>
          <h1 className="page-title">Ihre Bestellungen an einem Ort.</h1>
          <p>Melden Sie sich an, um Anfragen nachzuverfolgen, Favoriten wiederzufinden und Ihren nächsten Einkauf vorzubereiten.</p>
        </div>
        <UserRound size={58} strokeWidth={1.1} />
      </div>
      <div className="account-layout">
        <form className="account-form" onSubmit={submit}>
          <div className="form-heading"><span className="section-kicker">{mode === "login" ? "ANMELDEN" : mode === "register" ? "NEUES KONTO" : "PASSWORT ZURÜCKSETZEN"}</span><h2>{mode === "login" ? "Willkommen in Ihrem Kundenbereich" : mode === "register" ? "Kundenkonto erstellen" : "Passwort vergessen?"}</h2><p>{mode === "login" ? "Verwenden Sie die E-Mail-Adresse Ihres Kundenkontos." : mode === "register" ? "Speichern Sie Ihre Daten, um Favoriten wiederzufinden und künftige Besuche zu vereinfachen." : "Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten."}</p></div>
          {resetSent && <p className="account-form-success" role="status">Wenn ein Konto zu dieser Adresse existiert, wurde eine E-Mail zum Zurücksetzen gesendet.</p>}
          {verificationSent && <p className="account-form-success" role="status">Ihr Konto ist fast bereit. Prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Adresse vor der Anmeldung.</p>}
          {mode === "register" && <label className="field"><span>Vollständiger Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>}
          <label className="field"><span>E-Mail-Adresse</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="sie@beispiel.de" required /></label>
          {mode !== "forgot-password" && <PasswordField label="Passwort" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Ihr Passwort" />}
          {authError && <p className="form-error" role="alert">{authError}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={isAuthenticating}>{isAuthenticating ? "Wird verarbeitet..." : mode === "login" ? "Anmelden" : mode === "register" ? "Konto erstellen" : "Link erhalten"} <ArrowRight size={16} /></button>
          {mode === "login" && <button type="button" className="account-text-button" disabled={isAuthenticating} onClick={() => { setResetSent(false); setMode("forgot-password"); }}>Passwort vergessen?</button>}
          <button type="button" className="account-text-button" disabled={isAuthenticating} onClick={() => { setResetSent(false); setMode(mode === "register" ? "login" : "register"); }}>{mode === "register" ? "Bereits Kunde? Anmelden" : "Neu hier? Konto erstellen"}</button>
          {mode === "forgot-password" && <button type="button" className="account-text-button" disabled={isAuthenticating} onClick={() => { setResetSent(false); setMode("login"); }}>Zurück zur Anmeldung</button>}
        </form>
        <aside className="account-aside"><LockKeyhole size={24} /><h2>Ein Konto für regelmäßige Einkäufe</h2><p>Speichern Sie Ihre Daten und sparen Sie Zeit bei künftigen Bestellungen von Pellets, Briketts oder Brennholz.</p><div className="account-aside-line"><ShieldCheck size={17} /><span>Ihre Daten werden vertraulich verarbeitet.</span></div><Link to="/contact" className="account-aside-link">Hilfe benötigt? Kontakt aufnehmen <ArrowRight size={15} /></Link></aside>
      </div>
    </section>
  );
}
