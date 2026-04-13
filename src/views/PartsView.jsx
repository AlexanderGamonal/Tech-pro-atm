import { S2P, BRMP } from "../data/parts";
import { theme, fonts } from "../theme";
import { SearchBar, Sec, None, Tag, PartCard, ICONS, BackButton } from "../components/ui";

export function PartsView({
    query, onQueryChange, inputRef,
    partsOpen, onPartsOpen,
    expanded, onExpanded,
    filteredParts,
    favorites, onToggleFav,
}) {
    const queryLower = query.toLowerCase().trim();
    const isSearching = queryLower !== "";
    const shadow = `0 1px 3px rgba(0,0,0,.25)`;

    const showParts = partsOpen && partsOpen !== "NOM"
        ? (partsOpen === "S2" ? S2P : BRMP).filter(p =>
            queryLower === "" ||
            p.pn.toLowerCase().includes(queryLower) ||
            p.d.toLowerCase().includes(queryLower) ||
            p.m.toLowerCase().includes(queryLower)
          )
        : filteredParts;

    return (
        <div>
            <SearchBar value={query} onChange={onQueryChange} placeholder="Buscar número de parte, descripción..." inputRef={inputRef} />

            {/* Search results flat */}
            {isSearching && (
                filteredParts.length
                    ? <><Sec n={filteredParts.length}>RESULTADOS</Sec>{filteredParts.map((p, i) => <PartCard key={p.pn} part={p} index={i} expanded={expanded} onToggle={onExpanded} favorites={favorites} onToggleFav={onToggleFav} />)}</>
                    : <None icon="🔧" title="Sin resultados" subtitle="Busca por número de parte o descripción" />
            )}

            {/* Tree mode */}
            {!isSearching && (
                <div style={{ padding: "6px 0" }}>
                    {/* Level 1: Equipment selection */}
                    {!partsOpen && (
                        <div style={{ padding: "0 14px" }}>
                            <div style={{ fontSize: 11, fontFamily: fonts.display, color: theme.dm, padding: "4px 0 12px" }}>
                                Selecciona el equipo para ver sus partes:
                            </div>
                            {[
                                ["S2",  "S2 DISPENSER", "NCR 6627 / 6623", "Partes del dispensador de billetes", theme.rd, theme.rdB, S2P.length],
                                ["BRM", "BRM",          "NCR 6687 / 6683", "Partes del módulo de reciclaje",     theme.gn, theme.gnB, BRMP.length],
                            ].map(([id, name, model, sub, cl, bg, n], i) => (
                                <div key={id} className="nc" onClick={() => { onPartsOpen(id); onExpanded(null); }}
                                    style={{ margin: "5px 0", padding: "16px", background: theme.card, borderRadius: 12, border: `1px solid ${theme.bd}`, cursor: "pointer", boxShadow: shadow, animation: `nF .3s ease ${i * .08}s both` }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, color: cl, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, fontWeight: 800, fontFamily: fonts.mono }}>
                                            {id === "S2" ? "S2" : id === "BRM" ? "BR" : "SN"}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.display, color: theme.br }}>{name}</div>
                                            <div style={{ fontSize: 11, fontFamily: fonts.mono, color: theme.am, marginTop: 2 }}>{model}</div>
                                            <div style={{ fontSize: 11, fontFamily: fonts.display, color: theme.dm, marginTop: 2 }}>{sub}</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontFamily: fonts.mono, fontSize: 18, fontWeight: 700, color: theme.am }}>{n}</span>
                                            <span style={{ color: theme.dm }}>{ICONS.arrowRight}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Level 2: Parts list */}
                    {partsOpen && partsOpen !== "NOM" && (
                        <div>
                            <div style={{ padding: "0 14px" }}>
                                <BackButton onClick={() => { onPartsOpen(null); onExpanded(null); }} label="Volver a equipos" />
                            </div>
                            <Sec n={showParts.length}>{partsOpen === "S2" ? "PARTES S2 DISPENSER" : "PARTES BRM"}</Sec>
                            {showParts.map((p, i) => <PartCard key={p.pn} part={p} index={i} expanded={expanded} onToggle={onExpanded} favorites={favorites} onToggleFav={onToggleFav} />)}
                            {showParts.length === 0 && <None icon="🔧" title="Sin resultados" subtitle="No se encontraron partes" />}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
