import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';

interface MitreTechnique {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'covered' | 'uncovered';
  detections?: number;
}

interface MitreColumn {
  tactic: string;
  description: string;
  techniques: MitreTechnique[];
}

const mitreMatrixData: MitreColumn[] = [
  {
    tactic: 'Initial Access',
    description: 'Adversaries attempting to enter the network.',
    techniques: [
      { id: 'T1566', name: 'Phishing', description: 'Using emails to deliver malware or steal credentials.', status: 'covered' },
      { id: 'T1190', name: 'Exploit Public App', description: 'Targeting internet-facing application vulnerabilities.', status: 'uncovered' },
      { id: 'T1078', name: 'Valid Accounts', description: 'Leveraging compromised credentials to access systems.', status: 'covered' }
    ]
  },
  {
    tactic: 'Execution',
    description: 'Adversaries running malicious code.',
    techniques: [
      { id: 'T1059.001', name: 'PowerShell', description: 'Executing commands using the PowerShell interpreter.', status: 'active', detections: 2 },
      { id: 'T1059.003', name: 'Windows Cmd', description: 'Executing commands using the Windows Command Prompt.', status: 'covered' },
      { id: 'T1204', name: 'User Execution', description: 'Tricked users running malicious code/macros.', status: 'active', detections: 1 },
      { id: 'T1047', name: 'WMI Query', description: 'Invoking local/remote tasks via Windows Management.', status: 'active', detections: 1 }
    ]
  },
  {
    tactic: 'Persistence',
    description: 'Adversaries keeping access established.',
    techniques: [
      { id: 'T1053.005', name: 'Scheduled Task', description: 'Creating tasks to execute commands at specific times.', status: 'active', detections: 1 },
      { id: 'T1543', name: 'Create Service', description: 'Creating or modifying Windows services.', status: 'covered' },
      { id: 'T1547', name: 'Registry Run Keys', description: 'Placing payload in Startup folders/run keys.', status: 'covered' }
    ]
  },
  {
    tactic: 'Defense Evasion',
    description: 'Adversaries avoiding detection.',
    techniques: [
      { id: 'T1218.014', name: 'Certutil', description: 'Abusing Certutil to download or encode file payload.', status: 'active', detections: 1 },
      { id: 'T1218.010', name: 'Regsvr32', description: 'Using Regsvr32 to load remote scriptlets (Squiblydoo).', status: 'active', detections: 1 },
      { id: 'T1218.005', name: 'Mshta', description: 'Executing remote HTML applications via Mshta.', status: 'active', detections: 1 },
      { id: 'T1218.011', name: 'Rundll32', description: 'Invoking arbitrary DLLs using Rundll32 proxy.', status: 'covered' }
    ]
  },
  {
    tactic: 'Credential Access',
    description: 'Adversaries stealing usernames and credentials.',
    techniques: [
      { id: 'T1003.001', name: 'LSASS Memory Dump', description: 'Dumping LSASS memory using tools like Procdump or Mimikatz.', status: 'active', detections: 1 },
      { id: 'T1056', name: 'Input Capture', description: 'Keylogging or trapping user logins.', status: 'uncovered' },
      { id: 'T1110', name: 'Brute Force', description: 'Guessing passwords programmatically.', status: 'covered' }
    ]
  }
];

