import { useState } from "react";
import { S2, BRM, BRM_MOD } from "../data/errors";
import { S2_TREE, BRM_TREE } from "../data/trees";
import { S2_UNITS, S2_OP_POINTS, S2_SENSOR_FAIL, S2_SENSORS, S2_MECH_FAULTS, S2_JAM_DESC, S2_PICK_ERRORS } from "../data/s2mdata";
import { theme, fonts, getCategoryLabel } from "../theme";
import { SearchBar, Chip, Sec, None, Tag, StatusCard, ICONS, BackButton } from "../components/ui";

// ── S2 M_DATA Reference Component ──
function RefRow({ hex, label }) {
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 14px", borderBottom: `1px solid ${theme.bd}` }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 700, color: theme.am, minWidth: 36 }}>{hex}</span>
            <span style={{ fontSize: 12, fontFamily: fonts.display, color: theme.tx, flex: 1 }}>{label}</span>
        </div>
    );
}

function RefSection({ title, note, children }) {
    return (
        <div style={{ margin: "8px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, fontFamily: fonts.display, color: theme.bl, letterSpacing: "1.2px", textTransform: "uppercase", padding: "8px 0 4px" }}>{title}</div>
            {note && <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.5, marginBottom: 6 }}>{note}</div>}
            <div style={{ background: theme.card, borderRadius: 10, border: `1px solid ${theme.bd}`, overflow: "hidden" }}>
                {children}
            </div>
        </div>
    );
}

