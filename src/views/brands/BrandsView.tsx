import { useNavigate } from "react-router-dom";
import { brandsCatalog } from "../../data/catalog/brands";

export function BrandsView() {
    const navigate = useNavigate();


    return (
        <div style={{ padding: "20px 16px", animation: "fi 0.4s ease" }}>
            {/* Hero header */}
            <div style={{ textAlign: "center", padding: "24px 0 28px" }}>
                <div style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--c-accent)",
                    letterSpacing: "4px", textTransform: "uppercase", marginBottom: 8, opacity: .7,
                }}>// ATM TECH PRO — v3.0.0</div>
                <h2 className="font-orbitron" style={{
                    color: "var(--c-bright)", fontSize: "28px", margin: "0 0 6px",
                    textShadow: "0 0 18px rgba(0,212,255,.4), 0 0 40px rgba(0,212,255,.12)",
                    letterSpacing: "3px",
                }}>
                    SELECCIONA <span style={{ color: "var(--c-accent)" }}>MARCA</span>
                </h2>
                <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, var(--c-accent), transparent)", margin: "10px auto 0" }} />
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
                {brandsCatalog.map((brand, i) => (
                    <div key={brand.id} onClick={() => navigate(`/${brand.id}`)} className="card-cyber nc"
                        style={{ cursor: "pointer", animation: `nF .3s ease ${i * .08}s both` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: 50, height: 50,
                                background: "linear-gradient(135deg, var(--c-accent-bg), rgba(0,212,255,.12))",
                                border: "1px solid var(--c-accent-bd)",
                                borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "var(--c-accent)", fontSize: "22px", fontWeight: "900",
                                fontFamily: "'Orbitron', sans-serif",
                                boxShadow: "0 0 12px rgba(0,212,255,.15)",
                                flexShrink: 0,
                            }}>
                                {brand.name[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="font-orbitron" style={{ fontSize: "19px", color: "var(--c-bright)", letterSpacing: "1px" }}>
                                    {brand.name}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--c-dim)", fontFamily: "'Share Tech Mono', monospace", marginTop: 3, letterSpacing: ".5px" }}>
                                    {brand.families.length} familias · {brand.families.reduce((a, f) => a + (f.sections?.length ?? 0), 0)} herramientas
                                </div>
                            </div>
                            <span style={{ color: "var(--c-accent)", opacity: .6, fontSize: 18 }}>→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
