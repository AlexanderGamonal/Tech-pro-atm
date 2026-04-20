export type AptraCommand = {
    id: string;
    name: string;
    note?: "*" | "**";
    video?: boolean;
    desc: string;
    details?: string[];
};

export const APTRA_COMMANDS: AptraCommand[] = [
    {
        id: "clear-out",
        name: "Clear Out",
        note: "**",
        video: true,
        desc: "Intenta un reset mecánico del BRM. Lleva todos los billetes hasta el pocket y abre el shutter para su extracción.",
        details: [
            "Si el equipo es liberado exitosamente, se muestra el mensaje DEVICE CLEARED.",
            "De lo contrario, se muestra el mensaje DEVICE NOT CLEARED.",
        ],
    },
    {
        id: "clear-in",
        name: "Clear In",
        note: "*",
        desc: "Mueve los billetes al área segura del equipo.",
        details: [
            "Durante el test aparece un mensaje de precaución ya que los billetes son movidos al área segura del equipo.",
            "Al presionar OK se confirma la operación.",
            "Se realiza un reset del módulo y los billetes son llevados a exception 84 o a la posición de cassette seleccionada usando el test Set Storage Container.",
        ],
    },
    {
        id: "set-storage-container",
        name: "Set Storage Container",
        note: "*",
        desc: "Muestra dónde se van a depositar los billetes durante los test CLEAR IN y ENCASH. Por defecto es la primera posición disponible en el siguiente orden de prioridad:",
        details: [
            "1. Upper Exception Bin",
            "2. Lower Exception Cassette Bins 1, 2 and then 3",
            "3. Lower Exception Cassette Deposit Bin",
            "4. Cassette Positions 1 through 5 (bottom)",
        ],
    },
    {
        id: "accept",
        name: "Accept",
        desc: "Valida e ingresa billetes al equipo.",
        details: [
            "Cuando no hay billetes y el shutter está cerrado, se solicita indicar el destino de los billetes no reconocidos.",
            "A continuación se abre el shutter, se colocan los billetes, se confirma la operación y se procesan.",
            "En caso de haber billetes de un test previo, el test continúa con la etapa PROCESSING NOTES.",
            "Al finalizar la validación se muestra: note ID, category, serial number and orientation of each note recognised, reasons for any invalid notes, count summary per note category.",
        ],
    },
    {
        id: "encash",
        name: "Encash",
        note: "*",
        desc: "Coloca los billetes del escrow en el cassette seleccionado con el test Set Storage Container.",
        details: [
            "NOTES ENCASHED — Todos los billetes fueron almacenados exitosamente.",
            "NO NOTES ENCASHED — No hay billetes en el escrow para depositar.",
            "PARTIAL ENCASH — Se produjo una falla durante el test (con datos de error).",
        ],
    },
    {
        id: "refund",
        name: "Refund",
        note: "**",
        video: true,
        desc: "Todos los billetes almacenados en el escrow son devueltos al pocket para ser presentados y retirados.",
    },
    {
        id: "read-status",
        name: "Read Status",
        desc: "Muestra los valores de bytes T-DATA.",
        details: [
            "Con la opción LOOP desactivada, muestra toda la información de los módulos al desplazarse por las páginas.",
            "En modo LOOP, el test se utiliza como test de sensor mostrando en una sola página los valores de byte del punto de acceso, el sensor y los actuadores.",
        ],
    },
    {
        id: "deposit-run-to-run",
        name: "Deposit Run To Run",
        note: "*",
        desc: "Realiza simultáneamente los test de ACCEPT y ENCASH en una sola operación.",
    },
    {
        id: "return-run-to-run",
        name: "Return Run To Run",
        note: "**",
        desc: "Realiza simultáneamente los test de ACCEPT y REFUND en una sola operación.",
    },
    {
        id: "set-notes",
        name: "Set Notes",
        note: "*",
        desc: "Permite elegir la cantidad de billetes a ser seleccionados en el test de STACK. El máximo es de 200 billetes.",
    },
    {
        id: "stack",
        name: "Stack",
        note: "*",
        video: true,
        desc: "Extrae los billetes y los lleva hasta el pocket para presentarlos. La cantidad de billetes son los seteados en el test SET NOTES.",
    },
    {
        id: "present",
        name: "Present",
        note: "**",
        desc: "Abre el shutter y presenta los billetes en el pocket para ser retirados.",
    },
    {
        id: "dispense",
        name: "Dispense",
        note: "*",
        desc: "Realiza simultáneamente los test de STACK y PRESENT.",
    },
    {
        id: "test-cash-units",
        name: "Test Cash Units",
        note: "*",
        desc: "Saca un billete de cada cassette disponible, lo almacena en escrow y luego lo devuelve a los cassettes.",
        details: [
            "Durante el test se muestra la posición del cassette que está siendo probada.",
            "SUCCESS — El cassette fue probado exitosamente.",
            "EMPTY — No había billetes en el cassette.",
            "FAIL — Falla de la operación (el cassette podría ser de solo depósito).",
        ],
    },
    {
        id: "shutter-test",
        name: "Shutter Test",
        note: "**",
        desc: "Prueba la apertura del shutter.",
    },
    {
        id: "open-shutter",
        name: "Open Shutter",
        note: "**",
        desc: "Abre el shutter del equipo.",
    },
    {
        id: "close-shutter",
        name: "Close Shutter",
        desc: "Cierra el shutter del equipo.",
    },
    {
        id: "test-transport-motors",
        name: "Test Transport Motors",
        desc: "Prueba todos los motores del transporte (excepto el motor de 3-way ubicado en el separator).",
    },
    {
        id: "test-feed-motors",
        name: "Test Feed Motors Media",
        note: "*",
        desc: "Prueba todos los motores del pocket.",
    },
    {
        id: "test-escrow-drum",
        name: "Test Escrow Drum",
        desc: "Prueba el motor escrow.",
        details: [
            "Asegúrese que no haya billetes en el escrow para efectuar el test.",
            "No utilizar este test para vaciar el escrow.",
        ],
    },
    {
        id: "test-cassette-motors",
        name: "Test Cassette Motors Media",
        note: "*",
        desc: "Prueba todos los motores de los cassettes.",
    },
    {
        id: "test-3way-motor",
        name: "Test 3-Way Motor",
        desc: "Prueba solo el motor de 3-way en el separador.",
    },
    {
        id: "test-divert-gate",
        name: "Test Divert Gate",
        video: true,
        desc: "Este test prueba las divert gates (las puertas de desvío).",
        details: [
            "Se debe observar el movimiento de las mismas ya que el sistema no indica falla en caso de que no funcionen.",
        ],
    },
    {
        id: "guidance-lights",
        name: "Guidance Lights",
        desc: "Permite probar los semáforos indicadores del equipo.",
    },
    {
        id: "test-camera",
        name: "Test Camera",
        note: "**",
        desc: "Toma una imagen de los billetes depositados e informa si hay algún elemento extraño.",
    },
    {
        id: "metal-detect",
        name: "Metal Detect",
        note: "**",
        desc: "Revisa si entre los billetes depositados en el pocket hay un elemento metálico y lo informa.",
    },
    {
        id: "decashed-live",
        name: "De-Cashed Run To Run Live Media",
        desc: "Permite efectuar una prueba completa de depósito y dispensado del equipo con billetes reales.",
        details: [
            "Previo a la ejecución se debe realizar el test SET STORAGE CONTAINER para seleccionar la posición de depósito o reciclaje.",
            "El cassette no debe contener billetes para permitir ejecutar el test DEPOSIT RUN TO RUN.",
            "En caso de elegir una posición de reciclaje, esto permitirá correr el test de DISPENSE.",
            "Durante el test de DISPENSE, el test de STACK extraerá la cantidad de billetes seteados en SET NOTES.",
        ],
    },
    {
        id: "decashed-test",
        name: "De-Cashed Run To Run Test Media",
        desc: "Igual que DE-CASHED RUN TO RUN LIVE MEDIA pero acepta billetes de prueba que no puedan ser validados en el template del validador.",
        details: [
            "Todos los billetes son enviados al escrow y de ahí al cassette seleccionado para el test DEPOSIT RUN TO RUN.",
            "Al ejecutar el test de DISPENSE, entrega los billetes de prueba separados de los válidos.",
        ],
    },
    {
        id: "display-reject-rates",
        name: "Display Reject Rates",
        desc: "Muestra la tasa de rechazos en cada módulo.",
    },
    {
        id: "test-centralisation-motors",
        name: "Test Centralisation Motors",
        desc: "Prueba todos los motores del centralizador.",
    },
    {
        id: "device-self-test",
        name: "Device Self Test",
        desc: "Ejecuta una secuencia automática de tests del dispositivo.",
        details: [
            "1. Clear Out (except presenting of notes)",
            "2. Refund (except presenting of notes)",
            "3. Test Cash Units",
            "4. Shutter Test",
        ],
    },
    {
        id: "save-upper-log",
        name: "Save Upper Module Log",
        desc: "Guarda el log del módulo superior del BRM.",
    },
    {
        id: "save-lower-log",
        name: "Save Lower Module Log",
        desc: "Guarda el log del módulo inferior del BRM.",
    },
    {
        id: "save-bv-log",
        name: "Save BV Log",
        desc: "Guarda el log del validador de billetes (Bill Validator).",
    },
];

export const APTRA_NOTE_STAR =
    "Para habilitar el acceso a estos test, se debe retirar el lower module y abrir la tapa superior del lower module.";

export const APTRA_NOTE_DSTAR =
    "Los test indicados siguen la regla de seguridad 'Diag Shutter Security' aun cuando regularmente serían zonas no seguras. " +
    "Por lo cual podría aparecer el mensaje: \"Feed not empty. Obtain safe access to remove notes.\" " +
    "(pocket no vacío — obtenga acceso seguro para retirar billetes).";
