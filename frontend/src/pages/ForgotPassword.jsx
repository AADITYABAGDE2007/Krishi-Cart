import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 items-center justify-center p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('login.backToLogin')}
        </Link>

        {!submitted ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('login.resetPassword')}</h2>
              <p className="text-slate-500 font-medium">{t('login.forgotSub')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('login.phoneEmail')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
              >
                {t('login.sendLink')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
               <Mail className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Check your Inbox</h2>
            <p className="text-slate-500 font-medium mb-8">We've sent a password reset link to your email/phone number.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all"
            >
              {t('login.backToLogin')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
