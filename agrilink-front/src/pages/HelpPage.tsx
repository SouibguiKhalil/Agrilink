import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Commandes',
      questions: [
        {
          q: 'Comment passer une commande ?',
          a: 'Parcourez nos produits, ajoutez-les à votre panier, puis cliquez sur "Valider la commande". Vous devrez créer un compte ou vous connecter pour finaliser votre achat.'
        },
        {
          q: 'Puis-je modifier ma commande ?',
          a: 'Vous pouvez modifier votre commande jusqu\'à ce qu\'elle soit confirmée par le producteur. Contactez-nous rapidement si vous avez besoin de faire des changements.'
        },
        {
          q: 'Comment suivre ma commande ?',
          a: 'Rendez-vous dans "Mon compte" > "Mes commandes" pour voir le statut de vos commandes en temps réel.'
        }
      ]
    },
    {
      category: 'Livraison',
      questions: [
        {
          q: 'Quels sont les modes de livraison ?',
          a: 'Vous pouvez récupérer vos produits directement chez le producteur ou dans un point relais proche de chez vous. Les modalités sont précisées sur chaque fiche produit.'
        },
        {
          q: 'Quels sont les délais de livraison ?',
          a: 'Les délais varient selon les producteurs, généralement entre 2 et 5 jours. Vous recevrez une notification dès que votre commande est prête.'
        },
        {
          q: 'La livraison est-elle gratuite ?',
          a: 'Oui, la livraison est gratuite pour toutes les commandes sur AgriLink.'
        }
      ]
    },
    {
      category: 'Paiement',
      questions: [
        {
          q: 'Quels moyens de paiement acceptez-vous ?',
          a: 'Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que le paiement à la livraison pour certains producteurs.'
        },
        {
          q: 'Le paiement est-il sécurisé ?',
          a: 'Oui, toutes les transactions sont sécurisées et cryptées. Nous ne stockons jamais vos informations bancaires.'
        },
        {
          q: 'Puis-je obtenir une facture ?',
          a: 'Oui, vous recevrez automatiquement une facture par email après chaque commande.'
        }
      ]
    },
    {
      category: 'Producteurs',
      questions: [
        {
          q: 'Comment devenir producteur sur AgriLink ?',
          a: 'Créez un compte producteur, remplissez votre profil et ajoutez vos produits. Notre équipe validera votre inscription sous 48h.'
        },
        {
          q: 'Y a-t-il des frais pour les producteurs ?',
          a: 'AgriLink prélève une commission minimale de 10% pour couvrir les frais de plateforme. Pas de frais cachés.'
        },
        {
          q: 'Comment sont versés les paiements ?',
          a: 'Les paiements sont versés hebdomadairement sur le compte bancaire que vous avez renseigné.'
        }
      ]
    },
    {
      category: 'Compte',
      questions: [
        {
          q: 'Comment créer un compte ?',
          a: 'Cliquez sur "Se connecter" puis "Créer un compte". Remplissez vos informations et validez votre email.'
        },
        {
          q: 'J\'ai oublié mon mot de passe',
          a: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email pour réinitialiser votre mot de passe.'
        },
        {
          q: 'Comment supprimer mon compte ?',
          a: 'Contactez-nous à contact@agrilink.tn pour demander la suppression de votre compte.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F2E8CF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Comment pouvons-nous vous aider ?
            </h1>
            <div className="bg-white rounded-xl shadow-lg p-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                className="flex-1 border-none outline-none py-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#386641] mb-8 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Questions fréquentes
          </h2>

          <div className="space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.questions.map((faq, qIndex) => {
                    const index = catIndex * 10 + qIndex;
                    const isOpen = openFAQ === index;
                    
                    return (
                      <div key={qIndex} className="bg-white border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setOpenFAQ(isOpen ? null : index)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-900 pr-4">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[#386641] flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-gray-600">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-[#F2E8CF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Besoin d'aide supplémentaire ?
            </h2>
            <p className="text-gray-600">
              Notre équipe est là pour vous aider
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2E8CF] text-[#386641] mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Par email
              </h3>
              <p className="text-gray-600 mb-4">
                Envoyez-nous un email, nous vous répondrons sous 24h
              </p>
              <a
                href="mailto:contact@agrilink.tn"
                className="text-[#386641] hover:text-[#6A994E]"
              >
                contact@agrilink.tn
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2E8CF] text-[#386641] mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Par téléphone
              </h3>
              <p className="text-gray-600 mb-4">
                Du lundi au vendredi de 9h à 18h
              </p>
              <a
                href="tel:+21612345678"
                className="text-[#386641] hover:text-[#6A994E]"
              >
                +216 12 345 678
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Links */}
      <section className="py-12 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-[#386641] mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Informations légales
          </h3>
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <a href="/mentions-legales" className="hover:text-[#6A994E]">
              Mentions légales
            </a>
            <a href="/cgv" className="hover:text-[#6A994E]">
              CGU / CGV
            </a>
            <a href="/confidentialite" className="hover:text-[#6A994E]">
              Politique de confidentialité
            </a>
            <a href="/cookies" className="hover:text-[#6A994E]">
              Politique des cookies
            </a>
          </div>
        </div>
      </section>    </div>
  );
};
