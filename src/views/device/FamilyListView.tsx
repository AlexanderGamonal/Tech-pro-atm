import { useParams, useNavigate } from "react-router-dom";
import { brandsCatalog } from "../../data/catalog/brands";
import { ICONS, BackButton } from "../../components/ui";
import { theme, fonts } from "../../theme";

export function FamilyListView() {
    const { brandId } = useParams();
    const navigate = useNavigate();
    const brandData = brandsCatalog.find(b => b.id === brandId);
    if (!brandData) return null;



    return (
        <div style={{ padding: "0", animation: "fi 0.4s ease" }}>
            <BackButton onClick={() => navigate(-1)} label="Volver" />
            <div style={{ padding: "4px 20px 20px" }}>
                <h2 className="font-orbitron" style={{ color: "var(--c-bright)", fontSize: "26px", marginBottom: "5px" }}>
                    EQUIPOS {brandData.name}
                </h2>
                <p style={{ color: "var(--c-dim)", marginBottom: "25px", fontSize: "14px", fontFamily: fonts.display }}>
                    Selecciona una familia de hardware.
                </p>

                <div style={{ display: "grid", gap: "14px" }}>
                    {brandData.families.map((fam, i) => (
                        <div key={fam.id} onClick={() => navigate(`/${brandId}/${fam.id}`)} className="card-cyber nc"
                            style={{ cursor: "pointer", borderLeft: `4px solid ${fam.id === 's2' ? theme.rd : theme.gn}`, animation: `nF .3s ease ${i * .08}s both` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{
                                    width: 48, height: 48, background: "var(--c-bg)", borderRadius: 12, border: "1px solid var(--c-border)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: fam.id === "s2" ? theme.rd : theme.gn, fontSize: "18px", fontWeight: "bold",
                                    fontFamily: fonts.mono
                                }}>
                                    {fam.id === "s2" ? "S2" : "BRM"}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="font-orbitron" style={{ fontSize: "17px", color: "var(--c-bright)" }}>
                                        {fam.name}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "var(--c-dim)", fontFamily: fonts.mono, marginTop: 2 }}>
                                        {fam.models}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--c-dim)", marginTop: 4 }}>
                                        {fam.tech}
                                    </div>
                                </div>
                                <span style={{ color: "var(--c-dim)" }}>{ICONS.arrowRight}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
