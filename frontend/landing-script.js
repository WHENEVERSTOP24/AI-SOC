// ── Terminal scenarios ──
const scenarios = {
  ransomware: {
    title: 'AI-SOC Engine · Ransomware Kill Chain',
    lines: [
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '<span class="t-cyan">AI-SOC</span> <span class="t-dim">v2.1.0 · Threat Analysis Engine</span>' },
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[INGEST]</span> <span class="t-output">Receiving event stream · 1,847 events/sec</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[ALERT]</span> <span class="t-err">SIGMA-HIT: suspicious_macro_execution</span>' },
      { cls: 'mono', html: '         <span class="t-dim">host=WIN-FIN-07 · user=jdoe · proc=EXCEL.EXE</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[ALERT]</span> <span class="t-err">SIGMA-HIT: powershell_encoded_command</span>' },
      { cls: 'mono', html: '         <span class="t-dim">cmd=cmd.exe /c powershell -enc SGVsbG8gV29ybGQ=</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-cyan">Reasoning over alert cluster...</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-output">Pattern: T1566.001 → T1059.001 → T1021.002</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-output">Assessment: Ransomware kill chain in progress.</span>' },
      { cls: 'mono', html: '         <span class="t-dim">Macro delivery → PS execution → lateral move via SMB</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[SCORE]</span> <span class="t-err">Severity: CRITICAL (9.4/10)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[TACTIC]</span><span class="t-warn"> TA0002 Execution → TA0008 Lateral Movement</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-warn">Executing playbook: RANSOMWARE_CONTAIN_V3</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ WIN-FIN-07 isolated from network segment</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ Memory snapshot captured to forensics store</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ Case #SOC-2847 opened in TheHive</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ PagerDuty alert dispatched to on-call team</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-ok">━━━ THREAT CONTAINED in 1.84 seconds ━━━</span>' },
    ]
  },
  apt: {
    title: 'AI-SOC Engine · APT Intrusion Detection',
    lines: [
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '<span class="t-cyan">AI-SOC</span> <span class="t-dim">v2.1.0 · APT Analysis Module</span>' },
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[INGEST]</span> <span class="t-output">Zeek conn.log: anomalous beacon pattern detected</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[ALERT]</span> <span class="t-err">Periodic C2 beacon: 300s interval ±2s jitter</span>' },
      { cls: 'mono', html: '         <span class="t-dim">dst=185.220.101.47:443 · cert_subject=*.google.com (SPOOFED)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[INTEL]</span> <span class="t-err">OTX Hit: Cobalt Strike Team Server (conf: 94%)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[INTEL]</span> <span class="t-err">AbuseIPDB Score: 98/100</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[ALERT]</span> <span class="t-warn">T1003.001: LSASS memory read via procdump.exe</span>' },
      { cls: 'mono', html: '         <span class="t-dim">user=SYSTEM · parent=cmd.exe → procdump.exe lsass</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-cyan">Correlating across 3 hosts, 6h window...</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-output">Campaign: Spearphish → Cobalt Strike → Cred Harvest</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-output">Threat Actor Resemblance: APT29 (Cozy Bear) TTPs</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[SCORE]</span> <span class="t-err">Severity: CRITICAL (9.8/10)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ C2 IP blocked at perimeter firewall</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ Affected accounts locked pending investigation</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ Forensic package assembled for IR team</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-ok">━━━ APT CAMPAIGN DISRUPTED in 2.1 seconds ━━━</span>' },
    ]
  },
  insider: {
    title: 'AI-SOC Engine · Insider Threat Detection',
    lines: [
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '<span class="t-cyan">AI-SOC</span> <span class="t-dim">v2.1.0 · UEBA + Insider Threat Module</span>' },
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[UEBA]</span>  <span class="t-warn">Baseline deviation: user=msmith · score=+4.2σ</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[UEBA]</span>  <span class="t-output">Accessed 847 files in /finance/confidential/ (2h)</span>' },
      { cls: 'mono', html: '         <span class="t-dim">Normal pattern: 12 files/day avg over 90 days</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[ALERT]</span> <span class="t-err">USB mass storage device mounted · 14:23 UTC</span>' },
      { cls: 'mono', html: '         <span class="t-dim">host=WIN-MSMITH-LT · VID=0781 PID=5567 (SanDisk 128GB)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[ALERT]</span> <span class="t-err">Large outbound copy event · 2.3GB to removable media</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-cyan">Reasoning: UEBA spike + file access + USB copy...</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-err">HIGH CONFIDENCE: Data exfiltration via physical media</span>' },
      { cls: 'mono', html: '         <span class="t-dim">T1005 (Local Data) → T1052.001 (USB Exfil)</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[SCORE]</span> <span class="t-err">Severity: HIGH (8.6/10)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ DLP policy enforced — future USB writes blocked</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ HR &amp; Legal notified via encrypted channel</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ Evidence preserved with chain of custody log</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-ok">━━━ INSIDER THREAT CONTAINED in 1.2 seconds ━━━</span>' },
    ]
  },
  c2: {
    title: 'AI-SOC Engine · C2 Beacon Analysis',
    lines: [
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '<span class="t-cyan">AI-SOC</span> <span class="t-dim">v2.1.0 · Network Forensics Module</span>' },
      { cls: 'mono', html: '<span class="t-dim">──────────────────────────────────────────────────────────</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[NET]</span>   <span class="t-output">Analysing Zeek conn.log · last 24h window</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[NET]</span>   <span class="t-warn">Beaconing pattern identified: 3 hosts</span>' },
      { cls: 'mono', html: '         <span class="t-dim">WIN-DEV-12 | WIN-MKTG-03 | WIN-HR-09</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[NET]</span>   <span class="t-output">dst=104.21.88.43:443 · interval=300.0s · σ=1.7s</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[NET]</span>   <span class="t-output">Bytes sent: 482B avg · Bytes recv: 12KB avg</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[TLS]</span>   <span class="t-err">JA3 fingerprint match: Cobalt Strike default profile</span>' },
      { cls: 'mono', html: '         <span class="t-dim">JA3: 72a7c4bb5f4c1dddf2a0e7de15b03b87</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[INTEL]</span> <span class="t-err">ASN: AS13335 (Cloudflare) — C2 domain fronting</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[INTEL]</span> <span class="t-err">MISP Tag: cobalt-strike · threat-actor:TA505</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-cyan">Assessing campaign scope...</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[LLM]</span>   <span class="t-err">Active Cobalt Strike implants on 3 endpoints.</span>' },
      { cls: 'mono', html: '         <span class="t-output">Domain fronting via Cloudflare masks true C2 origin.</span>' },
      { cls: 'mono', html: '         <span class="t-output">TTPs align with TA505 ransomware precursor activity.</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-prompt">[SCORE]</span> <span class="t-err">Severity: CRITICAL (9.6/10)</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ 3 hosts isolated · egress traffic terminated</span>' },
      { cls: 'mono', html: '<span class="t-prompt">[SOAR]</span>  <span class="t-ok">✓ C2 domains/IPs pushed to DNS sinkholes</span>' },
      { cls: 'mono', html: '' },
      { cls: 'mono', html: '<span class="t-ok">━━━ C2 INFRASTRUCTURE SEVERED in 1.97 seconds ━━━</span>' },
    ]
  }
};

