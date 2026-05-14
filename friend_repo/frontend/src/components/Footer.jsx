/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Leaf, Globe, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white mb-6">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight">KRISHI CART</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering farmers and connecting them directly with consumers. 
              Fresh, traceable, and organic produce delivered straight from the farm to your table.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/consumer" className="hover:text-emerald-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Marketplace
                </Link>
              </li>
              <li>
                <Link to="/farmer" className="hover:text-emerald-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> My Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Customer Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Track Order</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Return Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">123 Agriculture Hub, Sector 4, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-400">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-400">support@krishicart.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Krishi Cart. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with <span className="text-red-500">❤</span> for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
