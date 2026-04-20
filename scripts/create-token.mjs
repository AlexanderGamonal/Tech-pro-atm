// ─────────────────────────────────────────────────────────────────────────────
// Script de administración: crea tokens de acceso en Firestore
// Ejecutar localmente: node scripts/create-token.mjs "Nombre del Técnico"
//
// REQUISITOS:
//   1. npm install firebase-admin  (solo necesitas instalarlo una vez aquí)
//   2. Descargar service account key desde Firebase Console:
//      Project Settings → Service accounts → Generate new private key
//   3. Guardar el archivo como: scripts/service-account.json
//      (ya está en .gitignore, nunca se sube al repo)
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cargar service account
let serviceAccount;
try {
    serviceAccount = JSON.parse(readFileSync(join(__dirname, "service-account.json"), "utf8"));
} catch {
    console.error("\n❌  No se encontró scripts/service-account.json");
    console.error("   Descárgalo desde Firebase Console → Project Settings → Service accounts\n");
    process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ─── Generar ID de token legible ─────────────────────────────────────────────
function generateToken(label) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O,I,0,1 para evitar confusión
    const seg   = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const prefix = label
        .split(" ")[0]
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 4)
        .padEnd(4, "X");
    return `${prefix}-${seg(4)}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const label = process.argv[2];

if (!label) {
    console.error('\n❌  Uso: node scripts/create-token.mjs "Nombre del Técnico"\n');
    process.exit(1);
}

const tokenId   = generateToken(label);
const tokenData = {
    label,
    used:              false,
    activatedAt:       null,
    deviceFingerprint: null,
    createdAt:         Timestamp.now(),
};

try {
    await db.collection("tokens").doc(tokenId).set(tokenData);
    console.log("\n✅  Token creado exitosamente:");
    console.log(`   Técnico : ${label}`);
    console.log(`   Token   : ${tokenId}`);
    console.log(`   Firestore: tokens/${tokenId}\n`);
} catch (err) {
    console.error("\n❌  Error al crear token:", err.message, "\n");
    process.exit(1);
}
