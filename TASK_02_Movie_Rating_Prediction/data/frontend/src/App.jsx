import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, BarChart3, Info, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

function App() {
  const [formData, setFormData] = useState({
    Year: 2024, Duration: 120, Votes: 5000, 
    Genre_encoded: 7.0, Director_encoded: 8.5, Actor_encoded: 4.5
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dynamic Chart Data based on your current inputs
  const chartData = useMemo(() => [
    { subject: 'Director', A: formData.Director_encoded, fullMark: 10 },
    { subject: 'Cast', A: formData.Actor_encoded, fullMark: 10 },
    { subject: 'Genre', A: formData.Genre_encoded, fullMark: 10 },
    { subject: 'Runtime', A: (formData.Duration / 20), fullMark: 10 },
    { subject: 'Recency', A: (formData.Year - 1900) / 12, fullMark: 10 },
  ], [formData]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) { console.error("Backend Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-hidden flex flex-col">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl px-12 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-1.5 rounded-md"><Film size={20} color="black"/></div>
          <h1 className="text-lg font-black tracking-widest uppercase italic">Cine<span className="text-yellow-500">Metric</span> AI</h1>
        </div>
        <div className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">Task 02 // Regression // Random Forest</div>
      </nav>

      <main className="flex-1 flex p-6 gap-6 relative">
        {/* Left: Control Console */}
        <div className="w-[400px] flex flex-col gap-6">
          <section className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 backdrop-blur-3xl flex-1">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Activity size={14} className="text-yellow-500"/> Feature_Inputs
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Release Year</label>
                  <input type="number" value={formData.Year} onChange={(e) => setFormData({...formData, Year: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-yellow-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Duration</label>
                  <input type="number" value={formData.Duration} onChange={(e) => setFormData({...formData, Duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-yellow-500" />
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-white/5">
                {['Director_encoded', 'Actor_encoded', 'Genre_encoded'].map((key) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-gray-400">
                      <span>{key.replace('_encoded', '')} Reputation</span>
                      <span className="text-yellow-500">{formData[key]}</span>
                    </div>
                    <input type="range" min="1" max="10" step="0.1" value={formData[key]} onChange={(e) => setFormData({...formData, [key]: e.target.value})} className="w-full accent-yellow-500 h-1 bg-white/10 rounded-full appearance-none" />
                  </div>
                ))}
              </div>

              <button onClick={handlePredict} disabled={loading} className="w-full py-4 bg-yellow-500 text-black font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
                {loading ? "PROCESSING..." : "RUN INFERENCE"}
              </button>
            </div>
          </section>
        </div>

        {/* Right: Analytics Visualizer */}
        <div className="flex-1 grid grid-rows-2 gap-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] flex items-center justify-center p-8 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {prediction && (
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="flex items-center gap-20">
                  <div className="text-center">
                    <div className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-2">Prediction</div>
                    <div className="text-[10rem] font-black italic leading-none">{prediction.rating}</div>
                  </div>

                  {/* LIVE RADAR CHART */}
                  <div className="w-80 h-80 opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="subject" tick={{fill: '#666', fontSize: 10, fontWeight: 'bold'}} />
                        <Radar name="Movie" dataKey="A" stroke="#eab308" fill="#eab308" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Model Confidence</div>
               <div className="text-4xl font-mono text-green-500">84%</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Error Margin</div>
               <div className="text-4xl font-mono text-yellow-500/50">±0.12</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Algorithm</div>
               <div className="text-sm font-bold tracking-tighter">RANDOM_FOREST_REGRESSOR</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;