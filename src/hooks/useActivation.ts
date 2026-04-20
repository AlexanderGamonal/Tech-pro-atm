import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const STORAGE_KEY = "atm_activation_v1";

// Genera una "huella" del dispositivo para asociar el token al equipo
function getDeviceFingerprint(): string {
    const parts = [
        navigator.language,
        navigator.platform ?? "",
        String(screen.width),
        String(screen.height),
        String(screen.colorDepth),
        String(new Date().getTimezoneOffset()),
    ];
    return btoa(unescape(encodeURIComponent(parts.join("|")))).slice(0, 32);
}

export type ActivationStatus = "checking" | "locked" | "unlocked";
export type ValidationStatus = "idle" | "loading" | "error" | "success";

export function useActivation() {
    const [status, setStatus]               = useState<ActivationStatus>("checking");
    const [validationStatus, setValidation] = useState<ValidationStatus>("idle");
    const [errorMsg, setErrorMsg]           = useState("");

    // Al arrancar: ¿este dispositivo ya fue activado?
    // También escucha el evento cuando otra instancia del hook activa el dispositivo
    useEffect(() => {
        const check = () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            setStatus(saved ? "unlocked" : "locked");
        };
        check();
        window.addEventListener("atm-activated", check);
        return () => window.removeEventListener("atm-activated", check);
    }, []);

    async function activate(rawToken: string) {
        const token = rawToken.trim().toUpperCase();
        if (!token) return;

        setValidation("loading");
        setErrorMsg("");

        try {
            const tokenRef  = doc(db, "tokens", token);
            const tokenSnap = await getDoc(tokenRef);

            if (!tokenSnap.exists()) {
                setValidation("error");
                setErrorMsg("Código inválido. Verifica el token e intenta nuevamente.");
                return;
            }

            const data = tokenSnap.data();

            if (data.used) {
                setValidation("error");
                setErrorMsg("Este código ya fue utilizado en otro dispositivo.");
                return;
            }

            // Marcar el token como usado en Firestore
            const fingerprint = getDeviceFingerprint();
            await updateDoc(tokenRef, {
                used:              true,
                activatedAt:       Timestamp.now(),
                deviceFingerprint: fingerprint,
            });

            // Guardar activación local y notificar a todas las instancias del hook
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                token,
                activatedAt: Date.now(),
                fingerprint,
            }));
            window.dispatchEvent(new Event("atm-activated"));

            setValidation("success");
            setTimeout(() => setStatus("unlocked"), 1400);

        } catch {
            setValidation("error");
            setErrorMsg("Error de conexión. Verifica tu internet e intenta nuevamente.");
        }
    }

    return { status, validationStatus, errorMsg, activate };
}
