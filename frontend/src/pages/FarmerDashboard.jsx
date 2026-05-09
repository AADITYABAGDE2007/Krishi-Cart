import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, IndianRupee, TrendingUp, TrendingDown, CheckCircle, Clock, Sparkles, Mic, MapPin, Banknote, CreditCard, X } from 'lucide-react';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useLocation } from '../context/LocationContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to simulate coordinates from city name
const getCoordinates = (locationName) => {
  if (!locationName) return [26.8467, 80.9462]; // Default Lucknow
  if (locationName.includes('Nashik')) return [19.9975, 73.7898];
  if (locationName.includes('Agra')) return [27.1767, 78.0081];
  if (locationName.includes('Kanpur')) return [26.4499, 80.3319];
  if (locationName.includes('Varanasi')) return [25.3176, 82.9739];
  // Randomize slightly around central India if unknown
  return [22.0 + (Math.random() * 2 - 1), 79.0 + (Math.random() * 2 - 1)];
};

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { selectedLocation } = useLocation();
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', qty: '', price: '', image: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [selectedOrderMap, setSelectedOrderMap] = useState(null);
  const [notification, setNotification] = useState(null);

  const [isListening, setIsListening] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchProducts();
    fetchOrders();

    // Request System Push Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch Mandi prices when location changes
  useEffect(() => {
    fetchMandiPrices();
  }, [selectedLocation]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('new_order', (order) => {
      setOrders(prev => [order, ...prev]);
      const msg = `New Order Received: ${order.item} from ${order.buyer}`;
      setNotification(msg);
      setTimeout(() => setNotification(null), 5000);

      // Trigger Mobile/Browser System Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Krishi Cart - Farmer", {
          body: msg,
          icon: 'https://cdn-icons-png.flaticon.com/512/1864/1864470.png'
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const [dataSource, setDataSource] = useState('mock');

  const fetchMandiPrices = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/mandi-prices?city=${encodeURIComponent(selectedLocation)}`);
      const data = await res.json();
      setDataSource(data.source || 'mock');
      if (data && data.records) {
        setMandiPrices(data.records);
      }
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
    }
  };

  const filteredMandiPrices = mandiPrices.filter(p => {
    const market = (p.market || '').toLowerCase();
    const city = (selectedLocation || '').toLowerCase();
    const state = (p.state || '').toLowerCase();
    return market.includes(city) || state.includes(city);
  });

  // If no prices for selected city, show some default ones or all
  const displayMandiPrices = filteredMandiPrices.length > 0 ? filteredMandiPrices : mandiPrices;

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.qty || !newItem.price) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        setNewItem({ name: '', qty: '', price: '', image: '' });
        setSuggestedPrice(null);
        document.getElementById('image-upload').value = '';
        fetchProducts(); // Refresh list
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleAISuggestion = () => {
    if (!newItem.name) {
      alert("Please enter a produce name first!");
      return;
    }
    setIsAnalyzing(true);
    // Simulate AI calculation delay
    setTimeout(() => {
      // Mock suggestion logic based on name length or random
      const basePrice = newItem.name.toLowerCase().includes('tomato') ? 22 : 
                        newItem.name.toLowerCase().includes('potato') ? 16 : 45;
      const suggested = basePrice + Math.floor(Math.random() * 5);
      
      setNewItem({...newItem, price: suggested});
      setSuggestedPrice(suggested);
      setIsAnalyzing(false);
      setIsAnalyzing(false);
    }, 1500);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Voice Recognition.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN'; 
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      let qtyMatch = transcript.match(/(\d+)\s*(kg|g|liters?)/i);
      let priceMatch = transcript.match(/(\d+)\s*(rupees|rs|per kg)/i);
      if (!priceMatch) priceMatch = transcript.match(/for\s*(\d+)/i); // e.g., "for 20"
      
      let qty = qtyMatch ? qtyMatch[0] : '';
      let price = priceMatch ? priceMatch[1] : '';
      
      let name = transcript;
      if (qtyMatch) name = name.replace(qtyMatch[0], '');
      if (priceMatch) name = name.replace(priceMatch[0], '');
      
      name = name.replace(/for|rupees|rs|per kg/gi, '').trim();
      name = name.charAt(0).toUpperCase() + name.slice(1);
      
      setNewItem({ ...newItem, name: name || transcript, qty: qty, price: price });
      setIsListening(false);
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)] relative">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-8 z-[200] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-6 h-6" />
          <p className="font-bold">{notification}</p>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-emerald-700 p-1 rounded-full"><X className="w-4 h-4"/></button>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('farmer.dashboard')}</h1>
          <p className="text-slate-600 font-medium mt-1">{t('farmer.manage')}</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-yellow-100 transition-all shadow-sm">
             <TrendingUp className="w-4 h-4" /> {t('farmer.analytics')}
           </button>
        </div>
      </div>

      {/* Live Mandi Rates Ticker */}
      {mandiPrices.length > 0 && (
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="bg-primary px-6 py-4 flex flex-col items-center justify-center gap-1 text-white font-bold whitespace-nowrap shadow-[4px_0_15px_rgba(0,0,0,0.1)] z-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-300" /> Live Mandi Rates
            </div>
            <span className="text-[10px] uppercase tracking-widest opacity-80">Source: {dataSource}</span>
          </div>
          <div className="flex-1 overflow-x-auto whitespace-nowrap p-4 flex gap-4 scrollbar-hide items-center bg-slate-50/50">
            {displayMandiPrices.map((price, idx) => (
              <div key={idx} className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm shrink-0">
                <span className="font-bold text-slate-800">{price.commodity}</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{price.market}</span>
                <span className="font-extrabold text-slate-900 flex items-center gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-500" />{price.modal_price}
                </span>
                {price.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Add Product & Inventory */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Add Product Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-primary/30">
                <Sparkles className="w-8 h-8 text-secondary animate-pulse mb-3" />
                <p className="text-slate-800 font-bold tracking-widest uppercase text-sm animate-pulse">{t('farmer.aiAnalyzing')}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="text-primary w-5 h-5" /> {t('farmer.listNew')}
              </h2>
              <button 
                type="button"
                onClick={startVoiceInput}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors ${isListening ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
              >
                <Mic className="w-4 h-4" /> {isListening ? 'Listening...' : 'Voice Input'}
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3 lg:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('farmer.produceName')}</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                  placeholder={t('farmer.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('farmer.qty')}</label>
                <input
                  type="text"
                  value={newItem.qty}
                  onChange={(e) => setNewItem({...newItem, qty: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                  placeholder={t('farmer.qtyPlaceholder')}
                />
              </div>
              <div>
                <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-1.5">
                  {t('farmer.price')}
                </label>
                <div className="relative flex shadow-sm rounded-xl">
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full pl-4 pr-10 py-2.5 rounded-l-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                    placeholder={t('farmer.pricePlaceholder')}
                  />
                  <button 
                    type="button" 
                    onClick={handleAISuggestion}
                    className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-y-slate-200 border-r-slate-200 border-l-0 rounded-r-xl px-3 transition-colors flex items-center justify-center"
                    title="AI Suggest Price"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {suggestedPrice && (
                <div className="md:col-span-3 text-xs text-yellow-700 flex items-center gap-1 mt-1 font-bold bg-yellow-50 p-2.5 rounded-lg border border-yellow-200">
                  <Sparkles className="w-3.5 h-3.5" /> {t('farmer.aiSuggested')}
                </div>
              )}

              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Product Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewItem({...newItem, image: reader.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {newItem.image && (
                    <img src={newItem.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0" />
                  )}
                </div>
              </div>

              <div className="md:col-span-3 mt-4">
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20">
                  {t('farmer.publish')}
                </button>
              </div>
            </form>
          </div>

          {/* Current Inventory */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-secondary w-5 h-5" /> {t('farmer.currentInv')}
              </h2>
              <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">{inventory.length} {t('farmer.items')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="px-6 py-4 font-bold">Image</th>
                    <th className="px-6 py-4 font-bold">{t('farmer.colProduce')}</th>
                    <th className="px-6 py-4 font-bold">{t('farmer.colQty')}</th>
                    <th className="px-6 py-4 font-bold">{t('farmer.colPrice')}</th>
                    <th className="px-6 py-4 font-bold">{t('farmer.colStatus')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <img src={item.image || 'https://images.unsplash.com/photo-1595856417537-8848d56b063d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=60'} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 group-hover:text-primary transition-colors">{item.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{item.stock || item.qty}</td>
                      <td className="px-6 py-4 text-slate-700 font-bold flex items-center gap-0.5 mt-2"><IndianRupee className="w-3.5 h-3.5 text-slate-400"/>{item.price}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle className="w-3 h-3" /> {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Active Orders */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Clock className="text-accent w-5 h-5" /> {t('farmer.liveOrders')}
              </h2>
              <div className="flex h-2 w-2 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </div>
            </div>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">{order.id}</span>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">₹{order.amount}</span>
                  </div>
                  <p className="font-bold text-slate-800 mb-3">{order.item}</p>
                  
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 mb-4 border border-slate-100">
                    <p className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                       <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] text-slate-700 font-bold">{order.buyer.charAt(0)}</span>
                       {t('farmer.buyer')} <span className="text-slate-900 font-bold">{order.buyer}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-slate-400" />
                       <span className="truncate">{order.location || 'Location pending...'}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                       {order.paymentMethod === 'cod' ? <Banknote className="w-4 h-4 text-emerald-600" /> : <CreditCard className="w-4 h-4 text-blue-500" />}
                       <span className="font-bold uppercase tracking-wider">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI/Online'}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                     <button 
                       onClick={() => setSelectedOrderMap(order)}
                       className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                     >
                       <MapPin className="w-3.5 h-3.5 text-primary" /> View Map
                     </button>
                     <span className="text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-md">
                       {order.status}
                     </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">{t('farmer.noOrders')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Customer Location Map Modal */}
      {selectedOrderMap && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col h-[70vh]">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Customer Location</h3>
                  <p className="text-xs text-slate-500">Order: {selectedOrderMap.id} • Buyer: {selectedOrderMap.buyer}</p>
                </div>
                <button onClick={() => setSelectedOrderMap(null)} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-full p-1.5"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 bg-slate-100 relative">
               <MapContainer center={getCoordinates(selectedOrderMap.location)} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={getCoordinates(selectedOrderMap.location)}>
                    <Popup>
                      <div className="text-center font-sans">
                        <p className="font-bold text-slate-800">{selectedOrderMap.buyer}'s Location</p>
                        <p className="text-xs text-slate-500">{selectedOrderMap.location}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">{selectedOrderMap.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}</p>
                      </div>
                    </Popup>
                  </Marker>
               </MapContainer>
             </div>

             <div className="p-5 bg-white border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="bg-primary/10 text-primary p-2 rounded-xl">
                      <Truck className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800 text-sm">Ready for Dispatch</p>
                      <p className="text-xs text-slate-500">Deliver to {selectedOrderMap.location || 'customer address'}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedOrderMap(null)}
                  className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-slate-800 transition-all"
                >
                  Close Map
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Add Truck icon for the modal since it wasn't imported originally
import { Truck } from 'lucide-react';

export default FarmerDashboard;
