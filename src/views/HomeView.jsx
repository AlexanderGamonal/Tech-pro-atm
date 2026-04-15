export function HomeView({ setTab }) {
    return (
        <div style={{ padding: "20px", animation: "fi 0.4s ease" }}>
            <h2 className="font-orbitron" style={{ color: "var(--c-accent)", fontSize: "26px", marginBottom: "5px" }}>
                NCR TECH
            </h2>
            <p style={{ color: "var(--c-dim)", marginBottom: "25px", fontSize: "14px" }}>
                SISTEMA DE DIAGNÓSTICO DE CAMPO
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
                <div onClick={() => setTab("errors")} className="card-cyber nc" style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ fontSize: "26px" }}>⚠️</div>
                        <div>
                            <div className="font-orbitron" style={{ fontSize: "17px", color: "var(--c-bright)" }}>Buscador de Errores</div>
                            <div style={{ fontSize: "13px", color: "var(--c-dim)" }}>Dispensadores 6623/6627 · Recicladores 6683/6687</div>
                        </div>
                    </div>
                </div>

                <div onClick={() => setTab("parts")} className="card-cyber nc" style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ fontSize: "26px" }}>🔧</div>
                        <div>
                            <div className="font-orbitron" style={{ fontSize: "17px", color: "var(--c-bright)" }}>Catálogo de Partes</div>
                            <div style={{ fontSize: "13px", color: "var(--c-dim)" }}>Partes S2 Dispensadores · BRM Recicladores</div>
                        </div>
                    </div>
                </div>

                <div onClick={() => setTab("leds")} className="card-cyber nc" style={{ cursor: "pointer", borderLeft: "4px solid var(--c-accent)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ fontSize: "26px" }}>🛠</div>
                        <div>
                            <div className="font-orbitron" style={{ fontSize: "17px", color: "var(--c-bright)" }}>BRM Referencia</div>
                            <div style={{ fontSize: "13px", color: "var(--c-dim)" }}>Diagrama · LEDs · RAS / Diagnóstico</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
