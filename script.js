/* =========================================================
   El Mejor Pancho de San Fernando — interacciones
   ========================================================= */
(() => {
  "use strict";

  /* -------------------------------------------------------
     MENÚ — editá acá nombres, descripciones y precios.
     price: precio único · priceCash / priceTransfer: efectivo y transferencia
     sin precio → se muestra "Consultar" (o priceLabel si lo tiene)
     Panchos: sauces (colores) y toppings: morron | parmesano
     Tostadas: kind "toast" · Bebidas: kind (bottle | can | cup) y los colores del dibujo
     ------------------------------------------------------- */
  const S = {
    mayo: "#FFF6DA", mostaza: "#F5B72E", ketchup: "#E23B2E", golf: "#F29A76", parmesano: "#F3E6B5",
    cheddar: "#F39C1F", picante: "#C2171B", miel: "#E0A526", chili: "#E8552E",
  };

  const MENU = [
    {
      id: "panchos", label: "Panchos",
      items: [
        { name: "Pancho", badge: "El de siempre", desc: "Salchicha alemana sazonada en la panchera con morrón, en pan artesanal. Tiras de morrón sin cargo.", priceCash: 3500, priceTransfer: 4000, sauces: [S.mostaza, S.ketchup], toppings: ["morron"] },
      ],
    },
    {
      id: "tostadas", label: "Tostadas",
      items: [
        { name: "Tostada de Jamón y Queso", desc: "Con jamón y queso de primera calidad, en pan de parmesano.", price: 4500, kind: "toast" },
      ],
    },
    {
      id: "salsas", label: "Salsas",
      items: [
        { name: "Mayonesa", desc: "Natura", sauces: [S.mayo] },
        { name: "Mostaza", desc: "Savora", sauces: [S.mostaza] },
        { name: "Ketchup", desc: "Hellmann's", sauces: [S.ketchup] },
        { name: "Salsa Golf", desc: "Hellmann's", sauces: [S.golf] },
        { name: "Parmesano", desc: "Queso parmesano rallado.", sauces: [S.parmesano], toppings: ["parmesano"] },
        { name: "Cheddar", desc: "Cheddar fundido.", sauces: [S.cheddar] },
        { name: "Salsa Picante", desc: "Para los que se la bancan.", sauces: [S.picante] },
        { name: "Mostaza con Miel", desc: "Pampa Gourmet", sauces: [S.miel] },
        { name: "Sweet Chili", desc: "Salsa agridulce en base a morrón, con un toquecito de picante. Pampa Gourmet.", sauces: [S.chili] },
      ],
    },
    {
      id: "bebidas", label: "Bebidas",
      items: [
        { name: "Coca", price: 6000, kind: "bottle", liquid: "#3B1A12", label: "#E23B2E", cap: "#E23B2E" },
        { name: "Coca Zero", desc: "1 litro de vidrio.", price: 6000, kind: "bottle", liquid: "#3B1A12", label: "#121110", cap: "#121110" },
        { name: "Fanta", price: 6000, kind: "bottle", liquid: "#F7931E", label: "#1F5FBF", cap: "#F7931E" },
        { name: "Sprite", price: 6000, kind: "bottle", liquid: "#D9F2D0", label: "#2E9A4A", cap: "#2E9A4A" },
        { name: "Línea Coca 1,75 L", price: 6000, kind: "bottle", liquid: "#3B1A12", label: "#E23B2E", cap: "#E23B2E" },
        { name: "Coquita de vidrio", desc: "237 cm³.", price: 2000, kind: "bottle", small: true, liquid: "#3B1A12", label: "#E23B2E", cap: "#E23B2E" },
        { name: "Pritty", price: 5000, kind: "bottle", liquid: "#E6F0A8", label: "#2E9A4A", cap: "#F5B72E" },
        { name: "Cunnington Tónica", kind: "bottle", liquid: "#EAF4E4", label: "#F5B72E", cap: "#F5B72E" },
        { name: "Agua", desc: "500 cm³.", price: 2500, kind: "bottle", small: true, liquid: "#CFE8F7", label: "#1F5FBF", cap: "#1F5FBF" },
        { name: "Agua con Gas", desc: "500 cm³.", price: 2500, kind: "bottle", small: true, bubbles: true, liquid: "#CFE8F7", label: "#2E9A4A", cap: "#2E9A4A" },
        { name: "Agua Saborizada", desc: "500 cm³.", price: 2500, kind: "bottle", small: true, liquid: "#F8C9D4", label: "#C2171B", cap: "#F29A76" },
        { name: "Café / Cortado", price: 2000, kind: "cup" },
      ],
    },
    {
      id: "cervezas", label: "Cervezas",
      items: [
        { name: "Imperial Lager", desc: "Lata 473 cm³.", kind: "can", label: "#D9A72B", band: "#121110" },
        { name: "Imperial IPA", desc: "Lata 473 cm³.", kind: "can", label: "#E58E1A", band: "#121110" },
        { name: "Schneider", desc: "Lata 473 cm³.", kind: "can", label: "#C8102E", band: "#F5B72E" },
        { name: "Quilmes", desc: "Lata 473 cm³.", kind: "can", label: "#6FB7E9", band: "#FFFFFF" },
        { name: "Heineken", desc: "Lata 473 cm³.", kind: "can", label: "#0B7A3E", band: "#C8102E" },
        { name: "Cerveza Artesanal", desc: "Lata 473 cm³.", kind: "can", label: "#7A4A22", band: "#F5B72E" },
      ],
    },
  ];

  // Tarjetas grandes de "Los de la casa"
  const FEATURED = [
    { ...MENU[0].items[0], art: "#F5B72E" },
    { ...MENU[1].items[0], art: "#F2B5A8" },
    { name: "Armalo a tu gusto", badge: "9 salsas", desc: "De la Savora de toda la vida a la Sweet Chili de Pampa Gourmet. Elegí las que quieras.", priceLabel: "9 salsas", art: "#7FA36D", sauces: [S.mostaza, S.ketchup, S.golf], toppings: ["morron"] },
    { ...MENU[3].items[5], name: "Con una Coquita", desc: "La coquita de vidrio de 237 cm³, la compañera ideal del pancho.", art: "#B9A3F0" },
  ];

  const SAUCES = [
    ["Mayonesa", "Natura", S.mayo], ["Mostaza", "Savora", S.mostaza], ["Ketchup", "Hellmann's", S.ketchup],
    ["Salsa Golf", "Hellmann's", S.golf], ["Parmesano", "", S.parmesano], ["Cheddar", "", S.cheddar],
    ["Salsa Picante", "", S.picante], ["Mostaza con Miel", "Pampa Gourmet", S.miel], ["Sweet Chili", "Pampa Gourmet", S.chili],
  ];

  const money = (n) => "$" + n.toLocaleString("es-AR");
  const isSauce = (item) => !item.kind && !item.priceCash && !item.price && !item.priceLabel;

  function priceHTML(item) {
    if (item.priceCash) {
      return `<span class="price-row">${money(item.priceCash)}<small>efectivo</small></span>` +
        `<span class="price-row price-row--alt">${money(item.priceTransfer)}<small>transferencia</small></span>`;
    }
    if (item.price) return money(item.price);
    if (item.priceLabel) return `<span class="price-na">${item.priceLabel}</span>`;
    return isSauce(item) ? "" : `<span class="price-na">Consultar</span>`;
  }
  function priceText(item) {
    if (item.priceCash) return `${money(item.priceCash)} en efectivo`;
    if (item.price) return money(item.price);
    return isSauce(item) ? "para tu pancho" : "consultar precio";
  }

  /* -------------------------------------------------------
     Ilustraciones SVG generadas según los datos
     ------------------------------------------------------- */
  const INK = "#121110";

  function dogSVG(item = {}) {
    const sauces = item.sauces && item.sauces.length ? item.sauces : [S.ketchup];
    const t = item.toppings || [];
    const parm = item.bun === "parmesano";
    const bunBack = parm ? "#E9BE73" : "#E8A34D";
    const bunFront = parm ? "#F3CF8A" : "#F0B25E";
    let out = "";

    // pan (atrás)
    out += `<path d="M18 86 C18 60 50 52 160 52 C270 52 302 60 302 86 L302 92 C302 108 280 112 160 112 C40 112 18 108 18 92 Z" fill="${bunBack}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;

    // salchicha alemana
    out += `<rect x="4" y="48" width="312" height="34" rx="17" fill="#B9533A" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M30 58 H150" stroke="#E98266" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;

    // salsas en zigzag
    sauces.forEach((c, i) => {
      const y = 58 + i * 6 - (sauces.length - 1) * 3;
      let d = `M${28 + i * 8} ${y}`;
      for (let x = 28 + i * 8, k = 0; x < 286; x += 16, k++) d += ` L${x + 16} ${y + (k % 2 ? -8 : 8)}`;
      out += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
      out += `<path d="${d}" fill="none" stroke="${c}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    });

    // tiras de morrón (arriba de las salsas)
    if (t.includes("morron")) {
      out += [[30, 44, 56], [104, 40, 50], [168, 46, 56], [236, 40, 52]].map(([x, y, w]) =>
        `<path d="M${x} ${y} q${w / 2} -12 ${w} 0" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M${x} ${y} q${w / 2} -12 ${w} 0" fill="none" stroke="#E0342A" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M${x + w * 0.25} ${y - 5} q${w / 4} -5 ${w / 2} 0" fill="none" stroke="#FF8A7A" stroke-width="2.5" stroke-linecap="round"/>`
      ).join("");
    }

    if (t.includes("parmesano")) {
      out += [[46, 44], [72, 52], [100, 42], [128, 50], [156, 44], [184, 52], [212, 42], [240, 50], [268, 44]].map(([x, y]) =>
        `<rect x="${x}" y="${y}" width="7" height="7" rx="2" fill="#FFF6DA" stroke="${INK}" stroke-width="2" transform="rotate(${x % 40} ${x + 3} ${y + 3})"/>`).join("");
    }

    // pan (adelante)
    out += `<path d="M10 92 C10 82 30 80 60 84 C100 90 220 90 260 84 C290 80 310 82 310 92 C310 128 270 146 160 146 C50 146 10 128 10 92 Z" fill="${bunFront}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    out += `<path d="M44 112 C80 126 120 130 160 130" fill="none" stroke="#FFD594" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
    if (parm) {
      out += [[70, 104], [110, 118], [150, 108], [190, 120], [230, 106], [260, 118], [90, 128], [210, 132]].map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="3.2" fill="#FFF6DA" stroke="${INK}" stroke-width="1.5"/>`).join("");
    }

    return `<svg viewBox="0 0 320 156" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.name || "Pancho"}">${out}</svg>`;
  }

  function drinkSVG(item) {
    let out = "";
    if (item.kind === "can") {
      out += `<path d="M48 34 Q48 22 60 20 H100 Q112 22 112 34 V206 Q112 218 100 220 H60 Q48 218 48 206 Z" fill="${item.label}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
      out += `<rect x="48" y="96" width="64" height="44" fill="${item.band}" stroke="${INK}" stroke-width="4"/>`;
      out += `<path d="M54 20 H106" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><ellipse cx="80" cy="16" rx="22" ry="5" fill="#D8D8D8" stroke="${INK}" stroke-width="4"/>`;
      out += `<path d="M62 40 V84 M62 152 V196" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity=".45"/>`;
      out += `<circle cx="80" cy="118" r="11" fill="${item.label}" stroke="${INK}" stroke-width="3"/>`;
    } else if (item.kind === "cup") {
      out += `<path d="M58 80 q-8 -16 4 -30 q10 -12 2 -26 M84 80 q-8 -16 4 -30 q10 -12 2 -26" fill="none" stroke="#F6EFE2" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
      out += `<ellipse cx="80" cy="196" rx="66" ry="14" fill="#F6EFE2" stroke="${INK}" stroke-width="5"/>`;
      out += `<path d="M120 116 h10 a22 22 0 0 1 0 44 h-14" fill="none" stroke="${INK}" stroke-width="10"/><path d="M120 116 h10 a22 22 0 0 1 0 44 h-14" fill="none" stroke="#F6EFE2" stroke-width="4"/>`;
      out += `<path d="M30 96 H130 V150 Q130 190 80 190 Q30 190 30 150 Z" fill="#F6EFE2" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
      out += `<ellipse cx="80" cy="98" rx="48" ry="9" fill="#7A4A22" stroke="${INK}" stroke-width="4"/><ellipse cx="74" cy="97" rx="18" ry="3.5" fill="#C9935F"/>`;
      out += `<path d="M44 120 V150" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
    } else {
      const sm = item.small;
      const top = sm ? 46 : 14, neck = sm ? 30 : 40;
      const body = `M66 ${top} H94 V${top + neck} C94 ${top + neck + 16} 118 ${top + neck + 22} 118 ${top + neck + 54} V214 Q118 226 106 226 H54 Q42 226 42 214 V${top + neck + 54} C42 ${top + neck + 22} 66 ${top + neck + 16} 66 ${top + neck} Z`;
      out += `<path d="${body}" fill="${item.liquid}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
      out += `<rect x="63" y="${top - 12}" width="34" height="16" rx="4" fill="${item.cap}" stroke="${INK}" stroke-width="4"/>`;
      out += `<rect x="42" y="${sm ? 150 : 140}" width="76" height="${sm ? 40 : 46}" fill="${item.label}" stroke="${INK}" stroke-width="4"/>`;
      out += `<path d="M52 ${sm ? 170 : 163} q14 -10 28 0 t28 0" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
      out += `<path d="M54 ${top + neck + 60} V${sm ? 140 : 130}" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
      if (item.bubbles) out += [[80, 120], [96, 104], [70, 96], [90, 205], [64, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>`).join("");
    }
    return `<svg class="is-tall" viewBox="0 0 160 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.name}">${out}</svg>`;
  }

  function toastSVG(item) {
    // tostado de jamón y queso en pan de parmesano: dos mitades vistas de costado
    const half = (x, y, w) => {
      let g = "";
      g += `<rect x="${x}" y="${y + 50}" width="${w}" height="26" rx="10" fill="#E9B464" stroke="${INK}" stroke-width="5"/>`;
      g += `<path d="M${x + 4} ${y + 42} H${x + w - 4} V${y + 54} H${x + 4} Z" fill="#F4A7A0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      g += `<path d="M${x + 2} ${y + 34} H${x + w - 2} V${y + 44} C${x + w - 14} ${y + 44} ${x + w - 16} ${y + 58} ${x + w - 26} ${y + 58} C${x + w - 36} ${y + 58} ${x + w - 36} ${y + 44} ${x + w * 0.55} ${y + 44} C${x + w * 0.45} ${y + 44} ${x + w * 0.42} ${y + 62} ${x + w * 0.32} ${y + 62} C${x + w * 0.22} ${y + 62} ${x + w * 0.24} ${y + 44} ${x + 2} ${y + 44} Z" fill="#FFD45E" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      g += `<rect x="${x}" y="${y}" width="${w}" height="38" rx="12" fill="#EDBE6E" stroke="${INK}" stroke-width="5"/>`;
      for (let gx = x + 18; gx < x + w - 14; gx += 26) g += `<path d="M${gx} ${y + 30} L${gx + 14} ${y + 8}" stroke="#8A4B1E" stroke-width="5" stroke-linecap="round" opacity=".75"/>`;
      g += [0.2, 0.45, 0.7, 0.88].map((k, i) => `<circle cx="${x + w * k}" cy="${y + (i % 2 ? 12 : 26)}" r="3" fill="#FFF6DA" stroke="${INK}" stroke-width="1.5"/>`).join("");
      return g;
    };
    const out = half(22, 20, 170) + half(128, 62, 172);
    return `<svg viewBox="0 0 320 156" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.name}">${out}</svg>`;
  }

  const isTall = (item) => !!item.kind && item.kind !== "toast";
  const artSVG = (item) => (item.kind === "toast" ? toastSVG(item) : item.kind ? drinkSVG(item) : dogSVG(item));

  /* -------------------------------------------------------
     Render: los de la casa, menú, salsas
     ------------------------------------------------------- */
  const track = document.getElementById("specialsTrack");
  track.innerHTML = FEATURED.map((item, i) => `
    <article class="special">
      <div class="special__art" style="--art-bg:${item.art}">
        ${item.badge ? `<span class="special__tag">${item.badge}</span>` : ""}
        ${artSVG(item)}
      </div>
      <div class="special__body">
        <h3 class="special__name">${item.name}</h3>
        <p class="special__desc">${item.desc}</p>
        <div class="special__foot">
          <span class="special__price">${priceHTML(item)}</span>
          <span class="special__num">${String(i + 1).padStart(2, "0")} / ${String(FEATURED.length).padStart(2, "0")}</span>
        </div>
      </div>
    </article>`).join("");

  const tabs = document.getElementById("menuTabs");
  const list = document.getElementById("menuList");
  const previewDog = document.getElementById("previewDog");
  const previewName = document.getElementById("previewName");

  tabs.innerHTML = MENU.map((c, i) =>
    `<button class="menu__tab" role="tab" id="tab-${c.id}" aria-selected="${i === 0}" aria-controls="menuList" data-cat="${c.id}">${c.label}</button>`
  ).join("");

  function setPreview(item) {
    previewDog.innerHTML = artSVG(item);
    previewDog.classList.toggle("is-tall", isTall(item));
    previewDog.classList.remove("is-swap");
    void previewDog.offsetWidth;
    previewDog.classList.add("is-swap");
    previewName.textContent = `${item.name} · ${priceText(item)}`;
  }

  function renderCategory(id) {
    const cat = MENU.find((c) => c.id === id);
    list.setAttribute("aria-labelledby", `tab-${id}`);
    list.innerHTML = cat.items.map((item, i) => `
      <article class="menu-item is-enter" style="animation-delay:${i * 50}ms" data-i="${i}" data-cursor="Mmm" tabindex="0">
        <span class="menu-item__num">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="menu-item__name">${item.name}${item.badge ? `<span class="menu-item__badge">${item.badge}</span>` : ""}</h3>
        <span class="menu-item__price">${priceHTML(item)}</span>
        ${item.desc ? `<p class="menu-item__desc">${item.desc}</p>` : ""}
      </article>`).join("");
    list.querySelectorAll(".menu-item").forEach((el) => {
      const item = cat.items[+el.dataset.i];
      el.addEventListener("mouseenter", () => setPreview(item));
      el.addEventListener("focus", () => setPreview(item));
    });
    setPreview(cat.items[0]);
    bindCursorTargets(list);
  }

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".menu__tab");
    if (!btn) return;
    tabs.querySelectorAll(".menu__tab").forEach((b) => b.setAttribute("aria-selected", b === btn));
    renderCategory(btn.dataset.cat);
  });
  tabs.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const all = [...tabs.querySelectorAll(".menu__tab")];
    const idx = all.indexOf(document.activeElement);
    if (idx < 0) return;
    const next = all[(idx + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length];
    next.focus(); next.click();
  });

  document.getElementById("sauceChips").innerHTML = SAUCES.map(([n, b, c]) =>
    `<span class="chip" style="--c:${c}"><i></i>${n}${b ? `<small>${b}</small>` : ""}</span>`).join("");

  const yearsEl = document.getElementById("years");
  if (yearsEl) yearsEl.textContent = new Date().getFullYear() - 2004;

  /* -------------------------------------------------------
     Horarios: estado en vivo (hora Argentina)
     Lunes a sábado de 11 a 22 hs
     ------------------------------------------------------- */
  const OPEN_MIN = 11 * 60, CLOSE_MIN = 22 * 60;
  const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const tzFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function arNow() {
    const p = Object.fromEntries(tzFmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { day: WD[p.weekday], h: +p.hour, m: +p.minute, s: +p.second };
  }
  const isOpenDay = (d) => d >= 1 && d <= 6;
  const fmtDur = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
  };

  function getStatus() {
    const n = arNow();
    const mins = n.h * 60 + n.m;
    if (isOpenDay(n.day) && mins >= OPEN_MIN && mins < CLOSE_MIN) {
      return { open: true, n, label: "Abierto ahora", detail: `Cerramos a las 22 hs · faltan ${fmtDur(CLOSE_MIN - mins)}`, progress: (mins - OPEN_MIN) / (CLOSE_MIN - OPEN_MIN) };
    }
    let wait, when;
    if (isOpenDay(n.day) && mins < OPEN_MIN) {
      wait = OPEN_MIN - mins; when = "hoy a las 11 hs";
    } else {
      let d = (n.day + 1) % 7, add = 1;
      while (!isOpenDay(d)) { d = (d + 1) % 7; add++; }
      wait = (24 * 60 - mins) + (add - 1) * 24 * 60 + OPEN_MIN;
      when = add === 1 ? "mañana a las 11 hs" : `el ${DAYS[d]} a las 11 hs`;
    }
    return { open: false, n, label: "Cerrado", detail: `Abrimos ${when} · en ${fmtDur(wait)}`, progress: isOpenDay(n.day) && mins >= CLOSE_MIN ? 1 : 0 };
  }

  const clock = document.getElementById("clock");
  const countdown = document.getElementById("countdown");
  const dayBar = document.getElementById("dayBar");

  function tickHours() {
    const st = getStatus();
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.classList.toggle("is-open", st.open);
      el.classList.toggle("is-closed", !st.open);
      el.querySelector("[data-status-text]").textContent = st.open ? "Abierto ahora" : "Cerrado ahora";
    });
    clock.textContent = `${String(st.n.h).padStart(2, "0")}:${String(st.n.m).padStart(2, "0")}`;
    countdown.textContent = st.detail;
    dayBar.style.setProperty("--p", `${Math.round(st.progress * 100)}%`);
    document.querySelectorAll("#hoursList li").forEach((li) => li.classList.toggle("is-today", +li.dataset.day === st.n.day));
  }
  tickHours();
  setInterval(tickHours, 15000);

  document.getElementById("year").textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     Navegación
     ------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileMenu.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* -------------------------------------------------------
     Cursor + magnetismo + tilt (sólo punteros finos)
     ------------------------------------------------------- */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cursor = document.querySelector(".cursor");
  const cLabel = cursor.querySelector(".cursor__label");

  function bindCursorTargets(root = document) {
    if (!fine) return;
    root.querySelectorAll("[data-cursor]").forEach((el) => {
      if (el._cur) return;
      el._cur = true;
      el.addEventListener("mouseenter", () => { cursor.classList.add("is-hover"); cLabel.textContent = el.dataset.cursor; });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  if (fine && !reduce) {
    document.documentElement.classList.add("has-cursor");
    const dot = cursor.querySelector(".cursor__dot"), ring = cursor.querySelector(".cursor__ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    bindCursorTargets();

    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .1s";
        el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(0)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)"; el.style.transform = ""; });
    });

    // parallax con el mouse en el hero
    const hero = document.getElementById("hero");
    const pEls = hero.querySelectorAll("[data-parallax]");
    hero.addEventListener("mousemove", (e) => {
      const cx = e.clientX - innerWidth / 2, cy = e.clientY - innerHeight / 2;
      pEls.forEach((el) => { const k = +el.dataset.parallax; el.style.translate = `${cx * k}px ${cy * k}px`; });
    });
  }

  /* -------------------------------------------------------
     Starburst del hero (como el del logo)
     ------------------------------------------------------- */
  (function buildBurst() {
    const poly = document.getElementById("burstShape");
    const pts = [], spikes = 22;
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2;
      const r = i % 2 ? 128 : 160 + (i % 4 === 0 ? 30 : 8);
      pts.push(`${(200 + Math.cos(a) * r).toFixed(1)},${(200 + Math.sin(a) * r).toFixed(1)}`);
    }
    poly.setAttribute("points", pts.join(" "));
  })();

  renderCategory(MENU[0].id);

  /* -------------------------------------------------------
     Animaciones (GSAP + ScrollTrigger + Lenis)
     Si las librerías no cargan, la página queda 100% usable.
     ------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  let lenis = null;

  if (!hasGsap || reduce) {
    preloader.remove();
    document.body.classList.remove("is-loading");
    document.querySelector(".progress").style.display = "none";
    navScroll();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js-anim");
  document.body.classList.add("is-loading");

  if (typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const target = id === "#top" ? 0 : document.querySelector(id);
        if (target === null) return;
        e.preventDefault();
        setMenu(false);
        lenis.scrollTo(target, { offset: id === "#top" ? 0 : -70, duration: 1.4 });
      });
    });
  }

  // split letters
  document.querySelectorAll(".split").forEach((el) => {
    el.innerHTML = [...el.textContent].map((c) => c === " " ? " " : `<span class="ch">${c}</span>`).join("");
  });
  // split words (manifesto) preserving highlight spans
  document.querySelectorAll("[data-words]").forEach((el) => {
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
            else { const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.classList.contains("hl")) {
          n.classList.add("w");
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(el);
  });

  // hero initial states
  gsap.set(".hero__title .ch", { yPercent: 110, rotate: 8 });
  gsap.set(".hero__badge", { scale: 0, rotate: -15 });
  gsap.set(".sticker", { scale: 0 });
  gsap.set(".hero__script", { opacity: 0, y: 20 });

  // ---- preloader ----
  const counter = document.getElementById("loadCount");
  const load = { v: 0 };
  const loaded = new Promise((res) => (document.readyState === "complete" ? res() : addEventListener("load", res, { once: true })));
  const minTime = new Promise((res) => setTimeout(res, 1300));
  gsap.to(load, { v: 86, duration: 1.3, ease: "power2.out", onUpdate: () => (counter.textContent = Math.round(load.v)) });

  Promise.all([loaded, minTime]).then(() => {
    const tl = gsap.timeline();
    tl.to(load, { v: 100, duration: 0.35, ease: "power1.out", onUpdate: () => (counter.textContent = Math.round(load.v)) })
      .to(".preloader__inner", { y: -40, opacity: 0, duration: 0.5, ease: "power3.in" })
      .to(".preloader__curtain--1", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
      .to(".preloader__curtain--2", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.65")
      .set(".preloader", { background: "transparent" })
      .to(".preloader__curtain--1", { yPercent: -200, duration: 0.8, ease: "expo.inOut" }, "-=0.35")
      .to(".preloader__curtain--2", { yPercent: -200, duration: 0.8, ease: "expo.inOut" }, "-=0.7")
      .add(() => { preloader.remove(); document.body.classList.remove("is-loading"); ScrollTrigger.refresh(); })
      .add(heroIntro(), "-=0.9");
  });

  function heroIntro() {
    const tl = gsap.timeline();
    tl.to(".hero__title .ch", { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.035 })
      .to(".hero__badge", { scale: 1, rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.6)" }, "-=0.8")
      .to(".hero__script", { opacity: 1, y: 0, duration: 0.8, ease: "back.out(2)" }, "-=1")
      .to(".sticker", { scale: 1, duration: 0.8, ease: "back.out(2.4)", stagger: 0.08 }, "-=1")
      .to(".hero .reveal-up", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, "-=1");
    return tl;
  }

  // ---- progreso + nav ----
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  navScroll();

  // ---- hero scroll out ----
  gsap.to(".hero__title", { yPercent: -30, scale: 0.92, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // ---- marquees reaccionan al scroll ----
  gsap.fromTo(".marquee--red", { xPercent: 4 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".marquees", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".marquee--mustard", { xPercent: -6 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: ".marquees", start: "top bottom", end: "bottom top", scrub: true } });

  // ---- manifesto palabra por palabra ----
  gsap.to(".manifesto__text .w", {
    opacity: 1, stagger: 0.05, ease: "none",
    scrollTrigger: { trigger: ".manifesto__text", start: "top 80%", end: "bottom 45%", scrub: true },
  });

  // ---- features ----
  gsap.from(".feature", {
    y: 80, opacity: 0, rotate: (i) => [-4, 3, -2][i], duration: 1, ease: "power3.out", stagger: 0.12,
    scrollTrigger: { trigger: ".features", start: "top 85%" },
  });

  // ---- section headings ----
  gsap.utils.toArray(".title-xl").forEach((el) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // ---- historia: contador hasta 2004 ----
  const yearObj = { v: 1990 };
  const yearNum = document.querySelector(".history__num");
  yearNum.textContent = "1990";
  gsap.to(yearObj, {
    v: 2004, duration: 1.6, ease: "power3.out",
    onUpdate: () => (yearNum.textContent = Math.round(yearObj.v)),
    scrollTrigger: { trigger: ".history", start: "top 80%" },
  });
  gsap.from(".history", { y: 80, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".history", start: "top 88%" } });
  gsap.from(".person", { scale: 0, duration: 0.7, stagger: 0.12, ease: "back.out(2.5)", scrollTrigger: { trigger: ".history__people", start: "top 92%" } });

  // ---- especiales: scroll horizontal pinneado (desktop) ----
  const mm = gsap.matchMedia();
  mm.add("(min-width: 761px)", () => {
    const pin = document.querySelector(".specials__pin");
    pin.style.width = "max-content";
    const dist = () => Math.max(0, pin.scrollWidth - window.innerWidth);
    const tween = gsap.to(pin, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: ".specials", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    gsap.utils.toArray(".special__art svg").forEach((svg) => {
      gsap.fromTo(svg, { xPercent: 30, rotate: 12 }, {
        xPercent: -10, rotate: -6, ease: "none",
        scrollTrigger: { trigger: svg.closest(".special"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
      });
    });
    return () => { pin.style.width = ""; };
  });
  mm.add("(max-width: 760px)", () => {
    gsap.from(".special", { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".specials__track", start: "top 85%" } });
  });

  // ---- menú ----
  gsap.from(".menu__tab", { y: 30, opacity: 0, duration: 0.7, stagger: 0.06, ease: "back.out(2)", scrollTrigger: { trigger: ".menu__tabs", start: "top 90%" } });
  gsap.from(".menu__plate", { scale: 0.6, rotate: -40, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.7)", scrollTrigger: { trigger: ".menu__body", start: "top 80%" } });
  gsap.from(".chip", { y: 30, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.04, ease: "back.out(2.5)", scrollTrigger: { trigger: ".sauces", start: "top 90%" } });

  // ---- horarios ----
  gsap.from(".hours__card", { y: 100, rotate: 6, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".hours", start: "top 70%" } });
  gsap.from(".hours__list li", { x: 40, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: ".hours__card", start: "top 75%" } });
  gsap.from(".hours__live", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".hours__live", start: "top 90%" } });

  // ---- CTA ----
  gsap.from(".cta__line", { yPercent: 60, opacity: 0, skewY: 6, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".cta", start: "top 70%" } });
  gsap.from(".cta__buttons .btn", { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(2)", scrollTrigger: { trigger: ".cta__buttons", start: "top 95%" } });

  // ---- footer: relleno del texto gigante ----
  gsap.to(".footer__giant", { backgroundSize: "100% 100%", ease: "none", scrollTrigger: { trigger: ".footer__giant", start: "top bottom", end: "bottom 98%", scrub: true } });

  // ---- link activo del nav ----
  ["menu", "nosotros", "horarios", "contacto"].forEach((id) => {
    ScrollTrigger.create({
      trigger: "#" + id, start: "top 50%", end: "bottom 50%",
      onToggle: (self) => {
        const link = document.querySelector(`.nav__links a[href="#${id}"]`);
        if (link) link.classList.toggle("is-active", self.isActive);
      },
    });
  });

  addEventListener("load", () => ScrollTrigger.refresh());

  /* nav: fondo al scrollear y se esconde al bajar */
  function navScroll() {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > last && y > 400 && !document.body.classList.contains("menu-open"));
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
