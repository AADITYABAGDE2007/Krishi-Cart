import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, ShoppingBag, ArrowRight, User, Bike } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('farmer');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignup = (e) => {
    e.preventDefault();
    login({ ...formData, role });
    if (role === 'farmer') navigate('/farmer');
    else if (role === 'delivery') navigate('/delivery');
    else navigate('/consumer');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative items-center justify-center overflow-hidden border-r border-slate-200">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        <div className="z-10 text-center px-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-sm font-bold mb-6 border border-primary/20 bg-white/80 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t('login.livePlatform')}
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{t('login.title1')} <span className="text-primary">{t('login.title2')}</span></h1>
          <p className="text-lg text-slate-600 font-medium">{t('login.subtitle')}</p>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('login.createAccount')}</h2>
            <p className="text-slate-500 font-medium">{t('login.signupSub')}</p>
          </div>
          
          {/* Role Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 border border-slate-200 shadow-inner">
            <button
              onClick={() => setRole('farmer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'farmer' ? 'bg-white text-primary-dark shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <Tractor className="w-4 h-4" /> {t('login.farmer')}
            </button>
            <button
              onClick={() => setRole('consumer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'consumer' ? 'bg-white text-primary-dark shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <ShoppingBag className="w-4 h-4" /> {t('login.consumer')}
            </button>
            <button
              onClick={() => setRole('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'delivery' ? 'bg-white text-primary-dark shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <Bike className="w-4 h-4" /> Delivery
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('login.fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                  placeholder={t('login.namePlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('login.phoneEmail')}</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                placeholder={t('login.phonePlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('login.password')}</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                placeholder={t('login.passwordPlaceholder')}
                required
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" className="rounded bg-white border-slate-300 text-primary focus:ring-primary/50 cursor-pointer" required />
              <span className="text-sm text-slate-600 font-medium">{t('login.agreeTerms')}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 flex justify-center items-center gap-2 mt-2"
            >
              {t('login.createAccount')} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            {t('login.alreadyAccount')} <Link to="/login" className="text-primary-dark font-bold hover:underline transition-colors">{t('login.signIn')} </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
