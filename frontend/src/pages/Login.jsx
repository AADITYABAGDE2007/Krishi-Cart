import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, ShoppingBag, ArrowRight, ShieldCheck, Mail, KeyRound, Bike, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [role, setRole] = useState('farmer');
  const [authMode, setAuthMode] = useState('email'); // 'email' or 'phone'
  const [step, setStep] = useState(1); // 1: Email/Phone, 2: OTP
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleRoleRoute = () => {
    if (role === 'farmer') navigate('/farmer');
    else if (role === 'delivery') navigate('/delivery');
    else navigate('/consumer');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Mock login to bypass suspended Firebase API key
      const mockUid = 'uid_' + Date.now().toString(36);
      login({ uid: mockUid, email: identifier, role });
      handleRoleRoute();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Mock OTP sending
      setTimeout(() => {
        setStep(2);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Mock OTP verification
      login({ uid: 'uid_phone_' + Date.now(), phoneNumber: identifier, role });
      handleRoleRoute();
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Mock Google Login
      login({ uid: 'uid_google_' + Date.now(), email: 'googleuser@example.com', name: 'Google User', role });
      handleRoleRoute();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative items-center justify-center overflow-hidden border-r border-slate-200">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
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

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('login.welcome')}</h2>
            <p className="text-slate-500 font-medium">{t('login.welcomeSub')}</p>
          </div>
          
          {/* Role Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6 border border-slate-200 shadow-inner">
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

          {/* Auth Mode Tabs */}
          {step === 1 && (
            <div className="flex justify-center gap-4 mb-6">
              <button 
                onClick={() => setAuthMode('email')}
                className={`text-sm font-bold pb-1 border-b-2 transition-all ${authMode === 'email' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setAuthMode('phone')}
                className={`text-sm font-bold pb-1 border-b-2 transition-all ${authMode === 'phone' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Phone (OTP)
              </button>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={authMode === 'email' ? handleEmailLogin : handleSendOTP} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {authMode === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <div className="relative">
                  {authMode === 'email' ? (
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  ) : (
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  )}
                  <input
                    type={authMode === 'email' ? 'email' : 'tel'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                    placeholder={authMode === 'email' ? 'john@example.com' : '9876543210'}
                    required
                  />
                </div>
              </div>

              {authMode === 'email' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-bold text-slate-700">Password</label>
                    <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Forgot Password?</Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded bg-white border-slate-300 text-primary focus:ring-primary/50 cursor-pointer" />
                  <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{t('login.remember')}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 flex justify-center items-center gap-2 mt-4 active:scale-[0.98]"
              >
                {isLoading ? (
                   <span className="flex items-center gap-2">Processing... <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span></span>
                ) : (
                   <span className="flex items-center gap-2">{authMode === 'email' ? 'Login' : 'Send OTP'} <ArrowRight className="w-4 h-4" /></span>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-50 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-3 active:scale-[0.98]"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>

            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-200 flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                 <span>We've sent an OTP to <span className="font-bold">{identifier}</span></span>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Enter OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 text-center text-2xl tracking-[0.5em] rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-300 shadow-sm font-mono"
                    placeholder="------"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-slate-900/20 flex justify-center items-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                   <span className="flex items-center gap-2">Verifying <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span></span>
                ) : (
                   <span className="flex items-center gap-2">Verify & Login <ArrowRight className="w-4 h-4" /></span>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-500 font-bold text-sm hover:text-primary transition-colors py-2"
              >
                Change Phone/Email
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            {t('login.noAccount')} <Link to="/signup" className="text-primary-dark font-bold hover:underline transition-colors">{t('login.signUp')}</Link>
          </p>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
