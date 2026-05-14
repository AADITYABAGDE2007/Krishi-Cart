import { useState } from 'react';
import { Package, IndianRupee, ShoppingCart, Sparkles, TrendingUp, Zap } from 'lucide-react';

const SmartSell = ({ mode = 'sell' }) => {
  const isBuy = mode === 'buy';
  const [selectedQty, setSelectedQty] = useState(20);

  const availableProducts = [
    { name: 'Tomatoes', icon: '🍅', stock: 50 },
    { name: 'Potatoes', icon: '🥔', stock: 100 },
    { name: 'Onions', icon: '🧅', stock: 80 },
  ];
  
  const [product, setProduct] = useState(availableProducts[0]);
  const [basePrice, setBasePrice] = useState(20);

  // Pricing rules
  const pricing = {
    1: basePrice,
    5: Math.round(basePrice * 0.9),
    10: Math.round(basePrice * 0.85),
    20: Math.round(basePrice * 0.8)
  };

  const quantities = [1, 5, 10, 20];
  const currentPricePerKg = pricing[selectedQty] || 20;
  const totalPrice = selectedQty * currentPricePerKg;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-primary w-5 h-5" /> {isBuy ? 'Smart Buy' : 'Smart Sell'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{isBuy ? 'Buy in bulk and save more' : 'Sell full stock faster'}</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <TrendingUp className="w-3 h-3" /> High Demand
          </span>
          <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3" /> Fast Selling
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Product Info & Quantity Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
              {product.icon}
            </div>
            <div className="flex-1">
              {!isBuy ? (
                <select 
                  value={product.name} 
                  onChange={(e) => setProduct(availableProducts.find(p => p.name === e.target.value))}
                  className="font-bold text-slate-800 text-lg bg-transparent border-b-2 border-slate-300 focus:border-primary outline-none cursor-pointer pb-0.5"
                >
                  {availableProducts.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              ) : (
                <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
              )}
              <p className="text-sm text-slate-500 flex items-center gap-1 font-medium mt-1">
                <Package className="w-4 h-4" /> Total Stock: <span className="text-slate-800 font-bold">{product.stock} kg</span>
              </p>
            </div>
            {!isBuy && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-400">Base Price (₹/kg)</span>
                <input 
                  type="number" 
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-16 text-right font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-primary mt-1"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Select Quantity to {isBuy ? 'Buy' : 'Sell'}</label>
            <div className="flex flex-wrap gap-3">
              {quantities.map(qty => (
                <button
                  key={qty}
                  onClick={() => setSelectedQty(qty)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    selectedQty === qty 
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:bg-slate-50'
                  }`}
                >
                  {qty} kg
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-medium text-sm">{isBuy ? 'Estimated Cost' : 'Estimated Revenue'}</span>
            <span className="text-xl font-extrabold text-slate-900 flex items-center">
              <IndianRupee className="w-5 h-5 text-slate-500" /> {totalPrice}
            </span>
          </div>

          {/* Party Details */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <img 
              src={isBuy ? "https://ui-avatars.com/api/?name=Ramesh+Kumar&background=10b981&color=fff" : "https://ui-avatars.com/api/?name=Amit+Sharma&background=3b82f6&color=fff"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-slate-100 object-cover" 
            />
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isBuy ? 'Farmer / Seller' : 'Potential Buyer'}</p>
              <h4 className="font-bold text-slate-800 text-base leading-tight">{isBuy ? 'Ramesh Kumar' : 'Amit Sharma'}</h4>
              <p className="text-xs text-slate-500 font-medium">
                {isBuy ? 'Nashik, MH • ⭐ 4.8' : 'Mumbai, MH • 📍 15 km away'}
              </p>
            </div>
            <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
              View
            </button>
          </div>
        </div>

        {/* Right Side: Dynamic Pricing Rules */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-5">
          <h4 className="text-sm font-bold text-slate-700 mb-2">Dynamic Pricing</h4>
          
          <div className="space-y-3">
            {[
              { qty: 1, price: pricing[1] },
              { qty: 5, price: pricing[5] },
              { qty: 20, price: pricing[20], highlight: true }
            ].map((rule) => (
              <div 
                key={rule.qty} 
                className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${
                  selectedQty === rule.qty 
                    ? 'bg-white border-primary shadow-sm' 
                    : 'border-transparent hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{rule.qty} kg</span>
                  {rule.highlight && (
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-1 border border-yellow-200">
                      <Sparkles className="w-3 h-3" /> Best Value
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-800 flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> {rule.price} <span className="text-xs text-slate-500 ml-1 font-medium">/kg</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 py-3 rounded-xl font-bold transition-all shadow-sm">
              <Sparkles className="w-4 h-4" /> {isBuy ? 'Best Offer' : 'Auto Price'}
            </button>
            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20">
              <ShoppingCart className="w-4 h-4" /> {isBuy ? 'Buy Selected' : 'Sell Selected'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSell;
