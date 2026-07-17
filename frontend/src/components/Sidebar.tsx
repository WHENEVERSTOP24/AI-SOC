import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  GitBranch,
  Grid, 
  Play, 
  Settings, 
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Alerts', path: '/alerts', icon: ShieldAlert },
    { name: 'Incident Timeline', path: '/incident', icon: Activity },
    { name: 'Investigation Graph', path: '/investigation', icon: GitBranch },
    { name: 'MITRE ATT&CK', path: '/mitre', icon: Grid },
    { name: 'Attack Simulator', path: '/simulator', icon: Play },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-64 bg-soc-surface border-r border-soc-border/60 z-30 py-5 px-3 flex flex-col justify-between">
      {/* Navigation Links */}
      <nav className="space-y-0.5">
        <div className="px-3 mb-4 text-[10px] font-mono font-semibold text-soc-muted uppercase tracking-[0.15em]">
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-soc-accent/10'
                    : 'text-soc-muted hover:text-white hover:bg-zinc-800/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-soc-accent rounded-full shadow-glow" />
                  )}
                  
                  {/* Icon with fixed width container for alignment */}
                  <span className={`flex items-center justify-center w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-soc-accent' : 'text-soc-muted group-hover:text-white'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer / Documentation Reference */}
      <div className="bg-soc-bg/60 border border-soc-border/40 rounded-xl p-4 hover:border-soc-accent/20 transition-colors">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-soc-accent flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <h4 className="text-xs font-semibold text-zinc-200">Mitigation Guide</h4>
            <p className="text-[10px] text-soc-muted mt-1 leading-relaxed">
              Read our local playbook procedures for host containment.
            </p>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="text-[10px] text-soc-accent hover:text-white font-semibold block mt-2 transition-colors"
            >
              Open Playbook →
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
