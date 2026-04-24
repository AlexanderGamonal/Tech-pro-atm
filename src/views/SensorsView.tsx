import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/ui";
import { theme, fonts } from "../theme";

const V = { ...theme };

const SENSOR_TYPES = [
    { prefix: "PI", label: "Photo Interruptor",     cat: "sensor" },
    { prefix: "SW", label: "Switch",                cat: "sensor" },
    { prefix: "PS", label: "Photo Sensor",          cat: "sensor" },
    { prefix: "BM", label: "Brushless DC Motor",    cat: "actuador" },
    { prefix: "DM", label: "DC Motor",              cat: "actuador" },
    { prefix: "SM", label: "Stepper Motor",         cat: "actuador" },
    { prefix: "RS", label: "Rotary Swing Solenoid", cat: "actuador" },
    { prefix: "SD", label: "Solenoid",              cat: "actuador" },
];

const SENSOR_COLOR  = "#38bdf8";
const ACTUATOR_COLOR = "#f59e0b";

export function SensorsView() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "0 0 40px", animation: "fi .3s ease" }}>
            <BackButton onClick={() => navigate(-1)} label="Volver" />

            {/* Header */}
            <div style={{ textAlign: "center", padding: "14px 0 8px", borderBottom: `1px solid ${V.bd}`, marginBottom: 18 }}>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: V.br, letterSpacing: 1, lineHeight: 1.15, margin: 0 }}>
                    Sensores <span style={{ color: "#38bdf8" }}>y Actuadores</span>
                </h2>
                <div style={{ fontSize: 11, color: V.dm, marginTop: 3, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1.5px" }}>
                    NCR 6683/6687 · BRM Recycler
                </div>
                <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, #38bdf8, transparent)`, margin: "8px auto 0" }} />
            </div>

            <div style={{ padding: "0 14px" }}>

                {/* Nomenclatura */}
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: V.ac, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${V.bd}` }}>
                    Nomenclatura
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                    {SENSOR_TYPES.map(({ prefix, label, cat }) => {
                        const color = cat === "sensor" ? SENSOR_COLOR : ACTUATOR_COLOR;
                        return (
                            <div key={prefix} style={{
                                background: V.card, border: `1px solid ${color}30`,
                                borderLeft: `3px solid ${color}`,
                                borderRadius: 8, padding: "10px 12px",
                                display: "flex", flexDirection: "column", gap: 3,
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 16, fontWeight: 900, color, letterSpacing: ".08em" }}>{prefix}</span>
                                    <span style={{
                                        fontSize: 9, fontFamily: fonts.display, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: ".8px",
                                        color, background: `${color}18`,
                                        border: `1px solid ${color}40`,
                                        borderRadius: 4, padding: "2px 6px",
                                    }}>{cat}</span>
                                </div>
                                <div style={{ fontSize: 12, color: V.tx, lineHeight: 1.3 }}>{label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Diagrama general */}
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: V.ac, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${V.bd}` }}>
                    Diagrama General
                </div>

                <div style={{ background: V.card, border: `1px solid ${V.bd}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{
                        fontFamily: fonts.mono, fontSize: 11, letterSpacing: "1.5px",
                        color: SENSOR_COLOR, textTransform: "uppercase",
                        padding: "8px 12px", borderBottom: `1px solid ${V.bd}`,
                        background: `${SENSOR_COLOR}0d`,
                    }}>
                        DIAGRAMA GENERAL — BRM 6683/6687
                    </div>
                    <img
                        src="/brm-sensors-general.png"
                        alt="Diagrama de sensores y actuadores BRM"
                        style={{ width: "100%", display: "block" }}
                    />
                    <div style={{
                        fontFamily: fonts.mono, fontSize: 11, color: V.dm,
                        padding: "6px 12px", letterSpacing: ".5px",
                        borderTop: `1px solid ${V.bd}`, textAlign: "center",
                    }}>
                        Sensors & Actuators — NCR BRM Recycler Module
                    </div>
                </div>

                <div style={{
                    background: `${ACTUATOR_COLOR}0d`, border: `1px solid ${ACTUATOR_COLOR}30`,
                    borderRadius: 8, padding: "10px 14px",
                    fontSize: 13, color: V.dm, fontFamily: fonts.display, lineHeight: 1.6,
                }}>
                    <span style={{ color: ACTUATOR_COLOR, fontWeight: 700 }}>Próximamente:</span> Diagramas detallados por módulo (Upper Module, Lower Module, Vertical Transport, Centralisation Transport).
                </div>

            </div>
        </div>
    );
}
