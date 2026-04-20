import { useState, useRef, useCallback, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { theme, fonts, getCategoryLabel } from "../theme";
import { SearchBar, Chip, Sec, None, Tag, StatusCard, ErrorSummaryCard, ICONS, BackButton } from "../components/ui";

// Data imports
import { S2_ERRORS } from "../data/devices/ncr/s2/errors";
import { S2_TREE } from "../data/devices/ncr/s2/trees";
import { S2_UNITS, S2_OP_POINTS, S2_SENSOR_FAIL, S2_SENSORS, S2_MECH_FAULTS, S2_JAM_DESC, S2_PICK_ERRORS } from "../data/devices/ncr/s2/mdata";

import { BRM_ERRORS, BRM_MOD, BRM_COMMANDS, BRM_MDATA_DETAILS, BRM_RESULTS } from "../data/devices/ncr/brm/errors";
import { BRM_TREE } from "../data/devices/ncr/brm/trees";

// ── S2 Data logic maps ──
const REQ_INHIBIT_REASONS = [
    "—", "Parámetro inválido", "Dispositivo fuera de servicio", "Requiere Clear",
    "Media presentada", "Media apilada", "Nada para retraer", "Nada para presentar",
    "Re-presentar no permitido", "Pick unit fuera de servicio", "Cassette vacío",
    "Cassette no instalado", "Bin no presente", "Bin lleno", "Tipo de cassette cambió",
    "Cassette sin latch", "Instance ID no configurado", "Límite de retract excedido",
    "Todos los cassettes inoperativos",
];
const NOT_CONFIG_ITEMS = [
    "Dispenser Instance ID", "Parámetros de media", "Configuración de Presenter inválida",
];
const UNIT_TO_SENSOR_GROUP: Record<string, string> = {
    "07": "SNT", "08": "Carriage", "0A": "Presenter Chassis",
    "0B": "Shutter", "0C": "Media Aligner", "0D": "Vacuum System",
    "01": "Pick", "02": "Pick", "03": "Pick", "04": "Pick", "05": "Pick", "06": "Pick",
};
const UNIT_TO_MECH_GROUP: Record<string, string> = {
    "07": "SNT", "08": "Carriage", "0A": "Presenter (Clamp)",
    "0B": "Shutter", "0C": "Media Aligner", "0D": "Vacuum System",
    "01": "Pick", "02": "Pick", "03": "Pick", "04": "Pick", "05": "Pick", "06": "Pick",
};
const UNIT_TO_JAM_GROUP: Record<string, string> = { "07": "SNT", "08": "Carriage", "09": "Bin" };

interface DecodeRow { label: string; hex: string; value: string; color: string; }

function decodeS2Bytes(ms: number, b1h: string, b2h: string, b3h: string, b4h: string): DecodeRow[] {
    const hi = (h: string) => h ? parseInt(h, 16) : null;
    const b1 = hi(b1h), b2 = hi(b2h), b3 = hi(b3h), b4 = hi(b4h);
    const hex = (h: string) => h ? h.toUpperCase().padStart(2, "0") : "";
    const rows: DecodeRow[] = [];
    const add = (label: string, rawHex: string, value: string, color = theme.am) =>
        rows.push({ label, hex: rawHex, value, color });

    // Byte 1 — NVRAM read/write
    if (ms === 1 && b1 !== null)
        add("Byte 1 — Operación", hex(b1h), b1 === 0 ? "Lectura (Read)" : b1 === 1 ? "Escritura (Write)" : "Desconocido", theme.am);

    // Byte 1 — Unit (most codes)
    if (ms !== 1 && b1 !== null) {
        const unitHex = hex(b1h);
        const unit = S2_UNITS.find(u => u.hex === unitHex);
        add("Byte 1 — Unidad", unitHex, unit?.label || `Desconocido (${unitHex})`, theme.am);
    }

    // Byte 2 — Op point (4, 5, 21-52)
    if (([4, 5].includes(ms) || (ms >= 21 && ms <= 52)) && b2 !== null) {
        const op = S2_OP_POINTS[b2];
        add("Byte 2 — Punto de operación", hex(b2h), op?.desc || "Desconocido", theme.bl);
    }

    // Byte 2 — Rejection reason (6)
    if (ms === 6 && b2 !== null)
        add("Byte 2 — Razón de rechazo", hex(b2h), REQ_INHIBIT_REASONS[b2] || "Desconocido", theme.bl);

    // Byte 2 — Not configured item (7)
    if (ms === 7 && b2 !== null)
        add("Byte 2 — Ítem no configurado", hex(b2h), NOT_CONFIG_ITEMS[b2] || "Desconocido", theme.bl);

    // Byte 3 — Sensor failure mode (21-33)
    if (ms >= 21 && ms <= 33 && b3 !== null) {
        const fail = S2_SENSOR_FAIL[b3];
        add("Byte 3 — Modo de falla de sensor", hex(b3h), fail?.desc || "Desconocido", theme.pr);
    }

    // Byte 3 — Mechanism fault (41-52)
    if (ms >= 41 && ms <= 52 && b3 !== null) {
        const unitHex = hex(b1h);
        const grpName = UNIT_TO_MECH_GROUP[unitHex];
        const grp = S2_MECH_FAULTS.find(m => m.unit === grpName);
        const fault = grp?.faults.find(f => parseInt(f.code, 16) === b3);
        add("Byte 3 — Descripción de falla mecánica", hex(b3h),
            fault ? `${fault.desc} (Dir: ${grp?.dir})` : `Código ${hex(b3h)} — ver tabla de falla mecánica`,
            theme.pr);
    }

    // Byte 4 — Sensor ID (21-33)
    if (ms >= 21 && ms <= 33 && b4 !== null) {
        const unitHex = hex(b1h);
        const grpName = UNIT_TO_SENSOR_GROUP[unitHex];
        const grp = S2_SENSORS.find(s => s.unit === grpName);
        const sensor = grp?.sensors.find(s => parseInt(s.id, 16) === b4);
        add("Byte 4 — ID de Sensor", hex(b4h),
            sensor ? sensor.name : `Sensor ID ${hex(b4h)} — unidad no identificada`,
            theme.gn);
    }

    // Byte 4 — Direction (41-52)
    if (ms >= 41 && ms <= 52 && b4 !== null)
        add("Byte 4 — Dirección", hex(b4h), `Valor de dirección: ${hex(b4h)} (ver tabla de unidad)`, theme.gn);

    // Byte 2 — Jam description (61-69)
    if (ms >= 61 && ms <= 69 && b2 !== null) {
        const unitHex = hex(b1h);
        const grpName = UNIT_TO_JAM_GROUP[unitHex];
        const grp = S2_JAM_DESC.find(j => j.unit === grpName);
        const jam = grp?.jams.find(j => parseInt(j.code, 16) === b2);
        add("Byte 2 — Descripción de atasco", hex(b2h),
            jam ? jam.desc : `Código ${hex(b2h)} — ver tabla de atasco`,
            theme.bl);
    }

    // Byte 3 — Jam source (61-69)
    if (ms >= 61 && ms <= 69 && b3 !== null)
        add("Byte 3 — Origen del atasco", hex(b3h),
            b3 === 0 ? "Billetes agrupados (bunched)" : `Pick Unit ${b3}`,
            theme.pr);

    // Byte 2 — Sensor ID (70-79)
    if (ms >= 70 && ms <= 79 && b2 !== null) {
        const unitHex = hex(b1h);
        const grpName = UNIT_TO_SENSOR_GROUP[unitHex];
        const grp = S2_SENSORS.find(s => s.unit === grpName);
        const sensor = grp?.sensors.find(s => parseInt(s.id, 16) === b2);
        add("Byte 2 — ID de Sensor (cambio inesperado)", hex(b2h),
            sensor ? sensor.name : `Sensor ID ${hex(b2h)}`,
            theme.bl);
    }

    // Byte 2 — Pick error reason (81-86)
    if (ms >= 81 && ms <= 86 && b2 !== null) {
        const pick = S2_PICK_ERRORS.find(p => parseInt(p.code, 16) === b2);
        add("Byte 2 — Razón de error de pique", hex(b2h),
            pick?.desc || "Desconocido", theme.bl);
    }

    return rows;
}

function decodeBRMBytes(_ms: number, b0h: string, b1h: string, b2h: string, b3h: string): DecodeRow[] {
    const hex = (h: string) => h ? h.toUpperCase().padStart(2, "0") : "";
    const rows: DecodeRow[] = [];
    const add = (label: string, rawHex: string, value: string, color = theme.am) =>
        rows.push({ label, hex: rawHex, value, color });

    const b0 = hex(b0h);
    const b1 = hex(b1h);
    const b2 = hex(b2h);
    const b3 = hex(b3h);

    const COMMANDS = BRM_COMMANDS as Record<string, string>;
    const MDATA    = BRM_MDATA_DETAILS as Record<string, string>;
    const RESULTS  = BRM_RESULTS as Record<string, string>;

    if (b0) {
        add("Byte 0 — Código de Comando", b0, COMMANDS[b0] ?? "Desconocido", theme.bl);
    }

    if (b1 && b2) {
        const dkey = `${b1} ${b2}`;
        add("Bytes 1 y 2 — Descripción de Error", `${b1} ${b2}`, MDATA[dkey] ?? "Desconocido", theme.pr);
    } else if (b1 || b2) {
        add("Bytes 1 y 2", `${b1} ${b2}`.trim(), "Requiere ambos bytes para descifrar la descripción", theme.pr);
    }

    if (b3) {
        add("Byte 3 — Resultado", b3, RESULTS[b3] ?? "Desconocido", theme.gn);
    }

    return rows;
}

interface ByteInputProps { label: string; sub?: string; value: string; onChange: (v: string) => void; color: string; wide?: boolean; }
function ByteInput({ label, sub, value, onChange, color, wide }: ByteInputProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <input
                value={value} onChange={e => onChange(e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 2))}
                placeholder="--" maxLength={2}
                style={{
                    width: wide ? 48 : 38, height: 38, textAlign: "center",
                    fontFamily: fonts.mono, fontSize: 16, fontWeight: 700,
                    color, background: theme.card, border: `1.5px solid ${color}60`,
                    borderRadius: 8, outline: "none", letterSpacing: ".1em",
                    textTransform: "uppercase",
                }}
            />
            <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, textAlign: "center", letterSpacing: ".3px" }}>{label}</span>
            {sub && <span style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.rdBd, textAlign: "center" }}>{sub}</span>}
        </div>
    );
}

