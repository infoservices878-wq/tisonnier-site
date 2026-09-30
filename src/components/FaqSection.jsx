import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { FAQ_ITEMS } from "../data/faq";

export default function FaqSection({ limit = null, showAllLink = false, title = "Häufige Fragen" }) {
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <section className="section faq-section">
      <div className="section-head-row">
        <h2 className="section-title">{title}</h2>
        {showAllLink && (
          <Link to="/faq" className="link-btn">
            Alle Fragen ansehen <ChevronRight size={16} strokeWidth={1.7} />
          </Link>
        )}
      </div>
      <div className="faq-list">
        {items.map((item, i) => (
          <details key={item.q} className="faq-item" open={i === 0}>
            <summary className="faq-q">{item.q}</summary>
            <p className="faq-a">{item.a}</p>
            {item.link && <p className="faq-a"><Link to={item.link.to}>{item.link.label}</Link></p>}
          </details>
        ))}
      </div>
    </section>
  );
}
