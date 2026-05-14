/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Package, MapPin, CheckCircle, Clock, Truck, IndianRupee, Navigation, X, BellRing, ShieldCheck, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';

const socket = io('http://localhost:5000');

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);
  const [capturingProofFor, setCapturingProofFor] = useState(null);
  
  // Delivery Partner Details (Mocked for now, should come from AuthContext)
  const partnerDetails = {
    partnerName: user?.name || "Raju Delivery",
    phone: "+919876543210",
    vehicleNo: "UP32-AB-1234"
  };

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/deliveries');
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error('Failed to fetch deliveries', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    socket.on('new_delivery', (delivery) => {
      setDeliveries((prev) => [delivery, ...prev]);
      const msg = `🔔 New Ride Request: ${delivery.pickup} to ${delivery.dropoff}`;
      setNotification(msg);
      setTimeout(() => setNotification(null), 8000);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("New Delivery Available", { body: msg });
      }
    });

    socket.on('delivery_update', (updatedDelivery) => {
      setDeliveries((prev) => prev.map(d => d.id === updatedDelivery.id ? updatedDelivery : d));
    });

    return () => {
      socket.off('new_delivery');
      socket.off('delivery_update');
    };
  }, [fetchDeliveries]);

  const acceptDelivery = async (id) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setNotification("Fetching your location to accept order...");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`http://localhost:5000/api/deliveries/${id}/accept`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...partnerDetails,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        });
        
        if (res.ok) {
          setNotification("✅ Order Accepted! Start your ride.");
          setTimeout(() => setNotification(null), 3000);
          
          // Start transmitting live location continuously
          navigator.geolocation.watchPosition((livePos) => {
            socket.emit("driver_location_update", {
              deliveryId: id,
              lat: livePos.coords.latitude,
              lng: livePos.coords.longitude
            });
          }, null, { enableHighAccuracy: true });
        } else {
          setNotification("❌ Order already accepted by someone else.");
        }
      } catch (err) {
        console.error('Failed to accept', err);
      }
    }, () => {
      alert("Please allow location access to accept orders!");
    });
  };

  const verifyOTPAndDeliver = async (id) => {
    const otp = window.prompt("Ask the customer for the 4-digit Delivery PIN:");
    if (!otp) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/deliveries/${id}/verify-otp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      await res.json();
      if (res.ok) {
        setNotification("✅ Delivery Successful! Earned your payout.");
        setTimeout(() => setNotification(null), 3000);
      } else {
        alert("❌ Incorrect PIN. Please check the customer's app.");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying PIN");
    }
  };



  const handleCaptureProofClick = (id) => {
    setCapturingProofFor(id);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file && capturingProofFor) {
      setNotification("Uploading Proof of Pickup...");
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await fetch(`http://localhost:5000/api/deliveries/${capturingProofFor}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Picked Up', pickupImage: reader.result })
          });
          setCapturingProofFor(null);
          setNotification("📦 Proof of Pickup Verified!");
          setTimeout(() => setNotification(null), 3000);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
          console.error(err);
          alert("Upload failed.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Searching for Partner': return 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse';
      case 'Accepted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Picked Up': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const availableDeliveries = deliveries.filter(d => d.status === 'Searching for Partner');
  const activeDeliveries = deliveries.filter(d => d.status !== 'Searching for Partner');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Hidden file input for camera/proof */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleProofUpload} 
        className="hidden" 
      />

      {notification && (
        <div className="fixed top-20 right-8 z-[200] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="font-bold">{notification}</p>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-slate-800 p-1 rounded-full"><X className="w-4 h-4"/></button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Truck className="w-8 h-8 text-primary" /> Delivery Partner Dashboard
          </h1>
          <p className="text-slate-600">Accept orders, manage routes, and track earnings Zomato-style.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Earnings</p>
            <p className="text-2xl font-bold text-slate-900">₹{deliveries.filter(d => d.status === 'Delivered').reduce((acc, d) => acc + parseInt(d.earnings.replace('₹', '')), 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Available Requests */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-orange-500" /> New Ride Requests ({availableDeliveries.length})
          </h2>
          
          {availableDeliveries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Waiting for Orders...</h3>
              <p className="text-slate-500 text-sm mt-1">Keep the app open to receive ride requests.</p>
            </div>
          ) : (
            availableDeliveries.map(delivery => (
              <div key={delivery.id} className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">NEW</div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{delivery.earnings}</h3>
                    <p className="text-sm font-bold text-slate-500">{delivery.distance}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 relative">
                    <div className="absolute left-3.5 top-6 bottom-[-20px] w-0.5 bg-slate-200"></div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-slate-300 z-10 shrink-0"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup</p>
                      <p className="text-sm font-bold text-slate-900">{delivery.pickup}</p>
                      <p className="text-xs text-slate-500">{delivery.item}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-primary z-10 shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dropoff</p>
                      <p className="text-sm font-bold text-slate-900">{delivery.dropoff}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => acceptDelivery(delivery.id)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-transform active:scale-95 flex justify-center items-center gap-2 shadow-lg"
                >
                  Swipe to Accept Ride
                </button>
              </div>
            ))
          )}
        </div>

        {/* Active Deliveries */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" /> My Active Deliveries
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            </div>
          ) : activeDeliveries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No Active Deliveries</h3>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-500">{delivery.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                   <div>
                      <p className="text-xs font-bold text-slate-500">Customer</p>
                      <p className="font-bold text-slate-800">Krishi Consumer</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-slate-500">Earnings</p>
                      <p className="font-black text-emerald-600 text-lg">{delivery.earnings}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {delivery.status === 'Accepted' && (
                    <button 
                      onClick={() => handleCaptureProofClick(delivery.id)}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Take Photo & Pick Up
                    </button>
                  )}
                  {delivery.status === 'Picked Up' && (
                    <button 
                      onClick={() => verifyOTPAndDeliver(delivery.id)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5 text-emerald-400" /> Enter Customer PIN
                    </button>
                  )}
                  {delivery.status === 'Delivered' && (
                    <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2 cursor-not-allowed">
                      <CheckCircle className="w-4 h-4" /> Delivered Successfully
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default DeliveryDashboard;
