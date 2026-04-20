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

@keyframes gridPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
@keyframes cardIn { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes spin { to{transform:rotate(360deg)} }
@keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 10px rgba(0,212,255,.3)} 50%{box-shadow:0 0 28px rgba(0,212,255,.7),0 0 50px rgba(0,212,255,.2)} }
@keyframes textGlow { 0%,100%{text-shadow:0 0 8px rgba(0,212,255,.5)} 50%{text-shadow:0 0 20px rgba(0,212,255,.95),0 0 40px rgba(0,212,255,.3)} }
@keyframes successPop { 0%{transform:scale(.8)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }

.act-grid {
    position:fixed;inset:0;z-index:0;
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
.act-card {
    animation:cardIn .5s cubic-bezier(.22,1,.36,1) both;
    backdrop-filter:blur(12px);
}
.act-badge { animation:glowPulse 2.5s ease-in-out infinite; }
.act-title { animation:textGlow 2.5s ease-in-out infinite; }
.act-input:focus { outline:none; border-color:${C.accent} !important; box-shadow:0 0 0 3px rgba(0,212,255,.15) !important; }
.act-btn { transition:all .2s; }
.act-btn:hover:not(:disabled) { background:rgba(0,212,255,.18) !important; box-shadow:0 0 18px rgba(0,212,255,.35) !important; }
.act-btn:disabled { opacity:.5;cursor:default; }
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
        // Inject CSS once
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

    // Button state
    const btnBorder = isSuccess ? C.gnBd : isError ? C.rdBd : C.acBd;
    const btnColor  = isSuccess ? C.gn   : isError ? C.rd   : C.accent;
    const btnBg     = isSuccess ? "rgba(34,197,94,.1)" : isError ? "rgba(244,63,94,.07)" : C.acBg;

    return (
        <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Rajdhani', sans-serif", position:"relative", overflow:"hidden" }}>
            <div className="act-grid" />
            <div className="act-scan-bg" />

            {/* Version badge */}
            <div style={{ position:"fixed",top:16,right:16,fontSize:11,fontFamily:"'Share Tech Mono',monospace",color:C.dim,letterSpacing:"1px" }}>v3.0.0</div>

            {/* Card */}
            <div className="act-card" style={{
                position:"relative", zIndex:1,
                width:"min(360px, calc(100vw - 40px))",
                background:C.card,
                border:`1px solid ${C.border}`,
                borderRadius:16,
                padding:"32px 28px",
                boxShadow:"0 0 60px rgba(0,212,255,.06),0 24px 48px rgba(0,0,0,.6)",
            }}>
                {/* Corner brackets */}
                <div style={{ position:"absolute",top:-1,left:-1,width:16,height:16,borderTop:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`,borderRadius:"4px 0 0 0" }} />
                <div style={{ position:"absolute",bottom:-1,right:-1,width:16,height:16,borderBottom:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`,borderRadius:"0 0 4px 0" }} />

                {/* Logo */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:24 }}>
                    <div className="act-badge" style={{ background:C.accent,borderRadius:8,padding:"4px 10px",fontFamily:"'Orbitron',sans-serif",fontWeight:900,fontSize:14,color:"#04070e",letterSpacing:1 }}>ATM</div>
                    <div className="act-title" style={{ fontFamily:"'Orbitron',sans-serif",fontWeight:700,fontSize:14,color:C.accent,letterSpacing:"3px" }}>TECH PRO</div>
                </div>

                <ScanAnimation />

                {/* Header text */}
                <div style={{ textAlign:"center",marginBottom:24 }}>
                    <div style={{ fontFamily:"'Orbitron',sans-serif",fontWeight:700,fontSize:18,color:C.br,letterSpacing:1,lineHeight:1.3 }}>
                        ACTIVACIÓN DE<br/>DISPOSITIVO
                    </div>
                    <div style={{ fontSize:13,color:C.dim,marginTop:8,fontFamily:"'Share Tech Mono',monospace",letterSpacing:".5px" }}>
                        Ingresa tu código de acceso
                    </div>
                </div>

                {/* Token input */}
                <input
                    ref={inputRef}
                    className="act-input"
                    value={token}
                    onChange={e => setToken(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    placeholder="XXXX-XXXX"
                    disabled={isLoading || isSuccess}
                    maxLength={20}
                    style={{
                        width:"100%",
                        boxSizing:"border-box",
                        background:"#090e18",
                        border:`1.5px solid ${isError ? C.rdBd : C.border}`,
                        borderRadius:10,
                        padding:"14px 16px",
                        fontFamily:"'Share Tech Mono',monospace",
                        fontSize:18,
                        letterSpacing:"4px",
                        color: isError ? C.rd : C.accent,
                        textAlign:"center",
                        marginBottom:12,
                        transition:"border-color .2s,box-shadow .2s,color .2s",
                    }}
                />

                {/* Activate button */}
                <button
                    className="act-btn"
                    onClick={() => activate(token)}
                    disabled={isLoading || isSuccess || !token.trim()}
                    style={{
                        width:"100%",
                        padding:"14px",
                        borderRadius:10,
                        border:`1.5px solid ${btnBorder}`,
                        background:btnBg,
                        color:btnColor,
                        fontFamily:"'Orbitron',sans-serif",
                        fontWeight:700,
                        fontSize:13,
                        letterSpacing:"1.5px",
                        cursor:"pointer",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:8,
                        marginBottom:16,
                    }}
                >
                    {isLoading && <Spinner />}
                    {isSuccess && <CheckIcon />}
                    {isLoading ? "VALIDANDO..." : isSuccess ? "ACCESO CONCEDIDO" : "ACTIVAR DISPOSITIVO"}
                </button>

                {/* Error message */}
                {isError && (
                    <div style={{ fontSize:13,color:C.rd,textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,lineHeight:1.4,padding:"10px 12px",background:"rgba(244,63,94,.07)",borderRadius:8,border:`1px solid ${C.rdBd}`,animation:"cardIn .3s ease" }}>
                        ⚠ {errorMsg}
                    </div>
                )}

                {/* Footer hint */}
                {!isError && (
                    <div style={{ fontSize:12,color:C.dim,textAlign:"center",fontFamily:"'Share Tech Mono',monospace",lineHeight:1.5 }}>
                        Contacta al administrador<br/>si no tienes un código de acceso
                    </div>
                )}
            </div>
        </div>
    );
}
