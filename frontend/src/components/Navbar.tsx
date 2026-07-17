import React from 'react';
import { Shield, Bell, Cpu, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-soc-surface/90 backdrop-blur-md border-b border-soc-border/60 z-40 px-6 flex items-center justify-between">
      {/* Branding */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-soc-accent/20 to-soc-accentSecondary/10 p-2 rounded-lg border border-soc-accent/20 text-soc-accent">
          <Shield className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white flex items-center">
          AI<span className="text-soc-accent">-SOC</span>
          <span className="ml-2.5 text-[10px] px-2 py-0.5 bg-zinc-800/50 border border-zinc-700/50 text-soc-muted rounded-full font-mono font-normal">
            v2.1.0
          </span>
        </span>
      </div>

      {/* Center — Search mockup */}
      <div className="hidden md:flex items-center relative max-w-md w-full mx-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-soc-muted/50" />
        <input
          type="text"
          placeholder="Search alerts, incidents, or threats..."
          className="w-full bg-soc-bg/60 border border-soc-border/50 rounded-lg pl-10 pr-4 py-1.5 text-xs text-soc-text placeholder-soc-muted/40 focus:outline-none focus:border-soc-accent/50 focus:bg-soc-bg transition-all duration-200"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          <kbd className="hidden lg:inline-flex text-[9px] px-1.5 py-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded text-soc-muted/50 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Ollama Status */}
        <div className="hidden lg:flex items-center space-x-2 border border-soc-border/40 bg-soc-bg/50 px-3 py-1.5 rounded-lg">
          <Cpu className="h-3.5 w-3.5 text-soc-accent" />
          <span className="text-[11px] text-soc-muted">Ollama:</span>
          <span className="text-[11px] text-soc-low font-semibold flex items-center">
            <span className="relative flex h-1.5 w-1.5 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-low opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-soc-low"></span>
            </span>
            ONLINE
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-soc-muted hover:text-white bg-soc-bg/50 border border-soc-border/40 rounded-lg hover:bg-zinc-800/50 transition-all duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-soc-critical rounded-full ring-2 ring-soc-surface"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3 border-l border-soc-border/40 pl-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-soc-accent/30 to-soc-accentSecondary/20 border border-soc-accent/30 text-soc-accent flex items-center justify-center font-bold text-sm shadow-glow">
            SEC
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-white">Security Analyst</div>
            <div className="text-[10px] text-soc-muted font-mono">ID: SA-9847</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
