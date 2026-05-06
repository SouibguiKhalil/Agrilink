import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas");
    }

    try {
      setError('');
      setLoading(true);
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.userType as 'user' | 'producer'
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Échec de la création du compte. Veuillez réessayer.');
    }
    setLoading(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Prénom *
          </label>
          <div className="mt-1">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nom *
          </label>
          <div className="mt-1">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Adresse email *
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe *
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimum 6 caractères
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe *
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
          Je suis un(e) *
        </label>
        <div className="mt-1">
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
          >
            <option value="buyer">Acheteur</option>
            <option value="producer">Producteur</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A994E] hover:bg-[#588545] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A994E] disabled:opacity-50"
        >
          {loading ? 'Création en cours...' : 'Créer mon compte'}
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">Déjà un compte ? </span>
        <Link to="/login" className="font-medium text-[#386641] hover:text-[#6A994E]">
          Se connecter
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