let currentAnimation = null;

function runScenario(key) {
  // Update active button
  document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const sc = scenarios[key];
  document.getElementById('term-title').textContent = sc.title;

  const output = document.getElementById('terminal-output');
  output.innerHTML = '';

  if (currentAnimation) clearTimeout(currentAnimation);

  let i = 0;
  function nextLine() {
    if (i >= sc.lines.length) return;
    const line = sc.lines[i];
    const el = document.createElement('div');
    el.innerHTML = line.html || '&nbsp;';
    output.appendChild(el);
    // Auto-scroll
    document.getElementById('term-body').scrollTop = 99999;
    i++;
    currentAnimation = setTimeout(nextLine, i < 5 ? 60 : i < 12 ? 90 : 70);
  }
  nextLine();
}
async function runLiveAnalysis() {

  document.querySelectorAll('.scenario-btn')
    .forEach(btn => btn.classList.remove('active'));

  document.getElementById('term-title').textContent =
    "AI-SOC Engine · Live Sysmon Analysis";

  const output = document.getElementById('terminal-output');

  output.innerHTML = `
  <div class="mono">
    <span class="t-cyan">Connecting to AI Backend...</span>
  </div>
  `;

  try {

    const response = await fetch("http://127.0.0.1:8000/analyze");

    if (!response.ok) {
      throw new Error("Backend returned " + response.status);
    }

    const data = await response.json();

    output.innerHTML = `
<pre style="white-space:pre-wrap;color:#d1d5db;font-family:inherit;">
${data.analysis}
</pre>
`;

  } catch (err) {

    output.innerHTML = `
<div class="mono">
<span class="t-err">Connection Failed</span>

${err}
</div>
`;

  }

}
// Run default on load
window.addEventListener('load', () => {
  setTimeout(() => runScenario('ransomware'), 600);
});

// ── Scroll animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Pulsing dashboard metrics ──
function pulseMetrics() {
  const vals = ['11','14','16','12','13'];
  const el = document.querySelector('.dash-metric-value.danger');
  if (!el) return;
  let idx = 0;
  setInterval(() => {
    el.textContent = vals[idx++ % vals.length];
  }, 3000);
}
window.addEventListener('load', pulseMetrics);