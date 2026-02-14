
import React, { useState, useCallback, useRef } from 'react';
import { processImage } from './services/imageUtils';
import { analyzeColorPalette } from './services/gemini';
import { ProcessedChannels, AnalysisResult } from './types';
import ChannelCard from './components/ChannelCard';

const App: React.FC = () => {
  const [channels, setChannels] = useState<ProcessedChannels | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const processed = await processImage(file);
      setChannels(processed);
      
      // Perform AI Analysis in parallel
      const aiResult = await analyzeColorPalette(processed.original);
      setAnalysis(aiResult);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please try another file.');
    } finally {
      setLoading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-layer-group text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">ChromaSplit <span className="text-white/40">PRO</span></h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={triggerUpload}
            className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            New Image
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        {!channels && !loading && (
          <div className="h-[70vh] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-[#0f0f0f] group hover:border-white/20 transition-all cursor-pointer" onClick={triggerUpload}>
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-white/40"></i>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white/80">Drop your image here</h2>
            <p className="text-white/40 mb-8">Supports PNG, JPG, and WEBP formats</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        )}

        {loading && (
          <div className="h-[70vh] flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-[spin_1s_linear_infinite]"></div>
              <div className="absolute inset-2 border-4 border-green-500 rounded-full border-b-transparent animate-[spin_1.5s_linear_infinite]"></div>
              <div className="absolute inset-4 border-4 border-blue-500 rounded-full border-l-transparent animate-[spin_2s_linear_infinite]"></div>
            </div>
            <p className="mt-8 text-white/60 font-medium animate-pulse">Splitting light spectrum...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {channels && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Analysis Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 h-full">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-purple-400"></i>
                    AI Color Intelligence
                  </h3>
                  
                  {analysis ? (
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-white/30 font-bold">Dominant Mood</span>
                        <p className="text-white/80 mt-1">{analysis.dominantColor}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-white/30 font-bold">Spectral Balance</span>
                        <p className="text-white/80 mt-1 leading-relaxed text-sm">{analysis.balance}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">Creative Suggestion</span>
                        <p className="text-white/90 mt-2 text-sm italic">"{analysis.suggestion}"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-3/4"></div>
                      <div className="h-20 bg-white/5 rounded w-full"></div>
                      <div className="h-16 bg-white/5 rounded w-full"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Preview */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center p-4">
                  <img 
                    src={channels.original} 
                    alt="Original" 
                    className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ChannelCard 
                title="Red" 
                imageUrl={channels.red} 
                colorClass="text-red-500 bg-red-500/10" 
              />
              <ChannelCard 
                title="Green" 
                imageUrl={channels.green} 
                colorClass="text-green-500 bg-green-500/10" 
              />
              <ChannelCard 
                title="Blue" 
                imageUrl={channels.blue} 
                colorClass="text-blue-500 bg-blue-500/10" 
              />
              <ChannelCard 
                title="Luminance" 
                imageUrl={channels.grayscale} 
                colorClass="text-white/50 bg-white/5" 
              />
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 px-6 border-t border-white/5 text-center text-white/20 text-sm">
        <p>© 2025 ChromaSplit Pro • High-Performance Spectral Analysis</p>
      </footer>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

export default App;