interface MStatusInputProps { value: string; onChange: (v: string) => void; }
function MStatusInput({ value, onChange }: MStatusInputProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <input
                value={value} onChange={e => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                placeholder="--" maxLength={3}
                style={{
                    width: 52, height: 38, textAlign: "center",
                    fontFamily: fonts.mono, fontSize: 16, fontWeight: 700,
                    color: theme.rd, background: theme.card, border: `1.5px solid ${theme.rd}60`,
                    borderRadius: 8, outline: "none", letterSpacing: ".1em",
                }}
            />
            <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm }}>M-Status</span>
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.rdBd }}>decimal</span>
        </div>
    );
}

interface DecoderResult { ms: number; err: typeof S2_ERRORS[0] | typeof BRM_ERRORS[0] | undefined; device: string; decoded: DecodeRow[]; tcode: string; }

function ErrorDecoder({ activeFamily }: { activeFamily: string }) {
    const [ms, setMs] = useState("");
    const [b0, setB0] = useState(activeFamily === "s2" ? "00" : "");
    const [b1, setB1] = useState("");
    const [b2, setB2] = useState("");
    const [b3, setB3] = useState("");
    const [b4, setB4] = useState("");
    const [tcode, setTcode] = useState("");
    const [result, setResult] = useState<DecoderResult | null>(null);

    function decode() {
        if (!ms) return;
        const msInt = parseInt(ms, 10);
        const err = activeFamily === "s2" ? S2_ERRORS.find(e => e.code === msInt) : BRM_ERRORS.find(e => e.code === msInt);
        const decoded = activeFamily === "s2" ? decodeS2Bytes(msInt, b1, b2, b3, b4) : decodeBRMBytes(msInt, b0, b1, b2, b3);
        setResult({ ms: msInt, err, device: activeFamily, decoded, tcode });
    }

    function reset() {
        setMs(""); setB1(""); setB2(""); setB3("");
        setB4(""); setTcode(""); setResult(null);
    }

    const sep = <span style={{ fontSize: 20, color: theme.dm, alignSelf: "center", paddingBottom: 14 }}>+</span>;

    return (
        <div style={{ padding: "0 14px 24px" }}>
            <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, padding: "14px 12px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, marginBottom: 14, lineHeight: 1.6 }}>
                    Ingresa los valores del <b style={{ color: theme.tx }}>Device Event Log</b>. M-Status en decimal. Bytes en hex (00–FF). T-Code opcional.
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                    <MStatusInput value={ms} onChange={setMs} />
                    {sep}
                    {activeFamily === "s2" ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontSize: 16, fontWeight: 700, color: theme.dm, background: theme.bg, border: `1.5px solid ${theme.bd}`, borderRadius: 8 }}>00</div>
                            <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm }}>Byte 0</span>
                            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.dm }}>YY (fijo)</span>
                        </div>
                    ) : (
                        <ByteInput label="Byte 0" sub="CMD" value={b0} onChange={setB0} color={theme.bl} />
                    )}
                    <ByteInput label="Byte 1" sub="AA" value={b1} onChange={setB1} color={theme.am} />
                    <ByteInput label="Byte 2" sub="BB" value={b2} onChange={setB2} color={theme.am} />
                    <ByteInput label="Byte 3" sub="CC" value={b3} onChange={setB3} color={theme.am} />
                    {activeFamily === "s2" && <ByteInput label="Byte 4" sub="DD" value={b4} onChange={setB4} color={theme.am} />}
                    {sep}
                    <ByteInput label="T-Code" sub="ZZ" value={tcode} onChange={setTcode} color={theme.gn} wide />
                </div>
                
                {activeFamily === "s2" ? (
                    <div style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.dm, textAlign: "center", marginTop: 6 }}>
                        Byte 0 = reservado (siempre 00) · Byte 4 = Sensor ID (fallas 21-33)
                    </div>
                ) : (
                    <div style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.dm, textAlign: "center", marginTop: 6 }}>
                        Byte 0 = Command Code · Bytes 1 y 2 = Detalles M_DATA · Byte 3 = Result
                    </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={decode} disabled={!ms} style={{
                        flex: 1, padding: "13px", borderRadius: 10, border: "none",
                        background: ms ? theme.am : theme.bd, color: ms ? "#000" : theme.dm,
                        fontFamily: fonts.display, fontWeight: 700, fontSize: 15, cursor: ms ? "pointer" : "default",
                        letterSpacing: ".4px",
                    }}>Decodificar</button>
                    <button onClick={reset} style={{
                        padding: "13px 18px", borderRadius: 10, border: `1px solid ${theme.bd}`,
                        background: "transparent", color: theme.dm,
                        fontFamily: fonts.display, fontSize: 14, cursor: "pointer",
                    }}>Reset</button>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div style={{ animation: "nF .3s ease" }}>
                    {result.err ? (
                        <>
                            <div style={{ background: theme.card, borderRadius: 12, border: `2px solid ${result.device === "s2" ? theme.rd + "70" : theme.gn + "70"}`, padding: "16px", marginBottom: 10, boxShadow: `0 0 18px ${result.device === "s2" ? theme.rd : theme.gn}18` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 32, fontWeight: 900, color: result.device === "s2" ? theme.rd : theme.gn, lineHeight: 1 }}>{result.ms}</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontFamily: fonts.mono, color: result.device === "s2" ? theme.rd : theme.gn, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>M-Status · {result.device.toUpperCase()}</div>
                                        <div style={{ fontSize: 15, fontFamily: fonts.display, fontWeight: 700, color: theme.br, lineHeight: 1.4 }}>{result.err.desc}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    <Tag color={theme.am}>{result.err.catEs || result.err.cat}</Tag>
                                    {result.tcode && <Tag color={theme.gn}>T-Code: {result.tcode.toUpperCase()}</Tag>}
                                </div>
                            </div>

                            {result.decoded.length > 0 && (
                                <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, overflow: "hidden", marginBottom: 10 }}>
                                    <div style={{ padding: "8px 14px", borderBottom: `1px solid ${theme.bd}`, fontSize: 12, fontFamily: fonts.display, fontWeight: 700, color: theme.bl, letterSpacing: "1px", textTransform: "uppercase" }}>
                                        Decodificación de M-Data
                                    </div>
                                    {result.decoded.map((row, i) => (
                                        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 14px", borderBottom: i < result.decoded.length - 1 ? `1px solid ${theme.bd}` : "none" }}>
                                            <span style={{ fontFamily: fonts.mono, fontSize: 15, fontWeight: 700, color: row.color, minWidth: 32, flexShrink: 0 }}>{row.hex}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.dm, marginBottom: 3, letterSpacing: ".3px" }}>{row.label}</div>
                                                <div style={{ fontSize: 14, fontFamily: fonts.display, color: theme.tx, lineHeight: 1.5 }}>{row.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result.err.mdata && (
                                <div style={{ background: "rgba(59,130,246,.06)", borderRadius: 10, border: `1px solid rgba(59,130,246,.2)`, padding: "10px 14px" }}>
                                    <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.bl, marginBottom: 6, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Estructura M-Data</div>
                                    <div style={{ fontSize: 14, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.7 }}>{result.err.mdata}</div>
                                </div>
                            )}
                        </>
                    ) : (
                        <None icon="🔍" title={`M-Status ${result.ms} no encontrado`} subtitle={`Código no existe en ${result.device.toUpperCase()}. Verifica el código.`} />
                    )}
                </div>
            )}
        </div>
    );
}

