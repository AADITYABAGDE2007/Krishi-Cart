/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, Navigation, Phone, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import LiveTrackingMap from '../components/LiveTrackingMap';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const TrackOrder = () => {
  const { orderId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeliveryDetails = useCallback(async () => {
    try {
      // Decode orderId if it's URL encoded (e.g., #ORD-001)
      const decodedOrderId = decodeURIComponent(orderId);
      const res = await fetch(`http://localhost:5000/api/deliveries/order/${encodeURIComponent(decodedOrderId)}`);
      if (res.ok) {
        const data = await res.json();
        setDelivery(data);
      }
    } catch (err) {
      console.error("Failed to fetch delivery details", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDeliveryDetails();

    socket.on('delivery_update', (updatedDelivery) => {
      if (updatedDelivery.orderId === orderId) {
        setDelivery(updatedDelivery);
      }
    });

    return () => socket.off('delivery_update');
  }, [orderId, fetchDeliveryDetails]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
          <p className="text-slate-500 mb-6">We couldn't find tracking details for this order.</p>
          <Link to="/consumer" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Return to Market</Link>
        </div>
      </div>
    );
  }

  const isDelivered = delivery.status === 'Delivered';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Side - Details */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
             {isDelivered && <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>}
             
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Track Order</h2>
                 <p className="text-sm font-bold text-slate-500">{delivery.orderId}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-primary/10 text-primary border-primary/20 animate-pulse'}`}>
                 {delivery.status}
               </span>
             </div>

             <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-500" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pickup</p>
                    <p className="font-bold text-slate-800 leading-tight">{delivery.pickup}</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Dropoff</p>
                    <p className="font-bold text-slate-800 leading-tight">{delivery.dropoff}</p>
                 </div>
               </div>
             </div>

             {/* OTP Section (Only if not delivered) */}
             {!isDelivered && (
               <div className="bg-slate-900 rounded-2xl p-5 text-center text-white mb-6 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                   <ShieldCheck className="w-4 h-4 text-emerald-400" /> Delivery OTP
                 </p>
                 <div className="flex justify-center gap-2">
                   {delivery.otp.split('').map((char, i) => (
                     <div key={i} className="w-12 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-black border border-white/20">
                       {char}
                     </div>
                   ))}
                 </div>
                 <p className="text-xs text-slate-400 mt-3">Share this PIN with your delivery partner.</p>
               </div>
             )}

             {isDelivered && (
               <div className="bg-emerald-50 rounded-2xl p-5 text-center text-emerald-900 border border-emerald-200 mb-6">
                 <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                 <h3 className="font-black text-lg">Delivered Successfully!</h3>
                 <p className="text-sm font-medium opacity-80 mt-1">Thank you for shopping directly from farmers.</p>
               </div>
             )}

             {/* Driver Details */}
             {delivery.partnerName ? (
               <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                     <Truck className="w-6 h-6 text-slate-400" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900">{delivery.partnerName}</p>
                     <p className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-0.5">{delivery.vehicleNo}</p>
                   </div>
                 </div>
                 <a href={`tel:${delivery.phone}`} className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200 hover:bg-green-100 transition-colors">
                   <Phone className="w-4 h-4" />
                 </a>
               </div>
             ) : (
               <div className="pt-6 border-t border-slate-100 text-center">
                 <div className="animate-pulse flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
                   <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                   Assigning Delivery Partner...
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-full lg:w-2/3 h-[500px] lg:h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
           {!isDelivered ? (
             <LiveTrackingMap deliveryId={delivery.id} />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Farm Fresh" className="w-64 h-64 object-cover rounded-full mb-6 border-8 border-white shadow-xl grayscale-[20%]" />
                <h2 className="text-2xl font-black text-slate-800">Enjoy your fresh produce!</h2>
                <Link to="/consumer" className="mt-4 text-primary font-bold hover:underline">Order More</Link>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
