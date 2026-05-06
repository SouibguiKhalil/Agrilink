import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#386641] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xl">🌾</span>
              </div>
              <span className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                AgriLink
              </span>
            </div>
            <p className="text-sm text-green-100">
              La plateforme qui relie directement les producteurs agricoles tunisiens aux consommateurs locaux.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-[#A7C957] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#A7C957] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#A7C957] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/produits" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Produits
                </a>
              </li>
              <li>
                <a href="/producteurs" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Producteurs
                </a>
              </li>
              <li>
                <a href="/comment-ca-marche" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="/blog" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/a-propos" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  À propos
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/aide" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/mentions-legales" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/cgv" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  CGU / CGV
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-green-100">Tunis, Tunisie</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@agrilink.tn" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  contact@agrilink.tn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+21612345678" className="text-green-100 hover:text-[#A7C957] transition-colors">
                  +216 12 345 678
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-green-100">
          <p>&copy; 2025 AgriLink. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
