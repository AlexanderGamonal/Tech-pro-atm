import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { injectCSS, applyTheme } from "./theme";
import { useFavorites } from "./hooks/useFavorites";
import { NavButton } from "./components/NavButton";
import { HomeView }  from "./views/HomeView";
import { ErrorView } from "./views/ErrorView";
import { PartsView } from "./views/PartsView";
import { LEDRefView } from "./views/LEDRefView";
import { S2, BRM } from "./data/errors";
import { ALLP } from "./data/parts";

const TABS = { HOME: "home", ERRORS: "errors", PARTS: "parts", LEDS: "leds" };

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("ncr_theme");
        return saved ? saved === "dark" : true;
    });

    useEffect(() => {
        injectCSS();
        applyTheme(isDark);
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;
            applyTheme(next);
            localStorage.setItem("ncr_theme", next ? "dark" : "light");
            return next;
        });
    }, []);

    // ── Navigation ──
    const [tab, setTab] = useState(TABS.HOME);

    // ── Search & filters ──
    const [query, setQuery]         = useState("");
    const [deviceFilter, setDeviceFilter] = useState("all");
    const [catFilter, setCatFilter]       = useState("all");
    const inputRef = useRef(null);
    const queryLower = query.toLowerCase().trim();

    // ── Error tree state ──
    const [errMode, setErrMode]     = useState("tree");
    const [treeOpen, setTreeOpen]   = useState(null);
    const [treeComp, setTreeComp]   = useState(null);

    // ── Parts tree state ──
    const [partsOpen, setPartsOpen] = useState(null);

    // ── Expanded card ──
    const [expanded, setExpanded]   = useState(null);
    const toggleExpanded = useCallback((id) => setExpanded(prev => prev === id ? null : id), []);

    // ── Favorites (persisted) ──
    const { favorites, toggleFavorite } = useFavorites();

    // ── Memoized filters ──
    const filteredS2 = useMemo(() => S2.filter(s =>
        (deviceFilter === "all" || deviceFilter === "s2") &&
        (catFilter === "all" || s.cat === catFilter) &&
        (queryLower === "" ||
            String(s.code).includes(queryLower) ||
            s.desc.toLowerCase().includes(queryLower) ||
            s.cat.toLowerCase().includes(queryLower) ||
            s.catEs.toLowerCase().includes(queryLower) ||
            (s.mdata || "").toLowerCase().includes(queryLower))
    ), [queryLower, deviceFilter, catFilter]);

    const filteredBRM = useMemo(() => BRM.filter(b =>
        (deviceFilter === "all" || deviceFilter === "brm") &&
        (catFilter === "all" || b.cat === catFilter) &&
        (queryLower === "" ||
            String(b.code).includes(queryLower) ||
            b.desc.toLowerCase().includes(queryLower) ||
            b.cat.toLowerCase().includes(queryLower) ||
            b.catEs.toLowerCase().includes(queryLower) ||
            (b.mdata || "").toLowerCase().includes(queryLower))
    ), [queryLower, deviceFilter, catFilter]);

    const filteredParts = useMemo(() => ALLP.filter(p =>
        queryLower === "" ||
        p.pn.toLowerCase().includes(queryLower) ||
        p.d.toLowerCase().includes(queryLower) ||
        p.m.toLowerCase().includes(queryLower)
    ), [queryLower]);

    const allCategories = useMemo(() =>
        [...new Set([...S2.map(s => s.cat), ...BRM.map(b => b.cat)])].sort()
    , []);

    // Reset query and filters when changing tabs
    const handleTabChange = useCallback((newTab) => {
        setTab(newTab);
        setQuery("");
        setExpanded(null);
        setDeviceFilter("all");
        setCatFilter("all");
    }, []);

    const renderView = () => {
        switch (tab) {
            case TABS.HOME:   return <HomeView setTab={handleTabChange} />;
            case TABS.LEDS:   return <LEDRefView />;
            case TABS.ERRORS: return (
                <ErrorView
                    query={query} onQueryChange={setQuery} inputRef={inputRef}
                    deviceFilter={deviceFilter} onDeviceFilter={setDeviceFilter}
                    catFilter={catFilter} onCatFilter={setCatFilter}
                    errMode={errMode} onErrMode={setErrMode}
                    treeOpen={treeOpen} onTreeOpen={setTreeOpen}
                    treeComp={treeComp} onTreeComp={setTreeComp}
                    expanded={expanded} onExpanded={toggleExpanded}
                    filteredS2={filteredS2} filteredBRM={filteredBRM}
                    allCategories={allCategories}
                    favorites={favorites} onToggleFav={toggleFavorite}
                />
            );
            case TABS.PARTS:  return (
                <PartsView
                    query={query} onQueryChange={setQuery} inputRef={inputRef}
                    partsOpen={partsOpen} onPartsOpen={setPartsOpen}
                    expanded={expanded} onExpanded={toggleExpanded}
                    filteredParts={filteredParts}
                    favorites={favorites} onToggleFav={toggleFavorite}
                />
            );
            default: return <HomeView setTab={handleTabChange} />;
        }
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
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "30px", height: "30px", background: "var(--c-accent)",
                        borderRadius: "6px", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "var(--c-bg)", fontWeight: "bold",
                        fontFamily: "'Orbitron', sans-serif", fontSize: "14px",
                    }}>N</div>
                    <div className="font-orbitron" style={{ fontSize: "14px", color: "var(--c-accent)" }}>NCR TECH</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: "12px", color: "var(--c-dim)", fontFamily: "'Share Tech Mono'" }}>v2.1.0</div>
                    <button onClick={toggleTheme} className="nf" style={{
                        width: 36, height: 36, borderRadius: 8, border: "1px solid var(--c-border)",
                        background: "var(--c-card)", cursor: "pointer", fontSize: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{isDark ? "☀️" : "🌙"}</button>
                </div>
            </header>

            <main style={{ paddingTop: "62px", paddingBottom: "70px" }}>
                {renderView()}
            </main>

            <nav style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
                background: "var(--c-nav-bg)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid var(--c-border)",
                display: "flex",
                paddingBottom: "env(safe-area-inset-bottom)",
            }}>
                <NavButton active={tab === TABS.HOME}   onClick={() => handleTabChange(TABS.HOME)}   icon="🏠" label="Inicio" />
                <NavButton active={tab === TABS.ERRORS} onClick={() => handleTabChange(TABS.ERRORS)} icon="⚠️" label="Errores" />
                <NavButton active={tab === TABS.PARTS}  onClick={() => handleTabChange(TABS.PARTS)}  icon="🔧" label="Partes" />
                <NavButton active={tab === TABS.LEDS}   onClick={() => handleTabChange(TABS.LEDS)}   icon="🛠" label="BRM Ref" />
            </nav>
        </div>
    );
}
