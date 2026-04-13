// Componentes UI atómicos compartidos entre todas las vistas
import { useState } from "react";
import { theme, fonts, getCategoryColor, getCategoryLabel } from "../theme";

export const ICONS = {
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16" y2="16" /></svg>,
    star: filled => <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>,
    arrowDown:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="6 9 12 15 18 9" /></svg>,
    arrowLeft:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>,
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
};

// Etiqueta de color con fondo translúcido
export function Tag({ color, children }) {
    return (
        <span style={{
            display: "inline-block", padding: "3px 9px", borderRadius: 5,
            fontSize: 12, fontWeight: 600, fontFamily: fonts.mono,
            color, background: `${color}18`, letterSpacing: ".03em", lineHeight: "20px",
        }}>{children}</span>
    );
}

// Encabezado de sección con contador
export function Sec({ children, n }) {
    return (
        <div style={{
            padding: "14px 16px 6px", fontSize: 11, fontWeight: 700,
            fontFamily: fonts.mono, color: theme.am, letterSpacing: ".12em",
            textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
        }}>
            <span style={{ width: 3, height: 13, background: theme.am, borderRadius: 1 }} />
            {children}
            {n != null && <span style={{ color: theme.dm, fontWeight: 500 }}>({n})</span>}
        </div>
    );
}

// Estado vacío / sin resultados
export function None({ icon, title, subtitle }) {
    return (
        <div style={{ textAlign: "center", padding: "50px 24px", animation: "nF .4s ease" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: .5 }}>{icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.display, color: theme.br }}>{title}</div>
            <div style={{ fontSize: 13, color: theme.dm, marginTop: 6, fontFamily: fonts.display }}>{subtitle}</div>
        </div>
    );
}

// Barra de búsqueda sticky
export function SearchBar({ value, onChange, placeholder, inputRef }) {
    return (
        <div style={{ padding: "10px 14px", position: "sticky", top: 54, zIndex: 99, background: theme.bg }}>
            <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.dm }}>
                    {ICONS.search}
                </div>
                <input
                    ref={inputRef}
                    className="ni"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: "100%", padding: "13px 40px 13px 46px",
                        background: theme.bg2, border: `1.5px solid ${theme.bd}`,
                        borderRadius: 12, color: theme.br, fontSize: 15,
                        fontFamily: fonts.display, fontWeight: 500,
                        transition: "border-color .2s, box-shadow .2s", boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = theme.am; e.target.style.boxShadow = `0 0 0 3px var(--c-accent-bg)`; }}
                    onBlur={e => { e.target.style.borderColor = theme.bd; e.target.style.boxShadow = "none"; }}
                />
                {value && (
                    <button onClick={() => onChange("")} style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", color: theme.dm, cursor: "pointer", padding: 4,
                    }}>{ICONS.x}</button>
                )}
            </div>
        </div>
    );
}

// Chip de filtro
export function Chip({ active, onClick, children }) {
    return (
        <button className="nf" onClick={onClick} style={{
            padding: "7px 15px", borderRadius: 20,
            border: `1px solid ${active ? theme.am : theme.bd}`,
            background: active ? theme.amG : "transparent",
            color: active ? theme.am : theme.dm,
            cursor: "pointer", fontSize: 12, fontFamily: fonts.display,
            fontWeight: active ? 700 : 500, whiteSpace: "nowrap", transition: "all .15s",
        }}>{children}</button>
    );
}

// Botón "Volver" reutilizable
export function BackButton({ onClick, label }) {
    return (
        <button className="nf" onClick={onClick} style={{
            background: "none", border: "none", color: theme.am, cursor: "pointer",
            fontFamily: fonts.display, fontSize: 14, fontWeight: 600,
            padding: "4px 0 12px", display: "flex", alignItems: "center", gap: 6,
        }}>
            {ICONS.arrowLeft} {label}
        </button>
    );
}

