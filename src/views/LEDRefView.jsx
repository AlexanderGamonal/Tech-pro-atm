import { useState } from "react";
import { LedDot } from "../components/LedDot";
import { UPPER_LEDS, LOWER_LEDS } from "../data/leds";
import { DIAG_COMMANDS } from "../data/sensors";

// ── shared helpers ────────────────────────────────────────────────────────────

const V = {
    bg:     "var(--c-bg)",
    surf:   "var(--c-surf)",
    card:   "var(--c-card)",
    bd:     "var(--c-border)",
    tx:     "var(--c-text)",
    br:     "var(--c-bright)",
    dm:     "var(--c-dim)",
    ac:     "var(--c-accent)",
    acBg:   "var(--c-accent-bg)",
    acBd:   "var(--c-accent-bd)",
    blue:   "var(--c-blue)",
    amber:  "#f59e0b",
};

function cardStyle() {
    return { background: V.surf, border: `1px solid ${V.bd}`, borderRadius: "0 8px 8px 8px", padding: "14px 12px", marginTop: 0 };
}

function tabStyle(id, active) {
    return {
        flex: 1, padding: "11px 4px",
        background: active ? V.surf : V.bg,
        border: `1px solid ${active ? V.ac : V.bd}`,
        borderBottom: active ? `1px solid ${V.surf}` : `1px solid ${V.bd}`,
        color: active ? V.ac : V.dm,
        cursor: "pointer", fontFamily: "'Orbitron', sans-serif",
        fontSize: "9px", fontWeight: 700, letterSpacing: ".8px",
        textTransform: "uppercase", borderRadius: "6px 6px 0 0",
        transition: "all .2s", position: "relative",
        bottom: active ? "-1px" : "0", zIndex: active ? 1 : 0,
    };
}

function SectionTitle({ children }) {
    return (
        <div style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700,
            color: V.ac, letterSpacing: "1.5px", textTransform: "uppercase",
            margin: "14px 0 10px", paddingBottom: 6, borderBottom: `1px solid ${V.bd}`,
        }}>{children}</div>
    );
}

function BackBtn({ onClick, label }) {
    return (
        <button onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "none", color: V.dm, cursor: "pointer", padding: "10px 0 14px",
            fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif",
        }}>
            <span style={{ fontSize: 18 }}>←</span> {label}
        </button>
    );
}

