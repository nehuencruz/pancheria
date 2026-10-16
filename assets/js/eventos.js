/* =========================================================
   Página de Eventos — lista de eventos con fotos (desde Supabase)
   ========================================================= */
(async () => {
  "use strict";

  const D = window.PanchoData;
  const esc = D.esc;
  const root = document.getElementById("eventsRoot");
  const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Starburst del hero ---------- */
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

  /* ---------- Datos ---------- */
  function dateBadge(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return `<div class="ev-date ev-date--none" aria-hidden="true">★</div>`;
    const [, y, mo, d] = m;
    return `<time class="ev-date" datetime="${y}-${mo}-${d}">
        <span class="ev-date__day">${+d}</span>
        <span class="ev-date__month">${MONTHS[+mo - 1] || ""}</span>
        <span class="ev-date__year">${y}</span>
      </time>`;
  }

  const photos = []; // lista plana para el visor
  function renderEvents(events) {
    if (!events.length) {
      root.innerHTML = `
        <div class="ev-empty">
          <img src="../assets/logo.webp" alt="" width="110" height="110" />
          <h2>Pronto, nuevos eventos</h2>
          <p>Todavía no hay fotos cargadas. Volvé a pasar por acá, o mejor: vení a la panchería.</p>
        </div>`;
      return;
    }
    root.innerHTML = events.map((ev) => {
      const list = (ev.event_photos || []).filter((p) => p.image_path);
      const figures = list.map((p) => {
        const i = photos.push({ src: D.imageUrl(p.image_path), caption: p.caption || "", title: ev.title }) - 1;
        return `
          <figure class="ev-photo">
            <button class="ev-photo__btn" type="button" data-photo="${i}" data-cursor="Ver" aria-label="Ampliar foto${p.caption ? ": " + esc(p.caption) : ""}">
              <img src="${esc(photos[i].src)}" alt="${esc(p.caption || ev.title)}" loading="lazy" decoding="async" />
            </button>
            ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}
          </figure>`;
      }).join("");
      return `
        <article class="ev-event">
          <header class="ev-event__head">
            ${dateBadge(ev.event_date)}
            <div>
              <h2 class="ev-event__title">${esc(ev.title)}</h2>
              ${ev.description ? `<p class="ev-event__desc">${esc(ev.description)}</p>` : ""}
            </div>
          </header>
          ${figures ? `<div class="ev-gallery">${figures}</div>` : ""}
        </article>`;
    }).join("");
  }

  let events = [];
  try {
    events = D.enabled ? await D.getEvents() : [];
  } catch (err) {
    console.warn("[eventos] no se pudieron cargar:", err.message);
  }
  renderEvents(events);

  /* ---------- Visor de fotos ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCaption");
  const lbCount = document.getElementById("lbCount");
  let current = 0, lastFocus = null;

  function show(i) {
    current = (i + photos.length) % photos.length;
    const p = photos[current];
    lbImg.src = p.src;
    lbImg.alt = p.caption || p.title;
    lbCap.textContent = p.caption;
    lbCount.textContent = `${current + 1} / ${photos.length}`;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    lb.classList.toggle("is-single", photos.length < 2);
    show(i);
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    document.getElementById("lbClose").focus();
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-photo]");
    if (btn) openLb(+btn.dataset.photo);
  });
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", () => show(current - 1));
  document.getElementById("lbNext").addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") { // mantener el foco dentro del visor
      const f = [...lb.querySelectorAll("button")].filter((b) => getComputedStyle(b).visibility !== "hidden");
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
    }
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Navegación ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  let lenis = null;
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileMenu.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lb.hidden) setMenu(false); });

  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > last && y > 400 && !document.body.classList.contains("menu-open"));
    last = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Cursor, botones magnéticos ---------- */
  if (fine && !reduce) {
    const cursor = document.querySelector(".cursor");
    const cLabel = cursor.querySelector(".cursor__label");
    document.documentElement.classList.add("has-cursor");
    const dot = cursor.querySelector(".cursor__dot"), ring = cursor.querySelector(".cursor__ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => { cursor.classList.add("is-hover"); cLabel.textContent = el.dataset.cursor; });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
      el.addEventListener("click", () => cursor.classList.remove("is-hover"));
    });
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Animaciones ---------- */
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (!hasGsap || reduce) {
    document.querySelector(".progress").style.display = "none";
    return;
  }
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js-anim");

  if (typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href="#top"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); lenis.scrollTo(0, { duration: 1.4 }); }));
  }

  document.querySelectorAll(".split").forEach((el) => {
    el.innerHTML = [...el.textContent].map((c) => `<span class="ch">${c}</span>`).join("");
  });

  gsap.timeline()
    .from(".ev-hero__title .ch", { yPercent: 110, rotate: 8, duration: 1.1, ease: "expo.out", stagger: 0.04 })
    .from(".ev-hero__badge", { scale: 0, rotate: -15, duration: 1.2, ease: "elastic.out(1, 0.6)" }, "-=0.8")
    .to(".ev-reveal", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, "-=1");

  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  gsap.to(".ev-hero__title", { yPercent: -25, opacity: 0.3, ease: "none", scrollTrigger: { trigger: ".ev-hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.fromTo(".marquee--red", { xPercent: 4 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".marquees", start: "top bottom", end: "bottom top", scrub: true } });

  gsap.utils.toArray(".ev-event").forEach((ev) => {
    gsap.from(ev.querySelector(".ev-event__head"), { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ev, start: "top 85%" } });
    gsap.from(ev.querySelectorAll(".ev-photo"), {
      y: 70, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: ev.querySelector(".ev-gallery") || ev, start: "top 88%" },
    });
  });
  gsap.from(".ev-empty", { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".ev-list", start: "top 80%" } });
  gsap.from(".cta__line", { yPercent: 60, opacity: 0, skewY: 6, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".cta", start: "top 70%" } });
  gsap.to(".footer__giant", { backgroundSize: "100% 100%", ease: "none", scrollTrigger: { trigger: ".footer__giant", start: "top bottom", end: "bottom 98%", scrub: true } });

  // las fotos cambian la altura de la página al cargar
  let refreshTimer;
  const refreshSoon = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250); };
  root.querySelectorAll("img").forEach((img) => img.addEventListener("load", refreshSoon, { once: true }));
  addEventListener("load", () => ScrollTrigger.refresh());
})();
