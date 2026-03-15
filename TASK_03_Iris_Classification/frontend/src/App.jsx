import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, FlaskConical, Binary, Info, CheckCircle2 } from 'lucide-react';

const speciesMeta = {
  setosa: { color: "from-indigo-500 to-blue-500", shadow: "shadow-blue-200", icon: "🌸" },
  versicolor: { color: "from-emerald-400 to-teal-600", shadow: "shadow-emerald-200", icon: "🌿" },
  virginica: { color: "from-rose-400 to-purple-600", shadow: "shadow-rose-200", icon: "🍂" }
};

function App() {
  const [inputs, setInputs] = useState({ sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runClassification = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Backend error: Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] p-6 font-sans antialiased">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-100 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto">
        {/* --- Header --- */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
              <FlaskConical className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Iris.AI Workbench</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Classification Model v1.0.4</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500">Intern: Mhd Suhail</p>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600">ENGINE_ONLINE</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Input Console --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-2 mb-8 text-slate-400">
                <BarChart3 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Feature Controls</span>
              </div>

              <div className="space-y-10">
                {Object.keys(inputs).map((key) => (
                  <div key={key} className="group">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-bold capitalize text-slate-700">{key.replace('_', ' ')}</label>
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-600">
                        {inputs[key]} <span className="text-[10px] text-slate-400">cm</span>
                      </span>
                    </div>
                    <input 
                      type="range" step="0.1" min="0.1" max="8"
                      value={inputs[key]}
                      onChange={(e) => {
                        setInputs({...inputs, [key]: parseFloat(e.target.value)});
                        setResult(null); // Reset result on change
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={runClassification}
                disabled={loading}
                className="w-full mt-12 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-300 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Processing..." : "Run Classification"}
              </button>
            </div>
          </div>

          {/* --- Output Display --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-full bg-white/40 backdrop-blur-md border border-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col">
              <div className="flex items-center gap-2 mb-8 text-slate-400">
                <Binary size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Analysis Result</span>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.div 
                      key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center space-y-3"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                        <FlaskConical className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm italic">Adjust parameters and run analysis</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="data" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="w-full"
                    >
                      <div className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${speciesMeta[result.species.toLowerCase()].color} text-white text-center shadow-2xl ${speciesMeta[result.species.toLowerCase()].shadow}`}>
                        <span className="text-6xl block mb-4">{speciesMeta[result.species.toLowerCase()].icon}</span>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-70 mb-1">Identified Species</p>
                        <h2 className="text-5xl font-black tracking-tighter mb-6">{result.species}</h2>
                        
                        <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20">
                          <CheckCircle2 size={16} className="text-white" />
                          <span className="text-sm font-bold">{result.confidence}% Confidence</span>
                        </div>
                      </div>

                      <div className="mt-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                        <Info className="text-indigo-500 shrink-0" size={20} />
                        <p className="text-xs text-indigo-700 leading-relaxed font-medium uppercase tracking-tight">
                          The SVM algorithm has mapped these four coordinates into the {result.species} cluster with high statistical significance.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;