function LedDetailCard({ led }) {
    return (
        <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 8, overflow: "hidden", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: V.acBg, borderBottom: `1px solid ${V.bd}` }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700, color: V.ac, background: V.acBg, border: `1px solid ${V.acBd}`, minWidth: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{led.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: V.br, lineHeight: 1.2 }}>{led.name}</div>
            </div>
            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
                {led.states.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <LedDot cls={s.cls} size={13} />
                        <span style={{ fontSize: 13, color: V.dm, lineHeight: 1.4 }}>
                            <b style={{ color: V.tx }}>{s.label}</b> — {s.desc}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Interactive LED simulator ─────────────────────────────────────────────────

function toCls(color, state) {
    if (state === 0) return "loff";
    if (color === "red")   return state === 1 ? "rs" : "rf";
    if (color === "amber") return state === 1 ? "as" : "af";
    if (color === "green") return state === 1 ? "gs" : "loff";
    return "loff";
}

const LED_DESCS = {
    upper: {
        red:   ["Sin errores", "Pestillo abierto", "Atasco / Falla"],
        amber: ["Sin avisos", "Reposición necesaria", "Reposición (parpadeando)"],
        green: ["Inoperativo", "Listo para usar", ""],
    },
    inter: {
        red:   ["Sin errores", "Pestillo abierto", "Atasco / Falla"],
        green: ["Inoperativo", "Listo", ""],
    },
    lower: {
        red:   ["Sin errores", "Latch abierto / Cassettes ausentes", "Atasco / Falla"],
        amber: ["Sin avisos", "Reposición necesaria", "Reposición (parpadeando)"],
        green: ["Inoperativo", "Listo para usar", ""],
    },
};

const PRESETS = [
    ["✅ Todo OK",       { upper:{red:0,amber:0,green:1}, inter:{red:0,green:1}, lower:{red:0,amber:0,green:1} }],
    ["🔴 Jam Upper",    { upper:{red:2,amber:0,green:0}, inter:{red:0,green:0}, lower:{red:0,amber:0,green:1} }],
    ["🔴 Jam Inter",    { upper:{red:0,amber:0,green:1}, inter:{red:2,green:0}, lower:{red:0,amber:0,green:1} }],
    ["🔴 Jam Lower",    { upper:{red:0,amber:0,green:1}, inter:{red:0,green:1}, lower:{red:2,amber:0,green:0} }],
    ["🟡 Reposición",   { upper:{red:0,amber:1,green:1}, inter:{red:0,green:1}, lower:{red:0,amber:1,green:1} }],
    ["🔴 Latch abierto",{ upper:{red:1,amber:0,green:0}, inter:{red:0,green:0}, lower:{red:0,amber:0,green:1} }],
    ["⚫ Reset",         { upper:{red:0,amber:0,green:0}, inter:{red:0,green:0}, lower:{red:0,amber:0,green:0} }],
];

function getModuleStatus(id, st) {
    if (!st) return { text: "—", color: V.dm };
    if (st.red === 2)        return { text: "Atasco / Falla grave", color: "var(--c-red)" };
    if (st.red === 1)        return { text: "Pestillo abierto", color: "var(--c-red)" };
    if ((st.amber || 0) >= 1)return { text: "Requiere reposición", color: V.amber };
    if (st.green === 1)      return { text: "Módulo listo", color: "var(--c-green)" };
    return { text: "Inoperativo / Sin energía", color: V.dm };
}

function InteractiveLEDs() {
    const initState = {
        upper: { red: 0, amber: 0, green: 0 },
        inter: { red: 0, green: 0 },
        lower: { red: 0, amber: 0, green: 0 },
    };
    const [leds, setLeds] = useState(initState);

    function cycle(mod, color) {
        setLeds(prev => {
            const cur = prev[mod][color];
            const next = (cur + 1) % 3;
            if (next === 0) {
                // last state → off, leave others untouched
                return { ...prev, [mod]: { ...prev[mod], [color]: 0 } };
            } else {
                // turning on or advancing → reset all others in module to 0
                const reset = Object.fromEntries(
                    Object.keys(prev[mod]).map(k => [k, k === color ? next : 0])
                );
                return { ...prev, [mod]: reset };
            }
        });
    }

    const MODULES = [
        { id: "upper", label: "Upper Module",  colors: ["red", "amber", "green"] },
        { id: "inter", label: "Intermediate",  colors: ["red", "green"] },
        { id: "lower", label: "Lower Module",  colors: ["red", "amber", "green"] },
    ];

    return (
        <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "1.5px", color: V.ac, textTransform: "uppercase", padding: "8px 12px", borderBottom: `1px solid ${V.bd}`, background: V.acBg }}>
                💡 Status Indicator LEDs — click LED para ciclar estado
            </div>
            {MODULES.map(({ id, label, colors }) => {
                const st = leds[id];
                const status = getModuleStatus(id, st);
                return (
                    <div key={id} style={{ padding: "11px 12px", borderBottom: `1px solid ${V.bd}`, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: V.dm, minWidth: 68, flexShrink: 0 }}>{label}</div>
                        <div style={{ display: "flex", gap: 9, background: V.bg, border: `1px solid ${V.bd}`, borderRadius: 6, padding: "7px 10px", flexShrink: 0 }}>
                            {colors.map(color => (
                                <div key={color} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}
                                    onClick={() => cycle(id, color)}>
                                    <LedDot cls={toCls(color, st[color])} size={18} />
                                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: V.dm, letterSpacing: ".5px", textTransform: "uppercase" }}>{color[0]}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: status.color, marginBottom: 2 }}>{status.text}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px" }}>
                                {colors.map(color => {
                                    const s = st[color];
                                    if (s === 0) return null;
                                    return <span key={color} style={{ fontSize: 12, color: V.dm }}>{LED_DESCS[id][color][s]}</span>;
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div style={{ padding: "10px 12px" }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: V.dm, letterSpacing: "1px", marginBottom: 8 }}>// PRESETS RÁPIDOS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {PRESETS.map(([label, state]) => (
                        <button key={label} onClick={() => setLeds(state)} style={{
                            fontSize: 12, padding: "6px 11px", background: V.card,
                            border: `1px solid ${V.bd}`, borderRadius: 6, color: V.tx,
                            cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                        }}>{label}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── BRM Interactive Diagram ───────────────────────────────────────────────────

const BRM_COMPS = [
    { id: "pocket",       name: "Pocket",                           module: "Upper Module", fill: "#1e3a5f", desc: "Bandeja de presentación de billetes al cliente. Recibe los billetes aceptados o retorna los rechazados para que el usuario los retire físicamente.", tags: ["presentación","retorno","cliente"] },
    { id: "exc-upper",    name: "Upper Exception Bin",              module: "Upper Module", fill: "#3b2a4a", desc: "Contenedor de excepciones superior. Almacena temporalmente billetes problemáticos durante el proceso de validación o transporte en el módulo superior.", tags: ["excepciones","rechazo","superior"] },
    { id: "bridge",       name: "Bridge / Centralisation Transport",module: "Upper Module", fill: "#1a3d3d", desc: "Transporte puente de centralización. Conecta los sub-módulos del Upper Module y dirige los billetes hacia el validador, escrow o pocket según el flujo.", tags: ["transporte","centralización","routing"] },
    { id: "escrow",       name: "Escrow",                           module: "Upper Module", fill: "#3a1e3a", desc: "Módulo de retención temporal. Mantiene los billetes en suspenso mientras el sistema confirma la transacción. Si hay error, los billetes se devuelven al cliente.", tags: ["retención","temporal","reversión"] },
    { id: "ut-front",     name: "Upper Transport (Front Side)",     module: "Upper Module", fill: "#2a3a1e", desc: "Transporte superior — lado frontal. Gestiona el movimiento de billetes en la sección delantera del módulo superior, coordinando el flujo desde el pocket hacia el validador.", tags: ["transporte","frontal","superior"] },
    { id: "bill-val",     name: "Bill Validator",                   module: "Upper Module", fill: "#3d2a1a", desc: "Validador de billetes. Verifica autenticidad (UV, IR, magnético, dimensión) y denominación. Núcleo de la aceptación; rechaza billetes falsos o dañados.", tags: ["validación","autenticidad","denominación","sensor"] },
    { id: "ut-rear",      name: "Upper Transport (Rear Side)",      module: "Upper Module", fill: "#1e2a3d", desc: "Transporte superior — lado trasero. Gestiona el movimiento de billetes en la sección posterior del módulo superior, enlazando el validador con el escrow y el bridge.", tags: ["transporte","trasero","superior"] },
    { id: "inter-transp", name: "Intermediate Transport",           module: "Interface",    fill: "#3d3a1a", desc: "Transporte intermedio. Enlace mecánico crítico entre el Upper Module y el Lower Module. Canaliza los billetes validados hacia las cassettes de reciclaje o el cassette de excepciones.", tags: ["interfaz","enlace","módulos"] },
    { id: "lh-transp",    name: "Lower Horizontal Transport",       module: "Lower Module", fill: "#1a3a2a", desc: "Transporte horizontal inferior. Distribuye los billetes a lo largo del módulo inferior, enrutándolos hacia la cassette correcta según las instrucciones del controlador.", tags: ["transporte","horizontal","distribución"] },
    { id: "vert-transp",  name: "Vertical Transport",               module: "Lower Module", fill: "#3a2a1e", desc: "Transporte vertical. Mueve billetes de forma vertical dentro del Lower Module, conectando el transporte horizontal con las cassettes de reciclaje.", tags: ["transporte","vertical","cassettes"] },
    { id: "exc-lower",    name: "Lower Exception Cassette",         module: "Lower Module", fill: "#2a1e3a", desc: "Cassette de excepciones inferior. Almacena definitivamente los billetes que no pudieron ser reciclados ni devueltos: billetes sospechosos, doblados o con error de transporte confirmado.", tags: ["excepciones","almacenamiento","rechazo definitivo"] },
    { id: "rec1",         name: "Recycler Cassette 1",              module: "Lower Module", fill: "#1e3a1e", desc: "Cassette recicladora #1. Almacena y dispensa billetes de una denominación específica. Puede recibir billetes durante depósitos y dispensarlos durante retiros.", tags: ["reciclaje","almacenamiento","dispensación"] },
    { id: "rec2",         name: "Recycler Cassette 2",              module: "Lower Module", fill: "#1e3a1e", desc: "Cassette recicladora #2. Almacena y dispensa billetes de una denominación específica.", tags: ["reciclaje","almacenamiento","dispensación"] },
    { id: "rec3",         name: "Recycler Cassette 3",              module: "Lower Module", fill: "#1e3a1e", desc: "Cassette recicladora #3. Almacena y dispensa billetes de una denominación específica.", tags: ["reciclaje","almacenamiento","dispensación"] },
    { id: "rec4",         name: "Recycler Cassette 4",              module: "Lower Module", fill: "#1e3a1e", desc: "Cassette recicladora #4. Almacena y dispensa billetes de una denominación específica.", tags: ["reciclaje","almacenamiento","dispensación"] },
];

const MOD_COLORS = { "Upper Module": "#58a6ff", "Lower Module": "#3fb950", "Interface": "#d29922" };
const COMP_TEXT  = { fill: "#a0b4cc", textAnchor: "middle", fontSize: 12, fontFamily: "IBM Plex Mono,monospace" };

function BrmDiagram() {
    const [sel, setSel] = useState("pocket");
    const info     = BRM_COMPS.find(c => c.id === sel);
    const modColor = info ? MOD_COLORS[info.module] : "#58a6ff";

    function compStyle(id) {
        const comp = BRM_COMPS.find(c => c.id === id);
        const isSelected = sel === id;
        return {
            fill: comp?.fill || "#1c2733",
            stroke: isSelected ? "#58a6ff" : "#4a90d9",
            strokeWidth: isSelected ? 2.5 : 0.8,
            cursor: "pointer",
            filter: isSelected ? "brightness(1.7)" : "none",
            transition: "all .15s",
        };
    }

    return (
        <div style={{ paddingBottom: 8 }}>
            <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "1.5px", color: "#4a90d9", textTransform: "uppercase", padding: "8px 12px", borderBottom: `1px solid ${V.bd}`, background: "rgba(74,144,217,.06)" }}>
                    📐 BRM — Diagrama de componentes interactivo
                </div>
                <svg viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
                    <rect x="8" y="8" width="544" height="185" rx="5" fill="none" stroke="#4a90d9" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="18" y="20" fontFamily="IBM Plex Mono,monospace" fontSize="9" fill="#4a90d9" letterSpacing="0.08em">UPPER MODULE</text>
                    <rect x="8" y="245" width="544" height="227" rx="5" fill="none" stroke="#4a90d9" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="18" y="257" fontFamily="IBM Plex Mono,monospace" fontSize="9" fill="#4a90d9" letterSpacing="0.08em">LOWER MODULE</text>
                    <line x1="110" y1="95" x2="185" y2="95" stroke="#3a5070" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1="185" y1="95" x2="185" y2="145" stroke="#3a5070" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1="255" y1="95" x2="310" y2="95" stroke="#3a5070" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1="360" y1="95" x2="415" y2="95" stroke="#3a5070" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1="415" y1="95" x2="470" y2="95" stroke="#3a5070" strokeWidth="1" strokeDasharray="4 3" />
                    <line x1="177" y1="193" x2="177" y2="245" stroke="#3a5070" strokeWidth="1" strokeDasharray="4 3" />
                    <g onClick={() => setSel("pocket")} style={{ cursor: "pointer" }}><rect x="16" y="75" width="94" height="110" rx="3" style={compStyle("pocket")} /><text x="63" y="130" {...COMP_TEXT}>Pocket</text></g>
                    <g onClick={() => setSel("exc-upper")} style={{ cursor: "pointer" }}><rect x="122" y="40" width="112" height="56" rx="3" style={compStyle("exc-upper")} /><text x="178" y="65" {...COMP_TEXT}>Upper Exception</text><text x="178" y="79" {...COMP_TEXT}>Bin</text></g>
                    <g onClick={() => setSel("bridge")} style={{ cursor: "pointer" }}><rect x="248" y="40" width="150" height="56" rx="3" style={compStyle("bridge")} /><text x="323" y="62" {...COMP_TEXT}>Bridge/Centralisation</text><text x="323" y="76" {...COMP_TEXT}>Transport</text></g>
                    <g onClick={() => setSel("escrow")} style={{ cursor: "pointer" }}><rect x="414" y="40" width="130" height="145" rx="3" style={compStyle("escrow")} /><text x="479" y="113" {...COMP_TEXT}>Escrow</text></g>
                    <g onClick={() => setSel("ut-front")} style={{ cursor: "pointer" }}><rect x="122" y="108" width="112" height="77" rx="3" style={compStyle("ut-front")} /><text x="178" y="142" {...COMP_TEXT}>Upper Transport</text><text x="178" y="155" {...COMP_TEXT}>(Front Side)</text></g>
                    <g onClick={() => setSel("bill-val")} style={{ cursor: "pointer" }}><rect x="248" y="108" width="100" height="77" rx="3" style={compStyle("bill-val")} /><text x="298" y="143" {...COMP_TEXT}>Bill</text><text x="298" y="156" {...COMP_TEXT}>Validator</text></g>
                    <g onClick={() => setSel("ut-rear")} style={{ cursor: "pointer" }}><rect x="360" y="108" width="48" height="77" rx="3" style={compStyle("ut-rear")} /><text x="384" y="138" {...COMP_TEXT}>Upper</text><text x="384" y="151" {...COMP_TEXT}>Transport</text><text x="384" y="164" {...COMP_TEXT}>(Rear)</text></g>
                    <g onClick={() => setSel("inter-transp")} style={{ cursor: "pointer" }}><rect x="120" y="201" width="115" height="35" rx="3" style={compStyle("inter-transp")} /><text x="177" y="220" {...COMP_TEXT}>Intermediate Transport</text></g>
                    <g onClick={() => setSel("lh-transp")} style={{ cursor: "pointer" }}><rect x="130" y="268" width="412" height="30" rx="3" style={compStyle("lh-transp")} /><text x="336" y="283" {...COMP_TEXT}>Lower Horizontal Transport</text></g>
                    <g onClick={() => setSel("vert-transp")} style={{ cursor: "pointer" }}><rect x="125" y="302" width="22" height="160" rx="3" style={compStyle("vert-transp")} /><text x="115" y="368" transform="rotate(-90,133,365)" fontSize="9" fontFamily="IBM Plex Mono,monospace" fill="#a0b4cc" textAnchor="middle">Vertical Transport</text></g>
                    <g onClick={() => setSel("exc-lower")} style={{ cursor: "pointer" }}><rect x="16" y="268" width="100" height="195" rx="3" style={compStyle("exc-lower")} /><text x="66" y="355" {...COMP_TEXT}>Lower</text><text x="66" y="369" {...COMP_TEXT}>Exception</text><text x="66" y="383" {...COMP_TEXT}>Cassette</text></g>
                    {[["rec1",158],["rec2",255],["rec3",353],["rec4",452]].map(([id, x], i) => (
                        <g key={id} onClick={() => setSel(id)} style={{ cursor: "pointer" }}>
                            <rect x={x} y="302" width="89" height="161" rx="3" style={compStyle(id)} />
                            <text x={x+44} y="378" {...COMP_TEXT}>Recycler</text>
                            <text x={x+44} y="391" {...COMP_TEXT}>Cassette {i+1}</text>
                        </g>
                    ))}
                </svg>
            </div>
            {info && (
                <div style={{ background: V.surf, border: `1px solid ${modColor}40`, borderRadius: 10, padding: "14px", animation: "fi .2s ease" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: V.br, marginBottom: 6 }}>{info.name}</div>
                    <div style={{ display: "inline-block", fontSize: 11, fontFamily: "'Share Tech Mono', monospace", color: modColor, background: `${modColor}18`, border: `1px solid ${modColor}40`, borderRadius: 4, padding: "2px 8px", marginBottom: 10 }}>{info.module}</div>
                    <div style={{ fontSize: 13, color: V.dm, lineHeight: 1.6, marginBottom: 10 }}>{info.desc}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {info.tags.map(t => (
                            <span key={t} style={{ fontSize: 11, color: "#58a6ff", background: "rgba(88,166,255,.08)", border: "1px solid rgba(88,166,255,.2)", borderRadius: 4, padding: "2px 8px" }}>{t}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function LEDRefView() {
    const [section, setSection] = useState(null);
    const [ledTab,  setLedTab]  = useState("overview");

    const header = (
        <div style={{ textAlign: "center", padding: "14px 0 8px", borderBottom: `1px solid ${V.bd}`, marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: V.br, letterSpacing: 1, lineHeight: 1.15, margin: 0 }}>
                BRM <span style={{ color: V.ac }}>Referencia</span>
            </h2>
            <div style={{ fontSize: 11, color: V.dm, marginTop: 3, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1.5px" }}>NCR 6683/6687 · Cajero Reciclador</div>
            <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${V.ac}, transparent)`, margin: "8px auto 0" }} />
        </div>
    );

    // ── Level 1 ──────────────────────────────────────────────────────────────
    if (!section) {
        const cards = [
            { id: "diagram", icon: "📐", title: "Diagrama BRM",     sub: "NCR 6687 / 6683", desc: "Componentes interactivos del módulo", color: "#4a90d9", bg: "rgba(74,144,217,.07)" },
            { id: "leds",    icon: "💡", title: "LEDs Status",       sub: "Indicadores 1–16", desc: "Estado de LEDs por módulo",          color: V.ac,      bg: V.acBg },
            { id: "ras",     icon: "🛠", title: "RAS / Diagnóstico", sub: "Direct Command",   desc: "Comandos de diagnóstico BRM",        color: V.amber,   bg: "rgba(245,158,11,.07)" },
        ];
        return (
            <div style={{ padding: "14px 8px 32px", animation: "fi .3s ease" }}>
                {header}
                <div style={{ padding: "0 14px" }}>
                    <div style={{ fontSize: 13, color: V.dm, marginBottom: 14 }}>Selecciona una sección:</div>
                    {cards.map(({ id, icon, title, sub, desc, color, bg }) => (
                        <div key={id} className="nc" onClick={() => setSection(id)}
                            style={{ margin: "6px 0", padding: "16px", background: V.card, borderRadius: 12, border: `1px solid ${V.bd}`, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,.15)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 10, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                                    {icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: V.br }}>{title}</div>
                                    <div style={{ fontSize: 12, color, fontFamily: "'Share Tech Mono', monospace", marginTop: 2 }}>{sub}</div>
                                    <div style={{ fontSize: 13, color: V.dm, marginTop: 2 }}>{desc}</div>
                                </div>
                                <span style={{ fontSize: 20, color: V.dm }}>→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── BRM Diagram ──────────────────────────────────────────────────────────
    if (section === "diagram") {
        return (
            <div style={{ padding: "14px 8px 32px", animation: "fi .3s ease" }}>
                {header}
                <div style={{ padding: "0 14px" }}>
                    <BackBtn onClick={() => setSection(null)} label="Volver" />
                    <BrmDiagram />
                </div>
            </div>
        );
    }

    // ── RAS / Diagnóstico ────────────────────────────────────────────────────
    if (section === "ras") {
        return (
            <div style={{ padding: "14px 8px 32px", animation: "fi .3s ease" }}>
                {header}
                <div style={{ padding: "0 14px" }}>
                    <BackBtn onClick={() => setSection(null)} label="Volver" />
                    <SectionTitle>COMANDOS RAS / DIAGNÓSTICO</SectionTitle>
                    <div style={{ fontSize: 13, color: V.dm, marginBottom: 12, lineHeight: 1.6 }}>
                        Ejecutar desde <b style={{ color: V.tx }}>Supervisor Mode → Diagnostics → Direct Command</b>.
                    </div>
                    {DIAG_COMMANDS.map(([cmd, desc]) => (
                        <div key={cmd} style={{ display: "flex", gap: 14, alignItems: "center", background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 8, padding: "13px 14px", marginBottom: 7 }}>
                            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, fontWeight: 700, color: V.amber, minWidth: 72, letterSpacing: ".06em", flexShrink: 0 }}>{cmd}</span>
                            <span style={{ fontSize: 13, color: V.tx, flex: 1 }}>{desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── LEDs ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ padding: "14px 8px 32px", animation: "fi .3s ease" }}>
            {header}
            <div style={{ padding: "0 8px" }}>
                <div style={{ padding: "0 6px" }}>
                    <BackBtn onClick={() => setSection(null)} label="Volver" />
                </div>
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${V.bd}`, marginBottom: 0 }}>
                    {[["overview", "General"], ["upper", "Upper (1-9)"], ["lower", "Lower (10-16)"]].map(([id, label]) => (
                        <button key={id} className="nf" onClick={() => setLedTab(id)} style={tabStyle(id, ledTab === id)}>{label}</button>
                    ))}
                </div>

                {ledTab === "overview" && (
                    <div style={cardStyle()}>
                        <InteractiveLEDs />
                        <SectionTitle>REFERENCIA — Estado General</SectionTitle>
                        {[
                            { title: "UPPER MODULE", rows: [
                                { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
                                { cls: "rf", label: "ROJO FLASH",  desc: "Atasco / Falla" },
                                { cls: "as", label: "ÁMBAR",       desc: "Para reabastecimiento" },
                                { cls: "loff", label: "VERDE OFF", desc: "Inoperativo" },
                                { cls: "gs", label: "VERDE SÓLIDO",desc: "Listo para usar" },
                            ]},
                            { title: "LOWER MODULE", rows: [
                                { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto o cassettes ausentes" },
                                { cls: "rf", label: "ROJO FLASH",  desc: "Atasco / Falla" },
                                { cls: "as", label: "ÁMBAR",       desc: "Para reabastecimiento" },
                                { cls: "loff", label: "VERDE OFF", desc: "Inoperativo" },
                                { cls: "gs", label: "VERDE SÓLIDO",desc: "Listo para usar" },
                            ]},
                        ].map(({ title, rows }) => (
                            <div key={title} style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700, color: V.br, letterSpacing: "1px", padding: "8px 12px", background: V.acBg, borderBottom: `1px solid ${V.bd}` }}>{title}</div>
                                <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
                                    {rows.map((r, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                            <LedDot cls={r.cls} />
                                            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: V.dm, minWidth: 90, flexShrink: 0, marginTop: 1 }}>{r.label}</span>
                                            <span style={{ fontSize: 13, color: V.tx }}>{r.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {ledTab === "upper" && (
                    <div style={cardStyle()}>
                        <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "1.5px", color: V.ac, textTransform: "uppercase", padding: "8px 11px", borderBottom: `1px solid ${V.bd}`, background: V.acBg }}>
                                📐 Upper Module — LEDs 1–9
                            </div>
                            <img src="/brm-upper.png" alt="Upper Module LED Diagram" style={{ width: "100%", display: "block" }} />
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: V.dm, padding: "6px 11px", letterSpacing: ".5px", borderTop: `1px solid ${V.bd}`, textAlign: "center" }}>
                                Individual Area Status Indicator Light Panels
                            </div>
                        </div>
                        <SectionTitle>LEDs 1–9 · Estado detallado</SectionTitle>
                        {UPPER_LEDS.map(led => <LedDetailCard key={led.n} led={led} />)}
                    </div>
                )}

                {ledTab === "lower" && (
                    <div style={cardStyle()}>
                        <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "1.5px", color: V.ac, textTransform: "uppercase", padding: "8px 11px", borderBottom: `1px solid ${V.bd}`, background: V.acBg }}>
                                📐 Lower Module — LEDs 10–16
                            </div>
                            <img src="/brm-lower.png" alt="Lower Module LED Diagram" style={{ width: "100%", display: "block" }} />
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: V.dm, padding: "6px 11px", letterSpacing: ".5px", borderTop: `1px solid ${V.bd}`, textAlign: "center" }}>
                                Individual Area Status Indicator Light Panels
                            </div>
                        </div>
                        <SectionTitle>LEDs 10–16 · Estado detallado</SectionTitle>
                        {LOWER_LEDS.map(led => <LedDetailCard key={led.n} led={led} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
