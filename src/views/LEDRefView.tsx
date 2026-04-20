import { useState, SVGProps, ReactNode, CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LedDot } from "../components/LedDot";
import { Sec, ICONS, BackButton } from "../components/ui";
import { theme, fonts } from "../theme";

// ── Data Imports ─────────────────────────────────────────────────────────────
// BRM
import { UPPER_LEDS, LOWER_LEDS } from "../data/devices/ncr/brm/leds";
import { DIAG_COMMANDS } from "../data/devices/ncr/brm/commands";
import { BRM_COMPS, MOD_COLORS } from "../data/devices/ncr/brm/diagram";

// S2
import { SENSOR_TYPES } from "../data/shared/sensors";
import { S2_UNITS, S2_SENSORS } from "../data/devices/ncr/s2/mdata";

// ── shared helpers ────────────────────────────────────────────────────────────
const V = {
    ...theme,
    ac:    theme.am,
    acBg:  theme.amG,
    acBd:  theme.amBd,
    surf:  theme.bg2,
    amber: "#f59e0b",
};

function cardStyle() {
    return { background: V.surf, border: `1px solid ${V.bd}`, borderRadius: "0 8px 8px 8px", padding: "14px 12px", marginTop: 0 };
}

function tabStyle(_id: string, active: boolean): CSSProperties {
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

function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <div style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700,
            color: V.ac, letterSpacing: "1.5px", textTransform: "uppercase",
            margin: "14px 0 10px", paddingBottom: 6, borderBottom: `1px solid ${V.bd}`,
        }}>{children}</div>
    );
}