function S2MDataRef() {
    const [open, setOpen] = useState(null);
    const toggle = (id) => setOpen(prev => prev === id ? null : id);
    const shadow = `0 1px 3px rgba(0,0,0,.25)`;

    return (
        <div style={{ paddingBottom: 24 }}>
            <div style={{ padding: "4px 14px 10px" }}>
                <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.6 }}>
                    Tablas de referencia para decodificar los bytes de M_DATA en errores del S2 Dispenser (M_STATUS 21–86).
                </div>
            </div>

            <RefSection title="Byte 1 — Identidad de Unidad" note="Unidad donde ocurrió la falla.">
                {S2_UNITS.map(u => <RefRow key={u.hex} hex={u.hex} label={u.label} />)}
            </RefSection>

            <RefSection title="Byte 2 — Punto de la Operación" note="M_STATUS 4, 5 y 21–52.">
                {S2_OP_POINTS.map(p => <RefRow key={p.code} hex={p.code} label={p.desc} />)}
            </RefSection>

            <RefSection title="Byte 3 — Modo de Falla de Sensor" note="M_STATUS 21–33 (Sensor Fault).">
                {S2_SENSOR_FAIL.map(f => <RefRow key={f.code} hex={f.code} label={f.desc} />)}
            </RefSection>

            <RefSection title="Byte 4 — ID de Sensor por Unidad" note="M_STATUS 21–33 y 70–79.">
                {S2_SENSORS.map((s, i) => {
                    const isOpen = open === `sen-${i}`;
                    return (
                        <div key={s.unit} className="nc" onClick={() => toggle(`sen-${i}`)}
                            style={{ borderBottom: i < S2_SENSORS.length - 1 ? `1px solid ${theme.bd}` : "none", cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                                <span style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 600, color: theme.br }}>{s.unit}</span>
                                <span style={{ color: theme.dm }}>{isOpen ? ICONS.arrowDown : ICONS.arrowRight}</span>
                            </div>
                            {isOpen && s.sensors.map(sen => (
                                <div key={sen.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 14px 8px 28px", borderTop: `1px solid ${theme.bd}` }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, color: theme.pr, minWidth: 28 }}>{sen.id}</span>
                                    <span style={{ fontSize: 12, fontFamily: fonts.display, color: theme.tx }}>{sen.name}</span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </RefSection>

            <RefSection title="Byte 3 — Descripción de Falla Mecánica" note="M_STATUS 41–52 (Mechanism Fault).">
                {S2_MECH_FAULTS.map((m, i) => {
                    const isOpen = open === `mech-${i}`;
                    return (
                        <div key={m.unit} className="nc" onClick={() => toggle(`mech-${i}`)}
                            style={{ borderBottom: i < S2_MECH_FAULTS.length - 1 ? `1px solid ${theme.bd}` : "none", cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                                <div>
                                    <span style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 600, color: theme.br }}>{m.unit}</span>
                                    {isOpen && <div style={{ fontSize: 12, fontFamily: fonts.mono, color: theme.am, marginTop: 2 }}>Dir: {m.dir}</div>}
                                </div>
                                <span style={{ color: theme.dm }}>{isOpen ? ICONS.arrowDown : ICONS.arrowRight}</span>
                            </div>
                            {isOpen && m.faults.map(f => (
                                <div key={f.code} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 14px 8px 28px", borderTop: `1px solid ${theme.bd}` }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, color: theme.am, minWidth: 28, flexShrink: 0 }}>{f.code}</span>
                                    <span style={{ fontSize: 12, fontFamily: fonts.display, color: theme.tx, lineHeight: 1.4 }}>{f.desc}</span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </RefSection>

            <RefSection title="Byte 2 — Descripción de Atasco (Jam)" note="M_STATUS 61–69 (Media Jam).">
                {S2_JAM_DESC.map((j, i) => {
                    const isOpen = open === `jam-${i}`;
                    return (
                        <div key={j.unit} className="nc" onClick={() => toggle(`jam-${i}`)}
                            style={{ borderBottom: i < S2_JAM_DESC.length - 1 ? `1px solid ${theme.bd}` : "none", cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                                <span style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 600, color: theme.br }}>{j.unit}</span>
                                <span style={{ color: theme.dm }}>{isOpen ? ICONS.arrowDown : ICONS.arrowRight}</span>
                            </div>
                            {isOpen && j.jams.map(jm => (
                                <div key={jm.code} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 14px 8px 28px", borderTop: `1px solid ${theme.bd}` }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, color: theme.rd, minWidth: 28, flexShrink: 0 }}>{jm.code}</span>
                                    <span style={{ fontSize: 12, fontFamily: fonts.display, color: theme.tx, lineHeight: 1.4 }}>{jm.desc}</span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </RefSection>

            <RefSection title="Byte 2 — Razón de Error de Pique" note="M_STATUS 81–86 (Pick Error).">
                {S2_PICK_ERRORS.map(p => <RefRow key={p.code} hex={p.code} label={p.desc} />)}
            </RefSection>
        </div>
    );
}

// ── Error Decoder ─────────────────────────────────────────────────────────────

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
const UNIT_TO_SENSOR_GROUP = {
    "07": "SNT", "08": "Carriage", "0A": "Presenter Chassis",
    "0B": "Shutter", "0C": "Media Aligner", "0D": "Vacuum System",
    "01": "Pick", "02": "Pick", "03": "Pick", "04": "Pick", "05": "Pick", "06": "Pick",
};
const UNIT_TO_MECH_GROUP = {
    "07": "SNT", "08": "Carriage", "0A": "Presenter (Clamp)",
    "0B": "Shutter", "0C": "Media Aligner", "0D": "Vacuum System",
    "01": "Pick", "02": "Pick", "03": "Pick", "04": "Pick", "05": "Pick", "06": "Pick",
};
const UNIT_TO_JAM_GROUP = { "07": "SNT", "08": "Carriage", "09": "Bin" };

function decodeS2Bytes(ms, b1h, b2h, b3h, b4h) {
    const hi = h => h ? parseInt(h, 16) : null;
    const b1 = hi(b1h), b2 = hi(b2h), b3 = hi(b3h), b4 = hi(b4h);
    const hex = h => h ? h.toUpperCase().padStart(2, "0") : "";
    const rows = [];
    const add = (label, rawHex, value, color = theme.am) =>
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
            fault ? `${fault.desc} (Dir: ${grp.dir})` : `Código ${hex(b3h)} — ver tabla de falla mecánica`,
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

function ByteInput({ label, sub, value, onChange, color, wide }) {
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

function MStatusInput({ value, onChange }) {
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

function ErrorDecoder() {
    const [ms,   setMs]   = useState("");
    const [b1,   setB1]   = useState("");
    const [b2,   setB2]   = useState("");
    const [b3,   setB3]   = useState("");
    const [b4,   setB4]   = useState("");
    const [tcode,setTcode]= useState("");
    const [result, setResult] = useState(null);

    function decode() {
        if (!ms) return;
        const msInt = parseInt(ms, 10);
        const errS2  = S2.find(e => e.code === msInt);
        const errBRM = BRM.find(e => e.code === msInt);
        const err = errS2 || errBRM;
        const device = errS2 ? "s2" : errBRM ? "brm" : null;
        const decoded = device === "s2" ? decodeS2Bytes(msInt, b1, b2, b3, b4) : [];
        setResult({ ms: msInt, err, device, decoded, tcode });
    }

    function reset() {
        setMs(""); setB1(""); setB2(""); setB3("");
        setB4(""); setTcode(""); setResult(null);
    }

    const sep = <span style={{ fontSize: 20, color: theme.dm, alignSelf: "center", paddingBottom: 14 }}>+</span>;

    return (
        <div style={{ padding: "0 14px 24px" }}>
            {/* Formula header */}
            <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, padding: "14px 12px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.dm, marginBottom: 12, lineHeight: 1.5 }}>
                    Ingresa los valores del <b style={{ color: theme.tx }}>Device Event Log</b>. M-Status en decimal (según Status Code Book). Bytes en hex (00–FF). T-Code opcional.
                </div>

                {/* Input row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                    <MStatusInput value={ms} onChange={setMs} />
                    {sep}
                    {/* Byte 0 = always 00/reserved — static */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontSize: 16, fontWeight: 700, color: theme.dm, background: theme.bg, border: `1.5px solid ${theme.bd}`, borderRadius: 8 }}>00</div>
                        <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm }}>Byte 0</span>
                        <span style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.dm }}>YY (fijo)</span>
                    </div>
                    <ByteInput label="Byte 1" sub="AA" value={b1} onChange={setB1} color={theme.am} />
                    <ByteInput label="Byte 2" sub="BB" value={b2} onChange={setB2} color={theme.am} />
                    <ByteInput label="Byte 3" sub="CC" value={b3} onChange={setB3} color={theme.am} />
                    <ByteInput label="Byte 4" sub="DD" value={b4} onChange={setB4} color={theme.am} />
                    {sep}
                    <ByteInput label="T-Code" sub="ZZ" value={tcode} onChange={setTcode} color={theme.gn} wide />
                </div>

                {/* Byte 0 note */}
                <div style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.dm, textAlign: "center", marginTop: 6 }}>
                    Byte 0 = reservado (siempre 00) · Byte 4 = Sensor ID (fallas 21-33)
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={decode} disabled={!ms} style={{
                        flex: 1, padding: "11px", borderRadius: 10, border: "none",
                        background: ms ? theme.am : theme.bd, color: ms ? "#000" : theme.dm,
                        fontFamily: fonts.display, fontWeight: 700, fontSize: 13, cursor: ms ? "pointer" : "default",
                    }}>Decodificar</button>
                    <button onClick={reset} style={{
                        padding: "11px 16px", borderRadius: 10, border: `1px solid ${theme.bd}`,
                        background: "transparent", color: theme.dm,
                        fontFamily: fonts.display, fontSize: 13, cursor: "pointer",
                    }}>Reset</button>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div style={{ animation: "nF .3s ease" }}>
                    {result.err ? (
                        <>
                            {/* Error header card */}
                            <div style={{ background: theme.card, borderRadius: 12, border: `1.5px solid ${result.device === "s2" ? theme.rd + "50" : theme.gn + "50"}`, padding: "14px 16px", marginBottom: 10 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 900, color: result.device === "s2" ? theme.rd : theme.gn }}>{result.ms}</span>
                                    <div>
                                        <div style={{ fontSize: 12, fontFamily: fonts.mono, color: result.device === "s2" ? theme.rd : theme.gn, textTransform: "uppercase", letterSpacing: "1px" }}>M-Status · {result.device === "s2" ? "S2 Dispenser" : "BRM"}</div>
                                        <div style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 600, color: theme.br, marginTop: 2 }}>{result.err.desc}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    <Tag color={theme.am}>{result.err.catEs || result.err.cat}</Tag>
                                    {result.tcode && <Tag color={theme.gn}>T-Code: {result.tcode.toUpperCase()}</Tag>}
                                </div>
                            </div>

                            {/* Decoded bytes */}
                            {result.decoded.length > 0 && (
                                <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, overflow: "hidden", marginBottom: 10 }}>
                                    <div style={{ padding: "8px 14px", borderBottom: `1px solid ${theme.bd}`, fontSize: 12, fontFamily: fonts.display, fontWeight: 700, color: theme.bl, letterSpacing: "1px", textTransform: "uppercase" }}>
                                        Decodificación de M-Data
                                    </div>
                                    {result.decoded.map((row, i) => (
                                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderBottom: i < result.decoded.length - 1 ? `1px solid ${theme.bd}` : "none" }}>
                                            <span style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 700, color: row.color, minWidth: 28, flexShrink: 0 }}>{row.hex}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.dm, marginBottom: 2 }}>{row.label}</div>
                                                <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.tx }}>{row.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Original mdata text from errors.js */}
                            {result.err.mdata && (
                                <div style={{ background: "rgba(59,130,246,.06)", borderRadius: 10, border: `1px solid rgba(59,130,246,.2)`, padding: "10px 14px" }}>
                                    <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.bl, marginBottom: 4, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Estructura M-Data</div>
                                    <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.6 }}>{result.err.mdata}</div>
                                </div>
                            )}
                        </>
                    ) : (
                        <None icon="🔍" title={`M-Status ${result.ms} no encontrado`} subtitle="Verifica el código o revisa el Status Code Book" />
                    )}
                </div>
            )}
        </div>
    );
}

export function ErrorView({
    query, onQueryChange, inputRef,
    deviceFilter, onDeviceFilter,
    catFilter, onCatFilter,
    errMode, onErrMode,
    treeOpen, onTreeOpen,
    treeComp, onTreeComp,
    expanded, onExpanded,
    filteredS2, filteredBRM,
    allCategories,
    favorites, onToggleFav,
}) {
    const shadow = `0 1px 3px rgba(0,0,0,.25)`;
    const queryLower = query.toLowerCase().trim();

    // Filtered PCB module codes and RAS commands
    const filteredMod = BRM_MOD.filter(m =>
        queryLower === "" ||
        m.range.toLowerCase().includes(queryLower) ||
        m.mod.toLowerCase().includes(queryLower) ||
        m.desc.toLowerCase().includes(queryLower) ||
        m.ex.toLowerCase().includes(queryLower)
    );
    const isSearch = errMode === "search" || queryLower !== "";

    // Tree level 3: items for selected component
    const selCodes = treeComp
        ? (treeOpen === "s2" ? S2_TREE : BRM_TREE).find(c => c.id === treeComp)?.codes || []
        : [];
    const selItems = treeComp
        ? (treeOpen === "s2" ? S2 : BRM).filter(s => selCodes.includes(s.code))
        : [];

    return (
        <div>
            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 6, padding: "12px 14px 6px" }}>
                {[
                    ["tree",    ICONS.grid,   "Componente"],
                    ["search",  ICONS.search, "Buscar"],
                    ["decoder", "🔬",         "Decodificar"],
                ].map(([mode, icon, label]) => (
                    <button key={mode} className="nf" onClick={() => {
                        onErrMode(mode);
                        if (mode !== "search") onQueryChange("");
                        if (mode !== "tree") { onTreeOpen(null); onTreeComp(null); }
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
            {errMode === "decoder" && !queryLower && <ErrorDecoder />}

            {/* ── SEARCH MODE ── */}
            {isSearch && <>
                <SearchBar value={query} onChange={onQueryChange} placeholder="Buscar M_STATUS, error, módulo..." inputRef={inputRef} />

                {/* Device filter chips */}
                <div className="ns" style={{ display: "flex", gap: 6, padding: "0 14px 8px", overflowX: "auto" }}>
                    {[["all", "Todos"], ["s2", "S2 Dispenser"], ["brm", "BRM"], ["pcb", "Códigos PCB"], ["s2ref", "S2 M_DATA Ref"]].map(([v, l]) => (
                        <Chip key={v} active={deviceFilter === v} onClick={() => { onDeviceFilter(v); onCatFilter("all"); }}>{l}</Chip>
                    ))}
                </div>

                {/* Category filter chips */}
                {deviceFilter !== "pcb" && (
                    <div className="ns" style={{ display: "flex", gap: 5, padding: "0 14px 10px", overflowX: "auto" }}>
                        <Chip active={catFilter === "all"} onClick={() => onCatFilter("all")}>Todas</Chip>
                        {allCategories.map(ct => (
                            <Chip key={ct} active={catFilter === ct} onClick={() => onCatFilter(ct)}>{getCategoryLabel(ct)}</Chip>
                        ))}
                    </div>
                )}

                {/* S2 results */}
                {(deviceFilter === "all" || deviceFilter === "s2") && filteredS2.length > 0 && <>
                    <Sec n={filteredS2.length}>S2 DISPENSER — 6627/6623</Sec>
                    {filteredS2.map((it, i) => (
                        <StatusCard key={`s2-${it.code}`} item={it} device="s2" index={i}
                            expanded={expanded} onToggle={onExpanded}
                            favorites={favorites} onToggleFav={onToggleFav} />
                    ))}
                </>}

                {/* BRM results */}
                {(deviceFilter === "all" || deviceFilter === "brm") && filteredBRM.length > 0 && <>
                    <Sec n={filteredBRM.length}>USB BRM — 6687/6683</Sec>
                    {filteredBRM.map((it, i) => (
                        <StatusCard key={`brm-${it.code}`} item={it} device="brm" index={i}
                            expanded={expanded} onToggle={onExpanded}
                            favorites={favorites} onToggleFav={onToggleFav} />
                    ))}
                </>}

                {/* PCB module codes */}
                {(deviceFilter === "all" || deviceFilter === "pcb" || deviceFilter === "brm") && filteredMod.length > 0 && <>
                    <Sec n={filteredMod.length}>CÓDIGOS PCB DEL BRM</Sec>
                    <div style={{ padding: "0 14px 6px" }}>
                        <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, lineHeight: 1.5 }}>
                            Códigos visibles en los LEDs de la PCB (P-Status / S-Status).
                        </div>
                    </div>
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
                </>}

                {/* S2 M_DATA Reference tables */}
                {deviceFilter === "s2ref" && (
                    <S2MDataRef />
                )}

                {/* Empty state */}
                {!filteredS2.length && !filteredBRM.length && deviceFilter !== "pcb" && !filteredMod.length && deviceFilter !== "s2ref" && (
                    <None icon="⚡" title="Sin resultados" subtitle="Intenta con otro código o término" />
                )}
            </>}

            {/* ── TREE MODE ── */}
            {errMode === "tree" && !queryLower && (
                <div style={{ padding: "6px 0" }}>
                    {/* Level 1: Device selection */}
                    {!treeOpen && (
                        <div style={{ padding: "0 14px" }}>
                            <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, padding: "4px 0 12px" }}>
                                Selecciona el equipo para ver sus componentes:
                            </div>
                            {[
                                ["s2",    "S2 DISPENSER",   "NCR 6627 / 6623", "Dispensador de billetes",             theme.rd, theme.rdB, S2.length],
                                ["brm",   "BRM",            "NCR 6687 / 6683", "Bunch Recycling Module — reciclaje",  theme.gn, theme.gnB, BRM.length],
                                ["s2ref", "S2 M_DATA REF",  "M_STATUS 21-86",  "Tablas de decodificación de M_DATA",  theme.bl, "rgba(59,130,246,0.07)", ""],
                            ].map(([id, name, model, sub, cl, bg, n], i) => (
                                <div key={id} className="nc" onClick={() => { onTreeOpen(id); onTreeComp(null); onExpanded(null); }}
                                    style={{ margin: "5px 0", padding: "16px", background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, cursor: "pointer", boxShadow: shadow, animation: `nF .3s ease ${i * .08}s both` }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, color: cl, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, fontWeight: 800, fontFamily: fonts.mono }}>
                                            {id === "s2" ? "S2" : id === "brm" ? "BR" : "MD"}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.display, color: theme.br }}>{name}</div>
                                            <div style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.am, marginTop: 2 }}>{model}</div>
                                            <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, marginTop: 2 }}>{sub}</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontFamily: fonts.mono, fontSize: 18, fontWeight: 700, color: theme.am }}>{n}</span>
                                            <span style={{ color: theme.dm }}>{ICONS.arrowRight}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Level 2: S2 M_DATA reference */}
                    {treeOpen === "s2ref" && (
                        <div>
                            <div style={{ padding: "0 14px" }}>
                                <BackButton onClick={() => { onTreeOpen(null); onTreeComp(null); }} label="Volver a equipos" />
                            </div>
                            <S2MDataRef />
                        </div>
                    )}

                    {/* Level 2: Component list */}
                    {treeOpen && !treeComp && treeOpen !== "s2ref" && (
                        <div style={{ padding: "0 14px" }}>
                            <BackButton onClick={() => { onTreeOpen(null); onTreeComp(null); }} label="Volver a equipos" />
                            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: fonts.display, color: theme.br, marginBottom: 4 }}>
                                {treeOpen === "s2" ? "S2 DISPENSER" : "BRM"}
                                <span style={{ fontFamily: fonts.mono, fontSize: 13, color: theme.am, fontWeight: 500 }}> {treeOpen === "s2" ? "6627/6623" : "6687/6683"}</span>
                            </div>
                            <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, marginBottom: 12 }}>
                                Selecciona el componente con problema:
                            </div>
                            {(treeOpen === "s2" ? S2_TREE : BRM_TREE).map((comp, i) => (
                                <div key={comp.id} className="nc" onClick={() => { onTreeComp(comp.id); onExpanded(null); }}
                                    style={{ margin: "4px 0", padding: "12px 14px", background: theme.card, borderRadius: 10, border: `1px solid ${theme.bd}`, cursor: "pointer", boxShadow: shadow, animation: `nF .25s ease ${i * .03}s both` }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.am, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 500, color: theme.br }}>{comp.label}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: theme.dm }}>{comp.codes.length} {comp.codes.length === 1 ? "código" : "códigos"}</span>
                                            <span style={{ color: theme.dm }}>{ICONS.arrowRight}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Level 3: Error codes for selected component */}
                    {treeOpen && treeComp && (
                        <div>
                            <div style={{ padding: "0 14px" }}>
                                <BackButton onClick={() => { onTreeComp(null); onExpanded(null); }} label="Volver a componentes" />
                            </div>
                            <Sec n={selItems.length}>
                                {(treeOpen === "s2" ? S2_TREE : BRM_TREE).find(c => c.id === treeComp)?.label}
                            </Sec>
                            {selItems.map((it, i) => (
                                <StatusCard key={`${treeOpen}-${it.code}`} item={it} device={treeOpen} index={i}
                                    expanded={expanded} onToggle={onExpanded}
                                    favorites={favorites} onToggleFav={onToggleFav} />
                            ))}
                            {selItems.length === 0 && <None icon="📋" title="Sin códigos" subtitle="No hay M_STATUS asociados a este componente" />}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
