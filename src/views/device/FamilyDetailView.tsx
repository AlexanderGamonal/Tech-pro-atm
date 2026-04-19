import { useParams, useNavigate } from "react-router-dom";
import { brandsCatalog } from "../../data/catalog/brands";
import { Tag } from "../../components/ui";
import { fonts } from "../../theme";

export function FamilyDetailView() {
    const { brandId, familyId } = useParams();
    const navigate = useNavigate();
    const brandData = brandsCatalog.find(b => b.id === brandId);
    const famData = brandData?.families.find(f => f.id === familyId);

    if (!brandData || !famData) return null;

    return (
        <div style={{ padding: "0", animation: "fi 0.4s ease" }}>
            <div style={{ padding: "16px 20px 5px", background: "var(--c-card)", borderBottom: "1px solid var(--c-border)" }}>
                <div style={{ marginTop: "6px", paddingBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                        <Tag color="var(--c-accent)">{brandData.name}</Tag>
                        <Tag color="var(--c-dim)">{famData.tech}</Tag>
                    </div>
                    <h2 className="font-orbitron" style={{ color: "var(--c-bright)", fontSize: "28px", margin: "5px 0" }}>
                        {famData.name}
                    </h2>
                    <div style={{ fontSize: "13px", color: "var(--c-accent)", fontFamily: fonts.mono, marginBottom: "12px" }}>
                        Soporte: {famData.models}
                    </div>
                    <p style={{ color: "var(--c-tx)", fontSize: "14px", fontFamily: fonts.display, lineHeight: 1.5 }}>
                        {famData.desc}
                    </p>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                <h3 className="font-orbitron" style={{ color: "var(--c-dim)", fontSize: "14px", marginBottom: "15px" }}>HERRAMIENTAS</h3>
                <div style={{ display: "grid", gap: "14px" }}>
                    {famData.sections.map((sec, i) => (
                        <div key={sec.id} onClick={() => navigate(`/${brandId}/${familyId}/${sec.id}`)} className="card-cyber nc"
                            style={{ cursor: "pointer", animation: `nF .3s ease ${i * .08}s both` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{ fontSize: "26px" }}>{sec.icon}</div>
                                <div>
                                    <div className="font-orbitron" style={{ fontSize: "17px", color: "var(--c-bright)" }}>
                                        {sec.title}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "var(--c-dim)" }}>
                                        {sec.desc}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
