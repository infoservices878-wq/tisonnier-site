import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function VerifyEmail() {
  const { authError, isAuthenticating, verifyEmail } = useAccount();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const key = searchParams.get("key") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!key || !email) {
      setStatus("invalid");
      return;
    }

    verifyEmail({ key, email }).then((success) => setStatus(success ? "verified" : "invalid"));
  }, [key, email]);

  return (
    <section className="section account-page">
      <div className="account-hero">
        <div>
          <span className="section-kicker">ESPACE CLIENT OSSAU BOIS</span>
          <h1 className="page-title">Confirmation de votre adresse e-mail.</h1>
          <p>Votre demande est traitée sur le site Ossau Bois.</p>
        </div>
        <MailCheck size={58} strokeWidth={1.1} />
      </div>
      <div className="account-layout">
        <div className="account-form">
          {status === "pending" && <div className="form-heading"><span className="section-kicker">Vérification en cours</span><h2>Nous confirmons votre adresse.</h2><p>{isAuthenticating ? "Un instant..." : "Veuillez patienter."}</p></div>}
          {status === "verified" && <div className="form-heading"><CheckCircle2 className="account-verification-icon" size={30} /><span className="section-kicker">Adresse confirmée</span><h2>Votre compte est activé.</h2><p>Vous pouvez maintenant vous connecter à votre espace client.</p><Link to="/connexion" className="btn btn-primary btn-block">Se connecter <ArrowRight size={16} /></Link></div>}
          {status === "invalid" && <div className="form-heading"><span className="section-kicker">Lien invalide</span><h2>Cette confirmation n’est plus disponible.</h2><p>{authError || "Le lien est invalide ou a expiré. Vous pouvez créer un nouveau compte avec une adresse valide."}</p><Link to="/connexion" className="btn btn-primary btn-block">Retour à la connexion <ArrowRight size={16} /></Link></div>}
        </div>
        <aside className="account-aside"><ShieldCheck size={24} /><h2>Une adresse vérifiée pour un espace fiable</h2><p>La confirmation de votre adresse protège votre compte et permet à Ossau Bois de vous transmettre les informations importantes liées à vos commandes.</p></aside>
      </div>
    </section>
  );
}
