/* ============================================================
   CREMAUR — main.js
   Rendering · smooth scroll · reveals · nav · enquiry form
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.CREMAUR_CONFIG || {};
  const D = window.CREMAUR_DATA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rupee = (n) => "₹" + n;
  const PLACEHOLDERS = CFG.usePlaceholders !== false;

  /* Brand ice-cream-cup mark (from the Cremaur logo) — theme-adaptive via currentColor */
  const CUP_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15.5" r="5.6"/><circle cx="29" cy="15" r="5.6"/><circle cx="23.5" cy="19.5" r="5.6"/><path d="M31 5 28 17"/><path d="M12.5 22h23l-2.3 18.2a2.2 2.2 0 0 1-2.2 1.9H17a2.2 2.2 0 0 1-2.2-1.9Z"/><rect x="19" y="30" width="10" height="6" rx="1.6"/></svg>';
  /* Elegant blurred placeholder (preserves layout & aspect ratio) */
  const CC_MARK = '<span class="mark" style="color:rgba(120,80,140,.5)">' + CUP_SVG + '</span>';
  function phBox() { return `<div class="ph">${CC_MARK}</div>`; }
  // returns a placeholder OR a real <img>, depending on config
  function media(src, alt, attrs) {
    if (PLACEHOLDERS) return phBox();
    return `<img src="${src}" alt="${alt}" loading="lazy" ${attrs || ""}>`;
  }
  // Motion policy: this is the brand's flagship experience, so animations are ON by default —
  // even if the OS has "Reduce Motion" enabled (that setting was silently killing the whole
  // experience). Users who truly want a static page can append ?motion=0.
  const motionParam = new URLSearchParams(location.search).get("motion");
  const prefersReduced = motionParam === "0"; // ONLY an explicit opt-out disables motion
  if (prefersReduced) document.documentElement.classList.add("no-motion");

  /* -------- feature icons (7, keyed by index) -------- */
  const ICONS = [
    '<path d="M7 14c0-3 2.2-5 5-5s5 2 5 5"/><path d="M5 14h14"/><path d="M8 14v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3"/>', // handmade (bowl)
    '<path d="M12 3v4"/><circle cx="12" cy="13" r="6"/><path d="M9 13a3 3 0 0 1 6 0"/>', // slow churn
    '<path d="M4 16h16"/><path d="M6 16a6 6 0 0 1 12 0"/><path d="M12 6c1 1 1 2 0 3"/>', // served fresh (dome)
    '<circle cx="9" cy="13" r="4"/><path d="M13 9c2-2 4-2 5-1-1 3-3 4-5 3"/><path d="M11 6v3"/>', // real fruit
    '<circle cx="9" cy="12" r="2.4"/><circle cx="15" cy="12" r="2.4"/><circle cx="12" cy="16" r="2.4"/>', // dried berries
    '<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M8 18L16 6" stroke-width="1.4"/>', // no sugar (cube crossed)
    '<path d="M6 10h12v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/>', // small batch (pot)
  ];

  /* -------- category (serve) icons -------- */
  const SERVE_ICONS = {
    scoop: '<path d="M6 13a6 6 0 0 1 12 0"/><path d="M4 13h16"/><path d="M8 13l4 8 4-8"/>',
    coffee: '<path d="M5 8h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/><path d="M16 9h2a2 2 0 0 1 0 4h-2"/><path d="M8 3c1 1 1 2 0 3M11 3c1 1 1 2 0 3"/>',
    shake: '<path d="M7 8h10l-1 12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M7 8a5 5 0 0 1 10 0"/><path d="M12 3v2"/>',
    mojito: '<path d="M5 6h14l-6 7v6"/><path d="M10 19h6"/><path d="M9 9c1.5 1 3 1 4 0"/>',
    bubble: '<circle cx="9" cy="9" r="2"/><circle cx="14" cy="8" r="2"/><circle cx="12" cy="13" r="2"/><path d="M6 16h12l-2 5H8z"/>',
    waffle: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M5 10h14M5 14h14M10 5v14M14 5v14"/>',
  };

  /* -------- floating garnish (SVG placeholders; swap w/ PNGs — see IMAGES.md) -------- */
  const GARNISH = {
    berry: '<svg viewBox="0 0 40 40"><g fill="#6A2C91"><circle cx="15" cy="22" r="7"/><circle cx="25" cy="20" r="7"/><circle cx="20" cy="29" r="7"/></g><path d="M20 22l3-9" stroke="#8A6B1E" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M23 13c3-2 6-1 7 1-2 2-5 2-7-1z" fill="#7aa05a"/></svg>',
    lavender: '<svg viewBox="0 0 30 54"><path d="M15 20v32" stroke="#7aa05a" stroke-width="2" fill="none"/><g fill="#8f6fc4"><ellipse cx="15" cy="8" rx="5" ry="8"/><ellipse cx="9" cy="16" rx="3.5" ry="5"/><ellipse cx="21" cy="16" rx="3.5" ry="5"/></g></svg>',
    spoon: '<svg viewBox="0 0 60 22"><rect x="20" y="9" width="34" height="4" rx="2" fill="#C9A24B"/><ellipse cx="12" cy="11" rx="12" ry="9" fill="#D9B85C"/><ellipse cx="12" cy="11" rx="8" ry="6" fill="#C9A24B"/></svg>',
    sparkle: '<svg viewBox="0 0 30 30"><path d="M15 2l2.6 9.4L27 14l-9.4 2.6L15 26l-2.6-9.4L3 14l9.4-2.6z" fill="#D9B85C"/></svg>',
    fruit: '<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="12" fill="#e8894b"/><path d="M20 10c1-4 4-5 6-4-1 3-3 5-6 4z" fill="#7aa05a"/><circle cx="16" cy="19" r="2" fill="#fff" opacity=".5"/></svg>',
  };
  const HERO_GARNISH = [
    { k: 'lavender', s: 62, x: '6%', y: '16%', r: -12 },
    { k: 'berry', s: 52, x: '86%', y: '22%', r: 8 },
    { k: 'sparkle', s: 26, x: '18%', y: '70%', r: 0 },
    { k: 'spoon', s: 76, x: '80%', y: '74%', r: 14 },
    { k: 'fruit', s: 46, x: '10%', y: '44%', r: -6 },
    { k: 'sparkle', s: 20, x: '70%', y: '48%', r: 0 },
  ];

  /* ================= ORDER / CONTACT ================= */
  function orderUrl() {
    if (CFG.whatsapp) {
      return "https://wa.me/" + CFG.whatsapp + "?text=" +
        encodeURIComponent("Hi Cremaur! I'd like to place an order. ☕🍨");
    }
    return (CFG.instagram && CFG.instagram.url) || "#";
  }
  function wireOrder() {
    const url = orderUrl();
    $$("[data-order]").forEach((a) => {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    });
    if (CFG.menuPdf) $$("[data-menu-pdf]").forEach((a) => (a.href = CFG.menuPdf));
    const watch = $("#watchBtn");
    if (watch) watch.href = (CFG.instagram && CFG.instagram.url) || "#";
    // Address line from config, if provided
    const addr = $("#addrLine");
    if (addr && CFG.addresses && CFG.addresses.length) {
      addr.innerHTML = CFG.addresses.join("<br><br>");
    }
    // Directions link (shows only if mapUrl is set)
    const mapLink = $("#mapLink");
    if (mapLink && CFG.mapUrl) { mapLink.href = CFG.mapUrl; mapLink.hidden = false; }
    // Phone row (shows only if phoneDisplay is set)
    const phoneRow = $("#phoneRow"), phoneLink = $("#phoneLink");
    if (phoneRow && phoneLink && CFG.phoneDisplay) {
      phoneLink.textContent = CFG.phoneDisplay;
      phoneLink.href = "tel:" + CFG.phoneDisplay.replace(/[^\d+]/g, "");
      phoneRow.hidden = false;
    }
  }

  /* ================= RENDER: HOME ================= */
  function renderMarquee() {
    const el = $("#flavorMarquee");
    if (!el || !D.fruitella) return;
    const words = D.fruitella.flavors.concat(["Handcrafted", "Real Cream", "No Added Sugar"]);
    const set = words.map((w) => `<span>${w}</span>`).join("");
    el.innerHTML = set + set; // duplicate for seamless loop
  }

  function renderFruFeatures() {
    const el = $("#fruFeatures");
    if (!el || !D.fruitella) return;
    el.innerHTML = D.fruitella.features.map((f, i) => `
      <div class="feature" data-reveal>
        <span class="fico"><svg viewBox="0 0 24 24">${ICONS[i] || ICONS[0]}</svg></span>
        <div><h4>${f.t}</h4><p>${f.d}</p></div>
      </div>`).join("");
  }

  function renderStory() {
    const b = $("#storyBody");
    if (b && D.story) b.innerHTML = D.story.body.map((p) => `<p data-reveal>${p}</p>`).join("");
    const pr = $("#promise");
    if (pr && D.story) pr.innerHTML = D.story.promise.map((p, i) => `
      <div class="p" data-reveal>
        <div class="num">0${i + 1}</div><h4>${p.t}</h4><p>${p.d}</p>
      </div>`).join("");
  }

  function tagFor(b) {
    if (b.note) return b.note;
    const n = b.n.toLowerCase();
    if (/(cold|iced|frappe|latte|mojito|shake)/.test(n)) return "Cold";
    if (/hot/.test(n)) return "Hot";
    return "Signature";
  }
  function renderBestSellers() {
    const el = $("#bestSellers");
    if (!el || !D.bestSellers) return;
    const order = orderUrl();
    el.innerHTML = D.bestSellers.map((b) => `
      <article class="bs-card" data-reveal>
        <div class="bs-thumb">
          <span class="bs-tag">${tagFor(b)}</span>
          ${media(b.img, b.n)}
        </div>
        <div class="bs-body">
          <div class="meta">
            <h4>${b.n}</h4>
            <span class="bs-price">${rupee(b.p)}</span>
          </div>
          <a class="bs-order" href="${order}" target="_blank" rel="noopener" aria-label="Order ${b.n}">
            <svg viewBox="0 0 24 24"><path d="M4 5h2l2.2 11a1.6 1.6 0 0 0 1.6 1.3h7a1.6 1.6 0 0 0 1.6-1.2L21 8H7"/><circle cx="10" cy="21" r="1.1"/><circle cx="18" cy="21" r="1.1"/></svg>
          </a>
        </div>
      </article>`).join("");
  }

  function renderServe() {
    const el = $("#serveGrid");
    if (!el || !D.serve) return;
    el.innerHTML = D.serve.map((s) => `
      <a class="serve-tile" href="menu.html#${s.id}" data-reveal>
        <span class="serve-ic"><svg viewBox="0 0 24 24">${SERVE_ICONS[s.icon] || SERVE_ICONS.scoop}</svg></span>
        <h4>${s.t}</h4><p>${s.d}</p>
      </a>`).join("");
  }

  function renderProcess() {
    const el = $("#procGrid");
    if (!el || !D.process) return;
    el.innerHTML = D.process.map((s, i) => `
      <div class="proc-step" data-reveal>
        <span class="pnum">${i + 1}</span>
        <h4>${s.t}</h4><p>${s.d}</p>
      </div>`).join("");
  }

  function renderSocial() {
    const el = $("#socialBand");
    if (!el) return;
    const s = CFG.social || { rating: "4.9", count: "10k+", label: "happy guests" };
    const initials = ["A", "P", "R", "S", "K"];
    const avatars = initials.map((c) => `<span>${c}</span>`).join("");
    const reviewBtn = CFG.googleReview
      ? `<a class="btn ghost sm" href="${CFG.googleReview}" target="_blank" rel="noopener"><span>Leave a Review</span></a>`
      : "";
    el.innerHTML = `
      <div class="social-cell" data-reveal>
        <div class="avatars">${avatars}</div>
        <p><b>${s.count}</b> ${s.label}</p>
      </div>
      <div class="social-divider"></div>
      <div class="social-cell" data-reveal>
        <div class="social-num">${s.rating}</div>
        <div class="stars">★★★★★</div>
        <p>Rated by our guests</p>
      </div>
      <div class="social-divider"></div>
      <div class="social-cell" data-reveal>
        <div class="stars" style="font-size:1.6rem">✦</div>
        <p>Made with love in Lucknow</p>
        ${reviewBtn}
      </div>`;
  }

  function renderHeroGarnish() {
    const el = $("#heroGarnish");
    if (!el) return;
    el.innerHTML = HERO_GARNISH.map((g) => `
      <span class="g" data-float style="left:${g.x};top:${g.y};width:${g.s}px;transform:rotate(${g.r}deg)">${GARNISH[g.k]}</span>`).join("");
  }

  // Replace framed photos with premium placeholders (config-driven)
  function swapStaticPlaceholders() {
    if (!PLACEHOLDERS) return;
    $$(".frame img, .hero-frame img").forEach((img) => {
      const d = document.createElement("div");
      d.className = "ph";
      d.innerHTML = CC_MARK;
      img.replaceWith(d);
    });
  }

  // Subtle floating particles (fixed ambient layer)
  function renderParticles() {
    const el = $(".particles");
    if (!el || prefersReduced) return;
    const n = window.matchMedia("(max-width:700px)").matches ? 9 : 16;
    let html = "";
    for (let i = 0; i < n; i++) {
      const left = Math.round(Math.random() * 100);
      const size = 3 + Math.random() * 5;
      const dur = 16 + Math.random() * 20;
      const delay = -Math.random() * dur;
      const op = 0.25 + Math.random() * 0.4;
      html += `<i style="left:${left}%;bottom:-8vh;width:${size}px;height:${size}px;opacity:${op};animation-duration:${dur}s;animation-delay:${delay}s"></i>`;
    }
    el.innerHTML = html;
  }

  function renderGallery() {
    const el = $("#gallery-grid");
    if (!el || !D.gallery) return;
    const spans = ["tall", "", "", "wide", "tall", "", "", ""];
    el.innerHTML = D.gallery.map((g, i) => `
      <figure class="${spans[i] || ""}" data-reveal>
        ${media(g.img, g.cap)}
        <figcaption>${g.cap}</figcaption>
      </figure>`).join("");
  }

  function renderWeddings() {
    const el = $("#wedPoints");
    if (!el || !D.weddings) return;
    el.innerHTML = D.weddings.points.map((p, i) => `
      <div class="wp" data-reveal>
        <span class="n">${i + 1}</span>
        <div><h4>${p.t}</h4><p>${p.d}</p></div>
      </div>`).join("");
  }

  /* ================= RENDER: MENU PAGE ================= */
  function renderMenu() {
    const body = $("#menuBody");
    const nav = $("#menuNavInner");
    if (!body || !D.menu) return;

    nav.innerHTML = D.menu.map((c) => `<a href="#${c.id}" data-spy="${c.id}">${c.cat.split(" — ")[0]}</a>`).join("");

    body.innerHTML = D.menu.map((c) => {
      const isWaffle = c.id === "waffles";
      let inner;
      if (isWaffle) {
        inner = `<div class="waffle-grid">` + c.items.map((it) => `
          <article class="wcard" data-reveal>
            <div class="img">${media(it.img, it.n)}</div>
            <div class="b">
              <div class="t"><h4>${it.n}</h4><span class="pr">${rupee(it.p)}</span></div>
              <p>${it.d || ""}</p>
            </div>
          </article>`).join("") + `</div>`;
      } else {
        inner = `<div class="mrows">` + c.items.map((it) => `
          <div class="mrow" data-reveal>
            <span class="nm">${it.n}${it.tag ? `<span class="tag">${it.tag}</span>` : ""}</span>
            <span class="pr">${rupee(it.p)}</span>
            ${it.d ? `<span class="desc">${it.d}</span>` : ""}
          </div>`).join("") + `</div>`;
      }
      return `<section class="mcat ${isWaffle ? "withimg" : ""}" id="${c.id}">
        <div class="mcat-head" data-reveal>
          <h2>${c.cat}</h2>
          ${c.note ? `<span class="note">${c.note}</span>` : ""}
        </div>
        ${inner}
      </section>`;
    }).join("");

    // scrollspy
    const links = $$("#menuNavInner a");
    const map = {};
    links.forEach((l) => (map[l.dataset.spy] = l));
    const spy = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const active = map[e.target.id];
          if (active) {
            active.classList.add("active");
            active.scrollIntoView({ block: "nearest", inline: "center", behavior: prefersReduced ? "auto" : "smooth" });
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".mcat").forEach((s) => spy.observe(s));
  }

  /* ================= NAV ================= */
  function initNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const drawer = $("#drawer");
    const isMenuPage = nav && nav.classList.contains("solid");

    function onScroll() {
      if (isMenuPage) return;
      nav.classList.toggle("solid", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function closeDrawer() {
      nav.classList.remove("open");
      drawer.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = !nav.classList.contains("open");
        nav.classList.toggle("open", open);
        drawer.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        drawer.setAttribute("aria-hidden", String(!open));
        document.body.style.overflow = open ? "hidden" : "";
      });
      $$("#drawer a").forEach((a) => a.addEventListener("click", closeDrawer));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
    }

    // back to top
    const top = $("#toTop");
    if (top) {
      window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 600), { passive: true });
      top.addEventListener("click", () => {
        if (window.__lenis) window.__lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      });
    }
  }

  /* ================= REVEALS (IntersectionObserver) ================= */
  function initReveals() {
    const items = $$("[data-reveal]");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((ents, obs) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          const sibs = Array.from(e.target.parentElement ? e.target.parentElement.children : [e.target])
            .filter((c) => c.hasAttribute && c.hasAttribute("data-reveal"));
          const idx = Math.max(0, sibs.indexOf(e.target));
          e.target.style.transition =
            `opacity .8s var(--ease-out) ${idx * 70}ms, transform .8s var(--ease-out) ${idx * 70}ms`;
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((i) => io.observe(i));
  }

  /* ================= SMOOTH SCROLL + PARALLAX ================= */
  function initMotion() {
    if (prefersReduced) return;
    // Lenis smooth scroll — lerp gives a continuous, buttery feel
    if (window.Lenis) {
      const lenis = new window.Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,        // let native momentum handle touch (best on iOS/Android)
        touchMultiplier: 1.4,
      });
      window.__lenis = lenis;
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // anchor links via lenis
      $$('a[href^="#"]').forEach((a) => {
        const id = a.getAttribute("href");
        if (id.length > 1) a.addEventListener("click", (e) => {
          const t = document.querySelector(id);
          if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); }
        });
      });
      if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", window.ScrollTrigger.update);
      }
    }
    // GSAP parallax
    if (window.gsap && window.ScrollTrigger) {
      const g = window.gsap;
      g.registerPlugin(window.ScrollTrigger);
      $$("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 0.1;
        g.to(el, {
          yPercent: -amt * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      // floating tags gentle drift
      $$("[data-float]").forEach((el, i) => {
        g.to(el, { y: i % 2 ? 12 : -12, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    }
  }

  /* ================= SCROLL-EXPANSION HERO ================= */
  function renderHero() {
    const h = CFG.hero || {};
    const mediaBox = $("#hxMedia");
    const bg = $("#hxBg");
    if (mediaBox) {
      const veil = '<span class="veil"></span>';
      if (PLACEHOLDERS) {
        mediaBox.innerHTML = phBox() + veil;
      } else if (h.mediaType === "video") {
        // Pick ONE source by screen width so only that file downloads (no double load).
        const lgMin = h.mediaLgMin || 1024;
        const isLg = window.matchMedia(`(min-width:${lgMin}px)`).matches;
        const src = (isLg && h.mediaLg) ? h.mediaLg : h.media;
        const poster = (isLg && h.posterLg) ? h.posterLg : h.poster;
        mediaBox.innerHTML =
          `<video src="${src}" ${poster ? `poster="${poster}"` : ""} autoplay muted loop playsinline preload="metadata"></video>` + veil;
      } else {
        mediaBox.innerHTML =
          `<img src="${h.media}" alt="Cremaur signature" fetchpriority="high" width="684" height="1164">` + veil;
      }
    }
    if (bg && h.bg && !PLACEHOLDERS) {
      bg.classList.remove("gradient");
      bg.innerHTML = `<img src="${h.bg}" alt="" aria-hidden="true">`;
    }
    // split title from config
    const t = (h.title || "Bliss in Every Bite").trim();
    const parts = t.split(" ");
    const w1 = $("#hxTitle .w1"), w2 = $("#hxTitle .w2");
    if (w1 && w2) { w1.textContent = parts[0]; w2.textContent = parts.slice(1).join(" "); }
    const hint = $("#hxHint span:first-child");
    if (hint && h.hint) hint.textContent = h.hint;
  }

  function initHeroExpand() {
    const hero = $("#hero");
    if (!hero) return;
    const media = $("#hxMedia"), title = $("#hxTitle"), bg = $("#hxBg"),
      hint = $("#hxHint"), reveal = $("#hxReveal");

    if (prefersReduced) {           // CSS .no-motion renders static expanded hero
      if (reveal) { reveal.style.setProperty("--hx-reveal", "1"); reveal.classList.add("on"); }
      if (title) title.style.opacity = "0";
      return;
    }
    let lastP = -1, rafPending = false;

    function update() {
      // read viewport dims fresh every call (robust to resize / mobile URL-bar)
      const vw = window.innerWidth, vh = window.innerHeight;
      const isSmall = vw <= 560;
      const rect = hero.getBoundingClientRect();
      const total = hero.offsetHeight - vh;
      let p = total > 0 ? (-rect.top) / total : 0;
      p = Math.min(1, Math.max(0, p));
      if (Math.abs(p - lastP) < 0.0012) return;
      lastP = p;

      const startW = isSmall ? 220 : 300, startH = isSmall ? 300 : 410;
      const endW = Math.min(vw * 0.94, 1500), endH = Math.min(vh * 0.84, 900);
      media.style.setProperty("--hx-w", (startW + (endW - startW) * p) + "px");
      media.style.setProperty("--hx-h", (startH + (endH - startH) * p) + "px");
      media.style.setProperty("--hx-veil", String(0.26 + 0.34 * p));

      // keep the split within the viewport — clamp travel so the long line never bleeds out
      const maxX = isSmall ? 12 : 16;
      title.style.setProperty("--hx-x", (maxX * p) + "vw");

      if (bg) bg.style.opacity = String(1 - p);
      hint.style.setProperty("--hx-hint", String(Math.max(0, 1 - p * 5)));

      const rp = p < 0.7 ? 0 : Math.min(1, (p - 0.7) / 0.26);
      reveal.style.setProperty("--hx-reveal", String(rp));
      reveal.classList.toggle("on", rp > 0.4);
      title.style.opacity = String(1 - rp);
    }

    // Drive on scroll (primary — works everywhere) with rAF coalescing; also a rAF
    // ticker as a smoothness enhancement where the browser keeps it running.
    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => { rafPending = false; update(); });
    }
    if (window.__lenis && window.__lenis.on) window.__lenis.on("scroll", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { lastP = -1; update(); }, { passive: true });
    update();
  }

  /* ================= WEDDING FORM ================= */
  function initForm() {
    const form = $("#wedForm");
    if (!form) return;
    const status = $("#wedStatus");

    function setErr(name, msg) {
      const el = form.querySelector(`[data-err="${name}"]`);
      if (el) el.textContent = msg || "";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      let ok = true;
      ["name", "mobile", "email", "event"].forEach((n) => setErr(n, ""));
      if (!f.name.value.trim()) { setErr("name", "Please tell us your name."); ok = false; }
      const mobile = f.mobile.value.trim();
      const digits = mobile.replace(/\D/g, "");
      if (!mobile) { setErr("mobile", "Please enter your mobile number."); ok = false; }
      else if (digits.length < 10) { setErr("mobile", "Please enter a valid mobile number."); ok = false; }
      const email = f.email.value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("email", "Please enter a valid email."); ok = false; }
      if (!f.event.value) { setErr("event", "Please choose an event type."); ok = false; }
      if (!ok) { status.textContent = ""; return; }

      const data = {
        name: f.name.value.trim(),
        mobile: mobile,
        email: email,
        event: f.event.value,
        date: f.date.value || "",
        guests: f.guests.value || "",
        message: f.message.value.trim(),
      };
      const lines = [
        "Cremaur — Wedding / Catering Enquiry",
        "Name: " + data.name,
        "Mobile: " + data.mobile,
        data.email ? "Email: " + data.email : "",
        "Event: " + data.event,
        data.date ? "Date: " + data.date : "",
        data.guests ? "Guests: " + data.guests : "",
        data.message ? "Message: " + data.message : "",
      ].filter(Boolean);
      const text = lines.join("\n");

      // Preferred: save straight to the Google Sheet (works on static hosting).
      if (CFG.sheetEndpoint) {
        status.textContent = "Sending your enquiry…";
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        const payload = new URLSearchParams({ ...data, company: (f.company && f.company.value) || "", page: location.href, ts: new Date().toISOString() });
        fetch(CFG.sheetEndpoint, { method: "POST", mode: "no-cors", body: payload })
          .then(() => {
            status.textContent = "Thank you! ✦ We've received your enquiry and will be in touch shortly.";
            form.reset();
          })
          .catch(() => {
            // Network failed — fall back so the enquiry is never lost.
            status.textContent = "Couldn't send automatically — opening Instagram DM instead.";
            if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
            window.open(CFG.instagram.url, "_blank", "noopener");
          })
          .finally(() => { if (btn) btn.disabled = false; });
        return;
      }

      // Fallback route: WhatsApp > Email > Instagram (+ clipboard)
      if (CFG.whatsapp) {
        window.open("https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        status.textContent = "Opening WhatsApp with your enquiry…";
      } else if (CFG.email) {
        window.location.href = "mailto:" + CFG.email +
          "?subject=" + encodeURIComponent("Wedding / Catering Enquiry — " + f.name.value.trim()) +
          "&body=" + encodeURIComponent(text);
        status.textContent = "Opening your email app…";
      } else {
        const done = () => {
          status.textContent = "Enquiry copied ✦ paste it in our Instagram DM (opening now).";
          setTimeout(() => window.open(CFG.instagram.url, "_blank", "noopener"), 700);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else { done(); }
      }
      form.reset();
    });
  }

  /* Hide the preloader as soon as the page is ready */
  function hidePreloader() {
    const p = $(".preloader");
    if (!p) return;
    const done = () => {
      p.classList.add("hide");
      setTimeout(() => { p.style.display = "none"; }, 600); // guarantee removal
    };
    if (document.readyState === "complete") setTimeout(done, 300);
    else window.addEventListener("load", () => setTimeout(done, 300), { once: true });
  }

  /* ================= INIT ================= */
  /* ================= GOOGLE ANALYTICS 4 ================= */
  function initAnalytics() {
    const id = CFG.analyticsId;
    if (!id) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id);
  }

  function init() {
    initAnalytics();
    hidePreloader();
    // Home renders
    renderHero();
    renderHeroGarnish();
    renderMarquee();
    renderServe();
    renderFruFeatures();
    renderProcess();
    renderStory();
    renderBestSellers();
    renderSocial();
    renderGallery();
    renderWeddings();
    // Menu page render
    renderMenu();
    // Placeholders + ambient
    swapStaticPlaceholders();
    renderParticles();
    // Shared
    wireOrder();
    initNav();
    initForm();
    const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
    // Motion after content exists
    initReveals();
    initMotion();       // sets up Lenis (window.__lenis) + parallax + float drift
    initHeroExpand();   // must run after Lenis exists
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
