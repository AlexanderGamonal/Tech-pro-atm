import { useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { SearchBar, Sec, None, PartCard } from "../components/ui";

import { S2_PARTS } from "../data/devices/ncr/s2/parts";
import { BRM_PARTS } from "../data/devices/ncr/brm/parts";

interface PartsViewProps { favorites: string[]; onToggleFav: (id: string) => void; }
export function PartsView({ favorites, onToggleFav }: PartsViewProps) {
    const { familyId: activeFamily } = useParams();
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toggleExpanded = useCallback((id: string) => setExpanded(prev => prev === id ? null : id), []);

    const queryLower = query.toLowerCase().trim();

    const PARTS_DATA = activeFamily === "s2" ? S2_PARTS : BRM_PARTS;

    const filteredParts = PARTS_DATA.filter(p =>
        queryLower === "" ||
        p.pn.toLowerCase().includes(queryLower) ||
        p.d.toLowerCase().includes(queryLower) ||
        p.m.toLowerCase().includes(queryLower)
    );

    return (
        <div>
            <SearchBar value={query} onChange={setQuery} placeholder="Buscar número de parte, descripción..." inputRef={inputRef} />

            {/* Part List */}
            {filteredParts.length > 0 ? (
                <>
                    <Sec n={filteredParts.length}>
                        PARTES {activeFamily === "s2" ? "S2 DISPENSER" : "BRM RECICLADOR"}
                    </Sec>
                    {filteredParts.map((p, i) => (
                        <PartCard key={p.pn} part={p} index={i} expanded={expanded} onToggle={toggleExpanded} favorites={favorites} onToggleFav={onToggleFav} />
                    ))}
                </>
            ) : (
                <None icon="🔧" title="Sin resultados" subtitle="Busca por número de parte o descripción" />
            )}
        </div>
    );
}
