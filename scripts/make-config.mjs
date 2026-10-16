#!/usr/bin/env node
/* =========================================================
   Genera config.js a partir de variables de entorno.

     SUPABASE_URL       → URL del proyecto (https://xxxx.supabase.co)
     SUPABASE_ANON_KEY  → clave PÚBLICA (anon / publishable)

   Uso local:  copiá .env.example a .env, completalo y ejecutá
               node scripts/make-config.mjs
   En GitHub:  lo ejecuta el workflow de publicación con las
               variables del repositorio.

   Se niega a usar una clave secreta (service_role / sb_secret_).
   ========================================================= */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const out = process.argv[2] || "config.js";

// Lee .env si existe (sin pisar variables ya definidas)
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trim().startsWith("#") && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

const url = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
const key = (process.env.SUPABASE_ANON_KEY || "").trim();

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

function isSecret(k) {
  if (/^sb_secret_/i.test(k)) return true;
  const parts = k.split(".");
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      return payload.role === "service_role";
    } catch { /* no es un JWT */ }
  }
  return false;
}

if (!url && !key) {
  console.warn("⚠ SUPABASE_URL y SUPABASE_ANON_KEY no están definidas: se genera config.js vacío (la web usa el menú de respaldo y el panel queda deshabilitado).");
} else {
  if (!/^https:\/\/[^\s/]+$/.test(url)) fail("SUPABASE_URL no es válida. Tiene que ser como https://xxxx.supabase.co");
  if (key.length < 20) fail("SUPABASE_ANON_KEY parece incompleta.");
  if (isSecret(key)) fail("SUPABASE_ANON_KEY es una clave SECRETA (service_role). Usá la clave pública (anon / publishable) y rotá la secreta en Supabase.");
}

const body = `/* Generado por scripts/make-config.mjs — no editar a mano. Solo datos públicos. */
window.PANCHO_CONFIG = ${JSON.stringify({ supabaseUrl: url, supabaseAnonKey: key }, null, 2)};
`;
writeFileSync(out, body);
console.log(`✔ ${out} generado${url ? ` para ${url}` : " (sin Supabase)"}`);
