export const CSS_ID = "ncr-unified-theme";

export function applyTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
}

export function injectCSS() {
    if (document.getElementById(CSS_ID)) return;
    const el = document.createElement("style");
    el.id = CSS_ID;
    el.textContent = `
    /* ── DARK THEME ── */
    :root, [data-theme="dark"] {
      --c-bg:        #0a0c10;
      --c-surf:      #111418;
      --c-card:      #181c22;
      --c-border:    #2a3040;
      --c-text:      #c8d6e8;
      --c-bright:    #f0f6ff;
      --c-dim:       #5c7080;
      --c-accent:    #00d4ff;
      --c-accent-bg: rgba(0,212,255,.07);
      --c-accent-bd: rgba(0,212,255,.38);
      --c-red:       #f43f5e;
      --c-red-bg:    rgba(244,63,94,.07);
      --c-red-bd:    rgba(244,63,94,.40);
      --c-green:     #22c55e;
      --c-green-bg:  rgba(34,197,94,.07);
      --c-green-bd:  rgba(34,197,94,.40);
      --c-blue:      #38bdf8;
      --c-blue-bg:   rgba(56,189,248,.07);
      --c-blue-bd:   rgba(56,189,248,.38);
      --c-purple:    #a78bfa;
      --c-purple-bg: rgba(167,139,250,.07);
      --c-purple-bd: rgba(167,139,250,.38);
      --c-nav-bg:    rgba(17,20,24,.97);
      --c-header-bg: rgba(17,20,24,.95);
      --c-grid:      rgba(0,212,255,.022);
    }

    /* ── LIGHT THEME ── */
    [data-theme="light"] {
      --c-bg:        #f0f4f8;
      --c-surf:      #e4eaf1;
      --c-card:      #ffffff;
      --c-border:    #c8d4e0;
      --c-text:      #2e4056;
      --c-bright:    #0a1628;
      --c-dim:       #7a90a8;
      --c-accent:    #0090b3;
      --c-accent-bg: rgba(0,144,179,.07);
      --c-accent-bd: rgba(0,144,179,.38);
      --c-red:       #d92847;
      --c-red-bg:    rgba(217,40,71,.07);
      --c-red-bd:    rgba(217,40,71,.38);
      --c-green:     #1a9458;
      --c-green-bg:  rgba(26,148,88,.07);
      --c-green-bd:  rgba(26,148,88,.38);
      --c-blue:      #2576cc;
      --c-blue-bg:   rgba(37,118,204,.07);
      --c-blue-bd:   rgba(37,118,204,.38);
      --c-purple:    #6840d0;
      --c-purple-bg: rgba(104,64,208,.07);
      --c-purple-bd: rgba(104,64,208,.38);
      --c-nav-bg:    rgba(236,241,247,.97);
      --c-header-bg: rgba(236,241,247,.95);
      --c-grid:      rgba(0,100,140,.025);
    }

    body {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-family: 'Rajdhani', sans-serif;
      margin: 0;
      transition: background-color .25s, color .25s;
    }

    .bg-grid {
      position: fixed; inset: 0; z-index: -1;
      background-image:
        linear-gradient(var(--c-grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--c-grid) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    @keyframes flash    { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    @keyframes ledFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.1; } }
    @keyframes fi  { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes nF  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }

    .font-orbitron { font-family: 'Orbitron', sans-serif; }
    .font-mono     { font-family: 'Share Tech Mono', monospace; }

    .card-cyber {
      background: var(--c-card);
      border: 1px solid var(--c-border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: background .25s, border-color .25s;
    }

    .led { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .led-flash { animation: flash 0.7s infinite; }

    .ns { -ms-overflow-style: none; scrollbar-width: none; }
    .ns::-webkit-scrollbar { display: none; }
    .nf { outline: none; -webkit-tap-highlight-color: transparent; }
    .nc { outline: none; -webkit-tap-highlight-color: transparent; }
    .ni { outline: none; }
    .ni::placeholder { color: var(--c-dim); }
  `;
    document.head.appendChild(el);
}

// ── Theme token object (CSS variable references) ─────────────────────────────
export const theme = {
    bg:    "var(--c-bg)",
    bg2:   "var(--c-surf)",
    card:  "var(--c-card)",
    bd:    "var(--c-border)",
    tx:    "var(--c-text)",
    br:    "var(--c-bright)",
    dm:    "var(--c-dim)",
    // Accent (cyan)
    am:    "var(--c-accent)",
    amG:   "var(--c-accent-bg)",
    amBd:  "var(--c-accent-bd)",
    // Red
    rd:    "var(--c-red)",
    rdB:   "var(--c-red-bg)",
    rdBd:  "var(--c-red-bd)",
    // Green
    gn:    "var(--c-green)",
    gnB:   "var(--c-green-bg)",
    gnBd:  "var(--c-green-bd)",
    // Blue
    bl:    "var(--c-blue)",
    blB:   "var(--c-blue-bg)",
    blBd:  "var(--c-blue-bd)",
    // Purple
    pr:    "var(--c-purple)",
    prB:   "var(--c-purple-bg)",
    prBd:  "var(--c-purple-bd)",
};

export const fonts = {
    display: "'Rajdhani', sans-serif",
    mono:    "'Share Tech Mono', monospace",
};

export function getCategoryColor(cat) {
    const map = {
        Sensor: theme.bl, Mechanism: theme.rd, Jam: theme.rd,
        Communication: theme.am, Security: theme.pr, Interlock: theme.am,
        Pick: theme.rd, Cassette: theme.gn, Board: theme.bl,
        Shutter: theme.am, General: theme.dm, "Bill Validator": theme.gn,
        Firmware: theme.bl, Maintenance: theme.gn, Reject: theme.rd,
        Command: theme.dm, Configuration: theme.am, Memory: theme.bl,
        Request: theme.am, Discard: theme.rd, SNR: theme.bl,
    };
    return map[cat] || theme.dm;
}

export function getCategoryLabel(cat) {
    const map = {
        General: "General", Memory: "Memoria", Communication: "Comunicación",
        Security: "Seguridad", Interlock: "Interlock", Request: "Solicitud",
        Configuration: "Configuración", Sensor: "Sensor", Mechanism: "Mecanismo",
        Jam: "Atasco/Jam", Pick: "Pique/Pick", Discard: "Descarte",
        SNR: "Nro. Serie", "Bill Validator": "Validador", Shutter: "Shutter",
        Board: "Placa/Board", Command: "Comando", Firmware: "Firmware",
        Maintenance: "Mantenimiento", Reject: "Rechazo", Cassette: "Cassette",
    };
    return map[cat] || cat;
}
