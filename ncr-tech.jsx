import React, { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// NCR TECH ASSISTANT - UNIFIED CYBER-INDUSTRIAL ENGINE
// ═══════════════════════════════════════════════════════════════

const S2 = [
    { code: 0, desc: "Sin error", cat: "General", catEs: "General" },
    { code: 1, desc: "Error de NVRAM: no se puede acceder a un área de memoria", cat: "Memory", catEs: "Memoria", mdata: "Byte 1: 0=Lectura, 1=Escritura" },
    { code: 2, desc: "Error de comunicación USB con el dispensador", cat: "Communication", catEs: "Comunicación" },
    { code: 3, desc: "Falla de comunicación en el bus I²C", cat: "Communication", catEs: "Comunicación" },
    { code: 4, desc: "Sistema de seguridad ICS activado en el dispensador", cat: "Security", catEs: "Seguridad", mdata: "Byte 1: Momento (0=Antes, 1=Durante, 2=Al final)" },
    { code: 5, desc: "Interlock abierto: se desconectó la energía durante operación", cat: "Interlock", catEs: "Interlock", mdata: "Byte 1: Momento (0=Antes, 1=Durante, 2=Al final)" },
    { code: 6, desc: "Solicitud rechazada: algo está mal con el pedido o no está permitido", cat: "Request", catEs: "Solicitud", mdata: "Byte 1: Unidad. Byte 2: Razón (1=Parámetro inválido, 2=Dispositivo fuera de servicio, 3=Requiere Clear, 4=Media presentada, 5=Media apilada, 6=Nada para retraer, 7=Nada para presentar, 8=Re-presentar no permitido, 9=Pick unit fuera de servicio, 10=Cassette vacío, 11=Cassette no instalado, 12=Bin no presente, 13=Bin lleno, 14=Tipo de cassette cambió, 15=Cassette sin latch, 16=Instance ID no configurado, 17=Límite de retract excedido, 18=Todos los cassettes inoperativos)" },
    { code: 7, desc: "Dispensador no configurado — primera operación desde encendido o corrupción de memoria", cat: "Configuration", catEs: "Configuración", mdata: "Byte 1: Unidad. Byte 2: Ítem no configurado (0=Instance ID, 1=Parámetros de media, 2=Config de Presenter inválida)" },
    { code: 8, desc: "No autorizado: cambio no autorizado del dispensador o control board", cat: "Security", catEs: "Seguridad" },
    { code: 9, desc: "No autenticado: el dispensador no ha sido autenticado", cat: "Security", catEs: "Seguridad" },
    { code: 21, desc: "Falla de sensor en SNT (Single Note Transport)", cat: "Sensor", catEs: "Sensor", mdata: "Byte 1: Unidad. Byte 2: Momento (0=Antes, 1=Durante, 2=Al final). Byte 3: Modo (0=No limpió, 1=Quedó bloqueado, 2=Sin POI, 3=CIC inválido, 4=Fuera de rango). Byte 4: ID del sensor. Bytes 5-6: Valor A/D" },
    { code: 22, desc: "Falla de sensor en Carriage", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 23, desc: "Falla de sensor en Presenter", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 24, desc: "Falla de sensor en Shutter", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 25, desc: "Falla de sensor en Pick 1", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 26, desc: "Falla de sensor en Pick 2", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 27, desc: "Falla de sensor en Pick 3", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 28, desc: "Falla de sensor en Pick 4", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 29, desc: "Falla de sensor en Pick 5", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 30, desc: "Falla de sensor en Pick 6", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 31, desc: "Falla de sensor en Aligner (alineador de billetes)", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 32, desc: "Falla de sensor en sistema de Vacuum (vacío)", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 33, desc: "Falla de sensor en Cassette", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 21" },
    { code: 41, desc: "Falla mecánica en SNT — mecanismo trabado o motor no responde", cat: "Mechanism", catEs: "Mecanismo", mdata: "Byte 1: Unidad. Byte 2: Momento. Byte 3: Descripción de falla. Byte 4: Dirección. Byte 5: Tipo (0=No se mueve en ninguna dirección, 1=No puede pasar posición). Bytes 6-7: Valor analógico del sensor" },
    { code: 42, desc: "Falla mecánica en Carriage — trabado o motor no responde", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 43, desc: "Falla mecánica en Presenter — clamp trabado o motor falló", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 44, desc: "Falla mecánica en Shutter — compuerta trabada", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 45, desc: "Falla mecánica en Pick 1", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 46, desc: "Falla mecánica en Pick 2", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 47, desc: "Falla mecánica en Pick 3", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 48, desc: "Falla mecánica en Pick 4", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 49, desc: "Falla mecánica en Pick 5", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 50, desc: "Falla mecánica en Pick 6", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 51, desc: "Falla mecánica en Aligner", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 52, desc: "Falla mecánica en sistema Vacuum", cat: "Mechanism", catEs: "Mecanismo", mdata: "Misma estructura que M_STATUS 41" },
    { code: 61, desc: "Atasco de billete en SNT", cat: "Jam", catEs: "Atasco/Jam", mdata: "Byte 1: Unidad. Byte 2: Descripción del atasco. Byte 3: Origen (0=Billetes agrupados, 1-6=Pick unit)" },
    { code: 62, desc: "Atasco de billete en Carriage", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 63, desc: "Atasco de billete en Bin (purge bin)", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 64, desc: "Atasco de billete en Pick 1", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 65, desc: "Atasco de billete en Pick 2", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 66, desc: "Atasco de billete en Pick 3", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 67, desc: "Atasco de billete en Pick 4", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 68, desc: "Atasco de billete en Pick 5", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 69, desc: "Atasco de billete en Pick 6", cat: "Jam", catEs: "Atasco/Jam", mdata: "Misma estructura que M_STATUS 61" },
    { code: 70, desc: "Cambio inesperado de sensor en SNT — sensor cambió de estado sin razón", cat: "Sensor", catEs: "Sensor", mdata: "Byte 1: Unidad. Byte 2: ID sensor. Bytes 3-4: Valor A/D. Bytes 5-6: Valor esperado" },
    { code: 71, desc: "Cambio inesperado de sensor en Carriage", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 72, desc: "Cambio inesperado de sensor en Presenter", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 73, desc: "Cambio inesperado de sensor en Shutter", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 74, desc: "Cambio inesperado de sensor en Pick 1", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 75, desc: "Cambio inesperado de sensor en Pick 2", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 76, desc: "Cambio inesperado de sensor en Pick 3", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 77, desc: "Cambio inesperado de sensor en Pick 4", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 78, desc: "Cambio inesperado de sensor en Pick 5", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 79, desc: "Cambio inesperado de sensor en Pick 6", cat: "Sensor", catEs: "Sensor", mdata: "Misma estructura que M_STATUS 70" },
    { code: 81, desc: "Error de pique en Pick 1 — falla al tomar billetes del cassette", cat: "Pick", catEs: "Pique/Pick", mdata: "Byte 1: ID del Pick Unit. Byte 2: Razón (0=Falla de pique, 1=Tipo de cassette cambió, 2=Muchos rechazos, 3=Cassette vacío, 4=Rechazo en stacker, 5=Pusher plate trabada, 6=Billete muy grueso)" },
    { code: 82, desc: "Error de pique en Pick 2", cat: "Pick", catEs: "Pique/Pick", mdata: "Misma estructura que M_STATUS 81" },
    { code: 83, desc: "Error de pique en Pick 3", cat: "Pick", catEs: "Pique/Pick", mdata: "Misma estructura que M_STATUS 81" },
    { code: 84, desc: "Error de pique en Pick 4", cat: "Pick", catEs: "Pique/Pick", mdata: "Misma estructura que M_STATUS 81" },
    { code: 85, desc: "Error de pique en Pick 5", cat: "Pick", catEs: "Pique/Pick", mdata: "Misma estructura que M_STATUS 81" },
    { code: 86, desc: "Error de pique en Pick 6", cat: "Pick", catEs: "Pique/Pick", mdata: "Misma estructura que M_STATUS 81" },
    { code: 91, desc: "Error al descartar billetes en área Divert del Purge Bin", cat: "Discard", catEs: "Descarte", mdata: "Byte 1: Razón (0=Bin lleno, 1=Bin removido). Byte 2: Compartimiento (0=Divert, 1=Reject, 2=Retract)" },
    { code: 92, desc: "Error al descartar billetes en área Reject del Purge Bin", cat: "Discard", catEs: "Descarte", mdata: "Misma estructura que M_STATUS 91" },
    { code: 93, desc: "Error al descartar billetes en área Retract del Purge Bin", cat: "Discard", catEs: "Descarte", mdata: "Misma estructura que M_STATUS 91" },
    { code: 95, desc: "Error de lectura de número de serie (SNR) — problema con hardware SNR", cat: "SNR", catEs: "Nro. Serie", mdata: "Byte 1: 0xE (Módulo SNR). Byte 2: Bits de razón (0=Placa defectuosa, 1=CIS superior, 2=CIS inferior, 3=Error de comunicación, 5=Desconocido, 7=Conteo no coincide)" },
    { code: 99, desc: "Manipulación manual con Interlock abierto — sensores cambiaron de estado inesperadamente", cat: "Interlock", catEs: "Interlock", mdata: "Byte 1: Unidad donde ocurrió la falla" },
];

// ── USB BRM M_STATUS (NCR 6687/6683) con M_DATA del Status Code Book pág 212-248 ──
const BRM_MDATA_COMMON = "Byte 0: Código de comando (00=Exitoso, 01=Open Shutter, 02=Close Shutter, 03=Count Items, 04=Store, 05=Clear, 06=Stack, 07=Check Transport, 33=ResetStart, 2B=Calibrate Sensors)\nByte 3: Resultado (00=Normal, 03=Sintaxis mala, 05=No autenticado, 30=Unidad no conectada, 60=Destino casi lleno, 70=Destino lleno, 80=Error de descarga, 90=Error ocurrió, B1=Shutter no cerrado, B2=Pocket no limpio, B4=Unidad abierta)";
const BRM = [
    { code: 0, desc: "Sin errores", cat: "General", catEs: "General" },
    { code: 1, desc: "Error de comunicación USB", cat: "Communication", catEs: "Comunicación", mdata: "Error de comunicación entre PC Core y el módulo BRM vía USB. Verificar cable USB, hub y conexión a la placa." },
    { code: 2, desc: "Operación no intentada, dispositivo ya en estado fatal", cat: "General", catEs: "General", mdata: "El BRM tiene un error fatal previo que no se ha resuelto. Se requiere un Clear o Reset del dispositivo antes de reintentar." },
    { code: 3, desc: "Datos de comando inválidos", cat: "Command", catEs: "Comando", mdata: "El comando enviado al BRM tiene formato incorrecto. Puede ser un problema de software o firmware." },
    { code: 4, desc: "Sospecha de manipulación del cliente", cat: "Security", catEs: "Seguridad", mdata: "El BRM detectó posible manipulación en la boca de depósito. Verificar sensores del Pocket y que no haya objetos extraños." },
    { code: 5, desc: "Billetes insuficientes para completar la operación de dispensado", cat: "Cassette", catEs: "Cassette", mdata: "No hay suficientes billetes en los cassettes para completar el Stack solicitado. Verificar niveles de cassettes." },
    { code: 6, desc: "Demasiados billetes rechazados durante el apilado", cat: "Reject", catEs: "Rechazo", mdata: "Se excedió el límite de rechazos durante la operación. Verificar calidad de billetes, limpieza del BV y templates de moneda." },
    { code: 10, desc: "Cassette o bin en posición llena", cat: "Cassette", catEs: "Cassette", mdata: "Bytes 1-2 indican qué cassette o bin está lleno. Vaciar el contenedor correspondiente." },
    { code: 20, desc: "Cassette o contenedor no presente — verificar instalación", cat: "Cassette", catEs: "Cassette", mdata: "Bytes 1-2 indican qué cassette falta. Verificar que esté correctamente insertado y que los contactos del docking connector estén limpios." },
    { code: 21, desc: "Atasco en shutter intermedio", cat: "Jam", catEs: "Atasco/Jam", mdata: "Bytes 1-2: 4A 61=Proceso de apertura incompleto, 4A 62=Proceso de cierre incompleto. Inspeccionar el shutter intermedio por billetes u objetos trabados." },
    { code: 22, desc: "Shutter trabado en posición abierta", cat: "Shutter", catEs: "Shutter", mdata: "Bytes 1-2: 4B 71=Shutter forzado abierto. Verificar mecanismo del shutter, solenoides y sensores de posición." },
    { code: 23, desc: "Shutter trabado en posición cerrada", cat: "Shutter", catEs: "Shutter", mdata: "Bytes 1-2: 4B 72=Shutter forzado cerrado. Verificar mecanismo, posibles atascos y sensores." },
    { code: 24, desc: "Error de hardware en Bill Validator (BV)", cat: "Bill Validator", catEs: "Validador", mod: "Bill Validator", mdata: "Bytes 1-2 con detalle del error del BV:\n45 91=Error de reloj, 45 92=Error temperatura, 45 93=Error interfaz\n45 95-9C=Errores de sensores ópticos del BV\n49 D1-DA=Errores de memoria interna/externa del BV\n49 E1-E4=Errores de FPGA/PLD\nAcción: Limpiar BV, verificar conexiones. Si persiste, descargar firmware con DOWNLOAD FIRMWARE o reemplazar BV." },
    { code: 25, desc: "Interlock abierto — módulo no está en posición correcta", cat: "Interlock", catEs: "Interlock", mdata: "El switch de interlock detecta que el módulo no está correctamente posicionado. Verificar que el módulo esté racked completamente y que el switch funcione." },
    { code: 26, desc: "No se puede determinar la posición del Shutter", cat: "Shutter", catEs: "Shutter", mdata: "Bytes 1-2: 4C 01=Comunicación anormal con shutter. Los sensores de posición no pueden determinar si está abierto o cerrado. Verificar sensores y cableado del shutter." },
    { code: 27, desc: "Error en sensor de ranura (slot sensor)", cat: "Sensor", catEs: "Sensor", mdata: "Falla en los sensores de la ranura de entrada de billetes del Pocket. Limpiar sensores y verificar conexiones." },
    { code: 28, desc: "Atasco en shuttle de ranura", cat: "Jam", catEs: "Atasco/Jam", mdata: "Mecanismo de shuttle de la ranura de entrada trabado. Inspeccionar por billetes atascados u objetos extraños." },
    { code: 29, desc: "Error en sensor de alimentación (feed sensor)", cat: "Sensor", catEs: "Sensor", mdata: "Falla en sensores del área de alimentación del Pocket. Limpiar y verificar sensores PSA del Pocket." },
    { code: 31, desc: "Atasco de billete entre feed y Bill Validator", cat: "Jam", catEs: "Atasco/Jam", mod: "Upper Transport", mdata: "Bytes 1-2: Códigos 20xx del Upper Transport.\n20 22-2F=Atasco entre sensores específicos (PSC2-PSC3, PSC3-PSG1, etc.)\n20 31-37=Atasco en sensor individual\nAcción: Retirar billetes atascados del transporte superior, verificar correas y rodillos." },
    { code: 32, desc: "Atasco de billete en el Bill Validator", cat: "Jam", catEs: "Atasco/Jam", mod: "Bill Validator", mdata: "Billete atascado dentro del validador. Abrir la tapa de limpieza del BV, retirar el billete y limpiar los rodillos y sensores del BV." },
    { code: 33, desc: "Atasco de billete entre Bill Validator y Escrow", cat: "Jam", catEs: "Atasco/Jam", mod: "Upper Transport", mdata: "Billete trabado en la ruta entre el BV y el módulo Escrow. Verificar la sección del Upper Transport después del BV (part 0090030509)." },
    { code: 34, desc: "Error en el tambor del Escrow — mecanismo no gira correctamente", cat: "Mechanism", catEs: "Mecanismo", mod: "Escrow", mdata: "Bytes 1-2: 30 01=Falla DMG1 (tambor), 30 02=Falla BMG1, 30 05=Fin de cinta, 30 06=Cinta sellada, 30 07=Posición anormal, 30 08-0A=Falla en carretes de cinta\n30 81-84=Error de transporte en Escrow\nAcción: Verificar cinta del Escrow, motor del tambor y sensores PSG1." },
    { code: 35, desc: "Atasco de billete en Escrow", cat: "Jam", catEs: "Atasco/Jam", mod: "Escrow", mdata: "Bytes 1-2: 30 11/12=Billetes remanentes en PSG1C/PSG1S, 30 71=Escrow lleno\nAcción: Retirar billetes del Escrow, verificar que no haya restos de billetes rotos." },
    { code: 38, desc: "Atasco de billete entre Escrow y feed", cat: "Jam", catEs: "Atasco/Jam", mod: "Upper Transport", mdata: "Billete trabado en la ruta de retorno entre Escrow y el feed del Pocket. Inspeccionar el Upper Transport completo." },
    { code: 39, desc: "Atasco en la ruta del Upper Exception Bin", cat: "Jam", catEs: "Atasco/Jam", mod: "Upper Exception", mdata: "Bytes 1-2: 35 71=Upper Exception Bin lleno\nBillete trabado en la ruta hacia el bin de excepción superior. Verificar y vaciar el Upper Exception Bin (part 0090030584)." },
    { code: 41, desc: "Error en Lower Exception Cassette — verificar motor y sensores", cat: "Mechanism", catEs: "Mecanismo", mod: "Lower Exception", mdata: "Bytes 1-2: 60 01-06=Falla de motor DMS5/DMS9, 60 11-14=Billetes remanentes en sensores PSW, 607x=Contenedor lleno\nAcción: Verificar motores de stage, sensores y vaciar el bin de excepción inferior." },
    { code: 42, desc: "Atasco en el transporte de cassettes", cat: "Jam", catEs: "Atasco/Jam", mod: "Cassette Transport", mdata: "Bytes 1-2: Códigos 50xx del Lower Transport.\n50 21-2F=Atasco entre sensores (PSR1-PSL1, PSR2-PSL5, etc.)\n50 31=Atasco en sensor PSR1\nAcción: Retirar billetes del transporte horizontal inferior, verificar correas y rodillos." },
    { code: 43, desc: "Atasco en el transporte vertical", cat: "Jam", catEs: "Atasco/Jam", mod: "Vertical Transport", mdata: "Billete trabado en el transporte vertical entre el Lower Transport y los cassettes. Verificar el Vertical Transport (part 0090029377)." },
    { code: 44, desc: "Error en Cassette 1 — verificar conexión, sensor y motor", cat: "Cassette", catEs: "Cassette", mod: "Cassette 1", mdata: "Bytes 1-2: 65 01-03=Falla motor SMS1/DMS1, 65 11-12=Billetes remanentes PSL1/PSL2, 65 31=Atasco en PSL1, 65 61=Error feed SMS1, 65 71=Cassette lleno\n66 01-5B=Errores de sensores PSL (ON/OFF check, ajuste, volumen)\n68 01-03=Error de configuración, 69 01-02=Error EEPROM, 69 21=Conector desenchufado" },
    { code: 45, desc: "Error en Cassette 2", cat: "Cassette", catEs: "Cassette", mod: "Cassette 2", mdata: "Misma estructura que Cassette 1 pero con códigos 70xx-74xx. 70 01-03=Falla motor DMS2/SMS2, 70 11-12=Billetes remanentes, 70 71=Cassette lleno" },
    { code: 46, desc: "Error en Cassette 3", cat: "Cassette", catEs: "Cassette", mod: "Cassette 3", mdata: "Misma estructura que Cassette 1 pero con códigos 75xx-79xx. 75 01-03=Falla motor DMS3/SMS3, 75 71=Cassette lleno" },
    { code: 47, desc: "Error en Cassette 4", cat: "Cassette", catEs: "Cassette", mod: "Cassette 4", mdata: "Misma estructura que Cassette 1 pero con códigos 80xx-84xx. 80 01-03=Falla motor DMS4/SMS4, 80 71=Cassette lleno" },
    { code: 48, desc: "Error en placa Upper CPU — verificar conexiones y estado de la PCB", cat: "Board", catEs: "Placa/Board", mod: "Upper CPU PCB", mdata: "Bytes 1-2: Códigos 42xx-49xx\n42 01=Error de comando, 42 02-4C=Errores de comunicación (timeout, BCC, parity, framing, overrun)\n44 21-2C=Conector desenchufado (CNJ3, CNJ5, CNJ6, CNJ71, CN1A, CN3A, CNF4, CNF6)\n44 41-46=Error de voltaje (+24V, +5V, LED+5V, Batería baja)\n44 F1=Watchdog reset, 44 F2=Error de programa, 44 F4=Stack overflow\nAcción: Verificar conectores, medir voltajes, reemplazar placa si es necesario." },
    { code: 49, desc: "Error en placa Lower CPU — verificar conexiones y estado de la PCB", cat: "Board", catEs: "Placa/Board", mod: "Lower CPU PCB", mdata: "Bytes 1-2: Códigos 92xx-94xx\n92 01-57=Errores de comunicación con submódulos\n93 01-04=Errores de configuración (SerialNo, HardwareRev, DipSW)\n94 01-02=Error EEPROM, 94 12-14=Error flash memory\n94 21-2C=Conector desenchufado (CNL, CNP1, CNR, CNS, CNSA, CNW1, etc.)\n94 41-46=Error de voltaje (+24V2/3, +5V2/3, LED+5V, Batería)\n94 F1=Watchdog reset, 94 F2=Error programa\nAcción: Verificar conectores del módulo inferior, medir voltajes." },
    { code: 50, desc: "Error de secuencia — comando enviado en orden incorrecto", cat: "Command", catEs: "Comando", mdata: "El software envió un comando en una secuencia no válida. Generalmente se resuelve con un Reset." },
    { code: 51, desc: "Módulo superior abierto (Upper unit open)", cat: "Interlock", catEs: "Interlock", mod: "Upper Module", mdata: "El interlock del módulo superior está abierto. Verificar que el Upper Module esté correctamente posicionado y el switch de interlock funcione." },
    { code: 52, desc: "Módulo inferior abierto (Lower unit open)", cat: "Interlock", catEs: "Interlock", mod: "Lower Module", mdata: "El interlock del módulo inferior está abierto. Verificar que el Lower Module esté racked y el switch de interlock funcione." },
    { code: 53, desc: "No autorizado — el número de serie del dispositivo cambió", cat: "Security", catEs: "Seguridad", mdata: "Se detectó un cambio de número de serie en algún componente. Requiere autenticación del dispositivo según el nivel de seguridad configurado." },
    { code: 60, desc: "Error de comunicación I2C entre placas", cat: "Communication", catEs: "Comunicación", mdata: "Falla de comunicación en el bus I2C entre la Upper CPU PCB y la Lower CPU PCB. Verificar el Flex Circuit 10 Track (part 0090028643) y las conexiones entre ambas placas." },
    { code: 61, desc: "Falla del motor en Upper Transport", cat: "Mechanism", catEs: "Mecanismo", mod: "Upper Transport", mdata: "Bytes 1-2: 20 01=Error rotación BMJ1, 20 02=BMJ2, 20 03=BMJ3\nEl motor principal del transporte superior no gira correctamente. Verificar motor DC Brushless (part 0090030503/0090030504), timing disk y conexiones." },
    { code: 62, desc: "Falla de sensor entre feed y Bill Validator", cat: "Sensor", catEs: "Sensor", mod: "Upper Transport", mdata: "Bytes 1-2: Códigos 21xx con sensores PSC1-PSC5\n21 01-09=ON check error, 21 21-28=Error de ajuste, 21 31-38=Límite superior volumen, 21 41-48=Límite inferior volumen, 21 51-5B=OFF check error\nAcción: Limpiar sensores del Upper Transport, ejecutar RAS 611F para recalibrar." },
    { code: 63, desc: "Falla de sensor entre Bill Validator y Escrow", cat: "Sensor", catEs: "Sensor", mod: "Upper Transport", mdata: "Misma estructura que M_STATUS 62 pero para sensores en la sección después del BV. Verificar sensores PSC3-PSC5 y conexiones." },
    { code: 64, desc: "Falla de sensor entre Escrow y feed", cat: "Sensor", catEs: "Sensor", mod: "Upper Transport", mdata: "Sensores en la ruta de retorno. Verificar y limpiar sensores, ejecutar calibración RAS 611F." },
    { code: 65, desc: "Falla en compuerta de desvío antes del BV (pre-BV divert)", cat: "Mechanism", catEs: "Mecanismo", mod: "Upper Transport", mdata: "Bytes 1-2: 21 81=Error desvío SMC1, 21 82=Error SDF1\nLa compuerta de desvío pre-BV no se mueve correctamente. Verificar solenoide de desvío (part 0090030505) y que no haya obstrucciones." },
    { code: 66, desc: "Falla en compuerta de desvío después del BV (post-BV divert)", cat: "Mechanism", catEs: "Mecanismo", mod: "Upper Transport", mdata: "Bytes 1-2: 21 83=Error RSC1, 21 84=Error SDC1\nLa compuerta post-BV no funciona. Verificar solenoide y conexiones." },
    { code: 67, desc: "Falla en compuerta de desvío del Upper Exception Bin", cat: "Mechanism", catEs: "Mecanismo", mod: "Upper Exception", mdata: "La compuerta que desvía billetes hacia el Upper Exception Bin no funciona. Verificar mecanismo de desvío y solenoide." },
    { code: 68, desc: "Error en Cassette 5", cat: "Cassette", catEs: "Cassette", mod: "Cassette 5", mdata: "Misma estructura de errores que Cassettes 1-4 pero para la posición 5 (si está configurada). Códigos 85xx-89xx." },
    { code: 69, desc: "Falla de comunicación entre procesadores (inter-process)", cat: "Communication", catEs: "Comunicación", mdata: "Error de comunicación entre la Upper CPU PCB y la Lower CPU PCB. Verificar Flex Circuit (part 0090028643) y estado de ambas placas." },
    { code: 70, desc: "Falla al descargar firmware al control board", cat: "Firmware", catEs: "Firmware", mdata: "Error durante la actualización de firmware del módulo. Reintentar con DOWNLOAD FIRMWARE desde APTRA. Si persiste, verificar conexión USB y estado de la placa." },
    { code: 71, desc: "Falla al descargar firmware directamente al Bill Validator", cat: "Firmware", catEs: "Firmware", mod: "Bill Validator", mdata: "Error al actualizar el firmware del BV. Verificar conexión del BV a la Upper CPU PCB y reintentar la descarga." },
    { code: 72, desc: "Atasco en Intermediate Transport", cat: "Jam", catEs: "Atasco/Jam", mod: "Intermediate Transport", mdata: "Bytes 1-2: 3A 11=Billetes remanentes en PSN1\nBillete trabado en el transporte intermedio. Inspeccionar y retirar billetes. Si se reemplazó alguna parte, ejecutar test REPLACED TRANSPORT seleccionando Intermediate Transport." },
    { code: 73, desc: "Falla de sensor en Intermediate Transport", cat: "Sensor", catEs: "Sensor", mod: "Intermediate Transport", mdata: "Bytes 1-2: 3B 01=ON check PSN1, 3B 21=Error ajuste PSN1, 3B 31=Volumen alto PSN1, 3B 41=Volumen bajo PSN1, 3B 51=OFF check PSN1\nAcción: Limpiar sensor PSN1 del Intermediate Transport." },
    { code: 74, desc: "Falla del motor en transporte de cassettes", cat: "Mechanism", catEs: "Mecanismo", mod: "Lower Transport", mdata: "Bytes 1-2: 50 01=Error rotación BMR1\nEl motor del Lower Transport no gira. Verificar motor DC Brushless, timing belt y conexiones a la Lower CPU PCB." },
    { code: 75, desc: "Falla en compuerta de desvío del transporte de cassettes", cat: "Mechanism", catEs: "Mecanismo", mod: "Lower Transport", mdata: "Bytes 1-2: 51 81-85=Error de desvío RSR1-RSR5\nLas compuertas que dirigen billetes a cada cassette no funcionan. Verificar solenoides rotary swing (RSR) y conexiones." },
    { code: 76, desc: "Falla de sensor en transporte de cassettes", cat: "Sensor", catEs: "Sensor", mod: "Lower Transport", mdata: "Bytes 1-2: 51 01-55=Errores de sensores PSR1S/C, PSR2, PSR3 (ON check, ajuste, volumen, OFF check)\n51 70=Lower Module mal colocado, 51 71=Lower Transport abierto\nAcción: Limpiar sensores del Lower Transport, ejecutar RAS 612F." },
    { code: 77, desc: "Falla del motor en transporte vertical", cat: "Mechanism", catEs: "Mecanismo", mod: "Vertical Transport", mdata: "Bytes 1-2: 55 01=Error rotación BMS1, 55 02=Error BMS2\nEl motor del transporte vertical no gira. Verificar motor, correas y conexiones." },
    { code: 78, desc: "Falla en compuerta de desvío del transporte vertical", cat: "Mechanism", catEs: "Mecanismo", mod: "Vertical Transport", mdata: "Bytes 1-2: 56 81=Error RSR6, 56 82=Error RST1, 56 83=Error RST2\nLas compuertas del transporte vertical no funcionan. Verificar solenoides y conexiones." },
    { code: 79, desc: "Falla de sensor en transporte vertical", cat: "Sensor", catEs: "Sensor", mod: "Vertical Transport", mdata: "Bytes 1-2: 56 01=ON check PIT1, 56 51=OFF check PIT1, 56 71=Vertical Transport abierto\nAcción: Limpiar sensores, verificar posicionamiento del módulo." },
    { code: 80, desc: "Falla de sensor en ruta del Upper Exception Bin", cat: "Sensor", catEs: "Sensor", mod: "Upper Exception", mdata: "Error en los sensores de la ruta hacia el bin de excepción superior. Limpiar sensores y verificar conexiones." },
    { code: 81, desc: "Parte reemplazada — ejecutar recalibración si es necesario", cat: "Maintenance", catEs: "Mantenimiento", mdata: "Se detectó que una parte fue reemplazada. Ejecutar el test REPLACED TRANSPORT seleccionando el módulo correspondiente, y luego DOWNLOAD FIRMWARE si es necesario." },
    { code: 82, desc: "Pocket stage trabado — verificar mecanismo y sensores", cat: "Jam", catEs: "Atasco/Jam", mod: "Pocket", mdata: "Bytes 1-2: 10 01-06=Falla de actuador DMA1-DMA5 (stages y lift)\n10 07-0B=Falla de motor SMA1 (feed)\n10 11-16=Billetes remanentes en sensores PSA5-PSA6\n10 70=Pocket lleno\nAcción: Verificar que el mecanismo de stage del Pocket se mueva libremente, limpiar sensores." },
    { code: 83, desc: "Dispositivo no autenticado — requiere autenticación", cat: "Security", catEs: "Seguridad", mdata: "La Upper CPU PCB fue reemplazada y el nivel de seguridad requiere autenticación. Verificar event log y autenticar según nivel de seguridad del ATM." },
    { code: 84, desc: "Demasiadas detecciones consecutivas de metal en Pocket", cat: "Security", catEs: "Seguridad", mod: "Pocket", mdata: "Bytes 1-2: 1B C2-C6=Errores de ajuste del detector de metal (Lower Coil)\n1D 52-55=Errores únicos de detección de metal\nEl detector de metal está reportando muchas detecciones. Puede ser un problema de calibración o de interferencia. Ejecutar calibración RAS 6100." },
    { code: 85, desc: "Demasiados objetos extraños detectados consecutivamente", cat: "Security", catEs: "Seguridad", mod: "Pocket", mdata: "Similar al M_STATUS 84 pero para objetos extraños en general. Verificar que no haya residuos en el Pocket y ejecutar calibración." },
];

// ── BRM ERROR CODES by module ──
const BRM_MOD = [
    { range: "10xx-1Fxx", mod: "Pocket", desc: "Errores de actuadores, sensores, cámara y detección de metal del Pocket", ex: "1002=Falla DMA2, 1115=Motor feed, 140x=EEPROM, 1A6x=Cámara, 1BCx=Detección metal" },
    { range: "20xx-21xx", mod: "Upper Transport", desc: "Errores de actuadores y sensores del transporte superior", ex: "200x=Actuador, 210x=ON check, 212x=Ajuste, 217x=Módulo mal colocado, 218x=Error desvío" },
    { range: "26xx-27xx", mod: "Bridge Transport", desc: "Errores de sensores del Bridge Transport", ex: "260x=ON check, 262x=Ajuste, 267x=Módulo mal colocado" },
    { range: "2Axx-2Fxx", mod: "Centralisation", desc: "Errores del transporte de centralización", ex: "2A0x=Error posición, 2B0x=Error sensor, 2D0x=Preparación envío, 2E0x=EEPROM" },
    { range: "30xx-34xx", mod: "Escrow", desc: "Errores del tambor, transporte y sensores del Escrow", ex: "3001=Falla DMG1, 3005=Fin de cinta, 3071=Escrow lleno, 34B1/B2=Conteo no coincide" },
    { range: "35xx-39xx", mod: "Upper Exception Bin", desc: "Errores del bin de excepción superior", ex: "357x=Contenedor lleno" },
    { range: "3Axx-3Bxx", mod: "Intermediate Transport", desc: "Errores del transporte intermedio", ex: "3A11=Billetes remanentes PSN1, 3B01=ON check PSN1" },
    { range: "42xx-49xx", mod: "Upper Module CPU", desc: "Errores de comunicación, EEPROM y voltaje de la placa CPU superior", ex: "4201=Error comando, 4421=Conector desenchufado, 4441=Error voltaje" },
    { range: "50xx-51xx", mod: "Lower Transport", desc: "Errores de actuadores y sensores del transporte inferior", ex: "5001=Rotación BMS1, 5101=ON check PSR1S, 5181=Desvío RSR1" },
    { range: "55xx-56xx", mod: "Vertical Transport", desc: "Errores de motor y sensores del transporte vertical", ex: "5501=Rotación BMS1, 5681=Desvío RSR6" },
    { range: "60xx-64xx", mod: "Exception Cassette", desc: "Errores de motor, sensor y EEPROM del cassette de excepción", ex: "6001=Falla DMS5, 6011=Billetes remanentes, 607x=Contenedor lleno" },
    { range: "65xx-89xx", mod: "Cassettes 1-4", desc: "Errores individuales por posición de cassette (motor, sensor, atasco, EEPROM)", ex: "6501=Cassette 1 DMS1, 7001=Cassette 2 DMS2, 7501=Cassette 3 DMS3, 8001=Cassette 4 DMS4" },
    { range: "92xx-99xx", mod: "Lower Module CPU", desc: "Errores de comunicación, EEPROM y voltaje de la placa CPU inferior", ex: "9201=Error comms, 9401=Error EEPROM, 9441=Voltaje +24V2" },
];

// ── PARTS S2 ──
const S2P = [
    { pn: "445-0732256", d: "S2 Presenter F/A FRU (presentador completo acceso frontal)", m: "Presenter", eq: "S2" },
    { pn: "445-0729119", d: "F/A Carriage Assembly (carro de transporte acceso frontal)", m: "Carriage", eq: "S2" },
    { pn: "445-0731333", d: "Assy - Presenter Core F/A (núcleo del presentador frontal)", m: "Presenter", eq: "S2" },
    { pn: "445-0756047", d: "Air Filter (filtro de aire del sistema de vacío)", m: "Presenter", eq: "S2" },
    { pn: "445-0731632", d: "Motor/Pump Assembly FRU (motor y bomba de vacío)", m: "Motor", eq: "S2" },
    { pn: "445-0729811", d: "SNT TLA Assembly (Single Note Transport — transporte de billete individual)", m: "SNT", eq: "S2" },
    { pn: "445-0736562", d: "Assy - Reference Edge FRU (borde de referencia del alineador BAM)", m: "Aligner", eq: "S2" },
    { pn: "445-0731307", d: "F/A Short Nose FRU (nariz corta acceso frontal)", m: "Nose", eq: "S2" },
    { pn: "445-0732257", d: "S2 Presenter R/A FRU (presentador completo acceso trasero)", m: "Presenter", eq: "S2" },
    { pn: "445-0729120", d: "R/A Carriage Assembly (carro de transporte acceso trasero)", m: "Carriage", eq: "S2" },
    { pn: "445-0731334", d: "Assy - Presenter Core R/A (núcleo del presentador trasero)", m: "Presenter", eq: "S2" },
    { pn: "445-0731305", d: "R/A Mid Nose FRU (nariz mediana acceso trasero)", m: "Nose", eq: "S2" },
    { pn: "445-0736668", d: "S2 Pick Module Assembly (módulo de pique completo)", m: "Pick", eq: "S2" },
    { pn: "445-0755466", d: "4 High Support Assembly Service (estructura soporte 4 cassettes)", m: "Frame", eq: "S2" },
    { pn: "445-0756605", d: "S2 Double Pick Dual Sensor (doble pique con sensor dual)", m: "Pick", eq: "S2" },
    { pn: "009-0026464", d: "S2 Suction Cup (ventosa para sistema de vacío)", m: "Vacuum", eq: "S2" },
    { pn: "445-0731226", d: "SOH LED Assembly (indicador LED de estado de salud)", m: "LED", eq: "S2" },
    { pn: "445-0689215", d: "Cassette Assembly Non TI (gaveta de billetes sin TI)", m: "Cassette", eq: "S2" },
    { pn: "445-0751775", d: "S2 Cassette Latch (traba de seguridad del cassette)", m: "Cassette", eq: "S2" },
    { pn: "445-0756691", d: "LatchFast Bin Assembly (bin de purga con traba rápida)", m: "Purge Bin", eq: "S2" },
    { pn: "445-0749347", d: "S2 Dispenser Control Board (placa controladora principal del dispensador)", m: "PCB", eq: "S2" },
    { pn: "445-0734103", d: "S2 Dual Cassette ID PCB Assembly (placa de identificación de cassettes)", m: "PCB", eq: "S2" },
];

// ── PARTS BRM ──
const BRMP = [
    { pn: "0090029370", d: "Pocket sin guías", m: "Pocket", eq: "BRM" },
    { pn: "0090035943", d: "BRM Pocket con guías anchas (completo)", m: "Pocket", eq: "BRM" },
    { pn: "0090029132", d: "BRM Wide Guide Set (juego de guías anchas)", m: "Pocket", eq: "BRM" },
    { pn: "4450775289", d: "BRM Alignment Gauge 2.5mm (galga de alineación)", m: "Pocket", eq: "BRM" },
    { pn: "0090029373", d: "Escrow (módulo completo)", m: "Escrow", eq: "BRM" },
    { pn: "0090029739", d: "Bill Validator HVD-300U (validador de billetes)", m: "Bill Validator", eq: "BRM" },
    { pn: "0090030198", d: "BRM Centralization (mecanismo de motores paso a paso)", m: "Centralisation", eq: "BRM" },
    { pn: "0090029372", d: "BRM Bridge Transport (mecanismo de correas)", m: "Bridge Transport", eq: "BRM" },
    { pn: "0090029839", d: "BRM Intermediate Transport (transporte intermedio)", m: "Intermediate Transport", eq: "BRM" },
    { pn: "0090030506", d: "Timing Belt frontal del Upper Transport (correa de tiempo)", m: "Upper Transport", eq: "BRM" },
    { pn: "0090030498", d: "BRM Horizontal Transport Timing Belt", m: "Upper Transport", eq: "BRM" },
    { pn: "0090030508", d: "BRM Top Transport Lower Timing Belt", m: "Upper Transport", eq: "BRM" },
    { pn: "0090030531", d: "BRM BV Rear Drive Belt (correa trasera del BV)", m: "Bill Validator", eq: "BRM" },
    { pn: "0090030500", d: "Pick Drive Stepping Motor (motor paso a paso del pique)", m: "Pocket", eq: "BRM" },
    { pn: "0090030502", d: "DC Lift Motor (motor DC de elevación)", m: "Lower Module", eq: "BRM" },
    { pn: "0090030503", d: "DC Brushless Motor 1 (transporte horizontal inferior, upper, lado escrow)", m: "Motor", eq: "BRM" },
    { pn: "0090030504", d: "DC Brushless Motor 2 (lower module, exception bin, upper antes del BV)", m: "Motor", eq: "BRM" },
    { pn: "4450746108", d: "Recycler Shutter Assembly (compuerta del reciclador)", m: "Shutter", eq: "BRM" },
    { pn: "0090031212", d: "Batería Lithium CR2/3 (para placas BRM y BNA)", m: "PCB", eq: "BRM" },
    { pn: "0090030499", d: "BRM Microswitch (microinterruptor)", m: "Switch", eq: "BRM" },
    { pn: "0090031115", d: "Pinch Roller Assembly (rodillo de presión)", m: "Transport", eq: "BRM" },
    { pn: "0090031116", d: "Dust Cover for Gears (tapa protectora de engranajes)", m: "Transport", eq: "BRM" },
    { pn: "0090030200", d: "Centralization Damper Assembly (amortiguador)", m: "Centralisation", eq: "BRM" },
    { pn: "0090035723", d: "BRM Recycle Cassette Standard (cassette configurable)", m: "Cassette", eq: "BRM" },
    { pn: "0090030532", d: "PCB I/O-41U Board (placa de entrada/salida)", m: "PCB", eq: "BRM" },
    { pn: "0090030199", d: "Centralisation Assembly PCB (placa de centralización)", m: "PCB", eq: "BRM" },
    { pn: "0090035724", d: "BRM Lower Exception Bin (bin de excepción inferior)", m: "Exception Bin", eq: "BRM" },
    { pn: "0090030584", d: "BRM Upper Exception Bin (cassette para billetes falsos)", m: "Exception Bin", eq: "BRM" },
    { pn: "0090029379", d: "BRM Upper CPU PCB — modelo antiguo", m: "PCB", eq: "BRM" },
    { pn: "0090036165", d: "BRM Upper CPU PCB — 2da generación (nueva)", m: "PCB", eq: "BRM" },
    { pn: "0090029380", d: "BRM Lower CPU PCB — modelo antiguo", m: "PCB", eq: "BRM" },
    { pn: "0090036166", d: "BRM Lower CPU PCB — 2da generación (nueva)", m: "PCB", eq: "BRM" },
    { pn: "4450750148", d: "BRM EChain 44 Link (cadena plástica superior e inferior)", m: "Transport", eq: "BRM" },
    { pn: "0090028643", d: "Flex Circuit 10 Track (flex que une ambas placas)", m: "PCB", eq: "BRM" },
    { pn: "4450761948", d: "Universal USB Hub Top Level Assembly", m: "USB", eq: "BRM" },
    { pn: "0090029374", d: "BRM Upper Transport (transporte superior completo)", m: "Upper Transport", eq: "BRM" },
    { pn: "0090030513", d: "Rear Upper Frame con Divert Gate (marco trasero)", m: "Upper Transport", eq: "BRM" },
    { pn: "0090030511", d: "Upper Transport Section antes del BV", m: "Upper Transport", eq: "BRM" },
    { pn: "0090030509", d: "Upper Transport Section después del BV", m: "Upper Transport", eq: "BRM" },
    { pn: "0090029376", d: "BRM Lower Transport (transporte inferior)", m: "Lower Transport", eq: "BRM" },
    { pn: "0090029375", d: "BRM Lower Frame (marco inferior)", m: "Lower Module", eq: "BRM" },
    { pn: "0090029377", d: "BRM Vertical Transport (transporte vertical)", m: "Vertical Transport", eq: "BRM" },
    { pn: "0090029840", d: "Overall Status Light LDHL-OS (luz de estado general)", m: "LED", eq: "BRM" },
    { pn: "4450753409", d: "PCB Recycler Shutter (placa del shutter)", m: "Shutter", eq: "BRM" },
    { pn: "0090030505", d: "Divert Rotary Solenoid (solenoide rotativo de desvío)", m: "Upper Transport", eq: "BRM" },
    { pn: "0090036137", d: "BRM Pinch Roller Set (juego de rodillos)", m: "Transport", eq: "BRM" },
    { pn: "0090033221", d: "BRM Spur Gear (engranaje recto)", m: "Transport", eq: "BRM" },
    { pn: "4450782284", d: "BRM Escrow Cover nuevo (tapa del escrow)", m: "Escrow", eq: "BRM" },
    { pn: "4450750127", d: "Upper Module Harness CNJ3 (arnés módulo superior)", m: "Cable", eq: "BRM" },
    { pn: "4450750126", d: "Lower Module Harness (arnés módulo inferior)", m: "Cable", eq: "BRM" },
    { pn: "4450753376", d: "BRM Shutter Harness (arnés del shutter)", m: "Cable", eq: "BRM" },
    { pn: "0090030523", d: "Interlock Assembly con CNSWJ7 (conjunto interlock)", m: "Interlock", eq: "BRM" },
    { pn: "0090036036", d: "Recycle Cassette Cable Assembly FRU (cable de cassette)", m: "Cable", eq: "BRM" },
    { pn: "0090036037", d: "Lower Exception Bin Cable Assembly FRU", m: "Cable", eq: "BRM" },
    { pn: "0090030507", d: "Cassette Latch — traba de purga", m: "Cassette", eq: "BRM" },
    { pn: "0090029579", d: "Cassette Latch — traba de caseteras", m: "Cassette", eq: "BRM" },
];

const ALLP = [...S2P, ...BRMP];

const S2U = [
    { v: "00", n: "Control Board (placa controladora)" }, { v: "01", n: "Pick Unit 1" }, { v: "02", n: "Pick Unit 2" },
    { v: "03", n: "Pick Unit 3" }, { v: "04", n: "Pick Unit 4" }, { v: "05", n: "Pick Unit 5" },
    { v: "06", n: "Pick Unit 6" }, { v: "07", n: "SNT (Single Note Transport)" }, { v: "08", n: "Carriage (carro)" },
    { v: "09", n: "Bin (contenedor)" }, { v: "0A", n: "Presenter Chassis (chasis presentador)" }, { v: "0B", n: "Shutter (compuerta)" },
    { v: "0C", n: "Media Aligner (alineador)" }, { v: "0D", n: "Vacuum System (sistema de vacío)" }, { v: "FF", n: "Error de secuencia de software" },
];

const S2S = [
    { u: "SNT", s: "00=Divert gate pos, 01=Stacker entry, 02=Divert bin entry, 03=HETS izq, 04=HETS der, 05=Media Width izq, 06=Media Width der, 07=Main timing disk, 08=Deflector home, 09=Deflector extendido" },
    { u: "Carriage", s: "00=Home (inicio), 01=Position (posición), 02=Belt encoder (codificador correa), 03=Bunch (grupo), 04=Pre-exit (pre-salida), 05=Exit (salida)" },
    { u: "Presenter", s: "00=Clamp pos (posición pinza), 01=Retract entry (entrada retracto), 02=Reject entry (entrada rechazo), 03=Purge Bin latch (traba purge bin), 04=Purge Bin present (purge bin presente), 05=Module latch (traba módulo)" },
    { u: "Shutter", s: "00=Open (abierto), 01=Closed (cerrado)" },
    { u: "Pick", s: "00=Pick arm pos (posición brazo), 01=D-wheel pos (posición rueda D), 02=Pick transport, 03=Cassette ID, 04=Cassette latch (traba), 05=Cassette low (bajo nivel)" },
    { u: "Aligner", s: "00=Aligner position (posición del alineador)" },
    { u: "Vacuum", s: "00=Vacuum sensor (sensor de vacío)" },
];

// ── ICONS ──
const Ic = {
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16" y2="16" /></svg>,
    warn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    wrench: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    star: f => <svg viewBox="0 0 24 24" fill={f ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
    moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
};

const ld = (k, d) => { try { const v = window.localStorage?.getItem(k); return v ? JSON.parse(v) : d } catch { return d } };
const sv = (k, v) => { try { window.localStorage?.setItem(k, JSON.stringify(v)) } catch { } };

const CSS_ID = "ncr-unified-theme";
const injectCSS = () => {
    if (document.getElementById(CSS_ID)) return;
    const el = document.createElement("style");
    el.id = CSS_ID;
    el.textContent = `
    :root {
      --bg: #0a0c10;
      --surf: #111418;
      --card: #181c22;
      --border: #2a3040;
      --accent: #00d4ff;
      --text: #c8d6e8;
      --dim: #5c7080;
      --error: #ff3b30;
      --warn: #ffb800;
      --success: #00e676;
    }

    body { 
      background-color: var(--bg); 
      color: var(--text); 
      font-family: 'Rajdhani', sans-serif;
      margin: 0; 
    }

    /* Fondo de rejilla industrial */
    .bg-grid {
      position: fixed; inset: 0; z-index: -1;
      background-image: 
        linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    @keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    @keyframes ledFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.1; } }
    @keyframes fi { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    .font-orbitron { font-family: 'Orbitron', sans-serif; }
    .font-mono { font-family: 'Share Tech Mono', monospace; }
    
    /* Estilos de Cards unificados */
    .card-cyber {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .led { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .led-error { background: var(--error); box-shadow: 0 0 8px var(--error); }
    .led-warn { background: var(--warn); box-shadow: 0 0 8px var(--warn); }
    .led-success { background: var(--success); box-shadow: 0 0 8px var(--success); }
    .led-flash { animation: flash 0.7s infinite; }
  `;
    document.head.appendChild(el);
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTES ATÓMICOS (UI)
// ═══════════════════════════════════════════════════════════════

const Tag = ({ type, children }) => {
    const colors = { error: '#ff3b30', warn: '#ffb800', success: '#00e676', info: '#00d4ff' };
    return (
        <span style={{
            fontSize: '10px', padding: '2px 6px', borderRadius: '3px',
            backgroundColor: `${colors[type] || '#555'}15`,
            color: colors[type] || '#fff',
            fontFamily: "'Share Tech Mono', monospace",
            border: `1px solid ${colors[type] || '#555'}40`,
            marginRight: '5px'
        }}>{children}</span>
    );
};

// ═══════════════════════════════════════════════════════════════
// VISTAS (VIEWS)
// ═══════════════════════════════════════════════════════════════

// 1. VISTA: HOME
const HomeView = ({ setTab, favs, tF }) => (
    <div style={{ padding: '20px', animation: 'fi 0.4s ease' }}>
        <h2 className="font-orbitron" style={{ color: '#00d4ff', fontSize: '24px', marginBottom: '5px' }}>NCR TECH</h2>
        <p style={{ color: '#5c7080', marginBottom: '25px', fontSize: '14px' }}>SISTEMA DE DIAGNÓSTICO DE CAMPO</p>

        <div style={{ display: 'grid', gap: '15px' }}>
            <div onClick={() => setTab('errors')} className="card-cyber" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '24px' }}>⚠️</div>
                    <div>
                        <div className="font-orbitron" style={{ fontSize: '16px' }}>Buscador de Errores</div>
                        <div style={{ fontSize: '12px', color: '#5c7080' }}>M_STATUS S2 & BRM</div>
                    </div>
                </div>
            </div>

            <div onClick={() => setTab('parts')} className="card-cyber" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '24px' }}>🔧</div>
                    <div>
                        <div className="font-orbitron" style={{ fontSize: '16px' }}>Catálogo de Partes</div>
                        <div style={{ fontSize: '12px', color: '#5c7080' }}>S2 & BRM Components</div>
                    </div>
                </div>
            </div>

            <div onClick={() => setTab('leds')} className="card-cyber" style={{ cursor: 'pointer', borderLeft: '4px solid #00d4ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '24px' }}>💡</div>
                    <div>
                        <div className="font-orbitron" style={{ fontSize: '16px' }}>Referencia LED</div>
                        <div style={{ fontSize: '12px', color: '#5c7080' }}>Guía de estados visuales</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// 2. VISTA: LED REFERENCE — brm-leds-v4.html (Componente completo)
// ═══════════════════════════════════════════════════════════════

// Datos del módulo Upper (LEDs 1-9)
const UPPER_LEDS = [
    {
        n: 1, name: "Dispense Transport", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 2, name: "Upper Transport — Front Latch", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 3, name: "Upper Transport — Back Latch", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 4, name: "Escrow Transport", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 5, name: "Bridge / Centralisation", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 6, name: "Cash-in Transport — Front Latch", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 7, name: "Cash-in Transport — Back Latch", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 8, name: "Escrow", states: [
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
    {
        n: 9, name: "Upper Transport — Replenishment", states: [
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
];

// Datos del módulo Lower (LEDs 10-21)
const LOWER_LEDS = [
    {
        n: 10, name: "Lower Transport — Front Latch", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto o cassette ausente" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 11, name: "Lower Transport — Back Latch", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto o cassette ausente" },
            { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" },
            { cls: "gs", label: "VERDE", desc: "Saludable" },
        ]
    },
    {
        n: 12, name: "Recycling Cassette 1", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" },
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
            { cls: "gs", label: "VERDE", desc: "OK" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
    {
        n: 13, name: "Recycling Cassette 2", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" },
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
            { cls: "gs", label: "VERDE", desc: "OK" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
    {
        n: 14, name: "Recycling Cassette 3", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" },
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
            { cls: "gs", label: "VERDE", desc: "OK" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
    {
        n: 15, name: "Recycling Cassette 4", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" },
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
            { cls: "gs", label: "VERDE", desc: "OK" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
    {
        n: 16, name: "Lower Exception Cassette", states: [
            { cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" },
            { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento / lleno" },
            { cls: "gs", label: "VERDE", desc: "OK" },
            { cls: "loff", label: "APAGADO", desc: "Inoperativo" },
        ]
    },
];

// Mapa de clases CSS de LED a colores inline (usa variables CSS del tema)
const LED_COLORS = {
    rs: { bg: "var(--red,  #ff3b30)", glow: "rgba(255,59,48,.8)", anim: false },
    rf: { bg: "var(--red,  #ff3b30)", glow: "rgba(255,59,48,.8)", anim: true },
    as: { bg: "var(--amb,  #ffb800)", glow: "rgba(255,184,0,.8)", anim: false },
    af: { bg: "var(--amb,  #ffb800)", glow: "rgba(255,184,0,.8)", anim: true },
    gs: { bg: "var(--grn,  #00e676)", glow: "rgba(0,230,118,.8)", anim: false },
    loff: { bg: "#252930", glow: "none", anim: false },
};

const LedDot = ({ cls, size = 11 }) => {
    const c = LED_COLORS[cls] || LED_COLORS.loff;
    return (
        <span style={{
            display: "inline-block",
            width: size, height: size,
            borderRadius: "50%",
            background: c.bg,
            boxShadow: c.glow !== "none" ? `0 0 7px ${c.glow}` : "none",
            border: cls === "loff" ? "1px solid #3a3e48" : "none",
            flexShrink: 0,
            animation: c.anim ? "ledFlash .7s infinite" : "none",
        }} />
    );
};

const LEDRefView = () => {
    const [ledTab, setLedTab] = useState("overview");

    const tabStyle = (id) => ({
        flex: 1,
        padding: "10px 4px",
        background: ledTab === id ? "#181c22" : "#111418",
        border: `1px solid ${ledTab === id ? "#00d4ff" : "#2a3040"}`,
        borderBottom: ledTab === id ? "1px solid #181c22" : "1px solid #2a3040",
        color: ledTab === id ? "#00d4ff" : "#5c7080",
        cursor: "pointer",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: ".8px",
        textTransform: "uppercase",
        borderRadius: "6px 6px 0 0",
        transition: "all .2s",
        position: "relative",
        bottom: ledTab === id ? "-1px" : "0",
        zIndex: ledTab === id ? 1 : 0,
    });

    const cardStyle = {
        background: "#181c22",
        border: "1px solid #2a3040",
        borderRadius: "0 8px 8px 8px",
        padding: "14px 12px",
        marginTop: 0,
    };

    const ModuleRow = ({ leds, name, desc }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#111418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 11px", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 5, background: "#0d1117", border: "1px solid #1e2530", borderRadius: 5, padding: "6px 8px", flexShrink: 0 }}>
                {leds.map((l, i) => <LedDot key={i} cls={l} size={14} />)}
            </div>
            <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: ".5px", marginBottom: 1 }}>{name}</div>
                <div style={{ fontSize: 11, color: "#5c7080" }}>{desc}</div>
            </div>
        </div>
    );

    const SectionTitle = ({ children }) => (
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, color: "#00d4ff", letterSpacing: "1.5px", textTransform: "uppercase", margin: "14px 0 10px", paddingBottom: 6, borderBottom: "1px solid #2a3040" }}>{children}</div>
    );

    const StateCard = ({ title, rows }) => (
        <div style={{ background: "#111418", border: "1px solid #2a3040", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "1px", padding: "7px 12px", background: "rgba(0,212,255,.06)", borderBottom: "1px solid #2a3040" }}>{title}</div>
            <div style={{ padding: "9px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                {rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <LedDot cls={r.cls} />
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#5c7080", minWidth: 82, flexShrink: 0, marginTop: 1, lineHeight: 1.3 }}>{r.label}</span>
                        <span style={{ fontSize: 12, color: "#c8d6e8", lineHeight: 1.35 }}>{r.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const LedDetailCard = ({ led }) => (
        <div style={{ background: "#111418", border: "1px solid #2a3040", borderRadius: 8, overflow: "hidden", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(0,212,255,.04)", borderBottom: "1px solid #2a3040" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: "#00d4ff", background: "rgba(0,212,255,.12)", border: "1px solid rgba(0,212,255,.3)", minWidth: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{led.n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{led.name}</div>
            </div>
            <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
                {led.states.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                        <LedDot cls={s.cls} />
                        <span style={{ fontSize: 12, color: "#5c7080", lineHeight: 1.35 }}><b style={{ color: "#c8d6e8" }}>{s.label}</b> — {s.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ padding: "14px 8x 32px", animation: "fi .3s ease" }}>
            {/* Header */}
            <div style={{ textAlign: "center", padding: "14px 0 8px", borderBottom: "1px solid #2a3040", marginBottom: 14 }}>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 1, lineHeight: 1.15, margin: 0 }}>BRM <span style={{ color: "#00d4ff" }}>Status</span> LEDs</h2>
                <div style={{ fontSize: 10, color: "#5c7080", marginTop: 3, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1.5px" }}>NCR BRM · Diagnostic Reference</div>
                <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #00d4ff, transparent)", margin: "8px auto 0" }} />
            </div>

            {/* Leyenda */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, background: "#111418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 11px", marginBottom: 12 }}>
                {[
                    ["rs", "Red Sólido — Falla"],
                    ["rf", "Red Flash — Atasco"],
                    ["as", "Amber — Advertencia"],
                    ["af", "Amber Flash — Desconocido"],
                    ["gs", "Verde — Saludable"],
                    ["loff", "Apagado — Inoperativo"],
                ].map(([cls, label]) => (
                    <div key={cls} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "#c8d6e8" }}>
                        <LedDot cls={cls} /> {label}
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 3, marginBottom: 0 }}>
                {[["overview", "Overview"], ["upper", "Upper"], ["lower", "Lower"]].map(([id, label]) => (
                    <button key={id} style={tabStyle(id)} onClick={() => setLedTab(id)}>{label}</button>
                ))}
            </div>

            {/* Panel: Overview */}
            {ledTab === "overview" && (
                <div style={cardStyle}>
                    {/* Imagen general de los paneles LED */}
                    <div style={{ background: "#111418", border: "1px solid #2a3040", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "1.5px", color: "#00d4ff", textTransform: "uppercase", padding: "7px 11px", borderBottom: "1px solid #2a3040", background: "rgba(0,212,255,.05)", display: "flex", alignItems: "center", gap: 6 }}>📷 Overall Status Indicator Light Panels</div>
                        {/*<img src="/brm-overview.png" alt="BRM Overall Status LED Panels" style={{ width: "100%", display: "block" }} />
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#5c7080", padding: "5px 11px", letterSpacing: ".5px", borderTop: "1px solid #2a3040", textAlign: "center" }}>GTS Reference · BRM Status LED Panels</div>*/}
                    </div>
                    <SectionTitle>Resumen por módulo</SectionTitle>
                    <ModuleRow leds={["rs", "as", "gs"]} name="Upper Module" desc="3 LEDs · Pestillos, atasco y reabastecimiento" />
                    <ModuleRow leds={["rs", "gs"]} name="Intermediate Module" desc="2 LEDs · Sensor PSN1 y atascos" />
                    <ModuleRow leds={["rs", "as", "gs"]} name="Lower Module" desc="3 LEDs · Pestillos, cassettes y reciclaje" />

                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, fontWeight: 700, color: "#00d4ff", letterSpacing: "1px", textTransform: "uppercase", margin: "14px 0 8px", opacity: .6 }}>Estados detallados</div>

                    <StateCard title="UPPER MODULE" rows={[
                        { cls: "rs", label: "ROJO SÓLIDO", desc: "Al menos un pestillo no cerrado" },
                        { cls: "rf", label: "ROJO FLASH", desc: "Atasco / Falla" },
                        { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
                        { cls: "loff", label: "VERDE OFF", desc: "Inoperativo" },
                        { cls: "gs", label: "VERDE SÓLIDO", desc: "Listo para usar" },
                    ]} />
                    <StateCard title="INTERMEDIATE MODULE" rows={[
                        { cls: "rs", label: "ROJO SÓLIDO", desc: "Sensor PSN1 bloqueado sin atasco — conector suelto" },
                        { cls: "rf", label: "ROJO FLASH", desc: "Atasco" },
                        { cls: "gs", label: "VERDE SÓLIDO", desc: "Listo para usar" },
                    ]} />
                    <StateCard title="LOWER MODULE" rows={[
                        { cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto o cassettes de reciclaje ausentes" },
                        { cls: "rf", label: "ROJO FLASH", desc: "Atasco / Falla" },
                        { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" },
                        { cls: "loff", label: "VERDE OFF", desc: "Inoperativo" },
                        { cls: "gs", label: "VERDE SÓLIDO", desc: "Listo para usar" },
                    ]} />
                </div>
            )}

            {/* Panel: Upper */}
            {ledTab === "upper" && (
                <div style={cardStyle}>
                    {/* Diagrama Upper Module */}
                    <div style={{ background: "#111418", border: "1px solid #2a3040", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "1.5px", color: "#00d4ff", textTransform: "uppercase", padding: "7px 11px", borderBottom: "1px solid #2a3040", background: "rgba(0,212,255,.05)", display: "flex", alignItems: "center", gap: 6 }}>📐 Upper Module — Diagrama LEDs 1–9</div>
                        <img src="/brm-upper.png" alt="Upper Module LED Diagram" style={{ width: "100%", display: "block" }} />
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#5c7080", padding: "5px 11px", letterSpacing: ".5px", borderTop: "1px solid #2a3040", textAlign: "center" }}>Individual Area Status Indicator Light Panels</div>
                    </div>
                    <SectionTitle>LEDs 1–9 · Estado detallado</SectionTitle>
                    <div style={{ fontSize: 10, fontFamily: "'Share Tech Mono'", color: "#5c7080", marginBottom: 12, background: "rgba(0,0,0,.25)", padding: "6px 10px", borderRadius: 4 }}>
                        LEDs individuales del módulo superior: transporte, escrow y reciclaje
                    </div>
                    {UPPER_LEDS.map(led => <LedDetailCard key={led.n} led={led} />)}
                </div>
            )}

            {/* Panel: Lower */}
            {ledTab === "lower" && (
                <div style={cardStyle}>
                    {/* Diagrama Lower Module */}
                    <div style={{ background: "#111418", border: "1px solid #2a3040", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "1.5px", color: "#00d4ff", textTransform: "uppercase", padding: "7px 11px", borderBottom: "1px solid #2a3040", background: "rgba(0,212,255,.05)", display: "flex", alignItems: "center", gap: 6 }}>📐 Lower Module — Diagrama LEDs 10–16</div>
                        <img src="/brm-lower.png" alt="Lower Module LED Diagram" style={{ width: "100%", display: "block" }} />
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#5c7080", padding: "5px 11px", letterSpacing: ".5px", borderTop: "1px solid #2a3040", textAlign: "center" }}>Individual Area Status Indicator Light Panels</div>
                    </div>
                    <SectionTitle>LEDs 10–16 · Estado detallado</SectionTitle>
                    <div style={{ fontSize: 10, fontFamily: "'Share Tech Mono'", color: "#5c7080", marginBottom: 12, background: "rgba(0,0,0,.25)", padding: "6px 10px", borderRadius: 4 }}>
                        LEDs individuales del módulo inferior: pestillos y cassettes de reciclaje
                    </div>
                    {LOWER_LEDS.map(led => <LedDetailCard key={led.n} led={led} />)}
                </div>
            )}
        </div>
    );
};

// 3. VISTAS: ERRORES Y PARTES (Implementar siguiendo el patrón de HomeView)
// ... (Aquí irían ErrorView y PartsView usando el mismo estilo de card-cyber)

// ═══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function App() {
    const [tab, setTab] = useState("home");
    const [darkMode, setDarkMode] = useState(true);

    useEffect(injectCSS, []);

    // Siempre en modo oscuro (tema cyber)
    const dk = true;

    const [q, setQ] = useState("");
    const [fav, setFav] = useState(() => ld("ncr_fv", []));
    const [exp, setExp] = useState(null);
    const [dF, setDF] = useState("all");
    const [cF, setCF] = useState("all");
    const [pF, setPF] = useState("all");
    const [errMode, setErrMode] = useState("tree"); // "tree" or "search"
    const [treeOpen, setTreeOpen] = useState(null); // which device is open: "s2" or "brm"
    const [treeComp, setTreeComp] = useState(null); // which component is selected
    const [partsOpen, setPartsOpen] = useState(null); // "S2" or "BRM" or null
    const [refOpen, setRefOpen] = useState(null); // "ras" or "nom" or null
    const iRef = useRef(null);

    useEffect(() => sv("ncr_fv", fav), [fav]);

    const tF = useCallback(id => setFav(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]), []);
    const ql = q.toLowerCase().trim();


    const $ = {
        bg: "var(--bg)", bg2: "var(--surf)", card: "var(--card)", bd: "var(--border)",
        tx: "var(--text)", dm: "var(--dim)", br: "#ffffff", am: "var(--accent)",
        amD: "var(--accent)", amG: "rgba(0, 212, 255, 0.07)", rd: "var(--error)",
        rdB: "rgba(255, 59, 48, 0.06)", bl: "#38bdf8", blB: "rgba(56, 189, 248, 0.06)",
        gn: "var(--success)", gnB: "rgba(0, 230, 118, 0.06)", pr: "#a78bfa", nav: "var(--surf)"
    };


    const cc = cat => ({ Sensor: $.bl, Mechanism: $.rd, Jam: $.rd, Communication: $.am, Security: $.pr, Interlock: $.am, Pick: $.rd, Cassette: $.gn, Board: $.bl, Shutter: $.am, General: $.dm, "Bill Validator": $.gn, Firmware: $.bl, Maintenance: $.gn, Reject: $.rd, Command: $.dm, Configuration: $.am, Memory: $.bl, Request: $.am, Discard: $.rd, SNR: $.bl }[cat] || $.dm);
    const F = { d: "'Rajdhani', sans-serif", m: "'Share Tech Mono', monospace" };

    // Category map for bilingual display
    const catLabel = cat => ({ General: "General", Memory: "Memoria", Communication: "Comunicación", Security: "Seguridad", Interlock: "Interlock", Request: "Solicitud", Configuration: "Configuración", Sensor: "Sensor", Mechanism: "Mecanismo", Jam: "Atasco/Jam", Pick: "Pique/Pick", Discard: "Descarte", SNR: "Nro. Serie", "Bill Validator": "Validador", Shutter: "Shutter", Board: "Placa/Board", Command: "Comando", Firmware: "Firmware", Maintenance: "Mantenimiento", Reject: "Rechazo", Cassette: "Cassette" }[cat] || cat);

    const fS = S2.filter(s => (dF === "all" || dF === "s2") && (cF === "all" || s.cat === cF) && (ql === "" || String(s.code).includes(ql) || s.desc.toLowerCase().includes(ql) || s.cat.toLowerCase().includes(ql) || s.catEs.toLowerCase().includes(ql) || (s.mdata || "").toLowerCase().includes(ql)));
    const fB = BRM.filter(s => (dF === "all" || dF === "brm") && (cF === "all" || s.cat === cF) && (ql === "" || String(s.code).includes(ql) || s.desc.toLowerCase().includes(ql) || s.cat.toLowerCase().includes(ql) || s.catEs.toLowerCase().includes(ql) || (s.mod || "").toLowerCase().includes(ql)));
    const fP = ALLP.filter(p => (pF === "all" || p.eq === pF) && (ql === "" || p.pn.toLowerCase().includes(ql) || p.d.toLowerCase().includes(ql) || p.m.toLowerCase().includes(ql)));
    const cats = [...new Set([...S2.map(s => s.cat), ...BRM.map(s => s.cat)])].sort();
    const dCm = [["07 01", "Reset de módulo"], ["01 11 01", "Transport Test: Pocket → Dispense"], ["01 11 03", "Transport Test: Pocket → Escrow"], ["01 11 31", "Transport Test: Pocket → Escrow → Pocket"], ["10 42", "Shutter abrir-cerrar (pulsar SW3)"], ["10 43", "Shutter en loop continuo"], ["6100", "Calibración de todos los sensores"], ["611F", "RAS Upper Module"], ["6113", "RAS Escrow"], ["6114", "RAS Bridge/Centralisation"], ["612F", "RAS Lower Module"], ["6131", "RAS Lower Exception Cassette"]];
    const sTp = [["PI", "Photo Interruptor (sensor óptico)"], ["SW", "Switch (interruptor)"], ["PS", "Photo Sensor (foto sensor)"], ["RS", "Rotary Swing / Solenoide"], ["BM", "Brushless DC Motor (motor sin escobillas)"], ["DM", "DC Motor (motor de corriente continua)"], ["SM", "Stepper Motor (motor paso a paso)"], ["SD", "Solenoide"]];
    const rU = S2U.filter(u => ql === "" || u.v.toLowerCase().includes(ql) || u.n.toLowerCase().includes(ql));
    const rS = S2S.filter(s => ql === "" || s.u.toLowerCase().includes(ql) || s.s.toLowerCase().includes(ql));
    const rM = BRM_MOD.filter(m => ql === "" || m.range.toLowerCase().includes(ql) || m.mod.toLowerCase().includes(ql) || m.desc.toLowerCase().includes(ql) || m.ex.toLowerCase().includes(ql));
    const rC = dCm.filter(([a, b]) => ql === "" || a.toLowerCase().includes(ql) || b.toLowerCase().includes(ql));
    const rT = sTp.filter(([a, b]) => ql === "" || a.toLowerCase().includes(ql) || b.toLowerCase().includes(ql));
    const rAny = rU.length || rS.length || rM.length || rC.length || rT.length;

    const sh = `0 1px 3px ${dk ? "rgba(0,0,0,.25)" : "rgba(0,0,0,.04)"}`;
    const Tag = ({ color, children }) => <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, fontFamily: F.m, color, background: `${color}14`, letterSpacing: ".03em", lineHeight: "18px" }}>{children}</span>;
    const Sec = ({ children, n }) => <div style={{ padding: "14px 16px 6px", fontSize: 10, fontWeight: 700, fontFamily: F.m, color: $.am, letterSpacing: ".14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 3, height: 12, background: $.am, borderRadius: 1 }} />{children}{n != null && <span style={{ color: $.dm, fontWeight: 500 }}>({n})</span>}</div>;
    const None = ({ i, t, s }) => <div style={{ textAlign: "center", padding: "50px 24px", animation: "nF .4s ease" }}><div style={{ fontSize: 36, marginBottom: 12, opacity: .5 }}>{i}</div><div style={{ fontSize: 15, fontWeight: 700, fontFamily: F.d, color: $.br }}>{t}</div><div style={{ fontSize: 12, color: $.dm, marginTop: 6, fontFamily: F.d }}>{s}</div></div>;
    const Search = ({ ph }) => <div style={{ padding: "10px 14px", position: "sticky", top: 54, zIndex: 99, background: $.bg }}><div style={{ position: "relative" }}><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: $.dm }}>{Ic.search}</div><input ref={iRef} className="ni" value={q} onChange={e => setQ(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "13px 40px 13px 44px", background: $.bg2, border: `1.5px solid ${$.bd}`, borderRadius: 12, color: $.br, fontSize: 14, fontFamily: F.d, fontWeight: 500, transition: "border-color .2s,box-shadow .2s", boxSizing: "border-box" }} onFocus={e => { e.target.style.borderColor = $.am; e.target.style.boxShadow = `0 0 0 3px ${$.am}15` }} onBlur={e => { e.target.style.borderColor = $.bd; e.target.style.boxShadow = "none" }} />{q && <button onClick={() => setQ("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: $.dm, cursor: "pointer", padding: 4 }}>{Ic.x}</button>}</div></div>;
    const Chip = ({ on, fn, children }) => <button className="nf" onClick={fn} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${on ? $.am : $.bd}`, background: on ? $.amG : "transparent", color: on ? $.am : $.dm, cursor: "pointer", fontSize: 11, fontFamily: F.d, fontWeight: on ? 700 : 500, whiteSpace: "nowrap", transition: "all .15s" }}>{children}</button>;

    const SC = ({ it, dv, i }) => {
        const id = `${dv}-${it.code}`, op = exp === id, fv = fav.includes(id); return (
            <div className="nc" onClick={() => setExp(op ? null : id)} style={{ margin: "5px 14px", padding: "14px 16px", background: $.card, borderRadius: 12, border: `1px solid ${op ? $.am + "60" : $.bd}`, cursor: "pointer", boxShadow: op ? `0 4px 24px ${$.amG}, inset 0 1px 0 ${$.am}12` : sh, animation: `nF .3s ease ${i * .025}s both` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ fontFamily: F.m, fontSize: 24, fontWeight: 700, color: $.am, lineHeight: 1, minWidth: 36, textAlign: "right" }}>{it.code}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontFamily: F.d, fontWeight: 500, color: $.br, lineHeight: 1.5 }}>{it.desc}</div>
                        <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                            <Tag color={cc(it.cat)}>{catLabel(it.cat)}</Tag>
                            {it.mod && <Tag color={$.bl}>{it.mod}</Tag>}
                        </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); tF(id) }} style={{ background: "none", border: "none", color: fv ? $.am : $.dm, cursor: "pointer", padding: 4, flexShrink: 0, transition: "color .15s" }}>{Ic.star(fv)}</button>
                </div>
                {op && it.mdata && <div style={{ marginTop: 12, padding: "12px 14px", background: dk ? "#090c10" : "#f5f6f8", borderRadius: 8, border: `1px solid ${$.bd}`, animation: "nF .2s ease" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, fontFamily: F.m, color: $.am, letterSpacing: ".12em", marginBottom: 8 }}>M_DATA — Datos adicionales</div>
                    <div style={{ fontSize: 11.5, fontFamily: F.m, color: $.tx, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{it.mdata}</div>
                </div>}
            </div>)
    };

    const PC = ({ p, i }) => {
        const id = `part-${p.pn}`, op = exp === id, fv = fav.includes(id); return (
            <div className="nc" onClick={() => setExp(op ? null : id)} style={{ margin: "5px 14px", padding: "14px 16px", background: $.card, borderRadius: 12, border: `1px solid ${op ? $.bl + "60" : $.bd}`, cursor: "pointer", boxShadow: op ? `0 4px 24px ${$.blB}` : sh, animation: `nF .3s ease ${i * .025}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: F.m, fontSize: 13, fontWeight: 600, color: $.bl, letterSpacing: ".02em" }}>{p.pn}</div>
                        <div style={{ fontSize: 12.5, fontFamily: F.d, color: $.br, marginTop: 5, lineHeight: 1.5 }}>{p.d}</div>
                        <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}><Tag color={p.eq === "S2" ? $.am : $.gn}>{p.eq}</Tag><Tag color={$.bl}>{p.m}</Tag></div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); tF(id) }} style={{ background: "none", border: "none", color: fv ? $.am : $.dm, cursor: "pointer", padding: 4 }}>{Ic.star(fv)}</button>
                </div>
                {op && <div style={{ marginTop: 12, padding: "12px 14px", background: dk ? "#090c10" : "#f5f6f8", borderRadius: 8, border: `1px solid ${$.bd}`, animation: "nF .2s ease", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: $.bg2, border: `1px dashed ${$.bd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📷</div>
                    <div><div style={{ fontSize: 10, fontFamily: F.m, color: $.dm }}>images/parts/{p.pn}.jpg</div><div style={{ fontSize: 10, fontFamily: F.d, color: $.dm, marginTop: 2, fontStyle: "italic" }}>Agregar foto en la carpeta</div></div>
                </div>}
            </div>)
    };

    // ═ TABS ═
    const ErrorView = () => {
        const isSearch = errMode === "search" || ql !== "";
        const selCodes = treeComp ? (treeOpen === "s2" ? S2_TREE : BRM_TREE).find(c => c.id === treeComp)?.codes || [] : [];
        const selItems = treeComp ? (treeOpen === "s2" ? S2 : BRM).filter(s => selCodes.includes(s.code)) : [];

        return <div>
            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 8, padding: "12px 14px 6px" }}>
                <button className="nf" onClick={() => { setErrMode("tree"); setQ("") }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${errMode === "tree" ? $.am : $.bd}`, background: errMode === "tree" ? $.amG : "transparent", color: errMode === "tree" ? $.am : $.dm, cursor: "pointer", fontFamily: F.d, fontSize: 12, fontWeight: errMode === "tree" ? 700 : 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                    Por componente
                </button>
                <button className="nf" onClick={() => { setErrMode("search"); setTreeOpen(null); setTreeComp(null) }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${errMode === "search" ? $.am : $.bd}`, background: errMode === "search" ? $.amG : "transparent", color: errMode === "search" ? $.am : $.dm, cursor: "pointer", fontFamily: F.d, fontSize: 12, fontWeight: errMode === "search" ? 700 : 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {Ic.search} Buscar código
                </button>
            </div>

            {/* Search mode */}
            {(errMode === "search" || ql !== "") && <>
                <Search ph="Buscar M_STATUS, error, módulo..." />
                <div className="ns" style={{ display: "flex", gap: 6, padding: "0 14px 8px", overflowX: "auto" }}>{[["all", "Todos"], ["s2", "S2 Dispenser"], ["brm", "BRM"], ["pcb", "Códigos PCB"], ["ras", "RAS / Diag"]].map(([v, l]) => <Chip key={v} on={dF === v} fn={() => { setDF(v); setCF("all") }}>{l}</Chip>)}</div>
                {dF !== "pcb" && <div className="ns" style={{ display: "flex", gap: 5, padding: "0 14px 10px", overflowX: "auto" }}><Chip on={cF === "all"} fn={() => setCF("all")}>Todas</Chip>{cats.map(ct => <Chip key={ct} on={cF === ct} fn={() => setCF(ct)}>{catLabel(ct)}</Chip>)}</div>}
                {(dF === "all" || dF === "s2") && fS.length > 0 && <><Sec n={fS.length}>S2 DISPENSER — 6627/6623</Sec>{fS.map((it, i) => <SC key={`s2-${it.code}`} it={it} dv="s2" i={i} />)}</>}
                {(dF === "all" || dF === "brm") && fB.length > 0 && <><Sec n={fB.length}>USB BRM — 6687/6683</Sec>{fB.map((it, i) => <SC key={`brm-${it.code}`} it={it} dv="brm" i={i} />)}</>}
                {(dF === "all" || dF === "pcb" || dF === "brm") && rM.length > 0 && <><Sec n={rM.length}>CÓDIGOS PCB DEL BRM</Sec>
                    <div style={{ padding: "0 14px 6px" }}><div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, lineHeight: 1.5 }}>Códigos visibles en los LEDs de la PCB (P-Status / S-Status).</div></div>
                    {rM.map(me => <div key={me.range} className="nc" style={{ margin: "5px 14px", padding: "14px 16px", background: $.card, borderRadius: 12, border: `1px solid ${$.bd}`, boxShadow: sh }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 14, fontWeight: 700, fontFamily: F.m, color: $.am }}>{me.range}</span><Tag color={$.bl}>{me.mod}</Tag></div><div style={{ fontSize: 12, fontFamily: F.d, color: $.tx, lineHeight: 1.5 }}>{me.desc}</div><div style={{ fontSize: 10.5, fontFamily: F.m, color: $.dm, marginTop: 8, lineHeight: 1.7, borderTop: `1px solid ${$.bd}`, paddingTop: 8 }}>{me.ex}</div></div>)}
                </>}
                {(dF === "all" || dF === "ras") && rC.length > 0 && <><Sec n={rC.length}>COMANDOS RAS / DIAGNÓSTICO — BRM</Sec>
                    <div style={{ padding: "0 14px 6px" }}><div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, lineHeight: 1.5 }}>Comandos de diagnóstico y calibración. Ejecutar desde Supervisor Mode → Diagnostics → Direct Command.</div></div>
                    {rC.map(([cmd, desc]) => <div key={cmd} style={{ margin: "5px 14px", padding: "14px 16px", background: $.card, borderRadius: 12, border: `1px solid ${$.bd}`, boxShadow: sh, display: "flex", gap: 14, alignItems: "center" }}><span style={{ fontFamily: F.m, fontSize: 16, fontWeight: 700, color: $.am, minWidth: 60, letterSpacing: ".04em" }}>{cmd}</span><span style={{ fontSize: 12.5, fontFamily: F.d, color: $.tx, flex: 1 }}>{desc}</span></div>)}
                </>}
                {!fS.length && !fB.length && dF !== "pcb" && !rM.length && dF !== "ras" && !rC.length && <None i="⚡" t="Sin resultados" s="Intenta con otro código o término" />}
            </>}

            {/* Tree mode */}
            {errMode === "tree" && !ql && <div style={{ padding: "6px 0" }}>
                {/* Level 1: Device selection */}
                {!treeOpen && <div style={{ padding: "0 14px" }}>
                    <div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, padding: "4px 0 12px" }}>Selecciona el equipo para ver sus componentes:</div>
                    {[["s2", "S2 DISPENSER", "NCR 6627 / 6623", "Dispensador de billetes", $.rd, $.rdB, S2.length],
                    ["brm", "BRM", "NCR 6687 / 6683", "Bunch Recycling Module — depósito y reciclaje", $.gn, $.gnB, BRM.length]
                    ].map(([id, name, model, sub, cl, bg, n], i) => (
                        <div key={id} className="nc" onClick={() => { setTreeOpen(id); setTreeComp(null); setExp(null) }} style={{ margin: "5px 0", padding: "16px", background: $.card, borderRadius: 12, border: `1px solid ${$.bd}`, cursor: "pointer", boxShadow: sh, animation: `nF .3s ease ${i * .08}s both` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, color: cl, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, fontWeight: 800, fontFamily: F.m }}>{id === "s2" ? "S2" : "BR"}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: F.d, color: $.br }}>{name}</div>
                                    <div style={{ fontSize: 11, fontFamily: F.m, color: $.am, marginTop: 2 }}>{model}</div>
                                    <div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, marginTop: 2 }}>{sub}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontFamily: F.m, fontSize: 18, fontWeight: 700, color: $.am }}>{n}</span>
                                    <span style={{ color: $.dm }}><ArrowR /></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}

                {/* Level 2: Component list */}
                {treeOpen && !treeComp && <div style={{ padding: "0 14px" }}>
                    <button className="nf" onClick={() => { setTreeOpen(null); setTreeComp(null) }} style={{ background: "none", border: "none", color: $.am, cursor: "pointer", fontFamily: F.d, fontSize: 12, fontWeight: 600, padding: "4px 0 10px", display: "flex", alignItems: "center", gap: 4 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                        Volver a equipos
                    </button>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: F.d, color: $.br, marginBottom: 4 }}>{treeOpen === "s2" ? "S2 DISPENSER" : "BRM"} <span style={{ fontFamily: F.m, fontSize: 11, color: $.am, fontWeight: 500 }}>{treeOpen === "s2" ? "6627/6623" : "6687/6683"}</span></div>
                    <div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, marginBottom: 12 }}>Selecciona el componente con problema:</div>
                    {(treeOpen === "s2" ? S2_TREE : BRM_TREE).map((comp, i) => {
                        const count = comp.codes.length;
                        return <div key={comp.id} className="nc" onClick={() => { setTreeComp(comp.id); setExp(null) }} style={{ margin: "4px 0", padding: "12px 14px", background: $.card, borderRadius: 10, border: `1px solid ${$.bd}`, cursor: "pointer", boxShadow: sh, animation: `nF .25s ease ${i * .03}s both` }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: 3, background: cc(treeOpen === "s2" ? "Sensor" : "Cassette"), flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, fontFamily: F.d, fontWeight: 500, color: $.br }}>{comp.label}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontFamily: F.m, fontSize: 11, color: $.dm }}>{count} {count === 1 ? "código" : "códigos"}</span>
                                    <span style={{ color: $.dm }}><ArrowR /></span>
                                </div>
                            </div>
                        </div>;
                    })}
                </div>}

                {/* Level 3: M_STATUS cards for selected component */}
                {treeOpen && treeComp && <div>
                    <div style={{ padding: "0 14px" }}>
                        <button className="nf" onClick={() => { setTreeComp(null); setExp(null) }} style={{ background: "none", border: "none", color: $.am, cursor: "pointer", fontFamily: F.d, fontSize: 12, fontWeight: 600, padding: "4px 0 6px", display: "flex", alignItems: "center", gap: 4 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                            Volver a componentes
                        </button>
                    </div>
                    <Sec n={selItems.length}>{(treeOpen === "s2" ? S2_TREE : BRM_TREE).find(c => c.id === treeComp)?.label}</Sec>
                    {selItems.map((it, i) => <SC key={`${treeOpen}-${it.code}`} it={it} dv={treeOpen} i={i} />)}
                    {selItems.length === 0 && <None i="📋" t="Sin códigos" s="No hay M_STATUS asociados a este componente" />}
                </div>}
            </div>}
        </div>;
    };

    // Parts module groupings
    const S2_PART_MODS = [...new Set(S2P.map(p => p.m))].sort();
    const BRM_PART_MODS = [...new Set(BRMP.map(p => p.m))].sort();
    const S2_TREE = [
        { id: "s2-snt", label: "SNT (Single Note Transport)", codes: [21, 41, 61, 70] },
        { id: "s2-carriage", label: "Carriage (Carro)", codes: [22, 42, 62, 71] },
        { id: "s2-presenter", label: "Presenter (Presentador)", codes: [23, 43, 72] },
        { id: "s2-shutter", label: "Shutter (Compuerta)", codes: [24, 44, 73] },
        { id: "s2-pick", label: "Pick Units (Módulos de pique)", codes: [25, 26, 27, 28, 29, 30, 45, 46, 47, 48, 49, 50, 64, 65, 66, 67, 68, 69, 74, 75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86] },
        { id: "s2-aligner", label: "Aligner / BAM (Alineador)", codes: [31, 51] },
        { id: "s2-vacuum", label: "Vacuum System (Sistema de vacío)", codes: [32, 52] },
        { id: "s2-cassette", label: "Cassette (Gavetas)", codes: [33] },
        { id: "s2-purge", label: "Purge Bin (Bin de purga)", codes: [91, 92, 93] },
        { id: "s2-board", label: "Control Board / PCB", codes: [1, 2, 3, 7, 8, 9] },
        { id: "s2-interlock", label: "Interlock (Seguridad)", codes: [5, 99] },
        { id: "s2-general", label: "General", codes: [0, 4, 6, 95] },
    ];
    const BRM_TREE = [
        { id: "brm-pocket", label: "Pocket (Boca de depósito)", codes: [4, 27, 28, 29, 82, 84, 85] },
        { id: "brm-shutter", label: "Shutter (Compuerta)", codes: [21, 22, 23, 26] },
        { id: "brm-bv", label: "Bill Validator (Validador)", codes: [24, 32, 71] },
        { id: "brm-upper", label: "Upper Transport (Transporte superior)", codes: [31, 33, 38, 61, 62, 63, 64, 65, 66] },
        { id: "brm-escrow", label: "Escrow (Custodia)", codes: [34, 35] },
        { id: "brm-exception", label: "Upper Exception Bin", codes: [39, 67, 80] },
        { id: "brm-intermediate", label: "Intermediate Transport", codes: [72, 73] },
        { id: "brm-lower", label: "Lower Transport (Transporte inferior)", codes: [42, 74, 75, 76] },
        { id: "brm-vertical", label: "Vertical Transport", codes: [43, 77, 78, 79] },
        { id: "brm-cassettes", label: "Cassettes (Gavetas 1-5)", codes: [44, 45, 46, 47, 68] },
        { id: "brm-exception-lower", label: "Lower Exception Cassette", codes: [41] },
        { id: "brm-upper-cpu", label: "Upper CPU PCB (Placa superior)", codes: [48] },
        { id: "brm-lower-cpu", label: "Lower CPU PCB (Placa inferior)", codes: [49] },
        { id: "brm-general", label: "General / Comunicación", codes: [0, 1, 2, 3, 5, 6, 10, 20, 25, 50, 51, 52, 53, 60, 69, 70, 81, 83] },
    ];
    const ArrowR = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg>;
    const ArrowD = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="6 9 12 15 18 9" /></svg>;

    const PartsView = () => {
        const isSearching = ql !== "";
        const showParts = partsOpen && partsOpen !== "NOM" ? (partsOpen === "S2" ? S2P : BRMP).filter(p => ql === "" || p.pn.toLowerCase().includes(ql) || p.d.toLowerCase().includes(ql) || p.m.toLowerCase().includes(ql)) : fP;

        return <div>
            <Search ph="Buscar número de parte, descripción..." />

            {/* If searching, show flat results */}
            {isSearching && <>
                {fP.length ? <><Sec n={fP.length}>RESULTADOS</Sec>{fP.map((p, i) => <PC key={p.pn} p={p} i={i} />)}</> : <None i="🔧" t="Sin resultados" s="Busca por número de parte o descripción" />}
            </>}

            {/* Tree mode when not searching */}
            {!isSearching && <div style={{ padding: "6px 0" }}>
                {/* Level 1: Equipment selection */}
                {!partsOpen && <div style={{ padding: "0 14px" }}>
                    <div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, padding: "4px 0 12px" }}>Selecciona el equipo para ver sus partes:</div>
                    {[["S2", "S2 DISPENSER", "NCR 6627 / 6623", "Partes del dispensador de billetes", $.rd, $.rdB, S2P.length],
                    ["BRM", "BRM", "NCR 6687 / 6683", "Partes del módulo de reciclaje", $.gn, $.gnB, BRMP.length],
                    ["NOM", "SENSORES", "S2 / BRM", "Prefijos, unidades y nomenclatura de sensores", $.pr, "rgba(167, 139, 250, 0.07)", sTp.length + S2U.length + S2S.length]
                    ].map(([id, name, model, sub, cl, bg, n], i) => (
                        <div key={id} className="nc" onClick={() => { setPartsOpen(id); setExp(null) }} style={{ margin: "5px 0", padding: "16px", background: $.card, borderRadius: 12, border: `1px solid ${$.bd}`, cursor: "pointer", boxShadow: sh, animation: `nF .3s ease ${i * .08}s both` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, color: cl, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, fontWeight: 800, fontFamily: F.m }}>{id === "S2" ? "S2" : id === "BRM" ? "BR" : "SN"}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: F.d, color: $.br }}>{name}</div>
                                    <div style={{ fontSize: 11, fontFamily: F.m, color: $.am, marginTop: 2 }}>{model}</div>
                                    <div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, marginTop: 2 }}>{sub}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontFamily: F.m, fontSize: 18, fontWeight: 700, color: $.am }}>{n}</span>
                                    <span style={{ color: $.dm }}><ArrowR /></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>}

                {/* Level 2: Parts list for selected equipment */}
                {partsOpen && partsOpen !== "NOM" && <div>
                    <div style={{ padding: "0 14px" }}>
                        <button className="nf" onClick={() => { setPartsOpen(null); setExp(null) }} style={{ background: "none", border: "none", color: $.am, cursor: "pointer", fontFamily: F.d, fontSize: 12, fontWeight: 600, padding: "4px 0 10px", display: "flex", alignItems: "center", gap: 4 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                            Volver a equipos
                        </button>
                    </div>
                    <Sec n={showParts.length}>{partsOpen === "S2" ? "PARTES S2 DISPENSER" : "PARTES BRM"}</Sec>
                    {showParts.map((p, i) => <PC key={p.pn} p={p} i={i} />)}
                    {showParts.length === 0 && <None i="🔧" t="Sin resultados" s="No se encontraron partes" />}
                </div>}

                {/* Level 2: Sensor nomenclature */}
                {partsOpen === "NOM" && <div>
                    <div style={{ padding: "0 14px" }}>
                        <button className="nf" onClick={() => { setPartsOpen(null); setExp(null) }} style={{ background: "none", border: "none", color: $.am, cursor: "pointer", fontFamily: F.d, fontSize: 12, fontWeight: 600, padding: "4px 0 10px", display: "flex", alignItems: "center", gap: 4 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                            Volver a equipos
                        </button>
                    </div>

                    <Sec n={sTp.length}>PREFIJOS DE SENSORES</Sec>
                    <div style={{ padding: "0 14px 8px" }}><div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, lineHeight: 1.5 }}>Prefijo que identifica el tipo de sensor o actuador en la nomenclatura NCR.</div></div>
                    {sTp.map(([prefix, desc]) => (
                        <div key={prefix} style={{ margin: "4px 14px", padding: "12px 16px", background: $.card, borderRadius: 10, border: `1px solid ${$.bd}`, boxShadow: sh, display: "flex", gap: 14, alignItems: "center" }}>
                            <span style={{ fontFamily: F.m, fontSize: 16, fontWeight: 700, color: $.pr, minWidth: 40, letterSpacing: ".04em" }}>{prefix}</span>
                            <span style={{ fontSize: 12.5, fontFamily: F.d, color: $.tx, flex: 1 }}>{desc}</span>
                        </div>
                    ))}

                    <Sec n={S2U.length}>UNIDADES S2 — BYTE 1 DE M_DATA</Sec>
                    <div style={{ padding: "0 14px 8px" }}><div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, lineHeight: 1.5 }}>Valor hexadecimal que identifica la unidad en los datos adicionales (M_DATA) del S2 Dispenser.</div></div>
                    {S2U.map(u => (
                        <div key={u.v} style={{ margin: "4px 14px", padding: "12px 16px", background: $.card, borderRadius: 10, border: `1px solid ${$.bd}`, boxShadow: sh, display: "flex", gap: 14, alignItems: "center" }}>
                            <span style={{ fontFamily: F.m, fontSize: 16, fontWeight: 700, color: $.am, minWidth: 40, letterSpacing: ".04em" }}>{u.v}</span>
                            <span style={{ fontSize: 12.5, fontFamily: F.d, color: $.tx, flex: 1 }}>{u.n}</span>
                        </div>
                    ))}

                    <Sec n={S2S.length}>SENSORES POR UNIDAD — S2 DISPENSER</Sec>
                    <div style={{ padding: "0 14px 8px" }}><div style={{ fontSize: 11, fontFamily: F.d, color: $.dm, lineHeight: 1.5 }}>ID de sensor (Byte 4 de M_DATA) para fallas tipo Sensor / Cambio inesperado por unidad.</div></div>
                    {S2S.map((s, i) => {
                        const id = `nom-${s.u}`, op = exp === id; return (
                            <div key={s.u} className="nc" onClick={() => setExp(op ? null : id)} style={{ margin: "5px 14px", padding: "14px 16px", background: $.card, borderRadius: 12, border: `1px solid ${op ? $.pr + "60" : $.bd}`, cursor: "pointer", boxShadow: op ? `0 4px 24px rgba(167,139,250,.12)` : sh, animation: `nF .3s ease ${i * .03}s both` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontFamily: F.d, fontWeight: 600, color: $.br }}>{s.u}</span>
                                    <span style={{ color: $.dm }}>{op ? <ArrowD /> : <ArrowR />}</span>
                                </div>
                                {op && <div style={{ marginTop: 10, padding: "10px 12px", background: dk ? "#090c10" : "#f5f6f8", borderRadius: 8, border: `1px solid ${$.bd}`, animation: "nF .2s ease" }}>
                                    <div style={{ fontSize: 11, fontFamily: F.m, color: $.tx, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{s.s}</div>
                                </div>}
                            </div>
                        );
                    })}
                </div>}
            </div>}
        </div>;
    };

    const renderView = () => {
        switch (tab) {
            case "home": return <HomeView setTab={setTab} />;
            case "leds": return <LEDRefView />;
            case "errors": return <ErrorView />;
            case "parts": return <PartsView />;
            default: return <HomeView setTab={setTab} />;
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <div className="bg-grid" />

            {/* HEADER FIJO */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                padding: '15px 20px',
                background: 'rgba(17, 20, 24, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #2a3040',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px', background: '#00d4ff',
                        borderRadius: '6px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#0a0c10', fontWeight: 'bold',
                        fontFamily: "'Orbitron', sans-serif"
                    }}>N</div>
                    <div className="font-orbitron" style={{ fontSize: '14px', color: '#00d4ff' }}>NCR TECH</div>
                </div>
                <div style={{ fontSize: '12px', color: '#5c7080', fontFamily: "'Share Tech Mono'" }}>v2.0.4</div>
            </header>

            {/* CONTENIDO DINÁMICO — con padding para header y nav fijos */}
            <main style={{ paddingTop: '62px', paddingBottom: '70px' }}>
                {renderView()}
            </main>

            {/* NAVEGACIÓN INFERIOR FIJA */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
                background: 'rgba(17, 20, 24, 0.97)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid #2a3040',
                display: 'flex',
                paddingBottom: 'env(safe-area-inset-bottom)'
            }}>
                <NavButton active={tab === 'home'} onClick={() => setTab('home')} icon="🏠" label="Inicio" />
                <NavButton active={tab === 'errors'} onClick={() => setTab('errors')} icon="⚠️" label="Errores" />
                <NavButton active={tab === 'parts'} onClick={() => setTab('parts')} icon="🔧" label="Partes" />
                <NavButton active={tab === 'leds'} onClick={() => setTab('leds')} icon="💡" label="LEDs" />
            </nav>
        </div>
    );
}

const NavButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} style={{
        flex: 1, padding: '12px 0', border: 'none', background: 'none',
        color: active ? '#00d4ff' : '#5c7080',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        fontSize: '10px', fontFamily: "'Rajdhani', sans-serif"
    }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontWeight: active ? '700' : '500' }}>{label}</span>
        {active && <div style={{ position: 'absolute', top: 0, width: '40%', height: '2px', background: '#00d4ff' }} />}
    </button>
);