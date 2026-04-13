export const UPPER_LEDS = [
    { n: 1, name: "Dispense Transport", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 2, name: "Upper Transport — Front Latch", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 3, name: "Upper Transport — Back Latch", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 4, name: "Escrow Transport", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 5, name: "Bridge / Centralisation", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 6, name: "Cash-in Transport — Front Latch", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 7, name: "Cash-in Transport — Back Latch", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 8, name: "Escrow", states: [{ cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" }, { cls: "gs", label: "VERDE", desc: "Saludable" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
    { n: 9, name: "Upper Transport — Replenishment", states: [{ cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" }, { cls: "gs", label: "VERDE", desc: "Saludable" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
];

export const LOWER_LEDS = [
    { n: 10, name: "Lower Transport — Front Latch", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto o cassette ausente" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 11, name: "Lower Transport — Back Latch", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Pestillo abierto o cassette ausente" }, { cls: "rf", label: "ROJO FLASH", desc: "Atasco o falla" }, { cls: "gs", label: "VERDE", desc: "Saludable" }] },
    { n: 12, name: "Recycling Cassette 1", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" }, { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" }, { cls: "gs", label: "VERDE", desc: "OK" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
    { n: 13, name: "Recycling Cassette 2", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" }, { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" }, { cls: "gs", label: "VERDE", desc: "OK" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
    { n: 14, name: "Recycling Cassette 3", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" }, { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" }, { cls: "gs", label: "VERDE", desc: "OK" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
    { n: 15, name: "Recycling Cassette 4", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" }, { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento" }, { cls: "gs", label: "VERDE", desc: "OK" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
    { n: 16, name: "Lower Exception Cassette", states: [{ cls: "rs", label: "ROJO SÓLIDO", desc: "Cassette ausente" }, { cls: "as", label: "ÁMBAR", desc: "Para reabastecimiento / lleno" }, { cls: "gs", label: "VERDE", desc: "OK" }, { cls: "loff", label: "APAGADO", desc: "Inoperativo" }] },
];

export const LED_COLORS = {
    rs:   { bg: "#ff3b30", glow: "rgba(255,59,48,.8)",  anim: false },
    rf:   { bg: "#ff3b30", glow: "rgba(255,59,48,.8)",  anim: true  },
    as:   { bg: "#ffb800", glow: "rgba(255,184,0,.8)",  anim: false },
    af:   { bg: "#ffb800", glow: "rgba(255,184,0,.8)",  anim: true  },
    gs:   { bg: "#00e676", glow: "rgba(0,230,118,.8)",  anim: false },
    loff: { bg: "#252930", glow: "none",                anim: false },
};
