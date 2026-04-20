import { useState } from "react";
import { APTRA_COMMANDS, APTRA_NOTE_STAR, APTRA_NOTE_DSTAR } from "../data/devices/ncr/brm/aptra";
import { theme } from "../theme";

const V = {
    ...theme,
    ac:    theme.am,
    acBg:  theme.amG,
    acBd:  theme.amBd,
    surf:  theme.bg2,
    amber: "#f59e0b",
    blue:  "#38bdf8",
};

function NoteBadge({ note }: { note: "*" | "**" }) {
    const isDouble = note === "**";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, fontWeight: 700,
            color: isDouble ? V.amber : V.blue,
            background: isDouble ? "rgba(245,158,11,.12)" : "rgba(56,189,248,.12)",
            border: `1px solid ${isDouble ? "rgba(245,158,11,.3)" : "rgba(56,189,248,.3)"}`,
            borderRadius: 4, padding: "1px 6px",
            letterSpacing: ".5px", flexShrink: 0,
        }}>
            {note}
        </span>
    );
}

function VideoBadge() {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, color: "#a78bfa",
            background: "rgba(167,139,250,.1)",
            border: "1px solid rgba(167,139,250,.25)",
            borderRadius: 4, padding: "1px 6px",
            flexShrink: 0,
        }}>
            ▶ VIDEO
        </span>
    );
}

export function AptraView() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [notesOpen, setNotesOpen] = useState(false);

    const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

    return (
        <div style={{ padding: "0 0 32px", animation: "fi .3s ease" }}>

            {/* Header */}
            <div style={{ textAlign: "center", padding: "14px 0 8px", borderBottom: `1px solid ${V.bd}`, marginBottom: 14 }}>
                <h2 style={{
                    fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900,
                    color: V.br, letterSpacing: 1, lineHeight: 1.15, margin: 0,
                }}>
                    DEVICE <span style={{ color: V.ac }}>DIAGNOSTICS</span>
                </h2>
                <div style={{
                    fontSize: 11, color: V.dm, marginTop: 3,
                    fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1.5px",
                }}>
                    APTRA · NCR 6683 / 6687 · BRM Recycler
                </div>
                <div style={{
                    width: 60, height: 2,
                    background: `linear-gradient(90deg, transparent, ${V.ac}, transparent)`,
                    margin: "8px auto 0",
                }} />
            </div>

            <div style={{ padding: "0 14px" }}>

                {/* Notes toggle */}
                <div
                    onClick={() => setNotesOpen(o => !o)}
                    style={{
                        marginBottom: 14, padding: "10px 14px",
                        background: "rgba(245,158,11,.06)",
                        border: "1px solid rgba(245,158,11,.2)",
                        borderRadius: 8, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15 }}>⚠️</span>
                        <span style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: 11, color: V.amber, letterSpacing: "1px",
                        }}>
                            NOTAS DE SEGURIDAD (* y **)
                        </span>
                    </div>
                    <span style={{ color: V.dm, fontSize: 16 }}>{notesOpen ? "▲" : "▼"}</span>
                </div>

                {notesOpen && (
                    <div style={{
                        marginBottom: 14, padding: "12px 14px",
                        background: V.surf, border: `1px solid ${V.bd}`,
                        borderRadius: 8, animation: "nF .2s ease",
                        display: "flex", flexDirection: "column", gap: 10,
                    }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <NoteBadge note="*" />
                            <span style={{ fontSize: 13, color: V.tx, lineHeight: 1.6 }}>{APTRA_NOTE_STAR}</span>
                        </div>
                        <div style={{ height: 1, background: V.bd }} />
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <NoteBadge note="**" />
                            <span style={{ fontSize: 13, color: V.tx, lineHeight: 1.6 }}>{APTRA_NOTE_DSTAR}</span>
                        </div>
                    </div>
                )}

                {/* Counter */}
                <div style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
                    color: V.dm, letterSpacing: "2px", marginBottom: 10,
                }}>
                    // {APTRA_COMMANDS.length} COMANDOS
                </div>

                {/* Command list */}
                {APTRA_COMMANDS.map((cmd, i) => {
                    const isOpen = expanded === cmd.id;
                    return (
                        <div
                            key={cmd.id}
                            onClick={() => toggle(cmd.id)}
                            className="nc"
                            style={{
                                marginBottom: 7,
                                background: isOpen ? V.surf : V.card,
                                border: `1px solid ${isOpen ? V.acBd : V.bd}`,
                                borderRadius: 10,
                                cursor: "pointer",
                                transition: "border-color .18s, background .18s",
                                boxShadow: isOpen ? `0 0 14px ${V.acBg}` : "none",
                                animation: `nF .3s ease ${i * .02}s both`,
                                overflow: "hidden",
                            }}
                        >
                            {/* Row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px" }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                                    background: isOpen ? V.acBg : "rgba(255,255,255,.03)",
                                    border: `1px solid ${isOpen ? V.acBd : V.bd}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "'Share Tech Mono', monospace",
                                    fontSize: 11, color: isOpen ? V.ac : V.dm,
                                    fontWeight: 700,
                                }}>
                                    {String(i + 1).padStart(2, "0")}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 14, fontWeight: 700,
                                        color: isOpen ? V.br : V.tx,
                                        fontFamily: "'Rajdhani', sans-serif",
                                        lineHeight: 1.3,
                                    }}>
                                        {cmd.name}
                                    </div>
                                    {!isOpen && (
                                        <div style={{
                                            fontSize: 12, color: V.dm,
                                            fontFamily: "'Share Tech Mono', monospace",
                                            marginTop: 2, letterSpacing: ".3px",
                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                        }}>
                                            {cmd.desc}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                                    {cmd.note && <NoteBadge note={cmd.note} />}
                                    {cmd.video && <VideoBadge />}
                                    <span style={{
                                        color: isOpen ? V.ac : V.dm,
                                        fontSize: 14, transition: "transform .2s, color .2s",
                                        transform: isOpen ? "rotate(90deg)" : "none",
                                    }}>›</span>
                                </div>
                            </div>

                            {/* Expanded content */}
                            {isOpen && (
                                <div style={{
                                    padding: "0 14px 14px 52px",
                                    animation: "nF .2s ease",
                                }}>
                                    <p style={{
                                        fontSize: 13, color: V.tx, lineHeight: 1.7,
                                        margin: "0 0 8px",
                                        fontFamily: "'Rajdhani', sans-serif",
                                    }}>
                                        {cmd.desc}
                                    </p>
                                    {cmd.details && (
                                        <ul style={{
                                            margin: 0, padding: 0, listStyle: "none",
                                            display: "flex", flexDirection: "column", gap: 5,
                                        }}>
                                            {cmd.details.map((d, di) => (
                                                <li key={di} style={{
                                                    display: "flex", gap: 8, alignItems: "flex-start",
                                                    fontSize: 13, color: V.dm, lineHeight: 1.6,
                                                    fontFamily: "'Rajdhani', sans-serif",
                                                }}>
                                                    <span style={{
                                                        color: V.ac, flexShrink: 0,
                                                        fontFamily: "'Share Tech Mono', monospace",
                                                        fontSize: 10, marginTop: 4,
                                                    }}>◆</span>
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(cmd.note || cmd.video) && (
                                        <div style={{
                                            display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap",
                                        }}>
                                            {cmd.note && <NoteBadge note={cmd.note} />}
                                            {cmd.video && <VideoBadge />}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