interface ErrorViewProps { favorites: string[]; onToggleFav: (id: string) => void; }
export function ErrorView({ favorites, onToggleFav }: ErrorViewProps) {
    const { familyId } = useParams();
    const activeFamily = familyId ?? "brm";
    const [query, setQuery] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [errMode, setErrMode] = useState("tree");
    const [treeComp, setTreeComp] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toggleExpanded = useCallback((id: string) => setExpanded(prev => prev === id ? null : id), []);

    const navigate = useNavigate();
    const shadow = `0 1px 3px rgba(0,0,0,.25)`;
    const queryLower = query.toLowerCase().trim();
    
    // Choose dataset depending on activeFamily
    const ERRORS_DATA = activeFamily === "s2" ? S2_ERRORS : BRM_ERRORS;
    const TREE_DATA = activeFamily === "s2" ? S2_TREE : BRM_TREE;
    
    // Derived categories
    const allCategories = [...new Set(ERRORS_DATA.map(s => s.cat))].sort();

    // Filter results
    const filteredErrors = ERRORS_DATA.filter(it => 
        (catFilter === "all" || it.cat === catFilter) &&
        (queryLower === "" ||
            String(it.code).includes(queryLower) ||
            it.desc.toLowerCase().includes(queryLower) ||
            it.cat.toLowerCase().includes(queryLower) ||
            (it.catEs || "").toLowerCase().includes(queryLower) ||
            (it.mdata || "").toLowerCase().includes(queryLower))
    );

    const filteredMod = activeFamily === "brm" ? BRM_MOD.filter(m =>
        queryLower === "" ||
        m.range.toLowerCase().includes(queryLower) ||
        m.mod.toLowerCase().includes(queryLower) ||
        m.desc.toLowerCase().includes(queryLower) ||
        m.ex.toLowerCase().includes(queryLower)
    ) : [];

    const isSearch = errMode === "search" || queryLower !== "";

    // Tree mode selection
    const selCodes = treeComp ? TREE_DATA.find(c => c.id === treeComp)?.codes || [] : [];
    const selItems = treeComp ? ERRORS_DATA.filter(s => selCodes.includes(s.code)) : [];

    return (
        <div>
            <BackButton onClick={() => navigate(-1)} label="Volver" />
            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 6, padding: "6px 14px 6px" }}>
                {([
                    ["tree",    ICONS.grid,   "Componente"],
                    ["search",  ICONS.search, "Buscar"],
                    ["decoder", "🔬",         "Decodificar"],
                ] as [string, ReactNode, string][]).map(([mode, icon, label]) => (
                    <button key={mode} className="nf" onClick={() => {
                        setErrMode(mode);
                        if (mode !== "search") setQuery("");
                        if (mode !== "tree") setTreeComp(null);
                    }} style={{
                        flex: 1, padding: "10px 4px", borderRadius: 10,
                        border: `1.5px solid ${errMode === mode ? theme.am : theme.bd}`,
                        background: errMode === mode ? theme.amG : "transparent",
                        color: errMode === mode ? theme.am : theme.dm,
                        cursor: "pointer", fontFamily: fonts.display, fontSize: 13,
                        fontWeight: errMode === mode ? 700 : 500,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    }}>
                        {icon} {label}
                    </button>
                ))}
            </div>

            {/* ── DECODER MODE ── */}
            {errMode === "decoder" && !queryLower && <ErrorDecoder activeFamily={activeFamily} />}

            {/* ── SEARCH MODE ── */}
            {isSearch && <>
                <SearchBar value={query} onChange={setQuery} placeholder="Buscar M_STATUS, o descripción..." inputRef={inputRef} />

                {/* Category filter chips */}
                <div className="ns" style={{ display: "flex", gap: 5, padding: "0 14px 10px", overflowX: "auto" }}>
                    <Chip active={catFilter === "all"} onClick={() => setCatFilter("all")}>Todas</Chip>
                    {allCategories.map(ct => (
                        <Chip key={ct} active={catFilter === ct} onClick={() => setCatFilter(ct)}>{getCategoryLabel(ct)}</Chip>
                    ))}
                    {activeFamily === "brm" && <Chip active={catFilter === "pcb"} onClick={() => setCatFilter("pcb")}>PCB (BRM)</Chip>}
                </div>

                {/* Specific PCB filter view */}
                {activeFamily === "brm" && catFilter === "pcb" ? (
                    filteredMod.length > 0 ? (
                        <>
                            <Sec n={filteredMod.length}>CÓDIGOS PCB DEL BRM</Sec>
                            {filteredMod.map(me => (
                                <div key={me.range} className="nc" style={{ margin: "5px 14px", padding: "14px 16px", background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, boxShadow: shadow }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: theme.am }}>{me.range}</span>
                                        <Tag color={theme.bl}>{me.mod}</Tag>
                                    </div>
                                    <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.tx, lineHeight: 1.5 }}>{me.desc}</div>
                                    <div style={{ fontSize: 12.5, fontFamily: fonts.mono, color: theme.dm, marginTop: 8, lineHeight: 1.7, borderTop: `1px solid ${theme.bd}`, paddingTop: 8 }}>{me.ex}</div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <None icon="⚡" title="Sin resultados" subtitle="Intenta con otro término" />
                    )
                ) : (
                    /* Error Results */
                    <>
                        {filteredErrors.length > 0 ? (
                            <>
                                <Sec n={filteredErrors.length}>CÓDIGOS DE ERROR {activeFamily.toUpperCase()}</Sec>
                                {filteredErrors.map((it, i) => (
                                    <StatusCard key={`${activeFamily}-${it.code}`} item={it} device={activeFamily} index={i}
                                        expanded={expanded} onToggle={toggleExpanded}
                                        favorites={favorites} onToggleFav={onToggleFav} />
                                ))}
                            </>
                        ) : (
                            <None icon="⚡" title="Sin resultados" subtitle="Intenta con otro código o término" />
                        )}
                    </>
                )}
            </>}

            {/* ── TREE MODE ── */}
            {errMode === "tree" && !queryLower && (
                <div style={{ padding: "4px 14px" }}>
                    {!treeComp ? (
                        <>
                            <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, padding: "4px 0 12px" }}>
                                Selecciona el componente estructural con el problema:
                            </div>
                            {TREE_DATA.map((comp, i) => (
                                <div key={comp.id} className="nc" onClick={() => { setTreeComp(comp.id); setExpanded(null); }}
                                    style={{ margin: "6px 0", padding: "14px 16px", background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, cursor: "pointer", boxShadow: shadow, animation: `nF .3s ease ${i * .08}s both` }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: 4, background: activeFamily === "s2" ? theme.rd : theme.gn, flexShrink: 0 }} />
                                            <span style={{ fontSize: 15, fontFamily: fonts.display, fontWeight: 600, color: theme.br }}>{comp.label}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontFamily: fonts.mono, fontSize: 14, color: theme.dm }}>{comp.codes.length}</span>
                                            <span style={{ color: theme.dm }}>{ICONS.arrowRight}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div style={{ paddingBottom: 10 }}>
                                <BackButton onClick={() => { setTreeComp(null); setExpanded(null); }} label="Volver a componentes" />
                            </div>
                            <Sec n={selItems.length}>
                                {TREE_DATA.find(c => c.id === treeComp)?.label}
                            </Sec>
                            {selItems.map((it, i) => (
                                <ErrorSummaryCard key={`${activeFamily}-${it.code}`} item={it} device={activeFamily} index={i}
                                    favorites={favorites} onToggleFav={onToggleFav} />
                            ))}
                            {selItems.length === 0 && <None icon="📋" title="Sin códigos" subtitle="No hay M_STATUS asociados a este componente" />}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
