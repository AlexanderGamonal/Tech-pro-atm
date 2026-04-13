import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ncr_fv";

function loadFromStorage(key, defaultValue) {
    try {
        const raw = window.localStorage?.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    try {
        window.localStorage?.setItem(key, JSON.stringify(value));
    } catch { /* storage unavailable */ }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => loadFromStorage(STORAGE_KEY, []));

    useEffect(() => {
        saveToStorage(STORAGE_KEY, favorites);
    }, [favorites]);

    const toggleFavorite = useCallback((id) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    }, []);

    return { favorites, toggleFavorite };
}
