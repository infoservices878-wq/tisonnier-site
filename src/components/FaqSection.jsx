import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { FAQ_ITEMS } from "../data/faq";

export default function FaqSection({ limit = null, showAllLink = false, title = "Questions fréquentes" }) {
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <section className="section faq-section">
      <div className="section-head-row">
        <h2 className="section-title">{title}</h2>
        {showAllLink && (
          <Link to="/faq" className="link-btn">
            Voir toutes les questions <ChevronRight size={16} strokeWidth={1.7} />
          </Link>
        )}
      </div>
      <div className="faq-list">
        {items.map((item, i) => (
          <details key={i} className="faq-item" open={i === 0}>
            <summary className="faq-q">{item.q}</summary>
            <p className="faq-a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
