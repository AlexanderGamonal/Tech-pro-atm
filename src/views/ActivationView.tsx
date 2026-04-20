import { useState, useRef, useEffect } from "react";
import { useActivation } from "../hooks/useActivation";

const C = {
    bg:     "#04070e",
    card:   "#0d1220",
    border: "#162035",
    accent: "#00d4ff",
    acBg:   "rgba(0,212,255,.07)",
    acBd:   "rgba(0,212,255,.35)",
    dim:    "#4a6070",
    tx:     "#b8cfe0",
    br:     "#e8f4ff",
    rd:     "#f43f5e",
    rdBd:   "rgba(244,63,94,.35)",
    gn:     "#22c55e",
    gnBd:   "rgba(34,197,94,.35)",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');

@keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }
@keyframes scanLine { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 10px rgba(0,212,255,.3)} 50%{box-shadow:0 0 28px rgba(0,212,255,.7),0 0 50px rgba(0,212,255,.2)} }
@keyframes textGlow { 0%,100%{text-shadow:0 0 8px rgba(0,212,255,.5)} 50%{text-shadow:0 0 20px rgba(0,212,255,.95),0 0 40px rgba(0,212,255,.3)} }
@keyframes successPop { 0%{transform:scale(.8)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
@keyframes errShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

.act-grid {
    position:fixed;inset:0;z-index:0;pointer-events:none;
    background-image:
        linear-gradient(rgba(0,212,255,.028) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,212,255,.028) 1px,transparent 1px),
        linear-gradient(rgba(0,212,255,.010) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,212,255,.010) 1px,transparent 1px);
    background-size:100px 100px,100px 100px,20px 20px,20px 20px;
}
.act-scan-bg {
    position:fixed;inset:0;z-index:0;pointer-events:none;
    background:repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px);
}
.act-wrap {
    position:relative;z-index:1;
    width:100%;height:100%;
    min-height:100svh;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:24px 16px;
    box-sizing:border-box;
    overflow-y:auto;
    overflow-x:hidden;
}
.act-card {
    width:100%;
    max-width:380px;
    margin:auto;
    background:${C.card};
    border:1px solid ${C.border};
    border-radius:20px;
    padding:28px 24px;
    box-sizing:border-box;
    box-shadow:0 0 60px rgba(0,212,255,.06),0 24px 48px rgba(0,0,0,.6);
    animation:cardIn .5s cubic-bezier(.22,1,.36,1) both;
    position:relative;
}
.act-badge { animation:glowPulse 2.5s ease-in-out infinite; }
.act-title { animation:textGlow 2.5s ease-in-out infinite; }
.act-input {
    width:100%;box-sizing:border-box;
    background:#090e18;
    border:1.5px solid ${C.border};
    border-radius:12px;
    padding:16px;
    font-family:'Share Tech Mono',monospace;
    font-size:20px;
    letter-spacing:4px;
    color:${C.accent};
    text-align:center;
    margin-bottom:12px;
    transition:border-color .2s,box-shadow .2s,color .2s;
    -webkit-appearance:none;
}
.act-input:focus { outline:none; border-color:${C.accent}; box-shadow:0 0 0 3px rgba(0,212,255,.15); }
.act-input.err { border-color:${C.rdBd}; color:${C.rd}; animation:errShake .35s ease; }
.act-btn {
    width:100%;padding:16px;border-radius:12px;
    border:1.5px solid ${C.acBd};
    background:${C.acBg};color:${C.accent};
    font-family:'Orbitron',sans-serif;font-weight:700;
    font-size:13px;letter-spacing:1.5px;
    cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:8px;
    margin-bottom:16px;
    transition:all .2s;
    min-height:52px;
    -webkit-tap-highlight-color:transparent;
}
.act-btn:active:not(:disabled) { opacity:.8;transform:scale(.98); }
.act-btn:disabled { opacity:.45;cursor:default; }
.act-btn.success { border-color:${C.gnBd};background:rgba(34,197,94,.1);color:${C.gn}; }
.act-btn.error   { border-color:${C.rdBd};background:rgba(244,63,94,.07);color:${C.rd}; }
`;

function Spinner() {
    return (
        <div style={{ width:20,height:20,border:`2.5px solid rgba(0,212,255,.2)`,borderTopColor:C.accent,borderRadius:"50%",animation:"spin .7s linear infinite" }} />
    );
}

function CheckIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{animation:"successPop .4s ease"}}>
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    );
}

function ScanAnimation() {
    return (
        <div style={{ position:"relative",width:"100%",height:3,background:`rgba(0,212,255,.08)`,borderRadius:2,overflow:"hidden",marginBottom:20 }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"100%",background:`linear-gradient(90deg,transparent,${C.accent},transparent)`,animation:"scanLine 1.8s linear infinite" }} />
        </div>
    );
}

export function ActivationView() {
    const { validationStatus, errorMsg, activate } = useActivation();
    const [token, setToken] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const id = "act-css";
        if (!document.getElementById(id)) {
            const el = document.createElement("style");
            el.id = id;
            el.textContent = css;
            document.head.appendChild(el);
        }
        setTimeout(() => inputRef.current?.focus(), 600);
    }, []);

    const isLoading = validationStatus === "loading";
    const isSuccess = validationStatus === "success";
    const isError   = validationStatus === "error";

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !isLoading && token.trim()) activate(token);
    }

    const btnClass = `act-btn${isSuccess ? " success" : isError ? " error" : ""}`;

    return (
        <div style={{ width: "100%", minHeight: "100vh", background: C.bg, fontFamily: "'Rajdhani', sans-serif" }}>
            <div className="act-grid" />
            <div className="act-scan-bg" />

            {/* Version badge */}
            <div style={{ position:"fixed", top:14, right:14, fontSize:11, fontFamily:"'Share Tech Mono',monospace", color:C.dim, letterSpacing:"1px", zIndex:10 }}>v3.0.0</div>

            <div className="act-wrap">
                <div className="act-card">
                    {/* Corner brackets */}
                    <div style={{ position:"absolute",top:-1,left:-1,width:18,height:18,borderTop:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`,borderRadius:"6px 0 0 0",pointerEvents:"none" }} />
                    <div style={{ position:"absolute",bottom:-1,right:-1,width:18,height:18,borderBottom:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`,borderRadius:"0 0 6px 0",pointerEvents:"none" }} />

                    {/* Logo */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:20 }}>
                        <div className="act-badge" style={{ background:C.accent, borderRadius:8, padding:"4px 10px", fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:14, color:"#04070e", letterSpacing:1 }}>ATM</div>
                        <div className="act-title" style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:14, color:C.accent, letterSpacing:"3px" }}>TECH PRO</div>
                    </div>

                    {/* Scan bar */}
                    <div style={{ position:"relative", width:"100%", height:3, background:"rgba(0,212,255,.08)", borderRadius:2, overflow:"hidden", marginBottom:20 }}>
                        <div style={{ position:"absolute", top:0, left:0, bottom:0, width:"50%", background:`linear-gradient(90deg,transparent,${C.accent},transparent)`, animation:"scanLine 1.8s linear infinite" }} />
                    </div>

                    {/* Title */}
                    <div style={{ textAlign:"center", marginBottom:22 }}>
                        <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:17, color:C.br, letterSpacing:1, lineHeight:1.35 }}>
                            ACTIVACIÓN DE<br/>DISPOSITIVO
                        </div>
                        <div style={{ fontSize:13, color:C.dim, marginTop:8, fontFamily:"'Share Tech Mono',monospace" }}>
                            Ingresa tu código de acceso
                        </div>
                    </div>

                    {/* Token input */}
                    <input
                        ref={inputRef}
                        className={`act-input${isError ? " err" : ""}`}
                        value={token}
                        onChange={e => setToken(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        placeholder="XXXX-XXXX"
                        disabled={isLoading || isSuccess}
                        maxLength={20}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                    />

                    {/* Activate button */}
                    <button
                        className={btnClass}
                        onClick={() => activate(token)}
                        disabled={isLoading || isSuccess || !token.trim()}
                    >
                        {isLoading && <div style={{ width:18, height:18, border:"2.5px solid rgba(0,212,255,.2)", borderTopColor:C.accent, borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }} />}
                        {isSuccess && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{animation:"successPop .4s ease",flexShrink:0}}>
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        )}
                        {isLoading ? "VALIDANDO..." : isSuccess ? "ACCESO CONCEDIDO" : "ACTIVAR DISPOSITIVO"}
                    </button>

                    {/* Error */}
                    {isError && (
                        <div style={{ fontSize:13, color:C.rd, textAlign:"center", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, lineHeight:1.4, padding:"10px 12px", background:"rgba(244,63,94,.07)", borderRadius:8, border:`1px solid ${C.rdBd}`, animation:"cardIn .3s ease" }}>
                            ⚠ {errorMsg}
                        </div>
                    )}

                    {/* Hint */}
                    {!isError && !isSuccess && (
                        <div style={{ fontSize:12, color:C.dim, textAlign:"center", fontFamily:"'Share Tech Mono',monospace", lineHeight:1.6, marginTop:4 }}>
                            Contacta al administrador<br/>si no tienes un código
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
