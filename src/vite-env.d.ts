/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
    export function registerSW(options?: {
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
    }): void;
}

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}
