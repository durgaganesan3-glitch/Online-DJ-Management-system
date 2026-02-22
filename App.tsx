
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MetalType, PlanningInputs, MarketRates, PlanningResults } from './types';
import { fetchMetalRates } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';

const App: React.FC = () => {
  const [rates, setRates] = useState<MarketRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputs, setInputs] = useState<PlanningInputs>({
    dailySaving: 1000,
    savingDuration: 30,
    selectedMetal: MetalType.GOLD,
    targetMetal: MetalType.GOLD,
    targetQuantity: 10,
    targetDuration: 365
  });

  const getLatestRates = useCallback(async () => {
    setLoading(true);
    const data = await fetchMetalRates();
    setRates(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getLatestRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo((): PlanningResults | null => {
    if (!rates) return null;

    const currentRate = inputs.selectedMetal === MetalType.GOLD ? rates.gold : rates.silver;
    const targetRate = inputs.targetMetal === MetalType.GOLD ? rates.gold : rates.silver;

    const totalSavings = inputs.dailySaving * inputs.savingDuration;
    const estimatedQuantity = totalSavings / currentRate;
    const advice = totalSavings >= currentRate ? "You may consider buying now." : "Continue saving.";
    
    // Required Daily Saving = (Target Quantity × Current Rate) ÷ Target Duration
    const requiredDailySaving = (inputs.targetQuantity * targetRate) / (inputs.targetDuration || 1);

    return {
      totalSavings,
      estimatedQuantity,
      advice,
      requiredDailySaving
    };
  }, [inputs, rates]);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-200">
              <span className="text-white font-bold">₹</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">SwarnaSanchay</h1>
          </div>
          <button 
            onClick={getLatestRates}
            disabled={loading}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Fetching Rates...' : 'Refresh Rates'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Financial Planning Assistant</h2>
          <p className="text-slate-500 max-w-2xl">Plan your precious metal investments with precision using the latest market rates for Gold and Silver in India.</p>
        </div>

        <InputSection inputs={inputs} setInputs={setInputs} />

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Consulting market experts via Gemini...</p>
          </div>
        ) : rates && results && (
          <ResultSection results={results} inputs={inputs} rates={rates} />
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-8 pb-12 border-t border-slate-200 pt-8 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} SwarnaSanchay India. All calculations are estimates based on real-time grounding.
      </footer>
    </div>
  );
};

export default App;
