import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import VirtualAssistant from "./components/VirtualAssistant";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Payment from "./pages/Payment";
import Returns from "./pages/Returns";
import FAQ from "./pages/FAQ";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Favorites from "./pages/Favorites";

const legacyRoutePrefixes = {
  "/catalogue": "/katalog",
  "/produit": "/produkt",
  "/panier": "/warenkorb",
  "/commande": "/bestellung",
  "/connexion": "/anmelden",
  "/reinitialisation": "/passwort-zuruecksetzen",
  "/verification-email": "/e-mail-bestaetigung",
  "/favoris": "/favoriten",
  "/contact": "/kontakt",
  "/entreprise": "/ueber-uns",
  "/livraison": "/lieferung",
  "/mentions-legales": "/impressum",
  "/politique-de-confidentialite": "/datenschutz",
  "/conditions-generales-de-vente": "/agb",
};

function LegacyRouteRedirect() {
  const location = useLocation();
  const legacyPrefix = Object.keys(legacyRoutePrefixes).find((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`));
  const destination = legacyPrefix ? location.pathname.replace(legacyPrefix, legacyRoutePrefixes[legacyPrefix]) : "/";

  return <Navigate replace to={`${destination}${location.search}${location.hash}`} />;
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/katalog" element={<Catalogue />} />
          <Route path="/katalog/:categoryId" element={<Catalogue />} />
          <Route path="/produkt/:productId" element={<ProductDetail />} />
          <Route path="/warenkorb" element={<Cart />} />
          <Route path="/bestellung" element={<Order />} />
          <Route path="/anmelden" element={<Login />} />
          <Route path="/passwort-zuruecksetzen" element={<ResetPassword />} />
          <Route path="/e-mail-bestaetigung" element={<VerifyEmail />} />
          <Route path="/favoriten" element={<Favorites />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/ueber-uns" element={<About />} />
          <Route path="/lieferung" element={<Delivery />} />
          <Route path="/zahlung" element={<Payment />} />
          <Route path="/retouren" element={<Returns />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/impressum" element={<LegalPage />} />
          <Route path="/datenschutz" element={<LegalPage />} />
          <Route path="/agb" element={<LegalPage />} />
          <Route path="/catalogue/*" element={<LegacyRouteRedirect />} />
          <Route path="/produit/*" element={<LegacyRouteRedirect />} />
          <Route path="/panier/*" element={<LegacyRouteRedirect />} />
          <Route path="/commande/*" element={<LegacyRouteRedirect />} />
          <Route path="/connexion/*" element={<LegacyRouteRedirect />} />
          <Route path="/reinitialisation/*" element={<LegacyRouteRedirect />} />
          <Route path="/verification-email/*" element={<LegacyRouteRedirect />} />
          <Route path="/favoris/*" element={<LegacyRouteRedirect />} />
          <Route path="/contact/*" element={<LegacyRouteRedirect />} />
          <Route path="/entreprise/*" element={<LegacyRouteRedirect />} />
          <Route path="/livraison/*" element={<LegacyRouteRedirect />} />
          <Route path="/mentions-legales/*" element={<LegacyRouteRedirect />} />
          <Route path="/politique-de-confidentialite/*" element={<LegacyRouteRedirect />} />
          <Route path="/conditions-generales-de-vente/*" element={<LegacyRouteRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <VirtualAssistant />
      <CookieConsent />
    </div>
  );
}
