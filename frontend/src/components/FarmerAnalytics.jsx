import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calculator, FileText, MessageCircle, PhoneCall } from 'lucide-react';

export const FarmerAnalytics = () => {
  const [cost, setCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [profit, setProfit] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Ramesh (Pune)', text: 'Aaj onion ka rate kya chal raha hai?', time: '10:30 AM' },
    { sender: 'Suresh (Nashik)', text: 'Bhai ₹1800/quintal mila mujhe subah.', time: '10:32 AM' }
  ]);

  const calculateProfit = () => {
    const c = parseFloat(cost);
    const s = parseFloat(sellingPrice);
    if (!c || !s) return;
    const p = s - c;
    const margin = ((p / c) * 100).toFixed(1);
    setProfit({ value: p.toFixed(2), margin });
  };

  const salesData = [
    { name: 'Mon', sales: 4000, demand: 2400 },
    { name: 'Tue', sales: 3000, demand: 1398 },
    { name: 'Wed', sales: 2000, demand: 9800 },
    { name: 'Thu', sales: 2780, demand: 3908 },
    { name: 'Fri', sales: 1890, demand: 4800 },
    { name: 'Sat', sales: 2390, demand: 3800 },
    { name: 'Sun', sales: 3490, demand: 4300 },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-black text-slate-900">Smart Sales Analytics</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profit Calculator */}
        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-6 h-6 text-emerald-700" />
            <h3 className="text-xl font-black text-emerald-900">Profit Calculator</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">Total Cost (₹)</label>
                <input type="number" value={cost} onChange={e=>setCost(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-emerald-200 outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. 500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">Selling Price (₹)</label>
                <input type="number" value={sellingPrice} onChange={e=>setSellingPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-emerald-200 outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. 800" />
              </div>
            </div>
            <button onClick={calculateProfit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors">
              Calculate Profit
            </button>
            
            {profit && (
              <div className="mt-4 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Estimated Profit</p>
                  <p className="text-2xl font-black text-emerald-600">₹{profit.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">Margin</p>
                  <p className="text-xl font-bold text-slate-800">{profit.margin}%</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community & Offline Tools */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PhoneCall className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-black text-slate-900">Offline SMS Orders</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-3">
              Receive order confirmations directly via SMS when internet is unavailable.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-max">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SMS Gateway Active
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Farmer Community Chat</h3>
              <p className="text-sm text-slate-600 font-medium mb-3">Connect with 500+ local farmers for advice and mandi updates.</p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors"
              >
                Join Discussion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col h-[600px]">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-amber-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Kisan Live Chat</h3>
                    <p className="text-xs text-amber-700 font-bold">504 Farmers Online</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-full p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
             
             <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
               {chatHistory.map((msg, idx) => (
                 <div key={idx} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                   <span className="text-[10px] text-slate-500 font-bold mb-1 ml-1">{msg.sender} • {msg.time}</span>
                   <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-medium shadow-sm ${msg.sender === 'You' ? 'bg-amber-500 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
             </div>

             <div className="p-4 bg-white border-t border-slate-100">
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   if (!chatMessage.trim()) return;
                   setChatHistory([...chatHistory, { sender: 'You', text: chatMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
                   setChatMessage('');
                 }}
                 className="flex gap-2"
               >
                 <input 
                   type="text" 
                   value={chatMessage}
                   onChange={(e) => setChatMessage(e.target.value)}
                   placeholder="Type a message to the community..."
                   className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                 />
                 <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 rounded-xl transition-colors">
                   Send
                 </button>
               </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
