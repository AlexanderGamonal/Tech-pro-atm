export const brandsCatalog = [
    {
        id: "ncr",
        name: "NCR",
        families: [
            {
                id: "s2",
                name: "S2 Dispenser",
                models: "6623 / 6627",
                tech: "Dispensador de Billetes",
                desc: "Módulo de dispensado frontal y trasero con sistema de pique por fricción y transporte de billete único (SNT).",
                sections: [
                    { id: "errors", title: "Errores", icon: "⚠️", desc: "Decodificador M_STATUS" },
                    { id: "parts", title: "Partes", icon: "🔧", desc: "Catálogo S2" },
                    { id: "sensors", title: "Sensores", icon: "📟", desc: "Nomenclatura M_DATA" }
                ]
            },
            {
                id: "brm",
                name: "BRM Recycler",
                models: "6683 / 6687",
                tech: "Módulo Reciclador",
                desc: "Módulo de reciclaje de billetes (Bunch Recycling Module) con validador continuo, escrow y sistema de cassettes administrables.",
                sections: [
                    { id: "errors", title: "Errores", icon: "⚠️", desc: "Decodificador BRM" },
                    { id: "parts", title: "Partes", icon: "🔧", desc: "Catálogo BRM" },
                    { id: "reference", title: "BRM Ref", icon: "🛠", desc: "LEDs & Diagramas" },
                    { id: "aptra", title: "APTRA Diag", icon: "🖥", desc: "Device Diagnostics desde APTRA" },
                    { id: "sensors", title: "Sensores", icon: "🔌", desc: "Sensores y Actuadores BRM" }
                ]
            }
        ]
    }
];
