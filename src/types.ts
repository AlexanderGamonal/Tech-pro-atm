// ── Catalog ──────────────────────────────────────────────────────────────────

export interface CatalogSection {
    id: string;
    title: string;
    icon: string;
    desc: string;
}

export interface Family {
    id: string;
    name: string;
    models: string;
    tech: string;
    desc: string;
    sections: CatalogSection[];
}

export interface Brand {
    id: string;
    name: string;
    families: Family[];
}

// ── Device data ───────────────────────────────────────────────────────────────

export interface ATMError {
    code: number;
    desc: string;
    cat: string;
    catEs?: string;
    mdata?: string;
}

export interface Part {
    pn: string;
    d: string;
    m: string;
    eq: string;
    img?: string;
}

export interface TreeComponent {
    id: string;
    label: string;
    codes: number[];
}

// ── UI ────────────────────────────────────────────────────────────────────────

export type FamilyId = "s2" | "brm";
