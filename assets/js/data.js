/* =========================================================
   Datos públicos desde Supabase (solo lectura).
   No usa la librería de Supabase: hace consultas simples a la API REST
   con la clave pública (anon/publishable). Escribir está bloqueado por
   las políticas RLS de la base de datos (ver supabase/schema.sql).
   Si no hay configuración o Supabase no responde, las páginas usan
   el contenido de respaldo y siguen funcionando.
   ========================================================= */
window.PanchoData = (() => {
  "use strict";

  const cfg = window.PANCHO_CONFIG || {};
  const url = typeof cfg.supabaseUrl === "string" ? cfg.supabaseUrl.replace(/\/+$/, "") : "";
  const key = typeof cfg.supabaseAnonKey === "string" ? cfg.supabaseAnonKey : "";
  const enabled = /^https:\/\/[^\s/]+$/.test(url) && key.length > 20;

  async function rest(path, timeout = 3500) {
    if (!enabled) throw new Error("Supabase no está configurado");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(`${url}/rest/v1/${path}`, {
        headers: { apikey: key, Accept: "application/json" },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  const imageUrl = (path) =>
    enabled && typeof path === "string" && path
      ? `${url}/storage/v1/object/public/media/${path.split("/").map(encodeURIComponent).join("/")}`
      : null;

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Categorías + productos activos (las políticas RLS ya filtran los inactivos)
  async function getMenu() {
    const [categories, products] = await Promise.all([
      rest("categories?select=slug,name,sort_order&order=sort_order.asc"),
      rest("products?select=id,category,name,description,price,price_cash,price_transfer,badge,image_path,art,featured,sort_order&active=eq.true&order=sort_order.asc,name.asc"),
    ]);
    if (!Array.isArray(categories) || !Array.isArray(products)) throw new Error("Respuesta inválida");
    return { categories, products };
  }

  // Eventos activos con sus fotos
  async function getEvents() {
    const rows = await rest(
      "events?select=id,title,description,event_date,sort_order,event_photos(id,image_path,caption,sort_order)" +
        "&active=eq.true&order=event_date.desc.nullslast,sort_order.asc&event_photos.order=sort_order.asc",
      6000
    );
    if (!Array.isArray(rows)) throw new Error("Respuesta inválida");
    return rows;
  }

  return { enabled, getMenu, getEvents, imageUrl, esc };
})();
