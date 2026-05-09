import React, { useState, useEffect } from 'react';
import { Package, MapPin, CheckCircle, Clock, Truck, IndianRupee, Navigation, X } from 'lucide-react';
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

  useEffect(() => {
    fetchDeliveries();

    // Request System Push Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    socket.on('new_delivery', (delivery) => {
      setDeliveries((prev) => [delivery, ...prev]);
      const msg = `New Delivery Assigned: ${delivery.pickup} to ${delivery.dropoff}`;
      setNotification(msg);
      setTimeout(() => setNotification(null), 5000);

      // Trigger Mobile/Browser System Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Krishi Cart - Delivery", {
          body: msg,
          icon: 'https://cdn-icons-png.flaticon.com/512/2766/2766327.png'
        });
      }
    });

    socket.on('delivery_update', (updatedDelivery) => {
      setDeliveries((prev) => prev.map(d => d.id === updatedDelivery.id ? updatedDelivery : d));
    });

    return () => {
      socket.off('new_delivery');
      socket.off('delivery_update');
    };
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/deliveries');
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error('Failed to fetch deliveries', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/deliveries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Picked Up': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-8 z-[200] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-6 h-6" />
          <p className="font-bold">{notification}</p>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-emerald-700 p-1 rounded-full"><X className="w-4 h-4"/></button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Truck className="w-8 h-8 text-primary" /> Delivery Partner Dashboard
          </h1>
          <p className="text-slate-600">Manage your active deliveries, route, and earnings.</p>
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

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500">Loading assignments...</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Active Deliveries</h3>
            <p className="text-slate-500">You currently have no orders assigned.</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-500">{delivery.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{delivery.item}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-full shrink-0">
                        <MapPin className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Pickup</p>
                        <p className="text-sm text-slate-500">{delivery.pickup}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-full shrink-0">
                        <Navigation className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Dropoff</p>
                        <p className="text-sm text-slate-500">{delivery.dropoff}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-4 shrink-0">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-sm text-slate-500 font-medium">Distance</span>
                    <span className="text-slate-900 font-bold">{delivery.distance}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-sm text-slate-500 font-medium">Est. Earnings</span>
                    <span className="text-green-600 font-bold text-lg">{delivery.earnings}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    {delivery.status === 'Pending' && (
                      <button 
                        onClick={() => updateStatus(delivery.id, 'Picked Up')}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                      >
                        <Package className="w-4 h-4" /> Mark Picked Up
                      </button>
                    )}
                    {delivery.status === 'Picked Up' && (
                      <button 
                        onClick={() => updateStatus(delivery.id, 'Delivered')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Delivered
                      </button>
                    )}
                    {delivery.status === 'Delivered' && (
                      <button disabled className="w-full bg-slate-200 text-slate-500 font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 cursor-not-allowed">
                        <CheckCircle className="w-4 h-4" /> Completed
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
