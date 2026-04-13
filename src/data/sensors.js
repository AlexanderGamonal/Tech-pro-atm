// Prefijos de tipos de sensor
export const SENSOR_TYPES = [
    ["PI", "Photo Interruptor (sensor óptico)"],
    ["SW", "Switch (interruptor)"],
    ["PS", "Photo Sensor (foto sensor)"],
    ["RS", "Rotary Swing / Solenoide"],
    ["BM", "Brushless DC Motor (motor sin escobillas)"],
    ["DM", "DC Motor (motor de corriente continua)"],
    ["SM", "Stepper Motor (motor paso a paso)"],
    ["SD", "Solenoide"],
];

// Comandos de diagnóstico y calibración BRM
export const DIAG_COMMANDS = [
    ["07 01", "Reset de módulo"],
    ["01 11 01", "Transport Test: Pocket → Dispense"],
    ["01 11 03", "Transport Test: Pocket → Escrow"],
    ["01 11 31", "Transport Test: Pocket → Escrow → Pocket"],
    ["10 42", "Shutter abrir-cerrar (pulsar SW3)"],
    ["10 43", "Shutter en loop continuo"],
    ["6100", "Calibración de todos los sensores"],
    ["611F", "RAS Upper Module"],
    ["6113", "RAS Escrow"],
    ["6114", "RAS Bridge/Centralisation"],
    ["612F", "RAS Lower Module"],
    ["6131", "RAS Lower Exception Cassette"],
];