export const Mitre: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering techniques based on search
  const highlightMatch = (name: string, id: string) => {
    if (!searchQuery) return false;
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">MITRE ATT&CK Matrix</h1>
          <p className="text-sm text-soc-muted mt-1.5">
            Enterprise tactic coverage and real-time mapping of detected endpoint telemetry.
          </p>
        </div>

        {/* Matrix Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-soc-muted/50" />
          <input
            type="text"
            placeholder="Search technique ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-soc-bg/60 border border-soc-border/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-soc-muted/40 focus:outline-none focus:border-soc-accent/50 focus:bg-soc-bg transition-all duration-200"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs bg-soc-surface border border-soc-border/60 p-4 rounded-xl shadow-card">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-soc-critical rounded-sm shadow-sm"></span>
          <span className="text-soc-text/80">Active Alert Detection</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-soc-accent/30 border border-soc-accent/40 rounded-sm"></span>
          <span className="text-soc-text/80">Sigma Rule Configured (No Active Threats)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-soc-bg/60 border border-soc-border/40 rounded-sm"></span>
          <span className="text-soc-muted">Telemetry Logged / Unmapped</span>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mitreMatrixData.map((col) => (
          <div key={col.tactic} className="card-premium p-4 flex flex-col space-y-4">
            {/* Column Tactic Header */}
            <div className="pb-3 border-b border-soc-border/30">
              <div className="bg-gradient-to-r from-soc-accent/10 to-transparent -mx-4 -mt-4 px-4 pt-4 pb-3 rounded-t-xl">
                <h3 className="font-bold text-white text-xs tracking-wider uppercase">{col.tactic}</h3>
                <p className="text-[10px] text-soc-muted mt-1 leading-normal">{col.description}</p>
              </div>
            </div>

            {/* Techniques */}
            <div className="space-y-2 flex-1">
              {col.techniques.map((tech) => {
                const isSelected = selectedTechnique?.id === tech.id;
                const isSearchMatch = highlightMatch(tech.name, tech.id);
                
                let baseClasses = 'bg-soc-bg/40 border-soc-border/30 text-soc-muted';
                if (tech.status === 'active') {
                  baseClasses = 'bg-soc-critical/5 border-soc-critical/20 text-soc-critical hover:bg-soc-critical/10';
                } else if (tech.status === 'covered') {
                  baseClasses = 'bg-soc-accent/5 border-soc-accent/15 text-soc-text/80 hover:bg-soc-accent/10';
                }

                return (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnique(tech)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 relative flex flex-col space-y-1.5 ${baseClasses} ${
                      isSelected ? 'ring-2 ring-soc-accent shadow-glow' : ''
                    } ${isSearchMatch ? 'ring-2 ring-soc-medium' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold opacity-70">{tech.id}</span>
                      {tech.status === 'active' && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-critical opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-soc-critical"></span>
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-zinc-200 truncate pr-4">{tech.name}</span>
                    
                    {tech.detections && (
                      <div className="text-[10px] text-soc-critical font-mono mt-0.5 font-semibold flex items-center space-x-1">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span>{tech.detections} active telemetry events</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer (when technique is clicked) */}
      {selectedTechnique && (
        <div className="card-premium-accent p-6 relative animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-soc-accent bg-soc-accent/10 px-2.5 py-1 rounded-lg border border-soc-accent/20">
                  {selectedTechnique.id}
                </span>
                <span className="text-xs text-soc-muted font-mono">ATT&CK Technique ID</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedTechnique.name}</h3>
            </div>
            
            <button 
              onClick={() => setSelectedTechnique(null)}
              className="text-soc-muted hover:text-white text-xs font-semibold px-3 py-1.5 bg-soc-bg/60 border border-soc-border/30 rounded-lg hover:bg-soc-bg transition-colors"
            >
              Close
            </button>
          </div>

          <p className="text-sm text-soc-text/80 leading-relaxed mt-4 pb-4 border-b border-soc-border/30">
            {selectedTechnique.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs">
              {selectedTechnique.status === 'active' ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-soc-critical" />
                  <span className="text-soc-critical font-medium">Critical coverage alert: live indicators found.</span>
                </>
              ) : selectedTechnique.status === 'covered' ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-soc-low" />
                  <span className="text-soc-low font-medium">Sigma detection rule is actively monitoring this technique.</span>
                </>
              ) : (
                <span className="text-soc-muted">No telemetry log rules configured for this tactic.</span>
              )}
            </div>

            <a 
              href={`https://attack.mitre.org/techniques/${selectedTechnique.id.split('.')[0]}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-soc-accent hover:text-white font-semibold transition-colors group"
            >
              <span>View MITRE Documentation</span>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mitre;
