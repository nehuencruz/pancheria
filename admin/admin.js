/* =========================================================
   Panel administrativo — El Mejor Pancho
   · Login con Supabase Auth (email + contraseña).
   · Solo usuarios en la tabla `admins` pueden modificar datos:
     lo garantizan las políticas RLS de la base (supabase/schema.sql),
     no este archivo. Acá solo se usa la clave PÚBLICA.
   ========================================================= */
(() => {
  "use strict";

  const BUCKET = "media";
  const MAX_SIDE = 1600;            // px del lado más largo al subir fotos
  const MAX_UPLOAD = 5 * 1024 * 1024;
  const MAX_ORIGINAL = 30 * 1024 * 1024;
  const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const money = (n) => "$" + Number(n).toLocaleString("es-AR");
  const VIEWS = ["viewConfig", "viewLogin", "viewDenied", "viewApp"];
  const showView = (id) => VIEWS.forEach((v) => ($("#" + v).hidden = v !== id));

  /* ---------- Configuración ---------- */
  const cfg = window.PANCHO_CONFIG || {};
  const url = typeof cfg.supabaseUrl === "string" ? cfg.supabaseUrl.replace(/\/+$/, "") : "";
  const key = typeof cfg.supabaseAnonKey === "string" ? cfg.supabaseAnonKey : "";

  // Nunca aceptar una clave secreta en el navegador
  function looksSecret(k) {
    if (/^sb_secret_/i.test(k)) return true;
    const parts = k.split(".");
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.role === "service_role";
      } catch { /* no es un JWT legible */ }
    }
    return false;
  }

  if (!/^https:\/\/[^\s/]+$/.test(url) || key.length < 20 || !window.supabase) {
    showView("viewConfig");
    return;
  }
  if (looksSecret(key)) {
    $("#configMsg").textContent = "La clave configurada es una clave SECRETA (service_role). Por seguridad el panel no funciona con ella: usá la clave pública (anon / publishable) y cambiá la clave secreta en Supabase.";
    showView("viewConfig");
    return;
  }

  const sb = window.supabase.createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });

  /* ---------- Avisos ---------- */
  function toast(msg, type = "ok") {
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast--error" : "");
    el.textContent = msg;
    $("#toasts").appendChild(el);
    setTimeout(() => el.remove(), type === "error" ? 6000 : 3000);
  }

  function friendlyError(err) {
    const m = (err && (err.message || err.error_description)) || String(err || "");
    if (err && (err.status === 401 || /JWT|token/i.test(m))) return "Tu sesión venció. Volvé a entrar.";
    if (err && (err.code === "42501" || /row-level security|permission denied/i.test(m))) return "No tenés permiso para hacer esto.";
    if (/Failed to fetch|NetworkError|network/i.test(m)) return "No hay conexión. Revisá internet e intentá de nuevo.";
    if (err && err.code === "23503") return "No se puede: hay datos que dependen de esto.";
    if (/check constraint/i.test(m)) return "Algún dato no es válido (revisá largos y precios).";
    return m || "Ocurrió un error inesperado.";
  }

  async function guard(promise) {
    const res = await promise;
    if (res.error) {
      if (res.error.status === 401) setTimeout(() => sb.auth.signOut(), 0);
      throw res.error;
    }
    return res.data;
  }

  /* ---------- Sesión ---------- */
  let currentUserId = null;

  async function handleSession(session) {
    const uid = session?.user?.id || null;
    if (uid === currentUserId && uid !== null) return;
    currentUserId = uid;
    if (!session) { showView("viewLogin"); return; }

    const { data: isAdmin, error } = await sb.rpc("is_admin");
    if (error) { toast(friendlyError(error), "error"); showView("viewLogin"); currentUserId = null; return; }
    if (!isAdmin) { showView("viewDenied"); return; }

    $("#userEmail").textContent = session.user.email || "";
    showView("viewApp");
    loadAll();
  }

  // Supabase recomienda no hacer llamadas dentro del callback: se difieren.
  sb.auth.onAuthStateChange((_event, session) => setTimeout(() => handleSession(session), 0));

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value;
    const errEl = $("#loginError");
    errEl.hidden = true;
    if (!email || !password) { errEl.textContent = "Completá email y contraseña."; errEl.hidden = false; return; }
    const btn = $("#loginBtn");
    btn.disabled = true; btn.textContent = "Entrando…";
    const { error } = await sb.auth.signInWithPassword({ email, password });
    btn.disabled = false; btn.textContent = "Entrar";
    if (error) {
      errEl.textContent = /invalid/i.test(error.message) ? "Email o contraseña incorrectos." : friendlyError(error);
      errEl.hidden = false;
      form.password.value = "";
      return;
    }
    form.password.value = "";
  });

  $("#passToggle").addEventListener("click", (e) => {
    const input = $("#loginForm").password;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    e.currentTarget.textContent = show ? "Ocultar" : "Ver";
    e.currentTarget.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
  });

  $$("[data-logout]").forEach((b) => b.addEventListener("click", async () => {
    await sb.auth.signOut();
    currentUserId = null;
    showView("viewLogin");
  }));

  /* ---------- Estado ---------- */
  const state = { categories: [], products: [], events: [] };
  const catName = (slug) => (state.categories.find((c) => c.slug === slug) || {}).name || slug;
  const publicUrl = (path) => (path ? sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : null);

  async function loadAll() {
    try {
      const [categories, products, events] = await Promise.all([
        guard(sb.from("categories").select("slug,name,sort_order").order("sort_order")),
        guard(sb.from("products").select("*").order("sort_order").order("name")),
        guard(sb.from("events").select("*, event_photos(*)")
          .order("event_date", { ascending: false, nullsFirst: false })
          .order("sort_order")
          .order("sort_order", { referencedTable: "event_photos" })),
      ]);
      state.categories = categories;
      state.products = products;
      state.events = events;
      fillCategorySelects();
      renderProducts();
      renderEvents();
    } catch (err) {
      toast(friendlyError(err), "error");
    }
  }

  /* ---------- Pestañas ---------- */
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.setAttribute("aria-selected", t === tab));
    $("#panelProducts").hidden = tab.dataset.tab !== "products";
    $("#panelEvents").hidden = tab.dataset.tab !== "events";
  }));

  /* =========================================================
     FOTOS: se achican en el navegador antes de subir
     ========================================================= */
  async function prepareImage(file) {
    if (!OK_TYPES.includes(file.type)) throw new Error(`"${file.name}": formato no permitido. Usá JPG, PNG o WEBP.`);
    if (file.size > MAX_ORIGINAL) throw new Error(`"${file.name}" es demasiado pesada (máx. 30 MB).`);
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      throw new Error(`No se pudo leer "${file.name}". Probá con otra foto.`);
    }
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    if (bitmap.close) bitmap.close();
    const toBlob = (type, q) => new Promise((res) => canvas.toBlob(res, type, q));
    let blob = await toBlob("image/webp", 0.85);
    if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg", 0.85);
    if (!blob) throw new Error(`No se pudo procesar "${file.name}".`);
    if (blob.size > MAX_UPLOAD) throw new Error(`"${file.name}" sigue siendo muy pesada después de achicarla.`);
    return { blob, type: blob.type, ext: blob.type === "image/webp" ? "webp" : "jpg" };
  }

  async function uploadImage(folder, file) {
    const img = await prepareImage(file);
    const path = `${folder}/${crypto.randomUUID()}.${img.ext}`;
    await guard(sb.storage.from(BUCKET).upload(path, img.blob, { contentType: img.type, cacheControl: "31536000", upsert: false }));
    return path;
  }

  async function removeImages(paths) {
    const list = paths.filter(Boolean);
    if (!list.length) return;
    const { error } = await sb.storage.from(BUCKET).remove(list);
    if (error) console.warn("No se pudieron borrar algunas fotos:", error.message);
  }

  /* =========================================================
     PRODUCTOS
     ========================================================= */
  function fillCategorySelects() {
    const opts = state.categories.map((c) => `<option value="${esc(c.slug)}">${esc(c.name)}</option>`).join("");
    const filter = $("#filterCategory");
    const prev = filter.value;
    filter.innerHTML = `<option value="all">Todas las categorías</option>${opts}`;
    filter.value = state.categories.some((c) => c.slug === prev) ? prev : "all";
    $("#productForm").category.innerHTML = opts;
  }

  function priceSummary(p) {
    if (p.price_cash != null && p.price_transfer != null) return `${money(p.price_cash)} efectivo · ${money(p.price_transfer)} transf.`;
    const v = p.price ?? p.price_cash ?? p.price_transfer;
    return v != null ? money(v) : "Sin precio";
  }

  function renderProducts() {
    const cat = $("#filterCategory").value;
    const q = $("#searchProducts").value.trim().toLowerCase();
    const list = state.products.filter((p) => (cat === "all" || p.category === cat) && (!q || p.name.toLowerCase().includes(q)));
    const root = $("#productsList");
    if (!list.length) {
      root.innerHTML = `<div class="empty">${state.products.length ? "No hay productos que coincidan." : "Todavía no hay productos. Tocá “+ Agregar producto”."}</div>`;
      return;
    }
    const groups = state.categories.map((c) => ({ c, items: list.filter((p) => p.category === c.slug) })).filter((g) => g.items.length);
    root.innerHTML = groups.map(({ c, items }) => `
      <h3 class="group-title">${esc(c.name)} <small>${items.length}</small></h3>
      ${items.map((p) => `
        <article class="row${p.active ? "" : " is-off"}" data-id="${esc(p.id)}">
          <div class="row__thumb">${p.image_path ? `<img src="${esc(publicUrl(p.image_path))}" alt="" loading="lazy" />` : esc(p.name.charAt(0).toUpperCase())}</div>
          <div class="row__main">
            <div class="row__title">${esc(p.name)}
              ${p.featured ? `<span class="pill pill--feat">Destacado</span>` : ""}
              ${p.active ? "" : `<span class="pill pill--off">Oculto</span>`}
            </div>
            <div class="row__meta">${esc(priceSummary(p))}${p.description ? " · " + esc(p.description.slice(0, 80)) + (p.description.length > 80 ? "…" : "") : ""}</div>
          </div>
          <div class="row__actions">
            <label class="switch" title="Visible en la web">
              <input type="checkbox" data-action="toggle" ${p.active ? "checked" : ""} aria-label="Visible en la web: ${esc(p.name)}" />
              <span class="switch__track"></span><span>${p.active ? "Visible" : "Oculto"}</span>
            </label>
            <button class="btn btn--light btn--sm" type="button" data-action="edit">Editar</button>
            <button class="btn btn--danger btn--sm" type="button" data-action="delete" aria-label="Eliminar ${esc(p.name)}">Eliminar</button>
          </div>
        </article>`).join("")}`).join("");
  }

  $("#filterCategory").addEventListener("change", renderProducts);
  $("#searchProducts").addEventListener("input", renderProducts);

  $("#productsList").addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || btn.dataset.action === "toggle") return;
    const p = state.products.find((x) => x.id === btn.closest(".row").dataset.id);
    if (!p) return;
    if (btn.dataset.action === "edit") openProduct(p);
    if (btn.dataset.action === "delete") deleteProduct(p);
  });

  $("#productsList").addEventListener("change", async (e) => {
    const input = e.target.closest('[data-action="toggle"]');
    if (!input) return;
    const p = state.products.find((x) => x.id === input.closest(".row").dataset.id);
    if (!p) return;
    input.disabled = true;
    try {
      const row = await guard(sb.from("products").update({ active: input.checked }).eq("id", p.id).select().single());
      Object.assign(p, row);
      toast(row.active ? `“${row.name}” ahora se ve en la web` : `“${row.name}” quedó oculto`);
    } catch (err) {
      input.checked = !input.checked;
      toast(friendlyError(err), "error");
    }
    renderProducts();
  });

  async function deleteProduct(p) {
    if (!confirm(`¿Eliminar “${p.name}”? Esta acción no se puede deshacer.\n\nSi solo querés sacarlo un tiempo, mejor ocultalo.`)) return;
    try {
      await guard(sb.from("products").delete().eq("id", p.id));
      await removeImages([p.image_path]);
      state.products = state.products.filter((x) => x.id !== p.id);
      renderProducts();
      toast(`“${p.name}” eliminado`);
    } catch (err) {
      toast(friendlyError(err), "error");
    }
  }

  // ----- Editor de producto -----
  const pDialog = $("#productDialog");
  const pForm = $("#productForm");
  let editingProduct = null;
  let pendingProductFile = null;
  let removeProductPhoto = false;

  function setPriceMode(mode) {
    $$('input[name="priceMode"]', pForm).forEach((r) => (r.checked = r.value === mode));
    $(".price-single", pForm).hidden = mode !== "single";
    $(".price-split", pForm).hidden = mode !== "split";
    $(".price-none", pForm).hidden = mode !== "none";
  }
  $$('input[name="priceMode"]', pForm).forEach((r) => r.addEventListener("change", () => setPriceMode(r.value)));

  function showProductPreview() {
    const box = $("#productPhotoPreview");
    if (pendingProductFile) {
      const src = URL.createObjectURL(pendingProductFile);
      box.innerHTML = `<img src="${src}" alt="Foto nueva" />`;
      box.querySelector("img").onload = () => URL.revokeObjectURL(src);
    } else if (editingProduct && editingProduct.image_path && !removeProductPhoto) {
      box.innerHTML = `<img src="${esc(publicUrl(editingProduct.image_path))}" alt="Foto actual" />`;
    } else {
      box.textContent = "Sin foto: se usa el dibujo";
    }
    $("#removeProductPhoto").hidden = !(pendingProductFile || (editingProduct && editingProduct.image_path && !removeProductPhoto));
  }

  function updateCounters(form) {
    $$("[data-counter]", form).forEach((c) => {
      const field = form[c.dataset.counter];
      c.textContent = `${field.value.length}/${field.maxLength}`;
    });
  }
  [pForm, $("#eventForm")].forEach((f) => f.addEventListener("input", () => updateCounters(f)));

  function openProduct(p = null) {
    editingProduct = p;
    pendingProductFile = null;
    removeProductPhoto = false;
    pForm.reset();
    $("#productError").hidden = true;
    $("#productDialogTitle").textContent = p ? "Editar producto" : "Nuevo producto";
    const filterCat = $("#filterCategory").value;
    pForm.name.value = p?.name || "";
    pForm.category.value = p?.category || (filterCat !== "all" ? filterCat : state.categories[0]?.slug || "");
    pForm.badge.value = p?.badge || "";
    pForm.description.value = p?.description || "";
    pForm.price.value = p?.price ?? "";
    pForm.price_cash.value = p?.price_cash ?? "";
    pForm.price_transfer.value = p?.price_transfer ?? "";
    const maxOrder = Math.max(0, ...state.products.filter((x) => x.category === pForm.category.value).map((x) => x.sort_order || 0));
    pForm.sort_order.value = p ? p.sort_order ?? 0 : maxOrder + 10;
    pForm.active.checked = p ? !!p.active : true;
    pForm.featured.checked = !!p?.featured;
    setPriceMode(p ? (p.price_cash != null && p.price_transfer != null ? "split" : (p.price ?? p.price_cash ?? p.price_transfer) != null ? "single" : "none") : "single");
    showProductPreview();
    updateCounters(pForm);
    pDialog.showModal();
    pForm.name.focus();
  }
  $("#addProduct").addEventListener("click", () => openProduct());

  pForm.photo.addEventListener("change", () => {
    const f = pForm.photo.files[0];
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) { toast("Formato no permitido. Usá JPG, PNG o WEBP.", "error"); pForm.photo.value = ""; return; }
    pendingProductFile = f;
    removeProductPhoto = false;
    showProductPreview();
  });
  $("#removeProductPhoto").addEventListener("click", () => {
    pendingProductFile = null;
    pForm.photo.value = "";
    removeProductPhoto = true;
    showProductPreview();
  });

  const intOrNull = (v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 ? n : NaN;
  };

  // Ajusta el dibujo cuando el producto cambia de categoría
  function artForCategory(art, category) {
    const a = { ...(art || {}) };
    const want = { tostadas: ["toast"], bebidas: ["bottle", "cup"], cervezas: ["can"] }[category];
    if (want) { if (!want.includes(a.kind)) a.kind = want[0]; }
    else delete a.kind;
    return a;
  }

  pForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = $("#productError");
    errEl.hidden = true;
    const fail = (msg) => { errEl.textContent = msg; errEl.hidden = false; };

    const name = pForm.name.value.trim();
    if (!name) return fail("El nombre es obligatorio.");
    const mode = $('input[name="priceMode"]:checked', pForm).value;
    const payload = {
      name,
      category: pForm.category.value,
      badge: pForm.badge.value.trim() || null,
      description: pForm.description.value.trim() || null,
      price: null, price_cash: null, price_transfer: null,
      sort_order: Number.parseInt(pForm.sort_order.value, 10) || 0,
      active: pForm.active.checked,
      featured: pForm.featured.checked,
      art: artForCategory(editingProduct?.art, pForm.category.value),
    };
    if (mode === "single") {
      payload.price = intOrNull(pForm.price.value);
      if (payload.price == null) return fail("Ingresá el precio, o elegí “Sin precio”.");
    } else if (mode === "split") {
      payload.price_cash = intOrNull(pForm.price_cash.value);
      payload.price_transfer = intOrNull(pForm.price_transfer.value);
      if (payload.price_cash == null || payload.price_transfer == null) return fail("Ingresá los dos precios (efectivo y transferencia).");
    }
    if ([payload.price, payload.price_cash, payload.price_transfer].some((v) => Number.isNaN(v))) return fail("Los precios tienen que ser números enteros, sin puntos ni comas.");

    const saveBtn = $("#productSave");
    saveBtn.disabled = true; saveBtn.textContent = "Guardando…";
    const oldPath = editingProduct?.image_path || null;
    let newPath = null;
    try {
      if (pendingProductFile) {
        saveBtn.textContent = "Subiendo foto…";
        newPath = await uploadImage("products", pendingProductFile);
        payload.image_path = newPath;
      } else if (removeProductPhoto) {
        payload.image_path = null;
      }
      const query = editingProduct
        ? sb.from("products").update(payload).eq("id", editingProduct.id)
        : sb.from("products").insert(payload);
      const row = await guard(query.select().single());
      if (oldPath && (newPath || removeProductPhoto)) await removeImages([oldPath]);
      if (editingProduct) Object.assign(editingProduct, row);
      else state.products.push(row);
      state.products.sort((a, b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name));
      renderProducts();
      pDialog.close();
      toast(`“${row.name}” guardado`);
    } catch (err) {
      if (newPath) await removeImages([newPath]);
      fail(err instanceof Error && !err.code && !err.status ? err.message : friendlyError(err));
    } finally {
      saveBtn.disabled = false; saveBtn.textContent = "Guardar";
    }
  });

  /* =========================================================
     EVENTOS
     ========================================================= */
  const fmtDate = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? `${+m[3]}/${+m[2]}/${m[1]}` : "Sin fecha";
  };

  function renderEvents() {
    const root = $("#eventsList");
    if (!state.events.length) {
      root.innerHTML = `<div class="empty">Todavía no hay eventos. Tocá “+ Nuevo evento”.</div>`;
      return;
    }
    root.innerHTML = state.events.map((ev) => {
      const photos = ev.event_photos || [];
      const cover = photos[0];
      return `
        <article class="row${ev.active ? "" : " is-off"}" data-id="${esc(ev.id)}">
          <div class="row__thumb">${cover ? `<img src="${esc(publicUrl(cover.image_path))}" alt="" loading="lazy" />` : "★"}</div>
          <div class="row__main">
            <div class="row__title">${esc(ev.title)} ${ev.active ? "" : `<span class="pill pill--off">Oculto</span>`}</div>
            <div class="row__meta">${esc(fmtDate(ev.event_date))} · ${photos.length} foto${photos.length === 1 ? "" : "s"}</div>
          </div>
          <div class="row__actions">
            <label class="switch" title="Visible en la web">
              <input type="checkbox" data-action="toggle" ${ev.active ? "checked" : ""} aria-label="Visible en la web: ${esc(ev.title)}" />
              <span class="switch__track"></span><span>${ev.active ? "Visible" : "Oculto"}</span>
            </label>
            <button class="btn btn--light btn--sm" type="button" data-action="edit">Editar</button>
            <button class="btn btn--danger btn--sm" type="button" data-action="delete" aria-label="Eliminar ${esc(ev.title)}">Eliminar</button>
          </div>
        </article>`;
    }).join("");
  }

  $("#eventsList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || btn.dataset.action === "toggle") return;
    const ev = state.events.find((x) => x.id === btn.closest(".row").dataset.id);
    if (!ev) return;
    if (btn.dataset.action === "edit") openEvent(ev);
    if (btn.dataset.action === "delete") deleteEvent(ev);
  });

  $("#eventsList").addEventListener("change", async (e) => {
    const input = e.target.closest('[data-action="toggle"]');
    if (!input) return;
    const ev = state.events.find((x) => x.id === input.closest(".row").dataset.id);
    if (!ev) return;
    input.disabled = true;
    try {
      const row = await guard(sb.from("events").update({ active: input.checked }).eq("id", ev.id).select().single());
      ev.active = row.active;
      toast(row.active ? "Evento visible en la web" : "Evento oculto");
    } catch (err) {
      input.checked = !input.checked;
      toast(friendlyError(err), "error");
    }
    renderEvents();
  });

  async function deleteEvent(ev) {
    const n = (ev.event_photos || []).length;
    if (!confirm(`¿Eliminar el evento “${ev.title}”${n ? ` y sus ${n} foto${n === 1 ? "" : "s"}` : ""}? No se puede deshacer.`)) return;
    try {
      await guard(sb.from("events").delete().eq("id", ev.id));
      await removeImages((ev.event_photos || []).map((p) => p.image_path));
      state.events = state.events.filter((x) => x.id !== ev.id);
      renderEvents();
      toast("Evento eliminado");
    } catch (err) {
      toast(friendlyError(err), "error");
    }
  }

  // ----- Editor de evento -----
  const eDialog = $("#eventDialog");
  const eForm = $("#eventForm");
  let editingEvent = null;

  function openEvent(ev = null) {
    editingEvent = ev;
    eForm.reset();
    $("#eventError").hidden = true;
    $("#uploadStatus").hidden = true;
    eForm.title.value = ev?.title || "";
    eForm.event_date.value = ev?.event_date || "";
    eForm.description.value = ev?.description || "";
    eForm.sort_order.value = ev?.sort_order ?? 0;
    eForm.active.checked = ev ? !!ev.active : true;
    updateCounters(eForm);
    renderEventPhotos();
    eDialog.showModal();
    eForm.title.focus();
  }
  $("#addEvent").addEventListener("click", () => openEvent());

  function renderEventPhotos() {
    const ev = editingEvent;
    $("#eventDialogTitle").textContent = ev ? "Editar evento" : "Nuevo evento";
    $("#eventPhotosBtn").hidden = !ev;
    $("#eventPhotosHint").textContent = ev
      ? "Podés subir varias fotos a la vez y escribir una descripción para cada una (se guarda al salir del cuadro de texto)."
      : "Primero guardá el evento; después vas a poder subir las fotos.";
    const grid = $("#eventPhotosGrid");
    const photos = ev ? ev.event_photos || [] : [];
    grid.innerHTML = photos.map((p, i) => `
      <div class="photo" data-id="${esc(p.id)}">
        <img src="${esc(publicUrl(p.image_path))}" alt="" loading="lazy" />
        <label class="sr-only" for="cap-${esc(p.id)}">Descripción de la foto ${i + 1}</label>
        <textarea id="cap-${esc(p.id)}" maxlength="500" placeholder="Descripción de la foto (opcional)">${esc(p.caption || "")}</textarea>
        <div class="photo__actions">
          <span>
            <button type="button" class="btn btn--light btn--sm" data-move="-1" ${i === 0 ? "disabled" : ""} aria-label="Mover antes">←</button>
            <button type="button" class="btn btn--light btn--sm" data-move="1" ${i === photos.length - 1 ? "disabled" : ""} aria-label="Mover después">→</button>
          </span>
          <button type="button" class="btn btn--danger btn--sm" data-remove>Eliminar</button>
        </div>
      </div>`).join("");
  }

  eForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = $("#eventError");
    errEl.hidden = true;
    const title = eForm.title.value.trim();
    if (!title) { errEl.textContent = "El título es obligatorio."; errEl.hidden = false; return; }
    const payload = {
      title,
      event_date: eForm.event_date.value || null,
      description: eForm.description.value.trim() || null,
      sort_order: Number.parseInt(eForm.sort_order.value, 10) || 0,
      active: eForm.active.checked,
    };
    const btn = $("#eventSave");
    btn.disabled = true; btn.textContent = "Guardando…";
    try {
      const query = editingEvent
        ? sb.from("events").update(payload).eq("id", editingEvent.id)
        : sb.from("events").insert(payload);
      const row = await guard(query.select().single());
      if (editingEvent) Object.assign(editingEvent, row);
      else { row.event_photos = []; state.events.unshift(row); editingEvent = row; }
      renderEvents();
      renderEventPhotos();
      toast("Evento guardado");
    } catch (err) {
      errEl.textContent = friendlyError(err); errEl.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = "Guardar evento";
    }
  });

  $("#eventPhotosInput").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    const ev = editingEvent;
    if (!ev || !files.length) return;
    const status = $("#uploadStatus");
    status.hidden = false;
    let order = Math.max(0, ...(ev.event_photos || []).map((p) => p.sort_order || 0));
    let ok = 0;
    for (const [i, file] of files.entries()) {
      status.textContent = `Subiendo foto ${i + 1} de ${files.length}…`;
      let path = null;
      try {
        path = await uploadImage(`events/${ev.id}`, file);
        order += 10;
        const row = await guard(sb.from("event_photos").insert({ event_id: ev.id, image_path: path, sort_order: order }).select().single());
        ev.event_photos = [...(ev.event_photos || []), row];
        ok++;
        renderEventPhotos();
      } catch (err) {
        if (path) await removeImages([path]);
        toast(err instanceof Error && !err.code && !err.status ? err.message : friendlyError(err), "error");
      }
    }
    status.hidden = true;
    renderEvents();
    if (ok) toast(`${ok} foto${ok === 1 ? "" : "s"} subida${ok === 1 ? "" : "s"}`);
  });

  const photoGrid = $("#eventPhotosGrid");
  photoGrid.addEventListener("change", async (e) => {
    const ta = e.target.closest("textarea");
    if (!ta || !editingEvent) return;
    const id = ta.closest(".photo").dataset.id;
    const photo = editingEvent.event_photos.find((p) => p.id === id);
    const caption = ta.value.trim() || null;
    try {
      await guard(sb.from("event_photos").update({ caption }).eq("id", id));
      photo.caption = caption;
      toast("Descripción guardada");
    } catch (err) {
      toast(friendlyError(err), "error");
    }
  });

  photoGrid.addEventListener("click", async (e) => {
    const card = e.target.closest(".photo");
    if (!card || !editingEvent) return;
    const photos = editingEvent.event_photos;
    const idx = photos.findIndex((p) => p.id === card.dataset.id);
    if (idx < 0) return;

    if (e.target.closest("[data-remove]")) {
      if (!confirm("¿Eliminar esta foto?")) return;
      try {
        await guard(sb.from("event_photos").delete().eq("id", photos[idx].id));
        await removeImages([photos[idx].image_path]);
        photos.splice(idx, 1);
        renderEventPhotos();
        renderEvents();
        toast("Foto eliminada");
      } catch (err) {
        toast(friendlyError(err), "error");
      }
      return;
    }

    const move = e.target.closest("[data-move]");
    if (move) {
      const j = idx + Number(move.dataset.move);
      if (j < 0 || j >= photos.length) return;
      const reordered = photos.slice();
      [reordered[idx], reordered[j]] = [reordered[j], reordered[idx]];
      try {
        // se renumeran todas para que el orden quede prolijo
        await Promise.all(reordered.map((p, n) => guard(sb.from("event_photos").update({ sort_order: (n + 1) * 10 }).eq("id", p.id))));
        reordered.forEach((p, n) => (p.sort_order = (n + 1) * 10));
        editingEvent.event_photos = reordered;
        renderEventPhotos();
        renderEvents();
      } catch (err) {
        toast(friendlyError(err), "error");
      }
    }
  });

  /* ---------- Cerrar modales ---------- */
  $$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

  /* ---------- Arranque ---------- */
  sb.auth.getSession().then(({ data }) => handleSession(data.session));
})();
