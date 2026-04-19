import { ReactNode } from "react";

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}

export function NavButton({ active, onClick, icon, label }: NavButtonProps) {
    return (
        <button onClick={onClick} className="nf" style={{
            flex: 1, padding: "12px 0", border: "none", background: "none",
            color: active ? "var(--c-accent)" : "var(--c-dim)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
            fontSize: "12px", fontFamily: "'Rajdhani', sans-serif",
            position: "relative", cursor: "pointer",
        }}>
            <span style={{ fontSize: "22px" }}>{icon}</span>
            <span style={{ fontWeight: active ? "700" : "500" }}>{label}</span>
            {active && (
                <div style={{
                    position: "absolute", top: 0, width: "40%",
                    height: "2px", background: "var(--c-accent)",
                }} />
            )}
        </button>
    );
}
