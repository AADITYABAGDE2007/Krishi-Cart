import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Tractor, ShoppingBag, Bike, Leaf, ShieldCheck, Clock, Sprout, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isLoggedIn) {
      const role = user?.role?.toLowerCase();
      if (role === 'farmer') navigate('/farmer');
      else if (role === 'delivery') navigate('/delivery');
      else navigate('/consumer');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-full md:w-3/4 lg:w-1/2 h-full bg-primary/10 rounded-bl-[100px] lg:rounded-bl-[200px] transform translate-x-10 -translate-y-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-6 border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Live in over 50+ Cities
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 delay-100">
                Fresh From Farm,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Direct to Door.</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-200">
                Skip the middlemen. Buy fresh, organic produce directly from verified farmers. Delivered to your doorstep with live GPS tracking.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 delay-300">
                <button onClick={handleCTA} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 hover:-translate-y-1">
                  <ShoppingBag className="w-5 h-5" /> Start Shopping
                </button>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                  Become a Partner <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-500 font-bold text-sm">
                 <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> Verified KYC</div>
                 <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500"/> 24h Delivery</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative animate-in zoom-in fade-in duration-700">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl transform scale-90"></div>
               <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fresh Produce" className="relative z-10 w-full h-auto object-cover rounded-[2rem] shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" />
               
               {/* Floating Badges */}
               <div className="absolute top-10 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Sprout className="w-5 h-5 text-green-600"/></div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">Farmer Profit</p>
                    <p className="text-lg font-black text-slate-900">+40% Higher</p>
                  </div>
               </div>
               
               <div className="absolute bottom-10 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Truck className="w-5 h-5 text-blue-600"/></div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">Delivery</p>
                    <p className="text-lg font-black text-slate-900">Live Tracked</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">How Krishi Cart Works</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">One unified platform connecting the entire agricultural supply chain with military-grade security and live tracking.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow group">
               <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Tractor className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-3">1. Verified Farmers</h3>
               <p className="text-slate-600 font-medium leading-relaxed mb-6">Farmers complete Aadhar KYC and list their fresh harvest directly on the app with live farm GPS coordinates.</p>
               <Link to="/signup" className="text-green-600 font-bold flex items-center gap-2 hover:underline">Join as Farmer <ArrowRight className="w-4 h-4"/></Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow group">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <ShoppingBag className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-3">2. Consumers Order</h3>
               <p className="text-slate-600 font-medium leading-relaxed mb-6">You buy organic produce at 20% cheaper rates. Secure payment and exact location pinpointing ensure smooth delivery.</p>
               <Link to="/login" className="text-primary font-bold flex items-center gap-2 hover:underline">Start Buying <ArrowRight className="w-4 h-4"/></Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow group">
               <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Bike className="w-8 h-8 text-orange-600" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-3">3. Zomato-Style Delivery</h3>
               <p className="text-slate-600 font-medium leading-relaxed mb-6">KYC-verified riders accept the order, pickup with Photo Proof, and deliver to you securely using a 4-digit PIN.</p>
               <Link to="/signup" className="text-orange-600 font-bold flex items-center gap-2 hover:underline">Ride with Us <ArrowRight className="w-4 h-4"/></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856417537-8848d56b063d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Leaf className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to revolutionize farming?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">Join thousands of farmers, delivery partners, and conscious consumers building a better food ecosystem.</p>
          <button onClick={handleCTA} className="bg-primary hover:bg-primary-dark text-white font-black text-lg px-10 py-5 rounded-2xl transition-transform hover:scale-105 shadow-xl shadow-primary/30">
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
