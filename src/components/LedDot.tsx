import { LED_COLORS } from "../data/devices/ncr/brm/leds";

type LedKey = keyof typeof LED_COLORS;

interface LedDotProps {
    cls: string;
    size?: number;
}

export function LedDot({ cls, size = 11 }: LedDotProps) {
    const key = (cls in LED_COLORS ? cls : "loff") as LedKey;
    const c = LED_COLORS[key];
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
