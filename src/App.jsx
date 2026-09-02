import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import FAQ from "./pages/FAQ";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:categoryId" element={<Catalogue />} />
          <Route path="/produit/:productId" element={<ProductDetail />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/entreprise" element={<About />} />
          <Route path="/livraison" element={<Delivery />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/politique-de-confidentialite" element={<LegalPage />} />
          <Route path="/conditions-generales-de-vente" element={<LegalPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
