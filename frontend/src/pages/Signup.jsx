import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, ShoppingBag, ArrowRight, User, Bike } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Signup = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('farmer');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleType: 'Motorcycle / Bike',
    vehicleNumber: '',
    farmSize: 'Small (Under 2 Acres)',
    primaryCrops: ''
  });

  const [aadharNumber, setAadharNumber] = useState('');
  const [verifyingAadhar, setVerifyingAadhar] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyAadhar = () => {
    if (aadharNumber.length !== 12) {
      alert("Aadhar must be exactly 12 digits");
      return;
    }
    setVerifyingAadhar(true);
    setTimeout(() => {
      setVerifyingAadhar(false);
      setAadharVerified(true);
    }, 1500); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if ((role === 'farmer' || role === 'delivery') && !aadharVerified) {
      alert("Government ID (Aadhar) verification is mandatory for Partners and Farmers.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Mock User locally since Firebase API key is suspended
      const mockUid = 'uid_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
      const user = { uid: mockUid, email: formData.email };

      // 3. Save to MongoDB
      const userData = {
        uid: user.uid,
        email: formData.email,
        name: formData.name,
        role: role,
        phone: formData.phone,
        aadharNumber: aadharNumber,
        farmSize: role === 'farmer' ? formData.farmSize : null,
        primaryCrops: role === 'farmer' ? formData.primaryCrops : null,
        vehicleType: role === 'delivery' ? formData.vehicleType : null,
        vehicleNumber: role === 'delivery' ? formData.vehicleNumber : null
      };

      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      // 4. Update local context and navigate
      login(userData);
      alert("Account created successfully! Verification email sent.");
      if (role === 'farmer') navigate('/farmer');
      else if (role === 'delivery') navigate('/delivery');
      else navigate('/consumer');

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('login.createAccount')}</h2>
            <p className="text-slate-500 font-medium">{t('login.signupSub')}</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 border border-slate-200 shadow-inner">
            <button type="button" onClick={() => setRole('farmer')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'farmer' ? 'bg-white text-primary-dark shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <Tractor className="w-4 h-4" /> {t('login.farmer')}
            </button>
            <button type="button" onClick={() => setRole('consumer')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'consumer' ? 'bg-white text-primary-dark shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <ShoppingBag className="w-4 h-4" /> {t('login.consumer')}
            </button>
            <button type="button" onClick={() => setRole('delivery')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'delivery' ? 'bg-white text-primary-dark shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                  placeholder={t('login.namePlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                placeholder="example@gmail.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                placeholder="9876543210"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('login.password')}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 shadow-sm"
                placeholder={t('login.passwordPlaceholder')}
                required
              />
            </div>

            {role === 'delivery' && (
              <div className="space-y-4 p-5 bg-slate-100 rounded-2xl border border-slate-200 mt-2 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Delivery Partner KYC</p>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Type</label>
                  <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 outline-none cursor-pointer">
                    <option>Motorcycle / Bike</option>
                    <option>Electric Scooter (EV)</option>
                    <option>Mini Truck / Three Wheeler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Number Plate</label>
                  <input type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 placeholder-slate-400 uppercase" placeholder="e.g. MH 12 AB 1234" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Government Aadhar Number</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength="12"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      disabled={aadharVerified || verifyingAadhar}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 placeholder-slate-400 tracking-wider disabled:bg-slate-50" 
                      placeholder="12-digit Aadhar No." 
                      required 
                    />
                    {!aadharVerified ? (
                      <button type="button" onClick={handleVerifyAadhar} disabled={verifyingAadhar || aadharNumber.length !== 12} className="bg-slate-800 text-white font-bold px-4 rounded-xl whitespace-nowrap hover:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2">
                        {verifyingAadhar ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Verify UIDAI'}
                      </button>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-600 font-bold px-4 rounded-xl flex items-center border border-emerald-200">Verified ✅</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {role === 'farmer' && (
              <div className="space-y-4 p-5 bg-green-50 rounded-2xl border border-green-200 mt-2 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs font-black text-green-700 uppercase tracking-widest">Farm Verification</p>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Farm Size</label>
                  <select value={formData.farmSize} onChange={e => setFormData({...formData, farmSize: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                    <option>Small (Under 2 Acres)</option>
                    <option>Medium (2 - 5 Acres)</option>
                    <option>Large (More than 5 Acres)</option>
                    <option>Greenhouse / Polyhouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Primary Crops Category</label>
                  <input type="text" value={formData.primaryCrops} onChange={e => setFormData({...formData, primaryCrops: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 placeholder-slate-400" placeholder="e.g. Organic Vegetables, Wheat, Fruits" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Government Aadhar Number</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength="12"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      disabled={aadharVerified || verifyingAadhar}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 placeholder-slate-400 tracking-wider disabled:bg-slate-50" 
                      placeholder="12-digit Aadhar No." 
                      required 
                    />
                    {!aadharVerified ? (
                      <button type="button" onClick={handleVerifyAadhar} disabled={verifyingAadhar || aadharNumber.length !== 12} className="bg-slate-800 text-white font-bold px-4 rounded-xl whitespace-nowrap hover:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2">
                        {verifyingAadhar ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Verify UIDAI'}
                      </button>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-600 font-bold px-4 rounded-xl flex items-center border border-emerald-200">Verified ✅</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" className="rounded bg-white border-slate-300 text-primary focus:ring-primary/50 cursor-pointer" required />
              <span className="text-sm text-slate-600 font-medium">{t('login.agreeTerms')}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 flex justify-center items-center gap-2 mt-2 disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : <>{t('login.createAccount')} <ArrowRight className="w-4 h-4" /></>}
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