type LedEntry = { n: number; name: string; states: { cls: string; label: string; desc: string }[] };
function LedDetailCard({ led }: { led: LedEntry }) {
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
const LED_DESCS = {
    upper: {
        red:   ["Sin errores", "Latch abierto", "Atasco / Falla"],
        amber: ["Sin avisos", "Reposición necesaria", "Reposición (parpadeando)"],
        green: ["Inoperativo", "Listo para usar", ""],
    },
    inter: {
        red:   ["Sin errores", "Latch abierto", "Atasco / Falla"],
        green: ["Inoperativo", "Listo", ""],
    },
    lower: {
        red:   ["Sin errores", "Latch abierto / Cassettes ausentes", "Atasco / Falla"],
        amber: ["Sin avisos", "Reposición necesaria", "Reposición (parpadeando)"],
        green: ["Inoperativo", "Listo para usar", ""],
    },
};

const PRESETS: [string, LedSimState][] = [
    ["✅ Todo OK",       { upper:{red:0,amber:0,green:1}, inter:{red:0,green:1}, lower:{red:0,amber:0,green:1} }],
    ["🔴 Jam Upper",    { upper:{red:2,amber:0,green:0}, inter:{red:0,green:0}, lower:{red:0,amber:0,green:1} }],
    ["🔴 Jam Inter",    { upper:{red:0,amber:0,green:1}, inter:{red:2,green:0}, lower:{red:0,amber:0,green:1} }],
    ["🔴 Jam Lower",    { upper:{red:0,amber:0,green:1}, inter:{red:0,green:1}, lower:{red:2,amber:0,green:0} }],
    ["🟡 Reposición",   { upper:{red:0,amber:1,green:1}, inter:{red:0,green:1}, lower:{red:0,amber:1,green:1} }],
    ["🔴 Latch abierto",{ upper:{red:1,amber:0,green:0}, inter:{red:0,green:0}, lower:{red:0,amber:0,green:1} }],
    ["⚫ Reset",         { upper:{red:0,amber:0,green:0}, inter:{red:0,green:0}, lower:{red:0,amber:0,green:0} }],
];

type LedModState = { red: number; amber?: number; green: number };
type LedSimState = { upper: LedModState; inter: LedModState; lower: LedModState };

function InteractiveLEDs() {
    const initState: LedSimState = {
        upper: { red: 0, amber: 0, green: 0 },
        inter: { red: 0, green: 0 },
        lower: { red: 0, amber: 0, green: 0 },
    };
    const [leds, setLeds] = useState<LedSimState>(initState);

    function toCls(color: string, state: number): string {
        if (state === 0) return "loff";
        if (color === "red")   return state === 1 ? "rs" : "rf";
        if (color === "amber") return state === 1 ? "as" : "af";
        if (color === "green") return state === 1 ? "gs" : "loff";
        return "loff";
    }

    function cycle(mod: keyof LedSimState, color: string) {
        setLeds(prev => {
            const cur = (prev[mod] as Record<string, number>)[color];
            const next = (cur + 1) % 3;
            if (next === 0) {
                return { ...prev, [mod]: { ...prev[mod], [color]: 0 } };
            } else {
                const reset = Object.fromEntries(Object.keys(prev[mod]).map(k => [k, k === color ? next : 0]));
                return { ...prev, [mod]: reset };
            }
        });
    }

    const MODULES = [
        { id: "upper", label: "Upper Module",  colors: ["red", "amber", "green"] },
        { id: "inter", label: "Intermediate",  colors: ["red", "green"] },
        { id: "lower", label: "Lower Module",  colors: ["red", "amber", "green"] },
    ];

    function getModuleStatus(_id: string, st: LedModState | undefined) {
        if (!st) return { text: "—", color: V.dm };
        if (st.red === 2)        return { text: "Atasco / Falla grave", color: "var(--c-red)" };
        if (st.red === 1)        return { text: "Latch abierto", color: "var(--c-red)" };
        if ((st.amber || 0) >= 1)return { text: "Requiere reposición", color: V.amber };
        if (st.green === 1)      return { text: "Módulo listo", color: "var(--c-green)" };
        return { text: "Inoperativo / Sin energía", color: V.dm };
    }

    return (
        <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "1.5px", color: V.ac, textTransform: "uppercase", padding: "8px 12px", borderBottom: `1px solid ${V.bd}`, background: V.acBg }}>
                💡 Status Indicator LEDs 
            </div>
            {MODULES.map(({ id, label, colors }) => {
                const st = leds[id as keyof LedSimState];
                const status = getModuleStatus(id, st);
                return (
                    <div key={id} style={{ padding: "11px 12px", borderBottom: `1px solid ${V.bd}`, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: V.dm, minWidth: 68, flexShrink: 0 }}>{label}</div>
                        <div style={{ display: "flex", gap: 9, background: V.bg, border: `1px solid ${V.bd}`, borderRadius: 6, padding: "7px 10px", flexShrink: 0 }}>
                            {colors.map(color => (
                                <div key={color} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}
                                    onClick={() => cycle(id as keyof LedSimState, color)}>
                                    <LedDot cls={toCls(color, (st as Record<string, number>)[color])} size={18} />
                                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: V.dm, letterSpacing: ".5px", textTransform: "uppercase" }}>{color[0]}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: status.color, marginBottom: 2 }}>{status.text}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px" }}>
                                {colors.map(color => {
                                    const s = (st as Record<string, number>)[color];
                                    if (s === 0) return null;
                                    return <span key={color} style={{ fontSize: 12, color: V.dm }}>{(LED_DESCS as Record<string, Record<string, string[]>>)[id]?.[color]?.[s]}</span>;
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
const COMP_TEXT: SVGProps<SVGTextElement> = { fill: "#c8dcea", textAnchor: "middle", fontSize: 12, fontFamily: "IBM Plex Mono,monospace", fontWeight: "600" };

function BrmDiagram() {
    const [sel, setSel] = useState("pocket");
    const info     = BRM_COMPS.find(c => c.id === sel);
    const modColor = info ? (MOD_COLORS as Record<string, string>)[info.module] ?? "#58a6ff" : "#58a6ff";

    function compStyle(id: string) {
        const comp = BRM_COMPS.find(c => c.id === id);
        const isSelected = sel === id;
        return {
            fill: comp?.fill || "#1c2733",
            stroke: isSelected ? "#58a6ff" : "#253a52",
            strokeWidth: isSelected ? 3 : 1,
            cursor: "pointer",
            filter: isSelected ? "brightness(1.8) saturate(1.6)" : "brightness(1.1)",
            transition: "all .15s",
        };
    }

    return (
        <div style={{ paddingBottom: 8 }}>
            <div style={{ background: V.surf, border: `1px solid ${V.bd}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "1.5px", color: "#4a90d9", textTransform: "uppercase", padding: "8px 12px", borderBottom: `1px solid ${V.bd}`, background: "rgba(74,144,217,.06)" }}>
                    📐 BRM — Diagrama de componentes 
                </div>
                <svg viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    {/* Background */}
                    <rect x="0" y="0" width="560" height="480" fill="#0c1520" />
                    {/* Module areas */}
                    <rect x="8" y="8" width="544" height="185" rx="6" fill="rgba(88,166,255,0.04)" stroke="#3a6fa0" strokeWidth="1.5" strokeDasharray="5 3" />
                    <text x="20" y="22" fontFamily="IBM Plex Mono,monospace" fontSize="10" fill="#6aaee8" letterSpacing="0.12em" fontWeight="700">UPPER MODULE</text>
                    <rect x="8" y="245" width="544" height="227" rx="6" fill="rgba(63,185,80,0.04)" stroke="#2e7a40" strokeWidth="1.5" strokeDasharray="5 3" />
                    <text x="20" y="258" fontFamily="IBM Plex Mono,monospace" fontSize="10" fill="#4ec468" letterSpacing="0.12em" fontWeight="700">LOWER MODULE</text>
                    {/* Flow lines */}
                    <line x1="110" y1="95" x2="185" y2="95" stroke="#2e5070" strokeWidth="1.5" strokeDasharray="5 3" />
                    <line x1="185" y1="95" x2="185" y2="145" stroke="#2e5070" strokeWidth="1.5" strokeDasharray="5 3" />
                    <line x1="255" y1="95" x2="310" y2="95" stroke="#2e5070" strokeWidth="1.5" strokeDasharray="5 3" />
                    <line x1="360" y1="95" x2="415" y2="95" stroke="#2e5070" strokeWidth="1.5" strokeDasharray="5 3" />
                    <line x1="415" y1="95" x2="470" y2="95" stroke="#2e5070" strokeWidth="1.5" strokeDasharray="5 3" />
                    <line x1="177" y1="193" x2="177" y2="245" stroke="#c8a020" strokeWidth="1.8" strokeDasharray="5 3" />
                    {/* Components */}
                    <g onClick={() => setSel("pocket")} style={{ cursor: "pointer" }}><rect x="16" y="75" width="94" height="110" rx="4" style={sel==="pocket"?{...compStyle("pocket"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("pocket")} /><text x="63" y="125" {...COMP_TEXT}>Pocket</text></g>
                    <g onClick={() => setSel("exc-upper")} style={{ cursor: "pointer" }}><rect x="122" y="40" width="112" height="56" rx="4" style={sel==="exc-upper"?{...compStyle("exc-upper"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("exc-upper")} /><text x="178" y="65" {...COMP_TEXT}>Upper Exception</text><text x="178" y="79" {...COMP_TEXT}>Bin</text></g>
                    <g onClick={() => setSel("bridge")} style={{ cursor: "pointer" }}><rect x="248" y="40" width="150" height="56" rx="4" style={sel==="bridge"?{...compStyle("bridge"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("bridge")} /><text x="323" y="62" {...COMP_TEXT}>Bridge/Centralisation</text><text x="323" y="76" {...COMP_TEXT}>Transport</text></g>
                    <g onClick={() => setSel("escrow")} style={{ cursor: "pointer" }}><rect x="414" y="40" width="130" height="145" rx="4" style={sel==="escrow"?{...compStyle("escrow"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("escrow")} /><text x="479" y="113" {...COMP_TEXT}>Escrow</text></g>
                    <g onClick={() => setSel("ut-front")} style={{ cursor: "pointer" }}><rect x="122" y="108" width="112" height="77" rx="4" style={sel==="ut-front"?{...compStyle("ut-front"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("ut-front")} /><text x="178" y="142" {...COMP_TEXT}>Upper Transport</text><text x="178" y="155" {...COMP_TEXT}>(Front Side)</text></g>
                    <g onClick={() => setSel("bill-val")} style={{ cursor: "pointer" }}><rect x="248" y="108" width="100" height="77" rx="4" style={sel==="bill-val"?{...compStyle("bill-val"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("bill-val")} /><text x="298" y="143" {...COMP_TEXT}>Bill</text><text x="298" y="156" {...COMP_TEXT}>Validator</text></g>
                    <g onClick={() => setSel("ut-rear")} style={{ cursor: "pointer" }}><rect x="360" y="108" width="48" height="77" rx="4" style={sel==="ut-rear"?{...compStyle("ut-rear"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("ut-rear")} /><text x="384" y="138" {...COMP_TEXT}>Upper</text><text x="384" y="151" {...COMP_TEXT}>Transport</text><text x="384" y="164" {...COMP_TEXT}>(Rear)</text></g>
                    <g onClick={() => setSel("inter-transp")} style={{ cursor: "pointer" }}><rect x="120" y="201" width="115" height="35" rx="4" style={sel==="inter-transp"?{...compStyle("inter-transp"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("inter-transp")} /><text x="177" y="221" {...COMP_TEXT}>Intermediate Transport</text></g>
                    <g onClick={() => setSel("lh-transp")} style={{ cursor: "pointer" }}><rect x="130" y="268" width="412" height="30" rx="4" style={sel==="lh-transp"?{...compStyle("lh-transp"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("lh-transp")} /><text x="336" y="284" {...COMP_TEXT}>Lower Horizontal Transport</text></g>
                    <g onClick={() => setSel("vert-transp")} style={{ cursor: "pointer" }}><rect x="125" y="302" width="22" height="160" rx="4" style={sel==="vert-transp"?{...compStyle("vert-transp"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("vert-transp")} /><text x="115" y="368" transform="rotate(-90,133,365)" fontSize="10" fontFamily="IBM Plex Mono,monospace" fill="#c8dcea" fontWeight="600" textAnchor="middle">Vertical Transport</text></g>
                    <g onClick={() => setSel("exc-lower")} style={{ cursor: "pointer" }}><rect x="16" y="268" width="100" height="195" rx="4" style={sel==="exc-lower"?{...compStyle("exc-lower"),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle("exc-lower")} /><text x="66" y="355" {...COMP_TEXT}>Lower</text><text x="66" y="369" {...COMP_TEXT}>Exception</text><text x="66" y="383" {...COMP_TEXT}>Cassette</text></g>
                    {([ ["rec1",158],["rec2",255],["rec3",353],["rec4",452] ] as [string, number][]).map(([id, x], i) => (
                        <g key={id} onClick={() => setSel(id)} style={{ cursor: "pointer" }}>
                            <rect x={x} y="302" width="89" height="161" rx="4" style={sel===id?{...compStyle(id),filter:"url(#glow) brightness(1.8) saturate(1.6)"}:compStyle(id)} />
                            <text x={x+44} y="378" {...COMP_TEXT}>Recycler</text>
                            <text x={x+44} y="391" {...COMP_TEXT}>Cassette {i+1}</text>
                        </g>
                    ))}
                </svg>
            </div>
            {info && (
                <div style={{ background: V.surf, border: `1.5px solid ${modColor}50`, borderRadius: 12, padding: "16px", animation: "fi .2s ease", boxShadow: `0 0 16px ${modColor}18` }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: V.br, marginBottom: 8 }}>{info.name}</div>
                    <div style={{ display: "inline-block", fontSize: 12, fontFamily: "'Share Tech Mono', monospace", color: modColor, background: `${modColor}20`, border: `1px solid ${modColor}50`, borderRadius: 5, padding: "3px 10px", marginBottom: 12 }}>{info.module}</div>
                    <div style={{ fontSize: 14, color: V.dm, lineHeight: 1.7, marginBottom: 12 }}>{info.desc}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {info.tags.map(t => (
                            <span key={t} style={{ fontSize: 12, color: "#58a6ff", background: "rgba(88,166,255,.10)", border: "1px solid rgba(88,166,255,.25)", borderRadius: 5, padding: "3px 10px" }}>{t}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function LEDRefView() {
    const { familyId: activeFamily } = useParams();
    const [section, setSection] = useState<string | null>(null);
    const [ledTab,  setLedTab]  = useState("overview");
    const [nomExpanded, setNomExpanded] = useState<string | null>(null);
    const navigate = useNavigate();

    // ── BRM (Recuperador) ──
    if (activeFamily === "brm") {
        const headerBRM = (
            <div style={{ textAlign: "center", padding: "14px 0 8px", borderBottom: `1px solid ${V.bd}`, marginBottom: 14 }}>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: V.br, letterSpacing: 1, lineHeight: 1.15, margin: 0 }}>
                    BRM <span style={{ color: V.gn }}>Referencia</span>
                </h2>
                <div style={{ fontSize: 11, color: V.dm, marginTop: 3, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1.5px" }}>NCR 6683/6687 · Cajero Reciclador</div>
                <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${V.gn}, transparent)`, margin: "8px auto 0" }} />
            </div>
        );

        if (!section) {
            const cards = [
                { id: "diagram", icon: "📐", title: "Diagrama BRM",     sub: "NCR 6687 / 6683", desc: "Componentes interactivos del módulo", color: "#4a90d9", bg: "rgba(74,144,217,.07)" },
                { id: "leds",    icon: "💡", title: "LEDs Status",       sub: "Indicadores 1–16", desc: "Estado de LEDs por módulo",          color: V.ac,      bg: V.acBg },
                { id: "ras",     icon: "🛠", title: "RAS / Diagnóstico", sub: "Direct Command",   desc: "Comandos de diagnóstico BRM",        color: V.amber,   bg: "rgba(245,158,11,.07)" },
            ];
            return (
                <div style={{ padding: "0 0 32px", animation: "fi .3s ease" }}>
                    <BackButton onClick={() => navigate(-1)} label="Volver" />
                    {headerBRM}
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

        if (section === "diagram") {
            return (
                <div style={{ padding: "0 0 32px", animation: "fi .3s ease" }}>
                    <BackButton onClick={() => setSection(null)} label="Volver" />
                    {headerBRM}
                    <div style={{ padding: "0 14px" }}>
                        <BrmDiagram />
                    </div>
                </div>
            );
        }

        if (section === "ras") {
            return (
                <div style={{ padding: "0 0 32px", animation: "fi .3s ease" }}>
                    <BackButton onClick={() => setSection(null)} label="Volver" />
                    {headerBRM}
                    <div style={{ padding: "0 14px" }}>
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

        if (section === "leds") {
            return (
                <div style={{ padding: "0 0 32px", animation: "fi .3s ease" }}>
                    <BackButton onClick={() => setSection(null)} label="Volver" />
                    {headerBRM}
                    <div style={{ padding: "0 8px" }}>
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
                                        { cls: "rs", label: "ROJO SÓLIDO", desc: "Latch abierto" },
                                        { cls: "rf", label: "ROJO FLASH",  desc: "Atasco / Falla" },
                                        { cls: "as", label: "ÁMBAR",       desc: "Para reabastecimiento" },
                                        { cls: "loff", label: "VERDE OFF", desc: "Inoperativo" },
                                        { cls: "gs", label: "VERDE SÓLIDO",desc: "Listo para usar" },
                                    ]},
                                    { title: "LOWER MODULE", rows: [
                                        { cls: "rs", label: "ROJO SÓLIDO", desc: "Latch abierto o cassettes ausentes" },
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
    }

    // ── S2 Sensores / Nomenclatura ──
    if (activeFamily === "s2") {
        const shadow = `0 1px 3px rgba(0,0,0,.25)`;
        return (
            <div style={{ padding: "0px", animation: "fi .3s ease" }}>
                <BackButton onClick={() => navigate(-1)} label="Volver" />
                <div style={{ textAlign: "center", padding: "14px 0 8px", borderBottom: `1px solid ${V.bd}`, marginBottom: 14 }}>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: V.br, letterSpacing: 1, lineHeight: 1.15, margin: 0 }}>
                        S2 <span style={{ color: V.rd }}>Sensores</span>
                    </h2>
                    <div style={{ fontSize: 11, color: V.dm, marginTop: 3, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1.5px" }}>NCR 6623/6627 · Cajero Dispensador</div>
                    <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${V.rd}, transparent)`, margin: "8px auto 0" }} />
                </div>

                <div style={{ padding: "0 14px 20px" }}>
                    <Sec n={SENSOR_TYPES.length}>PREFIJOS DE SENSORES / ACTUADORES</Sec>
                    <div style={{ padding: "0 14px 8px" }}>
                        <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.5 }}>
                            Prefijo que identifica el tipo de sensor o actuador en la nomenclatura NCR.
                        </div>
                    </div>
                    {SENSOR_TYPES.map(([prefix, desc]) => (
                        <div key={prefix} style={{ margin: "4px 14px", padding: "12px 16px", background: theme.card, borderRadius: 10, border: `1px solid ${theme.bd}`, boxShadow: shadow, display: "flex", gap: 14, alignItems: "center" }}>
                            <span style={{ fontFamily: fonts.mono, fontSize: 16, fontWeight: 700, color: theme.pr, minWidth: 40, letterSpacing: ".04em" }}>{prefix}</span>
                            <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.tx, flex: 1 }}>{desc}</span>
                        </div>
                    ))}

                    <div style={{ marginTop: 24 }} />
                    <Sec n={S2_UNITS.length}>UNIDADES S2 — BYTE 1 DE M_DATA</Sec>
                    <div style={{ padding: "0 14px 8px" }}>
                        <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.5 }}>
                            Valor hexadecimal que identifica la unidad en los datos adicionales (M_DATA) del S2 Dispenser.
                        </div>
                    </div>
                    {S2_UNITS.map(u => (
                        <div key={u.hex} style={{ margin: "4px 14px", padding: "12px 16px", background: theme.card, borderRadius: 10, border: `1px solid ${theme.bd}`, boxShadow: shadow, display: "flex", gap: 14, alignItems: "center" }}>
                            <span style={{ fontFamily: fonts.mono, fontSize: 16, fontWeight: 700, color: theme.am, minWidth: 40, letterSpacing: ".04em" }}>{u.hex}</span>
                            <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.tx, flex: 1 }}>{u.label}</span>
                        </div>
                    ))}

                    <div style={{ marginTop: 24 }} />
                    <Sec n={S2_SENSORS.length}>SENSORES POR UNIDAD — S2 DISPENSER</Sec>
                    <div style={{ padding: "0 14px 8px" }}>
                        <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.5 }}>
                            ID de sensor (Byte 4 de M_DATA) para fallas tipo Sensor / Cambio inesperado, por unidad.
                        </div>
                    </div>
                    {S2_SENSORS.map((s, i) => {
                        const id = `nom-${s.unit}`;
                        const isOpen = nomExpanded === id;
                        return (
                            <div key={s.unit} className="nc" onClick={() => setNomExpanded(isOpen ? null : id)}
                                style={{ margin: "5px 14px", padding: "14px 16px", background: theme.card, borderRadius: 12, border: `1px solid ${isOpen ? theme.prBd : theme.bd}`, cursor: "pointer", boxShadow: isOpen ? `0 4px 20px ${theme.prB}` : shadow, animation: `nF .3s ease ${i * .03}s both`, transition: "border-color .2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 600, color: theme.br }}>{s.unit}</span>
                                    <span style={{ color: theme.dm }}>{isOpen ? ICONS.arrowDown : ICONS.arrowRight}</span>
                                </div>
                                {isOpen && (
                                    <div style={{ marginTop: 10, padding: "10px 12px", background: theme.bg2, borderRadius: 8, border: `1px solid ${theme.bd}`, animation: "nF .2s ease" }}>
                                        {s.sensors.map(sen => (
                                            <div key={sen.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${theme.bd}` }}>
                                                <span style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 700, color: theme.pr, minWidth: 28 }}>{sen.id}</span>
                                                <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.tx }}>{sen.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
