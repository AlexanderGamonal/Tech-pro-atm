// ── S2 Dispenser M_DATA Reference Tables ──
// Source: B006-6273-U000 Status Code Book pp. 193-204

// Byte 1 — Unit Identities
export const S2_UNITS = [
    { hex: "00", label: "Control Board (placa controladora)" },
    { hex: "01", label: "Pick Unit 1" },
    { hex: "02", label: "Pick Unit 2" },
    { hex: "03", label: "Pick Unit 3" },
    { hex: "04", label: "Pick Unit 4" },
    { hex: "05", label: "Pick Unit 5" },
    { hex: "06", label: "Pick Unit 6" },
    { hex: "07", label: "SNT (Single Note Transport)" },
    { hex: "08", label: "Carriage (carro)" },
    { hex: "09", label: "Bin (contenedor)" },
    { hex: "0A", label: "Presenter Chassis (chasis presentador)" },
    { hex: "0B", label: "Shutter (compuerta)" },
    { hex: "0C", label: "Media Aligner (alineador de billetes)" },
    { hex: "0D", label: "Vacuum System (sistema de vacío)" },
    { hex: "FF", label: "Software Application Sequence Error" },
];

// Byte 2 — Point in operation (M_STATUS 4, 5, 21-52)
export const S2_OP_POINTS = [
    { code: "00", desc: "Antes de iniciar la operación" },
    { code: "01", desc: "Durante la operación" },
    { code: "02", desc: "Al finalizar la operación" },
];

// Byte 3 — Sensor failure mode (M_STATUS 21-33)
export const S2_SENSOR_FAIL = [
    { code: "0", desc: "Failed clear — sensor no limpia (sigue bloqueado)" },
    { code: "1", desc: "Failed blocked — sensor no bloquea (sigue limpio)" },
    { code: "2", desc: "No sensor POI — sin punto de inicio para el sensor" },
    { code: "3", desc: "CIC sensor reading invalid — lectura CIC inválida" },
    { code: "4", desc: "Out of range — valor analógico fuera de rango" },
];

// Byte 4 — Sensor Identities per unit (M_STATUS 21-33 y 70-79)
export const S2_SENSORS = [
    {
        unit: "SNT",
        sensors: [
            { id: "00", name: "Divert gate position (posición compuerta divert)" },
            { id: "01", name: "Stacker entry (entrada al stacker)" },
            { id: "02", name: "Divert bin entry (entrada al divert bin)" },
            { id: "03", name: "HETS izquierdo" },
            { id: "04", name: "HETS derecho" },
            { id: "05", name: "Media Width izquierdo (ancho de billete izq)" },
            { id: "06", name: "Media Width derecho (ancho de billete der)" },
            { id: "07", name: "Main timing disk (disco de temporización principal)" },
            { id: "08", name: "Media deflector home sensor" },
            { id: "09", name: "Media deflector extended sensor" },
        ],
    },
    {
        unit: "Carriage",
        sensors: [
            { id: "00", name: "Carriage home (posición inicial)" },
            { id: "01", name: "Carriage position (posición actual)" },
            { id: "02", name: "Carriage belt encoder (encoder de correa)" },
            { id: "03", name: "Bunch (grupo de billetes)" },
            { id: "04", name: "Pre-exit (pre-salida)" },
            { id: "05", name: "Exit (salida)" },
        ],
    },
    {
        unit: "Presenter Chassis",
        sensors: [
            { id: "00", name: "Clamp position (posición de pinza)" },
            { id: "01", name: "Retract entry (entrada de retracto)" },
            { id: "02", name: "Reject entry (entrada de rechazo)" },
            { id: "03", name: "Purge Bin latch (traba del purge bin)" },
            { id: "04", name: "Purge Bin present (purge bin presente)" },
            { id: "05", name: "Module latch (traba del módulo)" },
        ],
    },
    {
        unit: "Shutter",
        sensors: [
            { id: "00", name: "Shutter open (compuerta abierta)" },
            { id: "01", name: "Shutter closed (compuerta cerrada)" },
        ],
    },
    {
        unit: "Pick",
        sensors: [
            { id: "00", name: "Pick arm position (posición del brazo de pique)" },
            { id: "01", name: "D-wheel position (posición de rueda D)" },
            { id: "02", name: "Pick transport" },
            { id: "03", name: "Cassette ID" },
            { id: "04", name: "Cassette latch (traba del cassette)" },
            { id: "05", name: "Cassette low (nivel bajo de cassette)" },
        ],
    },
    {
        unit: "Media Aligner",
        sensors: [
            { id: "00", name: "Media Aligner position (posición del alineador)" },
        ],
    },
    {
        unit: "Vacuum System",
        sensors: [
            { id: "00", name: "Vacuum sensor (sensor de vacío)" },
        ],
    },
];

