import { useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, MessageCircle, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { FAQ_ITEMS } from "../data/faq";
import { PRODUCTS } from "../data/products";
import { COMPANY } from "../data/legalContent";

const normalize = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");
const hasKeyword = (value, keywords) => keywords.some((keyword) => value.includes(normalize(keyword)));

function getAssistantReply(question) {
  const query = normalize(question);
  const product = PRODUCTS.find((item) => {
    const terms = normalize(`${item.name} ${item.brand || ""} ${item.category}`);
    return terms.includes(query) || query.includes(normalize(item.name));
  });
  const category = CATEGORIES.find((item) => query.includes(normalize(item.name)) || query.includes(item.id));
  const faq = FAQ_ITEMS.find((item) => {
    const terms = normalize(`${item.q} ${item.a}`);
    return query.split(" ").filter((word) => word.length > 3).some((word) => terms.includes(word));
  });

  if (hasKeyword(query, ["qui es-tu", "qui es tu", "qui êtes-vous", "qui etes vous", "que fais-tu", "que fais tu", "ton rôle", "ton role"])) {
    return "Je suis l’assistant virtuel d’OSSAU BOIS. Je m’appuie sur les informations publiées dans notre catalogue, nos FAQ et nos pages de service pour vous répondre rapidement. Je ne remplace pas un conseiller : pour une situation particulière ou une confirmation de commande, je vous orienterai vers notre équipe.";
  }
  if (hasKeyword(query, ["vraie ia", "intelligence artificielle", "robot", "automatique", "assistant virtuel"])) {
    return "Je suis un assistant virtuel conçu pour vous guider sur le site OSSAU BOIS. Mes réponses sont basées sur les informations disponibles ici ; je préfère vous le préciser plutôt que d’inventer une réponse. Notre équipe reste votre interlocuteur pour toute validation commerciale.";
  }
  if (hasKeyword(query, ["arnaque", "anarque", "escroquerie", "fraude", "faux site", "fausse entreprise", "pas une arnaque", "peur de commander", "peur de se faire avoir", "rassurer"])) {
    return `D’après les informations publiques consultées, OSSAU BOIS est enregistrée comme une entreprise active et rien dans ces informations ne permet de la qualifier d’arnaque : ${COMPANY.legalForm}, SIREN ${COMPANY.siren}, SIRET ${COMPANY.siret}, RCS Pau, siège à ${COMPANY.city}. Vous pouvez vérifier ces éléments dans les registres officiels et consulter l’extrait INPI (${COMPANY.inpiExtractUrl}). Pour une décision commerciale, vérifiez toujours le bénéficiaire du paiement, demandez une confirmation écrite et contactez l’entreprise si vous avez le moindre doute.`;
  }
  if (hasKeyword(query, ["existe", "existence", "vraie entreprise", "fausse entreprise", "entreprise reelle", "legal", "légal", "siret", "kbis", "preuve", "document officiel", "registre", "immatricule"])) {
    return `OSSAU BOIS est identifiée comme une entreprise active : ${COMPANY.legalForm}, SIREN ${COMPANY.siren}, SIRET ${COMPANY.siret}, RCS Pau, siège à ${COMPANY.city}, capital de ${COMPANY.capital}. Vous pouvez consulter l’extrait INPI (${COMPANY.inpiExtractUrl}). Les documents du site ne remplacent pas les justificatifs officiels les plus récents.`;
  }
  if (hasKeyword(query, ["raison sociale", "adresse entreprise", "dirigeant", "immatriculation", "gérant", "gerant"])) {
    return `Les informations publiques indiquent ${COMPANY.name}, ${COMPANY.legalForm}, siège : ${COMPANY.address}, ${COMPANY.city}, ${COMPANY.country}, ${COMPANY.rcs}. Les gérants indiqués sont ${COMPANY.manager}. Vous pouvez vérifier ces éléments dans les registres officiels et consulter l’extrait INPI (${COMPANY.inpiExtractUrl}).`;
  }
  if (hasKeyword(query, ["authentifie", "certifie", "garantie entreprise", "comment vous faire confiance", "justificatif", "attestation"])) {
    return `Pour une vérification indépendante, consultez l’extrait INPI et les informations légales du site. Les fiches produit, la confirmation écrite et les coordonnées de contact vous permettent également de conserver une trace claire de l’échange. Pour les documents les plus récents, demandez confirmation à ${COMPANY.email}.`;
  }
  if (hasKeyword(query, ["fiable", "confiance", "serieux", "sérieux", "professionnel", "transparent", "avis"])) {
    return "OSSAU BOIS privilégie une relation claire : caractéristiques, conditionnements, prix et modalités de réception sont présentés avant la commande. Pour une première commande, vérifiez les Mentions légales et demandez les justificatifs officiels si nécessaire ; une confirmation écrite et une équipe joignable vous permettent de garder une trace précise de l’échange.";
  }
  if (hasKeyword(query, ["qualite", "qualité", "certification", "norme", "origine", "composition", "caracteristique", "caractéristique"])) {
    return "Chaque fiche produit présente les informations disponibles sur l’origine, la composition, l’humidité, le pouvoir calorifique, les certifications et le conditionnement. Vous pouvez comparer les références avant de choisir celle qui correspond à votre appareil.";
  }
  if (hasKeyword(query, ["securite", "sécurité", "donnees", "données", "rgpd", "confidentialite", "confidentialité", "vie privée"])) {
    return `Nous limitons les données demandées aux informations utiles à la relation client. Pour toute question sur vos données, consultez notre politique de confidentialité ou écrivez à ${COMPANY.email}.`; 
  }
  if (hasKeyword(query, ["garantie", "retour", "échange", "probleme", "problème", "reclamation", "réclamation", "endommage", "abimé", "abime"])) {
    return "En cas d’anomalie, notez vos réserves sur le bon de livraison, prenez des photos et contactez-nous sous 48 heures. Nous examinerons la situation avec vous et proposerons la solution adaptée selon le dossier.";
  }
  if (/^(bonjour|bonsoir|salut|hello|coucou|merci)/.test(query)) {
    return "Bonjour et bienvenue chez OSSAU BOIS. Je peux vous renseigner sur nos combustibles, les caractéristiques produit, la livraison, le retrait ou le stockage.";
  }
  if (hasKeyword(query, ["livraison", "livrer", "expedition", "expédier", "delai", "délai", "transport", "chauffeur", "arrive quand", "réception"])) {
    return "La livraison se fait sur palette, au bord de votre accès carrossable, avec hayon selon les conditions d’accès. Le délai indicatif est de 6 à 8 jours ouvrés et un créneau vous est communiqué avant le passage du transporteur.";
  }
  if (hasKeyword(query, ["retrait", "retirer", "enlevement", "enlèvement", "entrepot", "entrepôt", "phalsbourg", "venir chercher"])) {
    return `Le retrait est possible uniquement sur rendez-vous confirmé à ${COMPANY.warehouse.address}, ${COMPANY.warehouse.city}. Prévoyez un véhicule adapté au poids de la palette ; le paiement sur place est accepté.`;
  }
  if (hasKeyword(query, ["paiement", "payer", "reglement", "règlement", "carte", "cb"])) {
    return "Le paiement en ligne est prévu par carte bancaire. Pour un retrait sur place, le règlement peut être effectué le jour du rendez-vous après confirmation de la réservation.";
  }
  if (hasKeyword(query, ["stockage", "stocker", "conserver", "ranger", "humide", "humidité"])) {
    return "Conservez les sacs et paquets dans un local sec et ventilé, à l’abri de l’humidité. Surélevez la palette et gardez les emballages intacts pour protéger le combustible.";
  }
  if (hasKeyword(query, ["contact", "joindre", "telephone", "téléphone", "email", "mail", "appeler"])) {
    return `Notre équipe est joignable du ${COMPANY.hours.toLowerCase()} au ${COMPANY.phone} ou par e-mail à ${COMPANY.email}.`;
  }
  if (product) {
    return `${product.name}. ${product.description} Prix affiché : ${product.price.toFixed(2).replace(".", ",")} €. Consultez sa fiche pour les caractéristiques et le conditionnement.`;
  }
  if (category) {
    return `${category.name} : ${category.blurb}. Vous trouverez les références disponibles dans le catalogue, avec leurs conditionnements et caractéristiques détaillés.`;
  }
  if (faq) return faq.a;

  return "Je peux vous aider pour un produit, une catégorie, la livraison, le retrait, le paiement ou le stockage. Pour une demande particulière, notre équipe vous répond via la page Contact.";
}

export default function VirtualAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Bonjour, je suis l’assistant OSSAU BOIS. Que souhaitez-vous savoir ?" },
  ]);
  const messagesEndRef = useRef(null);
  const quickQuestions = useMemo(() => ["Quel est le délai de livraison ?", "Comment fonctionne le retrait ?", "Comment stocker les granulés ?"], []);

  const ask = (value = question) => {
    const text = value.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text },
      { id: Date.now() + 1, role: "assistant", text: getAssistantReply(text) },
    ]);
    setQuestion("");
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className={`assistant-widget${open ? " is-open" : ""}`}>
      {open && (
        <section className="assistant-panel" aria-label="Assistant OSSAU BOIS">
          <div className="assistant-panel-header">
            <div><span className="assistant-status"><span /> Assistant OSSAU BOIS</span><strong>Une réponse claire, simplement.</strong></div>
            <button type="button" className="assistant-close" onClick={() => setOpen(false)} aria-label="Fermer l’assistant"><X size={18} /></button>
          </div>
          <div className="assistant-messages" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`assistant-message assistant-message-${message.role}`}>{message.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="assistant-quick-actions">
            {quickQuestions.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}</button>)}
          </div>
          <form className="assistant-form" onSubmit={(event) => { event.preventDefault(); ask(); }}>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Écrire votre question" aria-label="Question à l’assistant" />
            <button type="submit" aria-label="Envoyer la question"><Send size={16} /></button>
          </form>
          <Link to="/contact" className="assistant-contact-link">Question spécifique ? Contacter l’équipe <ChevronDown size={14} /></Link>
        </section>
      )}
      <button type="button" className="assistant-trigger" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fermer l’assistant" : "Ouvrir l’assistant"}>
        {open ? <X size={22} /> : <><Bot size={23} /><span className="assistant-trigger-dot" /></>}
      </button>
    </div>
  );
}
