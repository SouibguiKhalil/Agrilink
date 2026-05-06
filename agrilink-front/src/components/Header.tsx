import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#386641] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🌾</span>
            </div>
            <span className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              AgriLink
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="/produits" className="text-gray-700 hover:text-[#6A994E] transition-colors">
              Produits
            </a>
            <a href="/producteurs" className="text-gray-700 hover:text-[#6A994E] transition-colors">
              Producteurs
            </a>
            <a href="/comment-ca-marche" className="text-gray-700 hover:text-[#6A994E] transition-colors">
              Comment ça marche
            </a>
            <a href="/blog" className="text-gray-700 hover:text-[#6A994E] transition-colors">
              Blog
            </a>
            <a href="/aide" className="text-gray-700 hover:text-[#6A994E] transition-colors">
              Aide
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-[#6A994E] transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>
            
            <a href="/panier" className="relative text-gray-600 hover:text-[#6A994E] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#BC4749] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </a>

            {isAuthenticated ? (
              <>
                <a href="/mon-compte" className="text-gray-600 hover:text-[#6A994E] transition-colors hidden md:flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Mon compte</span>
                </a>
                <div className="hidden lg:block">
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden lg:block">
                <Button variant="primary" size="sm" onClick={handleLoginClick}>
                  Se connecter
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col gap-4 mt-4">
              <a href="/produits" className="block py-2 text-gray-700 hover:text-[#6A994E]">
                Produits
              </a>
              <a href="/producteurs" className="block py-2 text-gray-700 hover:text-[#6A994E]">
                Producteurs
              </a>
              <a href="/comment-ca-marche" className="block py-2 text-gray-700 hover:text-[#6A994E]">
                Comment ça marche
              </a>
              <a href="/blog" className="block py-2 text-gray-700 hover:text-[#6A994E]">
                Blog
              </a>
              <a href="/aide" className="block py-2 text-gray-700 hover:text-[#6A994E]">
                Aide
              </a>
              {isAuthenticated ? (
                <>
                  <a href="/mon-compte" className="block py-2 text-gray-700 hover:text-[#6A994E]">
                    Mon compte
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-gray-700 hover:text-[#6A994E]"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="w-full text-left py-2 text-gray-700 hover:text-[#6A994E]"
                >
                  Se connecter
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
