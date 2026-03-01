import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [formData, setFormData] = useState({
    Pclass: 3, Sex: 0, Age: 25, SibSp: 0, Parch: 0, Fare: 10.5, Embarked: 2
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white font-sans flex items-center justify-center p-4">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl bg-[#161618]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col md:flex-row h-full">
          
          {/* LEFT: INPUTS */}
          <div className="w-full md:w-1/2 p-12 border-r border-white/5">
            <h1 className="text-3xl font-light mb-2">Titanic <span className="text-blue-500 font-medium">Predictor</span></h1>
            <p className="text-gray-500 mb-10 text-sm tracking-widest uppercase">Neural Analysis Model v1.0</p>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Passenger Parameters</label>
                
                {/* Gender Toggle */}
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl">
                  {[["Female", 0], ["Male", 1]].map(([label, val]) => (
                    <button
                      key={val}
                      onClick={() => setFormData({...formData, Sex: val})}
                      className={`flex-1 py-3 rounded-xl transition-all duration-300 ${formData.Sex === val ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Class Tabs */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFormData({...formData, Pclass: num})}
                      className={`flex-1 py-3 rounded-xl border transition-all ${formData.Pclass === num ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-white/5 bg-white/5 text-gray-500'}`}
                    >
                      Class {num}
                    </button>
                  ))}
                </div>

                {/* Age Slider */}
                <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Estimated Age</span>
                    <span className="text-xl font-mono text-blue-400">{formData.Age}</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" value={formData.Age}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none accent-blue-500"
                    onChange={(e) => setFormData({...formData, Age: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-5 bg-blue-600 rounded-2xl font-bold text-lg transition-all"
              >
                {loading ? "PROCESSING..." : "RUN NEURAL SCAN"}
              </motion.button>
            </div>
          </div>

          {/* RIGHT: LIVE RESULT */}
          <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-blue-600/5 to-transparent flex flex-col items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  </div>
                  <p className="text-gray-500 text-sm">Awaiting neural input signals...</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <p className="mt-6 text-blue-400 font-mono text-sm animate-pulse">ANALYZING PROBABILITY...</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center w-full"
                >
                  <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border ${result.survived ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {result.survived ? "SURVIVAL LIKELY" : "FATALITY DETECTED"}
                  </div>
                  
                  <div className="text-8xl font-black mb-4 tracking-tighter italic">
                    {result.probability}<span className="text-3xl text-gray-600 font-light">%</span>
                  </div>
                  
                  <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Inference Accuracy Score</p>
                  
                  <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-[280px] mx-auto">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-gray-500 text-[10px] uppercase mb-1">Status</div>
                      <div className={result.survived ? "text-emerald-400" : "text-red-400"}>
                        {result.survived ? "Safe" : "At Risk"}
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-gray-500 text-[10px] uppercase mb-1">Model</div>
                      <div className="text-blue-400">R-Forest</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default App;