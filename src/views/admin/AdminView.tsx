import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, setDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

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
    yl:     "#eab308",
};

interface TokenData {
    id: string;
    label: string;
    used: boolean;
    createdAt: Timestamp;
    activatedAt: Timestamp | null;
}

export function AdminView() {
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);

    // Login state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginErr, setLoginErr] = useState("");

    // Dashboard state
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [newLabel, setNewLabel] = useState("");
    const [createErr, setCreateErr] = useState("");
    const [genLoading, setGenLoading] = useState(false);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "tokens"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, snap => {
            const arr = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenData));
            setTokens(arr);
        });
        return unsub;
    }, [user]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginErr("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setLoginErr(err.message || "Error al iniciar sesión");
        }
    }

    function generateTokenStr(label: string) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        const prefix = label.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "X");
        return `${prefix}-${seg(4)}`;
    }

    async function handleCreateToken(e: React.FormEvent) {
        e.preventDefault();
        setCreateErr("");
        if (!newLabel.trim()) return;

        setGenLoading(true);
        const tokenId = generateTokenStr(newLabel.trim());
        try {
            await setDoc(doc(db, "tokens", tokenId), {
                label: newLabel.trim(),
                used: false,
                activatedAt: null,
                deviceFingerprint: null,
                createdAt: Timestamp.now(),
            });
            setNewLabel("");
        } catch (err: any) {
            setCreateErr("No tienes permisos o ocurrió un error." + err.message);
        } finally {
            setGenLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (confirm(`¿Seguro que deseas eliminar el token/acceso de ${id}?`)) {
            await deleteDoc(doc(db, "tokens", id));
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        alert(`Token copiado: ${text}`);
    }

    if (loading) return null;

    if (!user) {
        return (
            <div style={{ minHeight:"100svh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, fontFamily:"'Rajdhani', sans-serif" }}>
                <div style={{ width:"100%", maxWidth:320, padding:24, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,.5)" }}>
                    <h2 style={{ fontFamily:"'Orbitron', sans-serif", color:C.accent, textAlign:"center", marginBottom:20 }}>ADMIN LOGIN</h2>
                    <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo Admin" required style={{ padding:12, borderRadius:8, background:"#04070e", border:`1px solid ${C.border}`, color:C.tx, outline:"none", fontFamily:"'Share Tech Mono'" }} />
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required style={{ padding:12, borderRadius:8, background:"#04070e", border:`1px solid ${C.border}`, color:C.tx, outline:"none", fontFamily:"'Share Tech Mono'" }} />
                        {loginErr && <div style={{ color:C.rd, fontSize:12, textAlign:"center" }}>{loginErr}</div>}
                        <button type="submit" style={{ padding:14, background:C.acBg, border:`1px solid ${C.acBd}`, color:C.accent, borderRadius:8, fontFamily:"'Orbitron'", fontWeight:700, marginTop:8, cursor:"pointer" }}>ENTRAR</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight:"100svh", background:C.bg, fontFamily:"'Rajdhani', sans-serif", padding:"16px", paddingBottom:"40px", boxSizing:"border-box" }}>
            <div style={{ maxWidth:600, margin:"0 auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, borderBottom:`1px solid ${C.border}`, paddingBottom:16 }}>
                    <div>
                        <div style={{ fontFamily:"'Orbitron', sans-serif", color:C.accent, fontSize:20, fontWeight:700 }}>TECH PRO - ADMIN</div>
                        <div style={{ color:C.dim, fontSize:12, fontFamily:"'Share Tech Mono'" }}>{user.email}</div>
                    </div>
                    <button onClick={() => signOut(auth)} style={{ padding:"6px 12px", background:"transparent", border:`1px solid ${C.border}`, color:C.tx, borderRadius:6, cursor:"pointer" }}>Salir</button>
                </div>

                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:24 }}>
                    <div style={{ color:C.br, fontWeight:600, fontSize:16, marginBottom:12 }}>Generar Nuevo Acceso</div>
                    <form onSubmit={handleCreateToken} style={{ display:"flex", gap:8 }}>
                        <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="Nombre del Técnico" required style={{ flex:1, padding:12, borderRadius:8, background:"#04070e", border:`1px solid ${C.border}`, color:C.br, outline:"none", fontFamily:"'Rajdhani'", fontWeight:600, fontSize:15 }} />
                        <button type="submit" disabled={genLoading} style={{ padding:"0 16px", background:C.gnBd, border:"none", color:C.gn, borderRadius:8, fontFamily:"'Orbitron'", fontWeight:700, cursor:"pointer" }}>
                            {genLoading ? "..." : "+ CREAR"}
                        </button>
                    </form>
                    {createErr && <div style={{ color:C.rd, fontSize:12, marginTop:8 }}>{createErr}</div>}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {tokens.map(t => (
                        <div key={t.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:12 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                                <div>
                                    <div style={{ fontFamily:"'Share Tech Mono'", fontSize:18, color:C.accent, letterSpacing:2 }}>{t.id}</div>
                                    <div style={{ color:C.br, fontSize:15, fontWeight:600, marginTop:4 }}>{t.label}</div>
                                    <div style={{ color:C.dim, fontSize:12, marginTop:2 }}>Creado: {t.createdAt?.toDate?.().toLocaleDateString()}</div>
                                </div>
                                <div style={{ background: t.used ? C.acBg : "transparent", border:`1px solid ${t.used ? C.acBd : C.border}`, color: t.used ? C.accent : C.dim, padding:"4px 8px", borderRadius:4, fontSize:11, fontFamily:"'Orbitron'", fontWeight:700 }}>
                                    {t.used ? "USADO" : "NUEVO"}
                                </div>
                            </div>
                            
                            <div style={{ display:"flex", gap:8, marginTop:4 }}>
                                <button onClick={() => copyToClipboard(t.id)} style={{ flex:1, padding:10, background:"rgba(0,0,0,.2)", border:`1px solid ${C.border}`, color:C.br, borderRadius:6, cursor:"pointer" }}>Copiar</button>
                                <a href={`https://api.whatsapp.com/send?text=Aquí tienes tu acceso de Tech Pro: ${t.id}`} target="_blank" rel="noreferrer" style={{ flex:1, padding:10, background:C.acBg, border:`1px solid ${C.acBd}`, color:C.accent, borderRadius:6, textAlign:"center", textDecoration:"none", fontWeight:600 }}>WhatsApp</a>
                                <button onClick={() => handleDelete(t.id)} style={{ padding:10, background:C.rdBd, border:"none", color:C.rd, borderRadius:6, cursor:"pointer" }}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                    {tokens.length === 0 && <div style={{ textAlign:"center", padding:40, color:C.dim }}>No hay tokens generados.</div>}
                </div>
            </div>
        </div>
    );
}
