"use client";

import { Activity, BarChart3 } from "lucide-react";

export function HeroChart() {
  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-auto hover:scale-[1.02] transition-transform duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground text-sm font-medium">EUR/USD</p>
          <h3 className="text-2xl font-bold text-foreground">1.0924 <span className="text-emerald-500 text-sm font-medium">+0.45%</span></h3>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <BarChart3 className="text-blue-500" size={24} />
        </div>
      </div>
      
      {/* Mock Chart Area */}
      <div className="h-48 w-full flex items-end justify-between gap-2">
        {[40, 65, 45, 70, 55, 80, 60, 85, 75, 90, 65, 80].map((h, i) => (
          <div 
            key={i} 
            className="w-full bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-t-sm hover:from-blue-600/40 hover:to-blue-400 transition-all duration-300"
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-muted-foreground font-medium">
        <span>10:00</span>
        <span>11:00</span>
        <span>12:00</span>
        <span>13:00</span>
        <span>14:00</span>
      </div>
    </div>
  );
}

export function AiInsight() {
  return (
    <div className="bg-card/90 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
          <Activity className="text-emerald-500" size={20} />
        </div>
        <div>
          <h4 className="text-foreground font-semibold text-sm">AI Signal: Strong Buy</h4>
          <p className="text-muted-foreground text-xs mt-1">Confidence Score: 94%</p>
          <p className="text-muted-foreground text-[10px] mt-2">Updated 2m ago</p>
        </div>
      </div>
    </div>
  );
}
