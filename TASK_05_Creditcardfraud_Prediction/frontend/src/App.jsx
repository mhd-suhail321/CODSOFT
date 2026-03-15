import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, MapPin, Tablet, CreditCard, Search, Activity } from 'lucide-react';

function App() {
  const [data, setData] = useState({ location_delta: 1.2, device_score: -0.8, amount: 99.00 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Sends location_delta, device_score, amount
      });
      const response = await res.json();
      setResult(response);
    } catch (e) { 
      alert("Error: Ensure your FastAPI backend is running on port 8000"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-mono">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: Audit Controls --- */}
        <div className="lg:col-span-4 space-y-8 bg-[#111] p-8 border-l-2 border-white/10 shadow-2xl">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-500 animate-pulse" size={20} />
            <h1 className="text-xl font-black italic tracking-widest uppercase">Core_Audit</h1>
          </div>

          <div className="space-y-10 pt-10 border-t border-white/5">
            <div className="space-y-4">
              <label className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-2 tracking-tighter">
                <MapPin size={12} /> Location_Delta (Distance KM)
              </label>
              <input 
                type="number" step="0.1" value={data.location_delta}
                onChange={(e) => setData({...data, location_delta: parseFloat(e.target.value)})}
                className="w-full bg-transparent border-b border-zinc-800 py-2 outline-none focus:border-emerald-500 transition-all text-xl font-bold"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-2 tracking-tighter">
                <Tablet size={12} /> Device_Security_Score
              </label>
              <input 
                type="number" step="0.1" value={data.device_score}
                onChange={(e) => setData({...data, device_score: parseFloat(e.target.value)})}
                className="w-full bg-transparent border-b border-zinc-800 py-2 outline-none focus:border-emerald-500 transition-all text-xl font-bold"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-2 tracking-tighter">
                <CreditCard size={12} /> Transaction_Amount ($)
              </label>
              <input 
                type="number" step="1" value={data.amount}
                onChange={(e) => setData({...data, amount: parseFloat(e.target.value)})}
                className="w-full bg-transparent border-b border-zinc-800 py-2 outline-none focus:border-emerald-500 transition-all text-xl font-bold text-emerald-400"
              />
            </div>
          </div>

          <button 
            onClick={handleAudit} disabled={loading}
            className="w-full mt-10 py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center gap-3"
          >
            {loading ? "SCANNING..." : <><Search size={18}/> EXECUTE_AUDIT</>}
          </button>
        </div>

        {/* --- RIGHT: Result Display --- */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="idle" className="text-center opacity-20 animate-pulse flex flex-col items-center">
                <ShieldCheck size={120} strokeWidth={0.5} />
                <p className="mt-4 text-xs uppercase tracking-[0.5em]">Awaiting Data Stream</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full border-2 p-12 flex flex-col items-center justify-center text-center shadow-2xl"
                style={{ borderColor: result.status === 'FRAUD' ? '#ef4444' : '#ffffff20' }}
              >
                <div className="mb-6">
                  {result.status === 'FRAUD' ? <ShieldAlert size={80} className="text-red-500" /> : <ShieldCheck size={80} className="text-emerald-500" />}
                </div>

                <h2 className="text-[8vw] font-black leading-none mb-4 italic tracking-tighter uppercase" style={{ color: result.status === 'FRAUD' ? '#ef4444' : 'white' }}>
                  {result.status}
                </h2>

                <div className="grid grid-cols-2 gap-px bg-zinc-800 w-full mt-10 border border-zinc-800">
                  <div className="bg-[#050505] p-6">
                    <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest">Risk_Index</p>
                    <p className="text-2xl font-bold">{result.risk_score}%</p>
                  </div>
                  <div className="bg-[#050505] p-6">
                    <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest">Threat_Level</p>
                    <p className={`text-2xl font-bold ${result.threat_level === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>{result.threat_level}</p>
                  </div>
                </div>

                <p className="mt-12 text-[9px] text-zinc-600 uppercase tracking-[0.3em] max-w-sm">
                  INCIDENT_LOG: Transaction hash processed via Random Forest classifier // SMOTE Balancing Active.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default App;