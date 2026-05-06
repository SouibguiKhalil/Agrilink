import React, { useEffect, useState } from 'react';
import { Search, MapPin, TrendingUp, Heart, Shield, Leaf, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { CategoryCard } from '../components/CategoryCard';
import { ProducerCard } from '../components/ProducerCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { productsApi, type Product } from '../api/products';

const placeholderCategory = { icon: '🛒', name: 'Autres', count: 0 };

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Array<{ icon: string; name: string; count: number }>>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const products: Product[] = await productsApi.getProducts();
        const counts = products.reduce<Record<string, number>>((acc, p) => {
          const key = p.category || 'Autres';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const iconMap: Record<string, string> = {
          'Fruits & Légumes': '🥬',
          'Produits laitiers': '🧀',
          'Viande & Œufs': '🥩',
          "Huile d'olive": '🫒',
          Agrumes: '🍊',
          Céréales: '🌾',
          'Miel & Confitures': '🍯',
          Bio: '🌿',
          Autres: '🛒',
        };
        const computed = Object.entries(counts).map(([name, count]) => ({
          name,
          count,
          icon: iconMap[name] || '🛒',
        }));
        setCategories(computed.length ? computed : [placeholderCategory]);
        setCategoriesError(null);
      } catch (err) {
        console.error(err);
        setCategoriesError('Impossible de charger les catégories.');
        setCategories([placeholderCategory]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Producteurs section (peut rester statique si pas d'API prête)
  const producers = [
    {
      image: 'https://images.unsplash.com/photo-1752062866645-d315a90d3c76?w=400',
      name: 'Ferme Ben Ahmed',
      location: 'Nabeul, 15 km',
      categories: ['Fruits', 'Légumes'],
      badges: ['bio' as const, 'local' as const]
    },
    {
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400',
      name: 'Coopérative El Oued',
      location: 'Bizerte, 32 km',
      categories: ["Huile d'olive", 'Olives'],
      badges: ['local' as const]
    },
    {
      image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400',
      name: 'Laiterie Sahel',
      location: 'Sousse, 8 km',
      categories: ['Lait', 'Fromage', 'Yaourt'],
      badges: ['local' as const]
    },
    {
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      name: 'Ferme Kacem',
      location: 'Manouba, 12 km',
      categories: ['Œufs', 'Volaille'],
      badges: ['bio' as const]
    }
  ];

  const steps = [
    {
      icon: <Search className="w-12 h-12" />,
      title: 'Découvrez',
      description: 'Parcourez les produits frais de producteurs locaux près de chez vous'
    },
    {
      icon: <ShoppingCart className="w-12 h-12" />,
      title: 'Commandez',
      description: 'Ajoutez vos produits au panier et validez votre commande en quelques clics'
    },
    {
      icon: <MapPin className="w-12 h-12" />,
      title: 'Récupérez',
      description: 'Récupérez vos produits directement chez le producteur ou en point relais'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Savourez',
      description: 'Profitez de produits frais, locaux et traçables, au prix juste'
    }
  ];

  const testimonials = [
    {
      type: 'Producteur',
      name: 'Mohamed Trabelsi',
      location: 'Nabeul',
      text: "AgriLink m'a permis de vendre directement mes produits sans intermédiaires. Mon chiffre d'affaires a augmenté de 40% !",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      type: 'Acheteur',
      name: 'Leila Mansour',
      location: 'Tunis',
      text: 'Je trouve enfin des produits frais et locaux de qualité. Je connais mes producteurs et c’est rassurant pour ma famille.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative bg-[#F2E8CF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Achetez directement aux producteurs tunisiens
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Découvrez des produits frais, locaux et de saison. Soutenez l'agriculture tunisienne et profitez de prix justes pour tous.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Chercher un produit ou un producteur..."
                    className="flex-1 border-none outline-none py-2"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Localisation"
                    className="flex-1 border-none outline-none py-2"
                  />
                </div>
                <Button variant="primary" size="md">
                  Rechercher
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#6A994E]" />
                  <span>Prix justes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#6A994E]" />
                  <span>Produits locaux</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#6A994E]" />
                  <span>100% traçable</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1731601296638-74d76aceb245?w=800"
                  alt="Produits frais locaux"
                  className="w-full h-[500px] object-cover px-[0px] py-[4px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Catégories de produits
            </h2>
            <p className="text-gray-600">
              Explorez nos produits frais et locaux par catégorie
            </p>
          </div>

          {categoriesError && <p className="text-sm text-red-600 mb-4 text-center">{categoriesError}</p>}
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Producers Section */}
      <section className="py-16 bg-[#F2E8CF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Producteurs près de chez vous
              </h2>
              <p className="text-gray-600">
                Rencontrez les agriculteurs passionnés de votre région
              </p>
            </div>
            <Button variant="ghost" size="md" className="hidden md:block">
              Voir tous les producteurs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {producers.map((producer, index) => (
              <ProducerCard key={index} {...producer} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Comment ça marche ?
            </h2>
            <p className="text-gray-600">
              Achetez local en 4 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#F2E8CF] text-[#386641] mb-4">
                  {step.icon}
                </div>
                <h3 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {index + 1}. {step.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg">
              Commencer maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16 bg-[#386641] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Nos engagements
            </h2>
            <p className="text-green-100">
              Pour une agriculture durable et équitable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6A994E] mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Prix justes
              </h4>
              <p className="text-sm text-green-100">
                Rémunération équitable pour les producteurs, prix transparents pour les acheteurs
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6A994E] mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Circuits courts
              </h4>
              <p className="text-sm text-green-100">
                Vente directe du producteur au consommateur, sans intermédiaires
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6A994E] mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Traçabilité
              </h4>
              <p className="text-sm text-green-100">
                Transparence totale sur l'origine et le mode de production
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6A994E] mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h4 className="text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Durabilité
              </h4>
              <p className="text-sm text-green-100">
                Soutien à l'agriculture responsable et à l'environnement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Ils nous font confiance
            </h2>
            <p className="text-gray-600">
              Découvrez les témoignages de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#F2E8CF] rounded-xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <ImageWithFallback
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.type} · {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#F2E8CF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Prêt à rejoindre AgriLink ?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Que vous soyez producteur ou acheteur, découvrez les avantages d'une alimentation locale et responsable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Je suis acheteur
            </Button>
            <Button variant="secondary" size="lg">
              Je suis producteur
            </Button>
          </div>
        </div>
      </section>    </div>
  );
};

const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