// Card de código de error M_STATUS
export function StatusCard({ item, device, index, expanded, onToggle, favorites, onToggleFav }) {
    const id = `${device}-${item.code}`;
    const isOpen = expanded === id;
    const isFav  = favorites.includes(id);
    const shadow = `0 1px 3px rgba(0,0,0,.15)`;

    return (
        <div className="nc" onClick={() => onToggle(id)} style={{
            margin: "5px 14px", padding: "14px 16px", background: theme.card,
            borderRadius: 12, border: `1px solid ${isOpen ? theme.amBd : theme.bd}`,
            cursor: "pointer",
            boxShadow: isOpen ? `0 4px 20px var(--c-accent-bg)` : shadow,
            animation: `nF .3s ease ${index * .025}s both`,
            transition: "border-color .2s",
        }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 26, fontWeight: 700, color: theme.am, lineHeight: 1, minWidth: 38, textAlign: "right" }}>
                    {item.code}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontFamily: fonts.display, fontWeight: 500, color: theme.br, lineHeight: 1.5 }}>
                        {item.desc}
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                        <Tag color={getCategoryColor(item.cat)}>{getCategoryLabel(item.cat)}</Tag>
                        {item.mod && <Tag color={theme.bl}>{item.mod}</Tag>}
                    </div>
                </div>
                <button onClick={e => { e.stopPropagation(); onToggleFav(id); }} style={{
                    background: "none", border: "none", color: isFav ? theme.am : theme.dm,
                    cursor: "pointer", padding: 4, flexShrink: 0, transition: "color .15s",
                }}>
                    {ICONS.star(isFav)}
                </button>
            </div>
            {isOpen && item.mdata && (
                <div style={{ marginTop: 12, padding: "12px 14px", background: theme.bg2, borderRadius: 8, border: `1px solid ${theme.bd}`, animation: "nF .2s ease" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, fontFamily: fonts.mono, color: theme.am, letterSpacing: ".12em", marginBottom: 8 }}>
                        M_DATA — Datos adicionales
                    </div>
                    <div style={{ fontSize: 13, fontFamily: fonts.mono, color: theme.tx, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {item.mdata}
                    </div>
                </div>
            )}
        </div>
    );
}

// Imagen de parte con fallback
function PartImage({ pn }) {
    const [status, setStatus] = useState("loading"); // loading | ok | missing
    const src = `/images/parts/${pn}.jpg`;
    return (
        <div style={{ background: theme.bg2, borderRadius: 10, border: `1px solid ${theme.bd}`, overflow: "hidden" }}>
            {status !== "missing" && (
                <img
                    src={src}
                    alt={pn}
                    onLoad={() => setStatus("ok")}
                    onError={() => setStatus("missing")}
                    style={{ width: "100%", display: status === "ok" ? "block" : "none", maxHeight: 260, objectFit: "contain", background: "#fff" }}
                />
            )}
            {(status === "missing" || status === "loading") && (
                <div style={{ padding: "20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: theme.bg, border: `1px dashed ${theme.bd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {status === "loading" ? "⏳" : "📷"}
                    </div>
                    <div>
                        <div style={{ fontSize: 12, fontFamily: fonts.mono, color: theme.dm }}>{src}</div>
                        <div style={{ fontSize: 12, fontFamily: fonts.display, color: theme.dm, marginTop: 2, fontStyle: "italic" }}>
                            {status === "loading" ? "Cargando..." : "Sin imagen disponible"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Card de parte / repuesto
export function PartCard({ part, index, expanded, onToggle, favorites, onToggleFav }) {
    const id = `part-${part.pn}`;
    const isOpen = expanded === id;
    const isFav  = favorites.includes(id);
    const shadow = `0 1px 3px rgba(0,0,0,.15)`;

    return (
        <div className="nc" onClick={() => onToggle(id)} style={{
            margin: "5px 14px", padding: "14px 16px", background: theme.card,
            borderRadius: 12, border: `1px solid ${isOpen ? theme.blBd : theme.bd}`,
            cursor: "pointer",
            boxShadow: isOpen ? `0 4px 20px var(--c-blue-bg)` : shadow,
            animation: `nF .3s ease ${index * .025}s both`,
            transition: "border-color .2s",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 14, fontWeight: 600, color: theme.bl, letterSpacing: ".02em" }}>
                        {part.pn}
                    </div>
                    <div style={{ fontSize: 14, fontFamily: fonts.display, color: theme.br, marginTop: 5, lineHeight: 1.5 }}>
                        {part.d}
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                        <Tag color={part.eq === "S2" ? theme.am : theme.gn}>{part.eq}</Tag>
                        <Tag color={theme.bl}>{part.m}</Tag>
                    </div>
                </div>
                <button onClick={e => { e.stopPropagation(); onToggleFav(id); }} style={{
                    background: "none", border: "none", color: isFav ? theme.am : theme.dm,
                    cursor: "pointer", padding: 4,
                }}>
                    {ICONS.star(isFav)}
                </button>
            </div>
            {isOpen && (
                <div style={{ marginTop: 12, animation: "nF .2s ease" }}>
                    <PartImage pn={part.pn} />
                </div>
            )}
        </div>
    );
}
