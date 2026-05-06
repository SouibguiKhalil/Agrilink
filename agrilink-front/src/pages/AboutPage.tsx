import React from 'react';
import { TrendingUp, Users, Leaf, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Prix justes',
      description: 'Nous garantissons une rémunération équitable pour les producteurs et des prix transparents pour les consommateurs.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Lien direct',
      description: 'Nous créons un lien humain entre producteurs et consommateurs, sans intermédiaires.'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Agriculture durable',
      description: 'Nous promouvons des pratiques agricoles respectueuses de l\'environnement et du bien-être animal.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Consommation responsable',
      description: 'Nous encourageons une consommation locale, de saison et consciente de son impact.'
    }
  ];

  const impacts = [
    {
      number: '500+',
      label: 'Producteurs partenaires'
    },
    {
      number: '15,000+',
      label: 'Consommateurs actifs'
    },
    {
      number: '250 tonnes',
      label: 'De produits locaux vendus'
    },
    {
      number: '40%',
      label: 'Revenus en plus pour les producteurs'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F2E8CF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Notre mission : reconnecter la ville et la campagne
            </h1>
            <p className="text-lg text-gray-700">
              AgriLink est née d'une conviction simple : l'agriculture locale mérite d'être valorisée, 
              et chacun devrait pouvoir accéder facilement à des produits frais, traçables et équitables.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Notre histoire
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  En 2023, nous avons lancé AgriLink pour répondre à un double constat : 
                  les producteurs tunisiens peinaient à vivre de leur travail malgré la qualité 
                  de leurs produits, tandis que les consommateurs cherchaient de plus en plus 
                  à consommer local et responsable.
                </p>
                <p>
                  Nous avons créé une plateforme simple et transparente qui permet aux agriculteurs 
                  de vendre directement leurs produits, sans commission excessive, tout en offrant 
                  aux acheteurs une traçabilité totale et des prix justes.
                </p>
                <p>
                  Aujourd'hui, AgriLink est devenu un réseau solidaire qui réunit des centaines 
                  de producteurs et des milliers de consommateurs à travers la Tunisie.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1609755790602-2c5233f7692d?w=800"
                alt="Producteurs tunisiens"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#F2E8CF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Nos valeurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ce qui guide notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2E8CF] text-[#386641] mb-4">
                  {value.icon}
                </div>
                <h3 className="text-[#386641] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-[#386641] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Notre impact
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Des chiffres qui témoignent de notre engagement
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impacts.map((impact, index) => (
              <div key={index} className="text-center">
                <p className="text-5xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {impact.number}
                </p>
                <p className="text-green-100">
                  {impact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[#386641] mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Notre vision pour l'avenir
            </h2>
            <div className="space-y-6 text-gray-700">
              <div className="bg-[#F2E8CF] rounded-xl p-6">
                <h4 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Économie locale
                </h4>
                <p>
                  Nous voulons contribuer à revitaliser l'économie locale en permettant aux producteurs 
                  de vivre dignement de leur travail et en créant des emplois dans nos régions.
                </p>
              </div>
              <div className="bg-[#F2E8CF] rounded-xl p-6">
                <h4 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Environnement
                </h4>
                <p>
                  Réduire l'empreinte carbone de notre alimentation en favorisant les circuits courts 
                  et en soutenant les pratiques agricoles durables.
                </p>
              </div>
              <div className="bg-[#F2E8CF] rounded-xl p-6">
                <h4 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Société
                </h4>
                <p>
                  Recréer du lien social entre villes et campagnes, et sensibiliser aux enjeux 
                  de l'alimentation durable et de la souveraineté alimentaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F2E8CF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Rejoignez le mouvement
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Que vous soyez producteur ou consommateur, ensemble nous pouvons construire 
            un système alimentaire plus juste et plus durable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Devenir acheteur
            </Button>
            <Button variant="secondary" size="lg">
              Devenir producteur
            </Button>
          </div>
        </div>
      </section>    </div>
  );
};
