import React from 'react';
import { useLocation as useRouteLocation, Link, useNavigate } from 'react-router-dom';
import { User, ShoppingCart, MapPin, Search, ChevronDown, Globe, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const { selectedLocation, updateLocation } = useLocation();
  const { isLoggedIn, logout, user } = useAuth();
  const isAuthPage = routeLocation.pathname === '/login' || routeLocation.pathname === '/signup' || routeLocation.pathname === '/forgot-password';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-4">
          
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 group-hover:shadow border-primary/20 transition-all p-0.5">
                <img src="/krishi-cart-logo.png" alt="Krishi Cart Logo" className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-primary-dark leading-none hidden md:block">KRISHI CART</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group relative">
              <MapPin className="w-4 h-4 text-primary" />
              <select 
                value={selectedLocation}
                onChange={(e) => updateLocation(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="Lucknow">Lucknow, UP</option>
                <option value="Kanpur">Kanpur, UP</option>
                <option value="Varanasi">Varanasi, UP</option>
                <option value="Agra">Agra, UP</option>
                <option value="Prayagraj">Prayagraj, UP</option>
                <option value="Bhopal">Bhopal, MP</option>
                <option value="Indore">Indore, MP</option>
                <option value="Gwalior">Gwalior, MP</option>
                <option value="Jabalpur">Jabalpur, MP</option>
                <option value="Ujjain">Ujjain, MP</option>
                <option value="Delhi">New Delhi, DL</option>
                <option value="Mumbai">Mumbai, MH</option>
                <option value="Pune">Pune, MH</option>
                <option value="Nagpur">Nagpur, MH</option>
                <option value="Nashik">Nashik, MH</option>
                <option value="Bangalore">Bangalore, KA</option>
                <option value="Hyderabad">Hyderabad, TS</option>
                <option value="Chennai">Chennai, TN</option>
                <option value="Jaipur">Jaipur, RJ</option>
                <option value="Ahmedabad">Ahmedabad, GJ</option>
                <option value="Kolkata">Kolkata, WB</option>
                <option value="Patna">Patna, BR</option>
                <option value="Shimla">Shimla, HP</option>
                <option value="Ranchi">Ranchi, JH</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search for fresh produce..."
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={toggleLanguage} 
              className="p-2 text-slate-500 hover:text-primary transition-colors"
              title="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {!isAuthPage ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                {!isLoggedIn ? (
                  <>
                    <Link 
                      to="/login" 
                      className="text-slate-600 hover:text-primary font-bold text-sm px-4 py-2 rounded-xl transition-all"
                    >
                      {t('login')}
                    </Link>
                    <Link 
                      to="/signup" 
                      className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      {t('signup')}
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 text-slate-700 hover:text-primary transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-primary transition-all overflow-hidden">
                        <User className="w-4 h-4 text-slate-600 group-hover:text-primary" />
                      </div>
                      <span className="font-bold text-sm hidden md:block">{user?.name || 'My Profile'}</span>
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <Link to="/checkout" className="relative p-2.5 text-slate-600 hover:text-primary transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">0</span>
                </Link>
              </div>
            ) : (
               <Link to="/" className="text-primary font-bold text-sm">Back to Home</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
