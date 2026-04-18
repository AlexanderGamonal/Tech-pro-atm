import { brandsCatalog } from "../../data/catalog/brands";
import { theme, fonts } from "../../theme";

export function BrandsView({ onSelectBrand }) {
    const shadow = `0 1px 3px rgba(0,0,0,.25)`;

    return (
        <div style={{ padding: "20px", animation: "fi 0.4s ease" }}>
            <h2 className="font-orbitron" style={{ color: "var(--c-accent)", fontSize: "26px", marginBottom: "5px" }}>
                SELECCIONA UNA MARCA
            </h2>
            <p style={{ color: "var(--c-dim)", marginBottom: "25px", fontSize: "14px", fontFamily: fonts.display }}>
                Elige el fabricante del cajero automático.
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
                {brandsCatalog.map((brand, i) => (
                    <div key={brand.id} onClick={() => onSelectBrand(brand.id)} className="card-cyber nc"
                        style={{ cursor: "pointer", animation: `nF .3s ease ${i * .08}s both` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: 48, height: 48, background: "var(--c-accent-bg)", borderRadius: 12,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "var(--c-accent)", fontSize: "24px", fontWeight: "bold",
                                fontFamily: "'Orbitron', sans-serif"
                            }}>
                                {brand.name[0]}
                            </div>
                            <div>
                                <div className="font-orbitron" style={{ fontSize: "19px", color: "var(--c-bright)" }}>
                                    {brand.name}
                                </div>
                                <div style={{ fontSize: "13px", color: "var(--c-dim)" }}>
                                    {brand.families.length} familias de equipos
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
