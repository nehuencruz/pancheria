/* =========================================================
   El Mejor Pancho de San Fernando — interacciones
   ========================================================= */
(() => {
  "use strict";

  /* -------------------------------------------------------
     MENÚ — editá acá nombres, descripciones y precios.
     sauces: colores de las salsas que se dibujan en el pancho
     toppings: papas | cebolla | queso | panceta | verdeo | jalapeno | muzza
     ------------------------------------------------------- */
  const S = { ketchup: "#E23B2E", mostaza: "#F5B72E", mayo: "#FFF6DA", golf: "#F29A76", bbq: "#6B2A1A", picante: "#C2171B", cheddar: "#F39C1F", verde: "#6AA84F" };

  const MENU = [
    {
      id: "panchos", label: "Panchos",
      items: [
        { name: "Clásico", desc: "Pan tostado, salchicha a la plancha y hasta 3 salsas a elección.", price: 2500, sauces: [S.ketchup, S.mostaza] },
        { name: "Con Papas Pay", desc: "El clásico con una lluvia de papas pay crocantes por arriba.", price: 2900, sauces: [S.mayo, S.ketchup], toppings: ["papas"] },
        { name: "Doble Salchicha", desc: "Para los que vienen con hambre en serio. Dos salchichas, un pan.", price: 3600, sauces: [S.mostaza], double: true },
        { name: "Cheddar", desc: "Bañado en cheddar fundido y cebolla de verdeo.", price: 3300, sauces: [S.cheddar], toppings: ["queso", "verdeo"] },
      ],
    },
    {
      id: "especiales", label: "Especiales",
      items: [
        { name: "El Sanfernandino", badge: "De la casa", featured: true, art: "#F5B72E", desc: "Cheddar, panceta crocante, cebolla caramelizada, papas pay y salsa de la casa.", price: 4800, sauces: [S.cheddar, S.golf], toppings: ["panceta", "papas", "cebolla"] },
        { name: "Súper Completo", featured: true, art: "#7FA36D", desc: "Ketchup, mostaza, mayo, salsa golf, papas pay y verdeo. Todo, como debe ser.", price: 4200, sauces: [S.ketchup, S.mostaza, S.mayo], toppings: ["papas", "verdeo"] },
        { name: "El Picante", badge: "Pica", featured: true, art: "#E86A4F", desc: "Jalapeños, salsa picante casera y cheddar para calmar el fuego.", price: 4400, sauces: [S.picante, S.cheddar], toppings: ["jalapeno"] },
        { name: "Pancho Pizza", featured: true, art: "#B9A3F0", desc: "Muzzarella gratinada, salsa de tomate y orégano. Lo mejor de los dos mundos.", price: 4500, sauces: [S.ketchup], toppings: ["muzza"] },
        { name: "BBQ Bacon", featured: true, art: "#F2C9A0", desc: "Salsa barbacoa ahumada, panceta y cebolla crispy.", price: 4700, sauces: [S.bbq], toppings: ["panceta", "cebolla"] },
      ],
    },
    {
      id: "combos", label: "Combos",
      items: [
        { name: "Combo Solo", desc: "1 pancho clásico + papas fritas + gaseosa 500 ml.", price: 5900, sauces: [S.ketchup, S.mostaza], toppings: ["papas"] },
        { name: "Combo Dúo", badge: "Más pedido", desc: "2 panchos a elección + papas fritas grandes + 2 gaseosas.", price: 10900, sauces: [S.mayo, S.ketchup], double: true },
        { name: "Combo Familia", desc: "4 panchos clásicos + 2 papas fritas + gaseosa 1,5 L.", price: 17900, sauces: [S.ketchup, S.mostaza, S.mayo], toppings: ["papas"] },
      ],
    },
    {
      id: "extras", label: "Extras & Bebidas",
      items: [
        { name: "Papas Fritas", desc: "Porción crocante, recién salidas.", price: 2600, sauces: [S.ketchup] },
        { name: "Extra Cheddar", desc: "Sumale cheddar fundido a cualquier pancho.", price: 900, sauces: [S.cheddar], toppings: ["queso"] },
        { name: "Extra Panceta", desc: "Panceta crocante en tiras.", price: 1100, sauces: [S.golf], toppings: ["panceta"] },
        { name: "Gaseosa 500 ml", desc: "Línea Coca-Cola.", price: 1800, sauces: [S.mostaza] },
        { name: "Agua mineral", desc: "Con o sin gas.", price: 1400, sauces: [S.mayo] },
      ],
    },
  ];

  const SAUCES = [
    ["Ketchup", S.ketchup], ["Mostaza", S.mostaza], ["Mayonesa", S.mayo], ["Salsa golf", S.golf],
    ["Barbacoa", S.bbq], ["Picante casera", S.picante], ["Cheddar", S.cheddar], ["Papas pay", "#F7D36B"],
    ["Cebolla crispy", "#E8C79A"], ["Verdeo", S.verde], ["Panceta", "#A4442E"], ["Jalapeños", "#3F8F3A"],
  ];

  const money = (n) => "$" + n.toLocaleString("es-AR");

  /* -------------------------------------------------------
     Ilustración SVG de pancho, generada según los datos
     ------------------------------------------------------- */
  function dogSVG(item = {}, uid = Math.random().toString(36).slice(2, 7)) {
    const sauces = item.sauces && item.sauces.length ? item.sauces : [S.ketchup];
    const t = item.toppings || [];
    const ink = "#121110";
    let out = "";

    // bottom bun (back)
    out += `<path d="M18 86 C18 60 50 52 160 52 C270 52 302 60 302 86 L302 92 C302 108 280 112 160 112 C40 112 18 108 18 92 Z" fill="#E8A34D" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>`;

    // sausage(s)
    const sausage = (y, dx = 0) =>
      `<rect x="${4 + dx}" y="${y}" width="${312 - dx * 2}" height="34" rx="17" fill="#C8553D" stroke="${ink}" stroke-width="5"/>` +
      `<path d="M${30 + dx} ${y + 10} H${150}" stroke="#F08A6B" stroke-width="5" stroke-linecap="round" opacity=".7"/>` +
      `<path d="M${80} ${y + 26} l8 -8 M${130} ${y + 26} l8 -8 M${180} ${y + 26} l8 -8 M${230} ${y + 26} l8 -8" stroke="${ink}" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>`;
    if (item.double) out += sausage(36, 10);
    out += sausage(item.double ? 56 : 48);

    // toppings under sauce
    if (t.includes("queso")) {
      out += `<path d="M40 ${item.double ? 66 : 58} C60 50 90 56 110 52 C140 46 170 58 200 52 C230 46 260 56 282 54 L284 72 C270 84 262 70 252 82 C240 92 232 74 220 80 C200 92 190 72 170 82 C150 92 140 74 120 82 C100 90 92 74 74 82 C60 88 52 74 40 76 Z" fill="${S.cheddar}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
    }
    if (t.includes("muzza")) {
      out += `<path d="M30 56 C60 44 90 54 120 46 C150 40 180 54 210 46 C240 40 270 52 292 50 L290 70 C272 82 258 64 244 78 C226 90 214 66 196 78 C178 90 166 66 148 78 C130 88 118 66 100 78 C82 88 70 66 52 76 C42 80 34 72 30 72 Z" fill="#FFF3D1" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
        [70, 130, 190, 250].map((x) => `<circle cx="${x}" cy="56" r="3" fill="#3F8F3A"/>`).join("");
    }
    if (t.includes("panceta")) {
      out += [50, 120, 190, 250].map((x, i) =>
        `<path d="M${x} ${46 + (i % 2) * 4} q12 -10 24 0 t24 0" fill="none" stroke="#A4442E" stroke-width="9" stroke-linecap="round"/>` +
        `<path d="M${x} ${46 + (i % 2) * 4} q12 -10 24 0 t24 0" fill="none" stroke="#F2B49C" stroke-width="3" stroke-linecap="round"/>`
      ).join("");
    }

    // sauces zigzag
    sauces.forEach((c, i) => {
      const y = (item.double ? 48 : 58) + i * 6 - (sauces.length - 1) * 3;
      let d = `M${28 + i * 8} ${y}`;
      for (let x = 28 + i * 8, k = 0; x < 286; x += 16, k++) d += ` L${x + 16} ${y + (k % 2 ? -8 : 8)}`;
      out += `<path d="${d}" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
      out += `<path d="${d}" fill="none" stroke="${c}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    });

    // toppings over sauce
    if (t.includes("papas")) {
      const sticks = [[40, 40, 20], [70, 34, -30], [96, 42, 10], [128, 36, 40], [156, 44, -20], [186, 36, 25], [214, 42, -40], [244, 36, 15], [270, 44, -15]];
      out += sticks.map(([x, y, r]) => `<rect x="${x}" y="${y}" width="22" height="6" rx="3" fill="#F7D36B" stroke="${ink}" stroke-width="2.5" transform="rotate(${r} ${x + 11} ${y + 3})"/>`).join("");
    }
    if (t.includes("cebolla")) {
      out += [[60, 50], [104, 46], [148, 52], [196, 46], [236, 52], [272, 48]].map(([x, y]) => `<path d="M${x} ${y} q8 -10 16 0" fill="none" stroke="#FFF6DA" stroke-width="4" stroke-linecap="round"/>`).join("");
    }
    if (t.includes("verdeo")) {
      out += [[52, 44], [88, 52], [120, 42], [160, 50], [200, 42], [232, 50], [266, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${S.verde}" stroke="${ink}" stroke-width="2"/>`).join("");
    }
    if (t.includes("jalapeno")) {
      out += [70, 130, 190, 250].map((x, i) => `<g transform="translate(${x} ${44 + (i % 2) * 6})"><circle r="9" fill="#3F8F3A" stroke="${ink}" stroke-width="3"/><circle r="4" fill="#B7E08E"/></g>`).join("");
    }

    // front bun lip
    out += `<path d="M10 92 C10 82 30 80 60 84 C100 90 220 90 260 84 C290 80 310 82 310 92 C310 128 270 146 160 146 C50 146 10 128 10 92 Z" fill="#F0B25E" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>`;
    out += `<path d="M44 112 C80 126 120 130 160 130" fill="none" stroke="#FFD594" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;

    return `<svg viewBox="0 0 320 156" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.name || "Pancho"}" data-uid="${uid}">${out}</svg>`;
  }

  /* -------------------------------------------------------
     Render: especiales, menú, salsas
     ------------------------------------------------------- */
  const track = document.getElementById("specialsTrack");
  const featured = MENU.flatMap((c) => c.items).filter((i) => i.featured);
  track.innerHTML = featured.map((item, i) => `
    <article class="special">
      <div class="special__art" style="--art-bg:${item.art}">
        ${item.badge ? `<span class="special__tag">${item.badge}</span>` : ""}
        ${dogSVG(item)}
      </div>
      <div class="special__body">
        <h3 class="special__name">${item.name}</h3>
        <p class="special__desc">${item.desc}</p>
        <div class="special__foot">
          <span class="special__price">${money(item.price)}</span>
          <span class="special__num">${String(i + 1).padStart(2, "0")} / ${String(featured.length).padStart(2, "0")}</span>
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
    previewDog.innerHTML = dogSVG(item);
    previewDog.classList.remove("is-swap");
    void previewDog.offsetWidth;
    previewDog.classList.add("is-swap");
    previewName.textContent = `${item.name} · ${money(item.price)}`;
  }

  function renderCategory(id) {
    const cat = MENU.find((c) => c.id === id);
    list.setAttribute("aria-labelledby", `tab-${id}`);
    list.innerHTML = cat.items.map((item, i) => `
      <article class="menu-item is-enter" style="animation-delay:${i * 70}ms" data-i="${i}" data-cursor="Mmm" tabindex="0">
        <span class="menu-item__num">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="menu-item__name">${item.name}${item.badge ? `<span class="menu-item__badge">${item.badge}</span>` : ""}</h3>
        <span class="menu-item__price">${money(item.price)}</span>
        <p class="menu-item__desc">${item.desc}</p>
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

  document.getElementById("sauceChips").innerHTML = SAUCES.map(([n, c]) => `<span class="chip" style="--c:${c}"><i></i>${n}</span>`).join("");

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
  gsap.set(".hero__badge", { scale: 0, rotate: -200 });
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
  gsap.to(".hero__badge", { yPercent: 40, rotate: 25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

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
