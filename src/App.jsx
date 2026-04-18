import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { injectCSS, applyTheme } from "./theme";
import { useFavorites } from "./hooks/useFavorites";
import { NavButton } from "./components/NavButton";

// Vistas nuevas (Jerarquía)
import { BrandsView } from "./views/brands/BrandsView";
import { FamilyListView } from "./views/device/FamilyListView";
import { FamilyDetailView } from "./views/device/FamilyDetailView";

// Vistas de herramientas (adaptadas a activeFamily luego)
import { ErrorView } from "./views/ErrorView";
import { PartsView } from "./views/PartsView";
import { LEDRefView } from "./views/LEDRefView";

import { brandsCatalog } from "./data/catalog/brands";

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("ncr_theme");
        return saved ? saved === "dark" : true;
    });

    const [installPrompt, setInstallPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        injectCSS();
        applyTheme(isDark);

        const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
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

    // ── Navigation State (Jerarquía) ──
    const [nav, setNav] = useState({ brand: null, family: null, section: null });

    const goHome = useCallback(() => setNav({ brand: null, family: null, section: null }), []);
    const selectBrand = useCallback((b) => setNav({ brand: b, family: null, section: null }), []);
    const selectFamily = useCallback((f) => setNav(prev => ({ ...prev, family: f, section: null })), []);
    const selectSection = useCallback((s) => setNav(prev => ({ ...prev, section: s })), []);

    // ── Bottom Nav Bar Logic ──
    // Se muestra sólo si estamos dentro de una familia
    const activeBrandData = nav.brand ? brandsCatalog.find(b => b.id === nav.brand) : null;
    const activeFamData = activeBrandData && nav.family ? activeBrandData.families.find(f => f.id === nav.family) : null;

    // ── Search & filters (reset upon unmount or nav) ──
    const [query, setQuery] = useState("");
    const [deviceFilter, setDeviceFilter] = useState("all");
    const [catFilter, setCatFilter] = useState("all");
    const inputRef = useRef(null);

    const [errMode, setErrMode] = useState("tree");
    const [treeOpen, setTreeOpen] = useState(null);
    const [treeComp, setTreeComp] = useState(null);
    const [partsOpen, setPartsOpen] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const toggleExpanded = useCallback((id) => setExpanded(prev => prev === id ? null : id), []);

    const { favorites, toggleFavorite } = useFavorites();

    // Reset transients on section change
    useEffect(() => {
        setQuery("");
        setExpanded(null);
        setDeviceFilter("all");
        setCatFilter("all");
        setTreeOpen(null);
        setPartsOpen(null);
    }, [nav.section, nav.family]);


    const renderView = () => {
        if (nav.section) {
            // Render specific tool passing context
            switch (nav.section) {
                case "errors":
                    return <ErrorView 
                        activeFamily={nav.family}
                        query={query} onQueryChange={setQuery} inputRef={inputRef}
                        deviceFilter={deviceFilter} onDeviceFilter={setDeviceFilter}
                        catFilter={catFilter} onCatFilter={setCatFilter}
                        errMode={errMode} onErrMode={setErrMode}
                        treeOpen={treeOpen} onTreeOpen={setTreeOpen}
                        treeComp={treeComp} onTreeComp={setTreeComp}
                        expanded={expanded} onExpanded={toggleExpanded}
                        favorites={favorites} onToggleFav={toggleFavorite}
                    />;
                case "parts":
                    return <PartsView 
                        activeFamily={nav.family}
                        query={query} onQueryChange={setQuery} inputRef={inputRef}
                        partsOpen={partsOpen} onPartsOpen={setPartsOpen}
                        expanded={expanded} onExpanded={toggleExpanded}
                        favorites={favorites} onToggleFav={toggleFavorite}
                    />;
                case "reference":
                case "sensors":
                    return <LEDRefView activeFamily={nav.family} />;
                default:
                    return <div>Under construction</div>;
            }
        }
        if (nav.family) {
            return <FamilyDetailView 
                activeBrand={nav.brand} 
                activeFamily={nav.family} 
                onSelectSection={selectSection} 
                onBack={() => selectBrand(nav.brand)} 
            />;
        }
        if (nav.brand) {
            return <FamilyListView 
                activeBrand={nav.brand} 
                onSelectFamily={selectFamily} 
                onBack={goHome} 
            />;
        }
        return <BrandsView onSelectBrand={selectBrand} />;
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <div className="bg-grid" />

            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
                padding: "12px 16px",
                background: "var(--c-header-bg)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--c-border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {(nav.brand || nav.family || nav.section) && (
                        <button onClick={() => {
                            if (nav.section) selectSection(null);
                            else if (nav.family) selectBrand(nav.brand);
                            else goHome();
                        }} className="nf" style={{
                            background: "transparent", border: "none", color: "var(--c-text)",
                            fontSize: "22px", cursor: "pointer", padding: "0 4px 0 0",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            ←
                        </button>
                    )}
                        <div style={{
                            width: "auto", minWidth: "36px", height: "30px", background: "var(--c-accent)",
                            padding: "0 6px",
                            borderRadius: "6px", display: "flex", alignItems: "center",
                            justifyContent: "center", color: "var(--c-bg)", fontWeight: "bold",
                            fontFamily: "'Orbitron', sans-serif", fontSize: "14px",
                        }}>ATM</div>
                        <div className="font-orbitron" style={{ fontSize: "14px", color: "var(--c-accent)", letterSpacing: "1px" }}>
                            TECH PRO ATM
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
                {renderView()}
            </main>
        </div>
    );
}
