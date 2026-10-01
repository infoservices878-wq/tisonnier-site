import { useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { FAQ_ITEMS } from "../data/faq";
import { PRODUCTS } from "../data/products";
import { COMPANY } from "../data/legalContent";

const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const hasKeyword = (value, keywords) => keywords.some((keyword) => value.includes(normalize(keyword)));

function getAssistantReply(question) {
  const query = normalize(question);
  const product = PRODUCTS.find((item) => normalize(`${item.name} ${item.brand || ""} ${item.category}`).includes(query) || query.includes(normalize(item.name)));
  const category = CATEGORIES.find((item) => query.includes(normalize(item.name)) || query.includes(item.id));
  const faq = FAQ_ITEMS.find((item) => query.split(" ").filter((word) => word.length > 3).some((word) => normalize(`${item.q} ${item.a}`).includes(word)));

  if (hasKeyword(query, ["wer bist du", "was kannst du", "assistent", "ki", "chatbot"])) return "Ich bin der virtuelle Assistent von AM Holzbrennstoffe UG. Ich helfe Ihnen bei Fragen zu Produkten, Lieferung, Lagerung und Bestellung.";
  if (hasKeyword(query, ["unternehmen", "echt", "register", "handelsregister", "geschaftsfuhrer", "adresse", "impressum"])) return `${COMPANY.name} hat seinen Sitz in ${COMPANY.address}, ${COMPANY.city}, und ist beim ${COMPANY.registerCourt} unter ${COMPANY.registerNumber} eingetragen. Geschäftsführer ist ${COMPANY.manager}.`;
  if (hasKeyword(query, ["sicher", "vertrauen", "serios", "betrug", "betrugerisch"])) return "Im Impressum finden Sie die Unternehmens- und Registerangaben. Prüfen Sie vor einer Bestellung Produktinformationen, Lieferbedingungen und die Auftragsbestätigung.";
  if (hasKeyword(query, ["lieferung", "liefern", "versand", "spedition", "wann", "dauer", "zufahrt"])) return "Die Bestellung wird innerhalb von 1 bis 2 Werktagen nach Zahlungseingang vorbereitet. Die anschließende Lieferung auf Palette dauert in der Regel 3 bis 5 Werktage. Lieferinformationen erhalten Sie vor der Zustellung.";
  if (hasKeyword(query, ["zahlung", "zahlen", "uberweisung", "bank", "rechnung"])) return "Die Zahlung erfolgt per Banküberweisung. Nach Bestätigung Ihrer Anfrage erhalten Sie die Bankverbindung und den genauen Betrag per E-Mail.";
  if (hasKeyword(query, ["lagerung", "lagern", "trocken", "feuchtigkeit", "pellets lagern"])) return "Lagern Sie Säcke und Pakete trocken, gut belüftet und vor Feuchtigkeit geschützt. Stellen Sie die Palette möglichst erhöht ab und lassen Sie die Verpackung geschlossen.";
  if (hasKeyword(query, ["schaden", "beschadigt", "reklamation", "ruckgabe"])) return "Vermerken Sie sichtbare Schäden direkt auf dem Lieferschein und kontaktieren Sie uns innerhalb von 48 Stunden mit Fotos. Wir prüfen den Vorgang mit Ihnen.";
  if (hasKeyword(query, ["kontakt", "email", "e-mail", "telefon"])) return `Sie erreichen uns per E-Mail unter ${COMPANY.email}.`;
  if (product) return `${product.name}. ${product.description} Der angezeigte Preis beträgt ${product.price.toFixed(2).replace(".", ",")} €. Details finden Sie auf der Produktseite.`;
  if (category) return `${category.name}: ${category.blurb}. Alle verfügbaren Artikel finden Sie im Katalog.`;
  if (faq) return faq.a;
  return "Ich helfe Ihnen gerne zu Produkten, Kategorien, Lieferung, Zahlung oder Lagerung. Für eine konkrete Anfrage nutzen Sie bitte unsere Kontaktseite.";
}

export default function VirtualAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ id: 1, role: "assistant", text: "Hallo, ich bin der Assistent von AM Holzbrennstoffe UG. Wie kann ich Ihnen helfen?" }]);
  const messagesEndRef = useRef(null);
  const quickQuestions = useMemo(() => ["Wie lange dauert die Lieferung?", "Wie lagere ich Holzpellets?", "Wie erfolgt die Zahlung?"], []);
  const ask = (value = question) => {
    const text = value.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: Date.now(), role: "user", text }, { id: Date.now() + 1, role: "assistant", text: getAssistantReply(text) }]);
    setQuestion("");
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }));
  };
  return <div className={`assistant-widget${open ? " is-open" : ""}`}>
    {open && <section className="assistant-panel" aria-label="Assistent von AM Holzbrennstoffe UG"><div className="assistant-panel-header"><div><span className="assistant-status"><span /> Assistent AM Holzbrennstoffe UG</span><strong>Klare Antworten, einfach erklärt.</strong></div><button type="button" className="assistant-close" onClick={() => setOpen(false)} aria-label="Assistent schließen"><X size={18} /></button></div><div className="assistant-messages" aria-live="polite">{messages.map((message) => <div key={message.id} className={`assistant-message assistant-message-${message.role}`}>{message.text}</div>)}<div ref={messagesEndRef} /></div><div className="assistant-quick-actions">{quickQuestions.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}</button>)}</div><form className="assistant-form" onSubmit={(event) => { event.preventDefault(); ask(); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ihre Frage eingeben" aria-label="Frage an den Assistenten" /><button type="submit" aria-label="Frage senden"><Send size={16} /></button></form><Link to="/kontakt" className="assistant-contact-link">Konkrete Frage? Team kontaktieren <ChevronDown size={14} /></Link></section>}
    <button type="button" className="assistant-trigger" onClick={() => setOpen((value) => !value)} aria-label={open ? "Assistent schließen" : "Assistent öffnen"}>{open ? <X size={22} /> : <><Bot size={23} /><span className="assistant-trigger-dot" /></>}</button>
  </div>;
}
