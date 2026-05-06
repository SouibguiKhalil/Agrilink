import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProducersPage } from "./pages/ProducersPage";
import { ProducerStorePage } from "./pages/ProducerStorePage";
import { ProducerDetailsPage } from "./pages/ProducerDetailsPage";
import { CartPage } from "./pages/CartPage";
import { DeliveryPage } from "./pages/DeliveryPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { AccountPage } from "./pages/AccountPage";
import ProducerProductsPage from "./pages/ProducerProductsPage";
import ProducerSettingsPage from "./pages/ProducerSettingsPage";
import ProducerProfilePage from "./pages/ProducerProfilePage";
import { ProducerOrdersPage } from "./pages/ProducerOrdersPage";
import { AboutPage } from "./pages/AboutPage";
import { HelpPage } from "./pages/HelpPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { BuyerOrdersPage } from "./pages/BuyerOrdersPage";
import { BuyerOrderDetailPage } from "./pages/BuyerOrderDetailPage";
import { BuyerFavoritesPage } from "./pages/BuyerFavoritesPage";
import { BuyerAddressesPage } from "./pages/BuyerAddressesPage";
import { BuyerSettingsPage } from "./pages/BuyerSettingsPage";
import { AccountEntryPage } from "./pages/AccountEntryPage";
import Header from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produits" element={<ProductsPage />} />
          <Route path="/produit/:id" element={<ProductDetailPage />} />
          <Route path="/producteurs" element={<ProducersPage />} />
          <Route path="/producteur/:id" element={<ProducerDetailsPage />} />
          <Route path="/producteur/:id/boutique" element={<ProducerStorePage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/panier/livraison" element={<DeliveryPage />} />
          <Route path="/panier/confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/compte" element={<AccountPage />} />
          <Route path="/mon-compte" element={<AccountEntryPage />} />
          <Route path="/mon-compte/commandes" element={<BuyerOrdersPage />} />
          <Route path="/mon-compte/commandes/:id" element={<BuyerOrderDetailPage />} />
          <Route path="/mon-compte/favoris" element={<BuyerFavoritesPage />} />
          <Route path="/mon-compte/adresses" element={<BuyerAddressesPage />} />
          <Route path="/mon-compte/parametres" element={<BuyerSettingsPage />} />
          <Route path="/dashboard-producteur" element={<ProducerProfilePage />} />
          <Route path="/producteur/produits" element={<ProducerProductsPage />} />
          <Route path="/producteur/parametres" element={<ProducerSettingsPage />} />
          <Route path="/producteur/commandes" element={<ProducerOrdersPage />} />
          <Route path="/account/producer/products" element={<ProducerProductsPage />} />
          <Route path="/account/producer/profile" element={<ProducerProfilePage />} />
          <Route path="/account/producer/settings" element={<ProducerSettingsPage />} />
          <Route path="/account/producer/orders" element={<ProducerOrdersPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/aide" element={<HelpPage />} />
          <Route path="/contact" element={<HelpPage />} />
          <Route path="/mentions-legales" element={<HelpPage />} />
          <Route path="/cgv" element={<HelpPage />} />
          <Route path="/confidentialite" element={<HelpPage />} />
          <Route path="/comment-ca-marche" element={<HelpPage />} />
          <Route path="/blog" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