// Byte 3 — Mechanism Fault Descriptions (M_STATUS 41-52)
export const S2_MECH_FAULTS = [
    {
        unit: "SNT",
        dir: "00=Hacia stack · 01=Hacia divert",
        faults: [
            { code: "00", desc: "Divert gate atascada en posición stack" },
            { code: "01", desc: "Divert gate atascada en posición divert" },
            { code: "02", desc: "Divert gate atascada entre posiciones" },
            { code: "03", desc: "Motor principal falló" },
            { code: "04", desc: "Motor principal demasiado lento" },
            { code: "05", desc: "Media deflector atascado" },
        ],
    },
    {
        unit: "Carriage",
        dir: "00=A Home · 01=A Present · 02=A Rotate",
        faults: [
            { code: "00", desc: "Carriage atascado en posición Present" },
            { code: "01", desc: "Carriage atascado en posición Home" },
            { code: "02", desc: "Carriage atascado en posición Purge" },
            { code: "03", desc: "Carriage atascado en posición RFP" },
            { code: "04", desc: "Carriage atascado entre Present y Home" },
            { code: "05", desc: "Carriage atascado entre Home y RFP" },
            { code: "06", desc: "Carriage atascado entre Home y Purge" },
            { code: "07", desc: "Carriage atascado entre RFP y Purge" },
            { code: "08", desc: "Carriage atascado entre Purge y Present" },
            { code: "09", desc: "Carriage atascado entre Home y Park" },
            { code: "0A", desc: "Carriage atascado entre Park y Present" },
            { code: "0B", desc: "Motor de transmisión del Carriage falló" },
            { code: "0C", desc: "Motor de transmisión del Carriage demasiado rápido" },
            { code: "0D", desc: "Motor de transmisión del Carriage demasiado lento" },
            { code: "0E", desc: "Motor de correa del Carriage falló" },
        ],
    },
    {
        unit: "Presenter (Clamp)",
        dir: "00=A Home · 01=A Present · 02=A Rotate",
        faults: [
            { code: "00", desc: "Clamp atascado en posición Home" },
            { code: "01", desc: "Clamp atascado en posición Present" },
            { code: "02", desc: "Clamp atascado en posición Rotate" },
            { code: "03", desc: "Clamp atascado entre Home y Present" },
            { code: "04", desc: "Clamp atascado entre Present y Rotate" },
            { code: "05", desc: "Motor del Clamp falló" },
            { code: "06", desc: "Motor del Clamp demasiado lento" },
            { code: "07", desc: "Motor del Clamp demasiado rápido" },
        ],
    },
    {
        unit: "Shutter",
        dir: "00=A Open · 01=A Close",
        faults: [
            { code: "00", desc: "Shutter atascado abierto" },
            { code: "01", desc: "Shutter atascado cerrado" },
            { code: "02", desc: "Shutter atascado entre abierto y cerrado" },
            { code: "03", desc: "Ambos sensores del Shutter bloqueados — posición desconocida" },
        ],
    },
    {
        unit: "Pick",
        dir: "n = Fase n del ciclo",
        faults: [
            { code: "00", desc: "Falla en motor del brazo de pique (Pick arm motor)" },
            { code: "01", desc: "Falla en rueda D (D-wheel)" },
        ],
    },
    {
        unit: "Media Aligner",
        dir: "00=Hacia adelante · 01=Reversa",
        faults: [
            { code: "00", desc: "Media Aligner atascado" },
        ],
    },
    {
        unit: "Vacuum System",
        dir: "—",
        faults: [
            { code: "00", desc: "Falla en el sistema de vacío" },
        ],
    },
];

// Byte 2 — Media Jam Descriptions (M_STATUS 61-69)
export const S2_JAM_DESC = [
    {
        unit: "SNT",
        jams: [
            { code: "00", desc: "Atasco antes del HETS" },
            { code: "01", desc: "Atasco en el HETS" },
            { code: "02", desc: "Atasco en sensor de ancho de media" },
            { code: "03", desc: "Atasco entre sensor ancho y entrada del stacker" },
            { code: "04", desc: "Atasco entre sensor ancho y entrada del divert" },
            { code: "05", desc: "Atasco en entrada del stack" },
            { code: "06", desc: "Atasco en entrada del divert" },
        ],
    },
    {
        unit: "Carriage",
        jams: [
            { code: "00", desc: "Atasco en sensor Bunch" },
            { code: "01", desc: "Atasco en sensores Bunch y Pre-exit" },
            { code: "02", desc: "Atasco en sensor Pre-exit" },
            { code: "03", desc: "Atasco en sensores Pre-exit y Exit" },
            { code: "04", desc: "Atasco en sensor Exit" },
            { code: "05", desc: "Atasco entre Bunch y entrada de rechazo" },
            { code: "06", desc: "Atasco entre Bunch y entrada de retracto" },
            { code: "07", desc: "Atasco entre Bunch y Pre-exit" },
            { code: "08", desc: "Atasco entre Pre-exit y Exit" },
            { code: "09", desc: "Grupo de billetes no presentable (Bunch not presentable)" },
        ],
    },
    {
        unit: "Bin",
        jams: [
            { code: "00", desc: "Atasco en sensor de entrada al purge" },
            { code: "01", desc: "Atasco en sensor de entrada al retract" },
        ],
    },
];

// Byte 2 — Pick Error Reasons (M_STATUS 81-86)
export const S2_PICK_ERRORS = [
    { code: "00", desc: "Pick Failure — falla general de pique" },
    { code: "01", desc: "Tipo de cassette cambió desde que inició la solicitud" },
    { code: "02", desc: "Demasiados billetes rechazados" },
    { code: "03", desc: "Cassette vacío" },
    { code: "04", desc: "Billete rechazado en el stacker" },
    { code: "05", desc: "Pusher plate trabada" },
    { code: "06", desc: "Billete demasiado grueso para aprender (Too Thick to Learn)" },
];
