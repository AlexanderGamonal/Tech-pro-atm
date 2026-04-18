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
