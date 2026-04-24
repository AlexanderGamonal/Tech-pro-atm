import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { injectCSS, applyTheme } from "./theme";
import { useFavorites } from "./hooks/useFavorites";

import { BrandsView } from "./views/brands/BrandsView";
import { FamilyListView } from "./views/device/FamilyListView";
import { FamilyDetailView } from "./views/device/FamilyDetailView";

const ErrorView = lazy(() => import("./views/ErrorView").then(m => ({ default: m.ErrorView })));
const PartsView = lazy(() => import("./views/PartsView").then(m => ({ default: m.PartsView })));
const LEDRefView = lazy(() => import("./views/LEDRefView").then(m => ({ default: m.LEDRefView })));
const AptraView = lazy(() => import("./views/AptraView").then(m => ({ default: m.AptraView })));
const SensorsView = lazy(() => import("./views/SensorsView").then(m => ({ default: m.SensorsView })));

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("ncr_theme");
        return saved ? saved === "dark" : true;
    });

    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        injectCSS();
        applyTheme(isDark);

        const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e as unknown as BeforeInstallPromptEvent); };
        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", () => { setInstalled(true); setInstallPrompt(null); });
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;
            applyTheme(next);
            localStorage.setItem("ncr_theme", next ? "dark" : "light");
            return next;
        });
    }, []);

    const { favorites, toggleFavorite } = useFavorites();

    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div style={{ minHeight: "100vh" }}>
            <div className="bg-grid" />
            <div className="bg-scan" />

            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
                padding: "12px 16px",
                background: "var(--c-header-bg)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid var(--c-border)",
                boxShadow: "0 1px 0 rgba(0,212,255,.12), 0 4px 24px rgba(0,0,0,.5)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {!isHome && (
                        <button onClick={() => navigate(-1)} className="nf" style={{
                            background: "transparent", border: "none", color: "var(--c-text)",
                            fontSize: "22px", cursor: "pointer", padding: "0 4px 0 0",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            ←
                        </button>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
                        <div className="badge-neon" style={{
                            width: "auto", minWidth: "36px", height: "30px", background: "var(--c-accent)",
                            padding: "0 8px",
                            borderRadius: "6px", display: "flex", alignItems: "center",
                            justifyContent: "center", color: "#04070e", fontWeight: "900",
                            fontFamily: "'Orbitron', sans-serif", fontSize: "14px",
                            letterSpacing: "1px",
                        }}>ATM</div>
                        <div className="font-orbitron header-title-glow" style={{ fontSize: "14px", color: "var(--c-accent)", letterSpacing: "2px" }}>
                            TECH PRO
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "12px", color: "var(--c-dim)", fontFamily: "'Share Tech Mono'" }}>v3.0.0</div>
                    {installPrompt && !installed && (
                        <button onClick={async () => {
                            installPrompt.prompt();
                            const { outcome } = await installPrompt.userChoice;
                            if (outcome === "accepted") { setInstalled(true); setInstallPrompt(null); }
                        }} className="nf" style={{
                            padding: "0 10px", height: 34, borderRadius: 8,
                            border: "1px solid var(--c-accent)", background: "var(--c-accent-bg)",
                            color: "var(--c-accent)", cursor: "pointer", fontSize: 12,
                            fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                            letterSpacing: ".5px", whiteSpace: "nowrap",
                        }}>⬇ Instalar</button>
                    )}
                    <button onClick={toggleTheme} className="nf" style={{
                        width: 36, height: 36, borderRadius: 8, border: "1px solid var(--c-border)",
                        background: "var(--c-card)", cursor: "pointer", fontSize: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{isDark ? "☀️" : "🌙"}</button>
                </div>
            </header>

            <main style={{ paddingTop: "62px", paddingBottom: "20px" }}>
                <Suspense fallback={
                    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0", color: "var(--c-dim)", fontFamily: "'Share Tech Mono'", fontSize: 13 }}>
                        Cargando...
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<BrandsView />} />
                        <Route path="/:brandId" element={<FamilyListView />} />
                        <Route path="/:brandId/:familyId" element={<FamilyDetailView />} />
                        <Route path="/:brandId/:familyId/errors" element={
                            <ErrorView favorites={favorites} onToggleFav={toggleFavorite} />
                        } />
                        <Route path="/:brandId/:familyId/parts" element={
                            <PartsView favorites={favorites} onToggleFav={toggleFavorite} />
                        } />
                        <Route path="/:brandId/:familyId/reference" element={<LEDRefView />} />
                        <Route path="/:brandId/:familyId/sensors" element={<SensorsView />} />
                        <Route path="/:brandId/:familyId/aptra" element={<AptraView />} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
}
