import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { ProducerCard } from '../components/ProducerCard';
import { Button } from '../components/Button';
import { producersApi, type ProducerProfile } from '../api/producers';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = apiBase.replace(/\/api\/?$/, '');
const fallbackImage = 'https://via.placeholder.com/400x300?text=Producteur';
const PAGE_SIZE = 8;

const resolveImage = (image?: string | null) => {
  if (!image) return fallbackImage;
  const normalized = image.startsWith('http')
    ? image
    : image.startsWith('/')
      ? image
      : `/${image}`;

  if (normalized.startsWith('/uploads')) return `${apiOrigin}${normalized}`;
  return normalized;
};

export const ProducersPage: React.FC = () => {
  const [producers, setProducers] = useState<ProducerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducers = useCallback(
    async (term: string) => {
      setLoading(true);
      try {
        const data = await producersApi.getProducers(term || undefined);
        const sanitized = (Array.isArray(data) ? data : []).filter(
          (p) =>
            p &&
            p._id &&
            p.name &&
            p.name.trim().toLowerCase() !== 'ferme el oliva'
        );
        const unique = Array.from(
          sanitized.reduce(
            (map, item) => map.set(item._id, item),
            new Map<string, ProducerProfile>()
          ).values()
        );
        setProducers(unique);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les producteurs.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      loadProducers(searchTerm.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [loadProducers, searchTerm]);

  const categories = useMemo(() => {
    const setCat = new Set<string>();
    producers.forEach((p) =>
      (p.categories || []).forEach((c) => {
        const clean = c?.trim();
        if (clean) setCat.add(clean);
      })
    );
    return ['Tous', ...Array.from(setCat)];
  }, [producers]);

  const labels = useMemo(() => {
    const setLab = new Set<string>();
    producers.forEach((p) =>
      (p.badges || []).forEach((b) => {
        const clean = b?.trim();
        if (clean) setLab.add(clean);
      })
    );
    return ['Tous', ...Array.from(setLab)];
  }, [producers]);

  const filteredProducers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return producers.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || selectedCategory === 'Tous'
          ? true
          : (p.categories || []).includes(selectedCategory);
      const matchesLabel =
        selectedLabel === 'all' || selectedLabel === 'Tous'
          ? true
          : (p.badges || []).includes(selectedLabel);
      const matchesSearch =
        !normalizedSearch ||
        [p.name, p.city, p.location?.city, ...(p.categories || [])]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesLabel && matchesSearch;
    });
  }, [producers, selectedCategory, selectedLabel, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducers.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLabel, searchTerm]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedProducers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducers.slice(start, start + PAGE_SIZE);
  }, [filteredProducers, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const count = filteredProducers.length;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F2E8CF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Nos producteurs
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Découvrez les agriculteurs passionnés qui cultivent et élèvent avec amour les produits que vous retrouvez sur AgriLink.
            </p>

            <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Chercher un producteur..."
                  className="flex-1 border-none outline-none py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Localisation"
                  className="flex-1 border-none outline-none py-2"
                  disabled
                />
              </div>
              <Button variant="primary" size="md" onClick={() => loadProducers(searchTerm.trim())}>
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Tous' ? 'all' : cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === cat || (selectedCategory === 'all' && cat === 'Tous')
                    ? 'bg-[#386641] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-[#386641] hover:text-[#386641]'
                }`}
              >
                {cat}
              </button>
            ))}
            {labels.length > 1 &&
              labels.map((lab) => (
                <button
                  key={lab}
                  onClick={() => setSelectedLabel(lab === 'Tous' ? 'all' : lab)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedLabel === lab || (selectedLabel === 'all' && lab === 'Tous')
                      ? 'bg-[#386641] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-[#386641] hover:text-[#386641]'
                  }`}
                >
                  {lab}
                </button>
              ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              {loading ? 'Chargement...' : `${count} producteurs trouvés`}
            </p>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" disabled>
              <option>Trier par : Distance</option>
              <option>Nom (A-Z)</option>
              <option>Nouveaux producteurs</option>
            </select>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}
          {!loading && !error && count === 0 && (
            <p className="text-gray-600">Aucun producteur trouvé.</p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducers.map((producer) => (
                <ProducerCard
                  key={producer._id}
                  id={producer._id}
                  image={resolveImage(producer.imageUrl || producer.image)}
                  name={producer.name}
                  location={producer.location?.city || producer.city || ''}
                  categories={producer.categories || []}
                  badges={producer.badges || []}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center gap-2 mt-12">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg border ${
                  page === currentPage
                    ? 'bg-[#386641] text-white border-[#386641]'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#386641] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Vous êtes producteur ?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Rejoignez AgriLink et vendez vos produits directement aux consommateurs locaux. Aucune commission, relation directe, prix justes.
          </p>
          <Button variant="secondary" size="lg">
            Créer mon compte producteur
          </Button>
        </div>
      </section>
    </div>
  );
};
