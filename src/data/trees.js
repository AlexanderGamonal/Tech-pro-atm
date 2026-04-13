// Árbol de componentes S2 — mapea cada componente a sus códigos M_STATUS
export const S2_TREE = [
    { id: "s2-snt",      label: "SNT (Single Note Transport)",    codes: [21, 41, 61, 70] },
    { id: "s2-carriage", label: "Carriage (Carro)",               codes: [22, 42, 62, 71] },
    { id: "s2-presenter",label: "Presenter (Presentador)",         codes: [23, 43, 72] },
    { id: "s2-shutter",  label: "Shutter (Compuerta)",            codes: [24, 44, 73] },
    { id: "s2-pick",     label: "Pick Units (Módulos de pique)",  codes: [25, 26, 27, 28, 29, 30, 45, 46, 47, 48, 49, 50, 64, 65, 66, 67, 68, 69, 74, 75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86] },
    { id: "s2-aligner",  label: "Aligner / BAM (Alineador)",      codes: [31, 51] },
    { id: "s2-vacuum",   label: "Vacuum System (Sistema de vacío)",codes: [32, 52] },
    { id: "s2-cassette", label: "Cassette (Gavetas)",             codes: [33] },
    { id: "s2-purge",    label: "Purge Bin (Bin de purga)",       codes: [91, 92, 93] },
    { id: "s2-board",    label: "Control Board / PCB",            codes: [1, 2, 3, 7, 8, 9] },
    { id: "s2-interlock",label: "Interlock (Seguridad)",          codes: [5, 99] },
    { id: "s2-general",  label: "General",                        codes: [0, 4, 6, 95] },
];

// Árbol de componentes BRM — mapea cada componente a sus códigos M_STATUS
export const BRM_TREE = [
    { id: "brm-pocket",         label: "Pocket (Boca de depósito)",        codes: [4, 27, 28, 29, 82, 84, 85] },
    { id: "brm-shutter",        label: "Shutter (Compuerta)",              codes: [21, 22, 23, 26] },
    { id: "brm-bv",             label: "Bill Validator (Validador)",        codes: [24, 32, 71] },
    { id: "brm-upper",          label: "Upper Transport (Transporte sup.)", codes: [31, 33, 38, 61, 62, 63, 64, 65, 66] },
    { id: "brm-escrow",         label: "Escrow (Custodia)",                codes: [34, 35] },
    { id: "brm-exception",      label: "Upper Exception Bin",              codes: [39, 67, 80] },
    { id: "brm-intermediate",   label: "Intermediate Transport",           codes: [72, 73] },
    { id: "brm-lower",          label: "Lower Transport (Transporte inf.)",codes: [42, 74, 75, 76] },
    { id: "brm-vertical",       label: "Vertical Transport",               codes: [43, 77, 78, 79] },
    { id: "brm-cassettes",      label: "Cassettes (Gavetas 1-5)",          codes: [44, 45, 46, 47, 68] },
    { id: "brm-exception-lower",label: "Lower Exception Cassette",         codes: [41] },
    { id: "brm-upper-cpu",      label: "Upper CPU PCB (Placa superior)",   codes: [48] },
    { id: "brm-lower-cpu",      label: "Lower CPU PCB (Placa inferior)",   codes: [49] },
    { id: "brm-general",        label: "General / Comunicación",           codes: [0, 1, 2, 3, 5, 6, 10, 20, 25, 50, 51, 52, 53, 60, 69, 70, 81, 83] },
];
