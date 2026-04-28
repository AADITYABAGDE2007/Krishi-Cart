import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const product = location.state?.product || { 
    name: 'Fresh Tomatoes', 
    stock: '10kg', 
    price: 200, 
    farmer: 'Ramesh Singh',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&w=100&q=60'
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    const orderData = {
      item: `${product.name} (${product.stock || '1 qty'})`,
      buyer: 'Current Consumer',
      amount: product.price + 50
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        setStep(3);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-green-400 to-primary"></div>
          
          <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('checkout.confirmed')}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed font-medium">
            {t('checkout.confirmedSub1')} <span className="text-slate-900 font-bold">{product.farmer}</span>{t('checkout.confirmedSub2')}
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center border border-yellow-100">
                <Truck className="w-4 h-4 text-secondary" />
              </div>
              <span>{t('checkout.deliveryExpected')} <strong className="text-slate-900">{t('checkout.tomorrow')}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <span>{t('checkout.securedVia')} <strong className="text-slate-900">{t('checkout.escrow')}</strong></span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/consumer')}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
          >
            {t('checkout.continue')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/consumer" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> {t('checkout.back')}
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Side - Main Content */}
          <div className="flex-grow space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border border-primary/20">{step}</span>
                {step === 1 ? t('checkout.stepCart') : t('checkout.stepPayment')}
              </h2>
              
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 border border-slate-200 rounded-2xl bg-slate-50 shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{t('checkout.qty')} {product.stock || '1'} • {t('checkout.from')} <span className="text-slate-700 font-bold">{product.farmer}</span></p>
                      </div>
                    </div>
                    <div className="font-black text-xl text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">₹{product.price}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-5 border-2 border-primary/50 bg-primary/5 rounded-2xl cursor-pointer shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" className="text-primary focus:ring-primary w-5 h-5 bg-white border-slate-300 cursor-pointer" defaultChecked />
                      <span className="font-extrabold text-slate-900 flex items-center gap-2"><CreditCard className="w-5 h-5 text-slate-500"/> {t('checkout.upi')}</span>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5 opacity-90" />
                  </label>
                  <label className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" className="text-primary focus:ring-primary w-5 h-5 bg-white border-slate-300 cursor-pointer" />
                      <span className="font-bold text-slate-700">{t('checkout.cod')}</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="w-full md:w-96">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">{t('checkout.summary')}</h2>
              
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t('checkout.subtotal')}</span>
                  <span className="font-bold text-slate-700">₹{product.price}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t('checkout.delivery')} <span className="text-xs ml-1 bg-yellow-100 text-yellow-800 font-bold px-1.5 py-0.5 rounded border border-yellow-200">Direct</span></span>
                  <span className="font-bold text-slate-700">₹40</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t('checkout.platform')}</span>
                  <span className="font-bold text-slate-700">₹10</span>
                </div>
                
                <div className="border-t border-slate-200 pt-5 mt-2 flex justify-between items-center">
                  <span className="font-extrabold text-slate-800">{t('checkout.total')}</span>
                  <span className="font-black text-3xl text-slate-900">₹{product.price + 50}</span>
                </div>
              </div>
              
              {step === 1 ? (
                 <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2 text-base"
                >
                  {t('checkout.proceed')}
                </button>
              ) : (
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-md shadow-primary/30 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-base"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('checkout.processing')}
                    </span>
                  ) : (
                    `${t('checkout.paySecurely')} ₹${product.price + 50}`
                  )}
                </button>
              )}
              
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-inner">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t('checkout.securePayment')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
