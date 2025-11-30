"use client";

import { useEffect, useState, useMemo } from "react";
import { Zap } from "lucide-react";

export function HeroChart() {
  // Generate static data points for the line chart
  const initialData = [40, 45, 42, 55, 50, 65, 60, 75, 70, 85, 82];
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        // Random walk for the last point
        const change = (Math.random() - 0.45) * 3; 
        let newLast = last + change;
        newLast = Math.max(Math.min(newLast, 95), 40); // Keep in bounds
        
        // Create a new array with the updated last point
        const newData = [...prev];
        newData[newData.length - 1] = newLast;
        return newData;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate SVG path
  const pathD = useMemo(() => {
    const width = 100;
    const height = 100;
    const stepX = width / (data.length - 1);
    
    // Generate points
    const points = data.map((val, i) => {
      const x = i * stepX;
      const y = height - val; // Invert Y because SVG 0 is top
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [data]);

  // Calculate fill area path (closed loop)
  const fillD = `${pathD} L 100,100 L 0,100 Z`;

  const currentPrice = data[data.length - 1];

  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-auto hover:scale-[1.02] transition-transform duration-500 overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <p className="text-muted-foreground text-xs font-bold tracking-wider">XAU/USD</p>
             <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-mono">M15</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground flex items-center font-mono">
            3480.<span className="text-sm">{Math.floor(currentPrice)}</span>
          </h3>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20 shadow-inner">
          <Zap className="text-blue-500" size={24} />
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="h-56 w-full relative rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm p-4 overflow-hidden">
        
        {/* ICT Concept: FVG Zone */}
        <div className="absolute left-[55%] top-[30%] w-[15%] h-[15%] bg-blue-500/10 border-y border-blue-500/30 flex items-center justify-center z-0">
            <span className="text-[8px] text-blue-500 font-bold tracking-widest opacity-60">FVG</span>
        </div>

        {/* ICT Concept: Liquidity Line */}
        <div className="absolute left-0 right-0 top-[20%] border-t border-dashed border-rose-500/50 z-0">
             <span className="absolute right-2 -top-4 text-[8px] text-rose-500 font-bold">Buy Side Liquidity</span>
        </div>

        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Area Fill */}
            <path d={fillD} fill="url(#lineGradient)" className="transition-all duration-100 ease-linear" />
            
            {/* Line */}
            <path d={pathD} fill="none" stroke="rgb(16, 185, 129)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-100 ease-linear" />
            
            {/* Live Point */}
            <circle cx="100" cy={100 - currentPrice} r="2" fill="rgb(16, 185, 129)" className="animate-pulse">
                <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </circle>
        </svg>

        {/* Price Line */}
        <div 
            className="absolute right-0 w-full border-t border-emerald-500/50 border-dashed flex items-center justify-end transition-all duration-100 ease-linear z-20 pointer-events-none" 
            style={{ top: `${100 - currentPrice}%` }}
        >
            <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-l-sm font-mono shadow-sm">
                {currentPrice.toFixed(2)}
            </span>
        </div>
      </div>
    </div>
  );
}

export function AiInsight() {
  return null;
}

