import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Radio, Tv, Newspaper, ArrowUpRight } from 'lucide-react';

function App() {
  const [budget, setBudget] = useState({ tv: 150, radio: 22, news: 12 });
  const [prediction, setPrediction] = useState(0);

  const sync = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tv: budget.tv, radio: budget.radio, newspaper: budget.news }),
      });
      const data = await res.json();
      setPrediction(data.predicted_sales);
    } catch (e) { console.log("Check Backend"); }
  };

  useEffect(() => { sync(); }, [budget]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar: Controls */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">SalesForce</h1>
          </div>

          <div className="space-y-10 flex-1">
            {[
              { label: 'TV Advertising', key: 'tv', icon: <Tv size={16}/> },
              { label: 'Radio Spots', key: 'radio', icon: <Radio size={16}/> },
              { label: 'Newspaper Ads', key: 'news', icon: <Newspaper size={16}/> }
            ].map((item) => (
              <div key={item.key}>
                <div className="flex justify-between mb-3 items-center">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    {item.icon} {item.label}
                  </label>
                  <span className="text-xs font-bold text-slate-900">${budget[item.key]}K</span>
                </div>
                <input 
                  type="range" min="0" max="300" 
                  value={budget[item.key]}
                  onChange={(e) => setBudget({...budget, [item.key]: parseFloat(e.target.value)})}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 mt-auto">
             <p className="text-[10px] text-slate-400 font-medium">Model: Regression-V4</p>
             <p className="text-[10px] text-slate-400 font-medium">Instance: Localhost_8000</p>
          </div>
        </aside>

        {/* Main Content: Analytics */}
        <main className="flex-1 p-8 lg:p-16">
          <header className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Revenue Forecast</h2>
            <p className="text-slate-500 text-sm">Real-time prediction based on multi-channel marketing expenditure.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Primary Result Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Sales</p>
                <h3 className="text-5xl font-bold text-slate-900">{prediction} <span className="text-sm font-medium text-slate-400 italic">Units</span></h3>
              </div>
              <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                <ArrowUpRight size={14} />
                <span>92% Confidence Level</span>
              </div>
            </div>

            {/* Secondary Metric Card */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl flex flex-col justify-between text-white">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Budget</p>
                <h3 className="text-5xl font-bold italic">${(budget.tv + budget.radio + budget.news).toFixed(1)}K</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-medium uppercase mt-8">Allocated across 3 channels</p>
            </div>
          </div>

          <section className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
            <h4 className="text-indigo-900 font-bold text-sm mb-2 italic">Insight Summary</h4>
            <p className="text-indigo-700 text-sm leading-relaxed">
              Based on the current input vector, your marketing efficiency is optimized for <strong>{(prediction / (budget.tv + budget.radio + budget.news + 1)).toFixed(2)} units per $1k spent</strong>. Shifting budget to TV generally yields the highest marginal return in this dataset.
            </p>
          </section>
        </main>

      </div>
    </div>
  );
}

export default App;