import { useState } from 'react';
import { User, Package, MapPin, Mail, Phone, Calendar, ChevronRight, ShoppingBag, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [purchaseHistory] = useState([
    { id: '#ORD-102', item: 'Fresh Tomatoes (5kg)', date: '2026-04-25', status: 'Delivered', price: '₹100' },
    { id: '#ORD-101', item: 'Organic Potatoes (2kg)', date: '2026-04-20', status: 'Delivered', price: '₹30' },
    { id: '#ORD-099', item: 'Onions (3kg)', date: '2026-04-15', status: 'Delivered', price: '₹45' },
  ]);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        <button 
          onClick={() => navigate(user?.role?.toLowerCase() === 'farmer' ? '/farmer' : '/consumer')} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">{user?.name || 'Rahul Sharma'}</h2>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-6">Premium {user?.role || 'Consumer'}</p>
              
              <div className="space-y-4 text-left border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{user?.email || 'rahul.s@example.com'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">Lucknow, Uttar Pradesh</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">Joined April 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Farmer Support</h3>
                  <p className="text-emerald-100 text-sm mb-4">You've helped 5 local farmers this month by buying direct!</p>
                  <div className="h-2 bg-emerald-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-300 w-3/4 rounded-full"></div>
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 opacity-10">
                  <CheckCircle className="w-32 h-32" />
               </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Settings
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                   <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                      <ShoppingBag className="w-5 h-5" />
                   </div>
                   <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Orders</h4>
                   <p className="text-3xl font-black text-slate-900">12</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                   <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                      <Clock className="w-5 h-5" />
                   </div>
                   <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ongoing Orders</h4>
                   <p className="text-3xl font-black text-slate-900">1</p>
                </div>
                
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                    {purchaseHistory.slice(0, 2).map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                            <Package className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{order.item}</p>
                            <p className="text-xs font-medium text-slate-400">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">{order.price}</p>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b border-slate-50">
                  <h3 className="text-lg font-black text-slate-900">Your Full Purchase History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {purchaseHistory.map((order, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                          <td className="px-8 py-5 text-sm font-bold text-slate-500">{order.id}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-900">{order.item}</td>
                          <td className="px-8 py-5 text-sm font-medium text-slate-500">{order.date}</td>
                          <td className="px-8 py-5 text-sm font-black text-slate-900">{order.price}</td>
                          <td className="px-8 py-5">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                              <CheckCircle className="w-3 h-3" /> {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-black text-slate-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-all">
                          <Mail className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">Email Notifications</p>
                          <p className="text-xs text-slate-500">Manage how you receive alerts</p>
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-all">
                          <Package className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">Address Book</p>
                          <p className="text-xs text-slate-500">Manage your delivery locations</p>
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
