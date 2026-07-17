import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, HardDrive } from 'lucide-react';

export const Settings: React.FC = () => {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.2');
  const [sysmonPath, setSysmonPath] = useState('C:\\Windows\\System32\\winevt\\Logs\\Microsoft-Windows-Sysmon%4Operational.evtx');
  const [scanInterval, setScanInterval] = useState(5);

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure local telemetry source paths, Ollama LLM connections, and playbook execution parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ollama Connection Settings */}
        <div className="bg-soc-card border border-soc-border rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-soc-border/60">
            <Cpu className="h-5 w-5 text-soc-accent" />
            <h3 className="font-bold text-white text-sm">Local Ollama LLM Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase">Ollama Endpoint URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-soc-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-soc-accent"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase">Active LLM Model</label>
              <select
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                className="w-full bg-zinc-950 border border-soc-border rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-soc-accent"
              >
                <option value="llama3.2">Llama 3.2 (3B)</option>
                <option value="mistral">Mistral (7B)</option>
                <option value="codellama">CodeLlama (7B)</option>
                <option value="phi3">Phi-3 (3.8B)</option>
              </select>
            </div>
          </div>
          
          <div className="bg-zinc-950/40 border border-soc-border rounded-lg p-3 text-xs text-zinc-500">
            AI-SOC runs reasoning models locally using Ollama. Ensure your Ollama server is running and the chosen model is downloaded (`ollama run llama3.2`).
          </div>
        </div>

        {/* System Health Check */}
        <div className="bg-soc-card border border-soc-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-soc-border/60">
              <ShieldCheck className="h-5 w-5 text-soc-low" />
              <h3 className="font-bold text-white text-sm">Playbook Protection Level</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Automatic EDR Containment</span>
                <span className="text-soc-low font-bold">ENABLED</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Account Lockdown (SOAR)</span>
                <span className="text-soc-low font-bold">ENABLED</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">External Threat Intel Feeds</span>
                <span className="text-zinc-500 font-bold">STANDBY</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-soc-accent hover:bg-soc-accentHover text-white py-2 rounded-lg text-xs font-semibold shadow-md transition-all">
            Run Integrity Audit
          </button>
        </div>

        {/* Telemetry settings */}
        <div className="bg-soc-card border border-soc-border rounded-xl p-5 space-y-4 lg:col-span-3">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-soc-border/60">
            <Database className="h-5 w-5 text-soc-accent" />
            <h3 className="font-bold text-white text-sm">Telemetry Ingestion Sources</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase flex items-center">
                <HardDrive className="h-3.5 w-3.5 mr-1 text-zinc-500" /> Windows Sysmon EVTX Log Path
              </label>
              <input
                type="text"
                value={sysmonPath}
                onChange={(e) => setSysmonPath(e.target.value)}
                className="w-full bg-zinc-950 border border-soc-border rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-soc-accent"
              />
            </div>

            <div className="space-y-1.5 sm:w-1/3">
              <label className="text-xs text-zinc-400 font-semibold uppercase">Sysmon Scan Interval (seconds)</label>
              <input
                type="number"
                value={scanInterval}
                onChange={(e) => setScanInterval(parseInt(e.target.value) || 5)}
                className="w-full bg-zinc-950 border border-soc-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-soc-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
