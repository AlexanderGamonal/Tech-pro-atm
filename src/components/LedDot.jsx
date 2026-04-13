import { LED_COLORS } from "../data/leds";

export function LedDot({ cls, size = 11 }) {
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
}
