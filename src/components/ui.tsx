import { useState, ReactNode, RefObject } from "react";
import { theme, fonts, getCategoryColor, getCategoryLabel } from "../theme";
import { ATMError, Part } from "../types";

export const ICONS = {
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16" y2="16" /></svg>,
    star: (filled: boolean) => <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>,
    arrowDown:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="6 9 12 15 18 9" /></svg>,
    arrowLeft:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>,
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
};

interface TagProps { color: string; children: ReactNode; }
export function Tag({ color, children }: TagProps) {
    return (
        <span style={{
            display: "inline-block", padding: "3px 9px", borderRadius: 5,
            fontSize: 12, fontWeight: 600, fontFamily: fonts.mono,
            color, background: `${color}18`, letterSpacing: ".03em", lineHeight: "20px",
        }}>{children}</span>
    );
}

interface SecProps { children: ReactNode; n?: number; }
export function Sec({ children, n }: SecProps) {
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

interface NoneProps { icon: string; title: string; subtitle: string; }
export function None({ icon, title, subtitle }: NoneProps) {
    return (
        <div style={{ textAlign: "center", padding: "50px 24px", animation: "nF .4s ease" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: .5 }}>{icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.display, color: theme.br }}>{title}</div>
            <div style={{ fontSize: 13, color: theme.dm, marginTop: 6, fontFamily: fonts.display }}>{subtitle}</div>
        </div>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    inputRef: RefObject<HTMLInputElement | null>;
}
export function SearchBar({ value, onChange, placeholder, inputRef }: SearchBarProps) {
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

interface ChipProps { active: boolean; onClick: () => void; children: ReactNode; }
export function Chip({ active, onClick, children }: ChipProps) {
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

interface BackButtonProps { onClick: () => void; label: string; }
export function BackButton({ onClick, label }: BackButtonProps) {
    return (
        <button className="nf" onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: theme.am, cursor: "pointer",
            fontFamily: fonts.display, fontSize: 14, fontWeight: 600,
            padding: "10px 14px 6px",
        }}>
            {ICONS.arrowLeft} {label}
        </button>
    );
}

interface StatusCardProps {
    item: ATMError & { mod?: string };
    device: string;
    index: number;
    expanded: string | null;
    onToggle: (id: string) => void;
    favorites: string[];
    onToggleFav: (id: string) => void;
}
export function StatusCard({ item, device, index, expanded, onToggle, favorites, onToggleFav }: StatusCardProps) {
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

const CAT_DETAIL: Record<string, { causa: string; accion: string }> = {
    Sensor:        { causa: "Sensor físico sucio, desconectado o defectuoso.", accion: "Limpiar el área del sensor, verificar sus conexiones y reiniciar el equipo." },
    Mechanism:     { causa: "Mecanismo trabado, motor sin respuesta o componente dañado.", accion: "Verificar atasco físico, revisar el actuador o motor involucrado y ejecutar diagnóstico." },
    Jam:           { causa: "Billete atascado en el módulo o vía de transporte.", accion: "Abrir el módulo, retirar el billete con cuidado y reiniciar." },
    Communication: { causa: "Falla en el bus de comunicaciones o cable desconectado.", accion: "Verificar conexiones USB/I²C entre módulos y reiniciar." },
    Cassette:      { causa: "Gaveta no instalada correctamente, llena o ausente.", accion: "Revisar posición, latch e instalación de la gaveta afectada." },
    Security:      { causa: "Intento de manipulación detectado o falla de autenticación del módulo.", accion: "Verificar integridad física del equipo y registrar el incidente." },
    Interlock:     { causa: "El interlock se abrió durante una operación activa (pérdida de energía o apertura de puerta).", accion: "Cerrar correctamente las puertas, verificar el interlock y reiniciar." },
    Request:       { causa: "Solicitud rechazada por condición inválida del dispositivo o parámetro incorrecto.", accion: "Revisar el estado del cassette, la operación solicitada y reintentar." },
    Configuration: { causa: "El módulo no está configurado o la configuración es inválida tras un reinicio.", accion: "Ejecutar configuración inicial del dispensador desde el supervisor." },
    Memory:        { causa: "Error de acceso a memoria no volátil (NVRAM).", accion: "Reiniciar el módulo. Si persiste, reemplazar la placa de control." },
    General:       { causa: "Condición general del dispositivo fuera del estado esperado.", accion: "Revisar log de eventos del ATM y reiniciar el módulo si persiste." },
};

interface ErrorSummaryCardProps {
    item: ATMError & { mod?: string };
    device: string;
    index: number;
    favorites: string[];
    onToggleFav: (id: string) => void;
}
export function ErrorSummaryCard({ item, device, index, favorites, onToggleFav }: ErrorSummaryCardProps) {
    const [open, setOpen] = useState(false);
    const id = `${device}-${item.code}`;
    const isFav = favorites.includes(id);
    const catColor = getCategoryColor(item.cat);
    const detail = CAT_DETAIL[item.cat] ?? CAT_DETAIL["General"];

    return (
        <div className="nc" onClick={() => setOpen(o => !o)} style={{
            margin: "4px 14px", background: theme.card, borderRadius: 10,
            border: `1px solid ${open ? theme.amBd : theme.bd}`,
            cursor: "pointer", animation: `nF .3s ease ${index * .025}s both`,
            transition: "border-color .2s",
        }}>
            <div style={{ padding: "11px 14px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 700, color: theme.am, lineHeight: 1, minWidth: 32, textAlign: "right", flexShrink: 0 }}>
                    {item.code}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontFamily: fonts.display, fontWeight: 500, color: theme.br, lineHeight: 1.4 }}>
                        {item.desc}
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                        <Tag color={catColor}>{getCategoryLabel(item.cat)}</Tag>
                        {item.mod && <Tag color={theme.bl}>{item.mod}</Tag>}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <button onClick={e => { e.stopPropagation(); onToggleFav(id); }} style={{
                        background: "none", border: "none", color: isFav ? theme.am : theme.dm,
                        cursor: "pointer", padding: 4, transition: "color .15s",
                    }}>
                        {ICONS.star(isFav)}
                    </button>
                    <span style={{ color: theme.dm, fontSize: 13 }}>{open ? ICONS.arrowDown : ICONS.arrowRight}</span>
                </div>
            </div>

            {open && (
                <div style={{ margin: "0 12px 12px", padding: "12px 14px", background: theme.bg2, borderRadius: 8, border: `1px solid ${theme.bd}`, animation: "nF .2s ease" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: fonts.mono, color: theme.dm, letterSpacing: ".1em", marginBottom: 4 }}>CATEGORÍA</div>
                            <Tag color={catColor}>{item.catEs ?? getCategoryLabel(item.cat)}</Tag>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: fonts.mono, color: "#f59e0b", letterSpacing: ".1em", marginBottom: 4 }}>POSIBLE CAUSA</div>
                            <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.tx, lineHeight: 1.6 }}>{detail.causa}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: fonts.mono, color: "#22c55e", letterSpacing: ".1em", marginBottom: 4 }}>ACCIÓN RECOMENDADA</div>
                            <div style={{ fontSize: 13, fontFamily: fonts.display, color: theme.tx, lineHeight: 1.6 }}>{detail.accion}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PartImage({ pn }: { pn: string }) {
    const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
    const src = `/images/parts/${pn}.jpg`;
    return (
        <div style={{ background: theme.bg2, borderRadius: 10, border: `1px solid ${theme.bd}`, overflow: "hidden", minHeight: status === "ok" ? 0 : 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
                src={src}
                alt={pn}
                onLoad={() => setStatus("ok")}
                onError={() => setStatus("missing")}
                style={{ width: "100%", maxHeight: 260, objectFit: "contain", background: "#fff", display: status === "ok" ? "block" : "none" }}
            />
            {status === "loading" && (
                <div style={{ padding: "18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${theme.am}`, borderTopColor: "transparent", animation: "spin .7s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, fontStyle: "italic" }}>Cargando imagen…</span>
                </div>
            )}
            {status === "missing" && (
                <div style={{ padding: "18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>📷</span>
                    <span style={{ fontSize: 13, fontFamily: fonts.display, color: theme.dm, fontStyle: "italic" }}>Sin imagen disponible</span>
                </div>
            )}
        </div>
    );
}

interface PartCardProps {
    part: Part;
    index: number;
    expanded: string | null;
    onToggle: (id: string) => void;
    favorites: string[];
    onToggleFav: (id: string) => void;
}
export function PartCard({ part, index, expanded, onToggle, favorites, onToggleFav }: PartCardProps) {
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
