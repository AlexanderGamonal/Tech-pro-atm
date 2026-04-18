import { useState } from "react";
import { theme, fonts } from "../theme";
import { SearchBar, Sec, None, PartCard } from "../components/ui";

import { S2_PARTS } from "../data/devices/ncr/s2/parts";
import { BRM_PARTS } from "../data/devices/ncr/brm/parts";

export function PartsView({
    activeFamily,
    query, onQueryChange, inputRef,
    expanded, onExpanded,
    favorites, onToggleFav,
}) {
    const queryLower = query.toLowerCase().trim();
    const isSearching = queryLower !== "";

    const PARTS_DATA = activeFamily === "s2" ? S2_PARTS : BRM_PARTS;

    const filteredParts = PARTS_DATA.filter(p =>
        queryLower === "" ||
        p.pn.toLowerCase().includes(queryLower) ||
        p.d.toLowerCase().includes(queryLower) ||
        p.m.toLowerCase().includes(queryLower)
    );

    return (
        <div>
            <SearchBar value={query} onChange={onQueryChange} placeholder="Buscar número de parte, descripción..." inputRef={inputRef} />

            {/* Part List */}
            {filteredParts.length > 0 ? (
                <>
                    <Sec n={filteredParts.length}>
                        PARTES {activeFamily === "s2" ? "S2 DISPENSER" : "BRM RECICLADOR"}
                    </Sec>
                    {filteredParts.map((p, i) => (
                        <PartCard key={p.pn} part={p} index={i} expanded={expanded} onToggle={onExpanded} favorites={favorites} onToggleFav={onToggleFav} />
                    ))}
                </>
            ) : (
                <None icon="🔧" title="Sin resultados" subtitle="Busca por número de parte o descripción" />
            )}
        </div>
    );
}
