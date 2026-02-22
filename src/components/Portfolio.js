import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Skills", "Projects", "Resume", "Contact"];

const SKILLS = {
  Frontend: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "ReactJS"],
  Backend: ["Java (Fundamentals)", "REST API Basics"],
  Tools: ["Git", "GitHub", "Visual Studio Code"],
  Concepts: ["Responsive Design", "DOM Manipulation", "Web Concepts"],
  Soft: ["Problem Solving", "Team Collaboration", "Quick Learner"],
};

const PROJECTS = [
  {
    title: "Netflix Homepage Clone",
    tech: ["HTML", "CSS", "Bootstrap"],
    desc: "Responsive clone of the Netflix homepage with Bootstrap grid system, navigation bar, banners, content sections, and footer with mobile-first design.",
    icon: "▶",
    color: "#e50914",
  },
  {
    title: "API-Based Weather Dashboard",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    desc: "Responsive weather application fetching live data from a public weather API, using Bootstrap components for layout, forms, and UI responsiveness.",
    icon: "⛅",
    color: "#00b4d8",
  },
  {
    title: "Online Task Management System",
    tech: ["HTML", "CSS", "JavaScript"],
    desc: "Task management interface with task creation, filtering, and completion tracking using DOM manipulation and event handling.",
    icon: "✓",
    color: "#06d6a0",
  },
];

export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navBtnRefs = useRef({});
  const mobileMenuRef = useRef(null);

  const titles = ["Full Stack Developer", "React Enthusiast", "ECE Student", "Problem Solver"];
  const [titleIdx, setTitleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [typedText, setTypedText] = useState("");

  // ── Scroll spy ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const closest = NAV_LINKS.map((l) => {
        const el = document.getElementById(l.toLowerCase());
        if (!el) return { l, dist: Infinity };
        return { l, dist: Math.abs(el.getBoundingClientRect().top - 90) };
      }).reduce((a, b) => (a.dist < b.dist ? a : b));
      setActive(closest.l);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Sliding indicator ────────────────────────────────────────
  useEffect(() => {
    const el = navBtnRefs.current[active];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, scrolled]);

  // ── Close mobile menu on outside click ──────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // ── Typewriter ───────────────────────────────────────────────
  useEffect(() => {
    const word = titles[titleIdx];
    const timeout = setTimeout(() => {
      if (!deleting && charIdx < word.length) setCharIdx((c) => c + 1);
      else if (!deleting && charIdx === word.length) setDeleting(true);
      else if (deleting && charIdx > 0) setCharIdx((c) => c - 1);
      else { setDeleting(false); setTitleIdx((i) => (i + 1) % titles.length); }
    }, deleting ? 40 : charIdx === titles[titleIdx].length ? 1800 : 80);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, titleIdx]);

  useEffect(() => { setTypedText(titles[titleIdx].slice(0, charIdx)); }, [charIdx, titleIdx]);

  const goTo = (link) => {
    setActive(link);
    setMenuOpen(false);
    const el = document.getElementById(link.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={S.root}>
      <style>{css}</style>

      {/* ═══════════════════════════════ NAVBAR ══════════════════════════════ */}
      <nav style={{ ...S.nav, ...(scrolled ? S.navScrolled : {}) }}>

        {/* Logo */}
        <button style={S.logo} onClick={() => goTo("About")}>
          NK<span style={S.logoDot}>.</span>
        </button>

        {/* Desktop pill navigation */}
        <div style={S.navPillWrap} className="nav-desktop">
          <div style={S.navPill}>
            <span style={{ ...S.navSlider, left: indicatorStyle.left, width: indicatorStyle.width }} />
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                ref={(el) => (navBtnRefs.current[l] = el)}
                style={{ ...S.navBtn, ...(active === l ? S.navBtnActive : {}) }}
                onClick={() => goTo(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Hire Me + Burger */}
        <div style={S.navRight}>
          <a href="mailto:kilarinani25@gmail.com" style={S.navCta} className="nav-desktop">
            Hire Me ✦
          </a>
          <button
            style={S.burgerBtn}
            className="nav-mobile"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span style={{ ...S.bar, ...(menuOpen ? S.bar1Open : {}) }} />
            <span style={{ ...S.bar, ...(menuOpen ? S.barMidOpen : {}) }} />
            <span style={{ ...S.bar, ...(menuOpen ? S.bar3Open : {}) }} />
          </button>
        </div>
      </nav>

      {/* ════════════════════════════ MOBILE DRAWER ══════════════════════════ */}
      <div
        ref={mobileMenuRef}
        style={{ ...S.drawer, ...(menuOpen ? S.drawerOpen : {}) }}
      >
        <div style={S.drawerHeader}>
          <span style={S.drawerLogo}>NK<span style={S.logoDot}>.</span></span>
          <button style={S.drawerClose} onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div style={S.drawerLinks}>
          {NAV_LINKS.map((l, i) => (
            <button
              key={l}
              style={{
                ...S.drawerLink,
                ...(active === l ? S.drawerLinkActive : {}),
                transitionDelay: menuOpen ? `${i * 55}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateX(0)" : "translateX(20px)",
              }}
              onClick={() => goTo(l)}
            >
              <span style={S.drawerNum}>0{i + 1}</span>
              <span>{l}</span>
              {active === l && <span style={S.drawerDot} />}
            </button>
          ))}
        </div>
        <div style={S.drawerFooter}>
          <p style={S.drawerContact}>📧 kilarinani25@gmail.com</p>
          <p style={S.drawerContact}>📞 +91 70135 27455</p>
          <a href="mailto:kilarinani25@gmail.com" style={S.drawerCta}>
            Hire Me ✦
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && <div style={S.backdrop} onClick={() => setMenuOpen(false)} />}

      {/* ═══════════════════════════════ HERO ════════════════════════════════ */}
      <section id="about" style={S.hero}>
        <div style={S.heroBg}>
          <div style={S.gridPattern} />
          <div style={S.glow1} />
          <div style={S.glow2} />
        </div>
        <div style={S.heroContent} className="fade-in">
          <p style={S.greet}>Hello, I'm</p>
          <h1 style={S.heroName}>
            Sri Venkata<br />
            <span style={S.nameAccent}>Nani Kilari</span>
          </h1>
          <div style={S.typingRow}>
            <span style={S.typingText}>{typedText}</span>
            <span style={S.cursor}>|</span>
          </div>
          <p style={S.heroBio}>
            Final-year B.Tech student in Electronics & Communication Engineering focused on Java Full Stack Web Development. Building responsive, user-friendly web applications.
          </p>
          <div style={S.heroCtas}>
            <button style={S.btnPrimary} className="btn-hover" onClick={() => goTo("Projects")}>View Projects</button>
            <button style={S.btnOutline} className="btn-hover" onClick={() => goTo("Contact")}>Contact Me</button>
          </div>
          <div style={S.chips}>
            <a href="mailto:kilarinani25@gmail.com" style={S.chip}>📧 Email</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={S.chip}>💼 LinkedIn</a>
            <span style={S.chip}>📍 India</span>
          </div>
        </div>
        <div style={S.heroAvatarWrap}>
          <div style={S.avatar}>NK</div>
          <div style={S.ring1} />
          <div style={S.ring2} />
        </div>
      </section>

      {/* ═══════════════════════════════ SKILLS ══════════════════════════════ */}
      <section id="skills" style={S.section}>
        <div style={S.inner}>
          <div style={S.secHeader}>
            <span style={S.secTag}>What I Know</span>
            <h2 style={S.secTitle}>Skills & <span style={S.grad}>Expertise</span></h2>
          </div>
          <div style={S.skillGrid}>
            {Object.entries(SKILLS).map(([cat, items]) => (
              <div key={cat} style={S.skillCard} className="card-hover">
                <h3 style={S.skillCat}>{cat}</h3>
                <div style={S.tagWrap}>
                  {items.map((s) => <span key={s} style={S.tag}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PROJECTS ════════════════════════════ */}
      <section id="projects" style={{ ...S.section, background: "#0a0a0f" }}>
        <div style={S.inner}>
          <div style={S.secHeader}>
            <span style={S.secTag}>What I've Built</span>
            <h2 style={S.secTitle}>Featured <span style={S.grad}>Projects</span></h2>
          </div>
          <div style={S.projGrid}>
            {PROJECTS.map((p) => (
              <div key={p.title} style={S.projCard} className="proj-hover">
                <div style={{ ...S.projIcon, background: p.color + "22", color: p.color }}>{p.icon}</div>
                <h3 style={S.projTitle}>{p.title}</h3>
                <p style={S.projDesc}>{p.desc}</p>
                <div style={S.techRow}>
                  {p.tech.map((t) => <span key={t} style={{ ...S.techBadge, borderColor: p.color + "88", color: p.color }}>{t}</span>)}
                </div>
                <div style={{ ...S.projAccent, background: p.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ RESUME ══════════════════════════════ */}
      <section id="resume" style={S.section}>
        <div style={S.inner}>
          <div style={S.secHeader}>
            <span style={S.secTag}>Background</span>
            <h2 style={S.secTitle}>My <span style={S.grad}>Resume</span></h2>
          </div>
          <div style={S.resumeGrid}>
            <div>
              <h3 style={S.resumeGroup}>🎓 Education</h3>
              {[
                { degree: "B.Tech – ECE", inst: "Marri Laxman Reddy Institute of Technology", score: "CGPA: 6.3/10" },
                { degree: "Intermediate (Class XII)", inst: "Sri Chaitanya Junior College", score: "93%" },
                { degree: "Secondary School (Class X)", inst: "Montessori High School", score: "98.9%" },
              ].map((e) => (
                <div key={e.degree} style={S.tlItem}>
                  <div style={S.tlDot} />
                  <div>
                    <p style={S.tlDegree}>{e.degree}</p>
                    <p style={S.tlInst}>{e.inst}</p>
                    <span style={S.tlBadge}>{e.score}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={S.resumeGroup}>🏆 Certifications</h3>
              <div style={S.certCard}>
                <p style={S.certTitle}>Mentorship Program on Web Development</p>
                <p style={S.certOrg}>Launched Global</p>
                <p style={S.certId}>Certificate ID: LEDCC1536</p>
                <p style={S.certDesc}>Completed hands-on training in HTML, CSS, JavaScript, Bootstrap, and modern frontend development practices.</p>
              </div>
              <h3 style={{ ...S.resumeGroup, marginTop: 32 }}>📬 Contact</h3>
              <div style={S.contactInfo}>
                <p>📞 +91 70135 27455</p>
                <p>✉️ kilarinani25@gmail.com</p>
                <p>📍 India</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button style={S.btnPrimary} className="btn-hover" onClick={() => goTo("Contact")}>
              Get In Touch →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ CONTACT ═════════════════════════════ */}
      <section id="contact" style={{ ...S.section, background: "#0a0a0f" }}>
        <div style={S.inner}>
          <div style={S.secHeader}>
            <span style={S.secTag}>Get In Touch</span>
            <h2 style={S.secTitle}>Let's <span style={S.grad}>Connect</span></h2>
          </div>
          <div style={S.contactGrid}>
            <div>
              <p style={S.contactText}>
                I'm currently seeking entry-level developer roles. Whether you have a project in mind, a position to fill, or just want to connect — I'd love to hear from you!
              </p>
              <div style={S.contactLinks}>
                <a href="mailto:kilarinani25@gmail.com" style={S.contactLink}>📧 kilarinani25@gmail.com</a>
                <a href="tel:+917013527455" style={S.contactLink}>📞 +91 70135 27455</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={S.contactLink}>💼 LinkedIn Profile</a>
              </div>
            </div>
            <form style={S.form} onSubmit={handleSubmit}>
              {sent && <div style={S.successMsg}>✅ Message sent! I'll get back to you soon.</div>}
              <input style={S.input} placeholder="Your Name" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required className="input-focus" />
              <input style={S.input} type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} required className="input-focus" />
              <textarea style={{ ...S.input, minHeight: 120, resize: "vertical" }} placeholder="Your Message" value={formData.message} onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))} required rows={5} className="input-focus" />
              <button type="submit" style={S.btnPrimary} className="btn-hover">Send Message →</button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FOOTER ══════════════════════════════ */}
      <footer style={S.footer}>
        <div style={S.footerNav}>
          {NAV_LINKS.map((l) => (
            <button key={l} style={S.footerLink} onClick={() => goTo(l)} className="footer-link">
              {l}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 20, color: "#666" }}>
          Designed & Built by <span style={S.grad}>Sri Venkata Nani Kilari</span>
        </p>
        <p style={{ fontSize: 12, color: "#3a3a4a", marginTop: 8 }}>© 2025 All Rights Reserved</p>
      </footer>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  root: { fontFamily: "'Sora', sans-serif", background: "#08080e", color: "#e8e8f0", minHeight: "100vh", overflowX: "hidden" },

  // NAV
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 5%", transition: "all 0.35s ease", background: "transparent" },
  navScrolled: { background: "rgba(8,8,14,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 5%", boxShadow: "0 4px 40px rgba(0,0,0,0.5)" },
  logo: { fontSize: 26, fontWeight: 900, letterSpacing: -1, color: "#fff", cursor: "pointer", background: "none", border: "none", fontFamily: "'Sora', sans-serif", padding: 0 },
  logoDot: { color: "#a78bfa" },
  navPillWrap: { flex: 1, display: "flex", justifyContent: "center" },
  navPill: { position: "relative", display: "flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 100, padding: 5 },
  navSlider: { position: "absolute", top: 5, height: "calc(100% - 10px)", background: "linear-gradient(135deg, rgba(124,58,237,0.75), rgba(37,99,235,0.75))", borderRadius: 100, transition: "left 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1)", zIndex: 0 },
  navBtn: { position: "relative", zIndex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 18px", borderRadius: 100, fontSize: 14, fontWeight: 600, color: "#777", fontFamily: "'Sora', sans-serif", transition: "color 0.2s", whiteSpace: "nowrap" },
  navBtnActive: { color: "#fff" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  navCta: { padding: "9px 22px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", borderRadius: 100, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" },

  // Burger
  burgerBtn: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, width: 42, height: 42, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, cursor: "pointer", padding: 0 },
  bar: { display: "block", width: 20, height: 2, background: "#ddd", borderRadius: 2, transition: "transform 0.3s, opacity 0.3s", transformOrigin: "center" },
  bar1Open: { transform: "translateY(7px) rotate(45deg)" },
  barMidOpen: { opacity: 0, transform: "scaleX(0)" },
  bar3Open: { transform: "translateY(-7px) rotate(-45deg)" },

  // Drawer
  drawer: { position: "fixed", top: 0, right: 0, bottom: 0, width: "min(320px, 88vw)", background: "linear-gradient(160deg, #0e0e1c 0%, #08080e 100%)", zIndex: 190, transform: "translateX(110%)", transition: "transform 0.4s cubic-bezier(.4,0,.2,1)", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", boxShadow: "-20px 0 80px rgba(0,0,0,0.6)" },
  drawerOpen: { transform: "translateX(0)" },
  drawerHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  drawerLogo: { fontSize: 24, fontWeight: 900, color: "#fff" },
  drawerClose: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#aaa", cursor: "pointer", width: 36, height: 36, fontSize: 14, fontFamily: "'Sora', sans-serif" },
  drawerLinks: { flex: 1, padding: "28px 20px", display: "flex", flexDirection: "column", gap: 4 },
  drawerLink: { display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", cursor: "pointer", padding: "14px 16px", borderRadius: 12, fontSize: 17, fontWeight: 600, color: "#777", fontFamily: "'Sora', sans-serif", textAlign: "left", transition: "background 0.2s, color 0.25s, transform 0.3s, opacity 0.3s", position: "relative" },
  drawerLinkActive: { color: "#fff", background: "rgba(167,139,250,0.12)" },
  drawerNum: { fontSize: 11, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, minWidth: 20 },
  drawerDot: { position: "absolute", right: 16, width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #60a5fa)" },
  drawerFooter: { padding: "20px 28px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 },
  drawerContact: { color: "#555", fontSize: 13 },
  drawerCta: { marginTop: 12, display: "block", textAlign: "center", padding: "12px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" },
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 180, backdropFilter: "blur(4px)" },

  // Hero
  hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "120px 6% 80px", position: "relative", gap: 40, flexWrap: "wrap" },
  heroBg: { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" },
  gridPattern: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" },
  glow1: { position: "absolute", top: "10%", right: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", filter: "blur(40px)" },
  glow2: { position: "absolute", bottom: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.09) 0%, transparent 70%)", filter: "blur(40px)" },
  heroContent: { flex: "1 1 380px", maxWidth: 640, position: "relative", zIndex: 2 },
  greet: { color: "#a78bfa", fontWeight: 600, fontSize: 14, letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 12 },
  heroName: { fontSize: "clamp(40px, 7vw, 78px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, margin: "0 0 4px", color: "#fff" },
  nameAccent: { background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  typingRow: { display: "flex", alignItems: "center", gap: 2, marginBottom: 24, height: 36 },
  typingText: { fontSize: 21, fontWeight: 600, color: "#94a3b8" },
  cursor: { fontSize: 22, color: "#a78bfa", animation: "blink 1s infinite" },
  heroBio: { color: "#94a3b8", fontSize: 16.5, lineHeight: 1.75, maxWidth: 520, marginBottom: 36 },
  heroCtas: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 },
  chips: { display: "flex", gap: 10, flexWrap: "wrap" },
  chip: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 40, padding: "7px 16px", fontSize: 13, color: "#bbb", textDecoration: "none" },
  heroAvatarWrap: { flex: "1 1 240px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 270 },
  avatar: { width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 62, fontWeight: 900, color: "#fff", zIndex: 2, position: "relative", boxShadow: "0 0 60px rgba(124,58,237,0.45)" },
  ring1: { position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "1.5px solid rgba(167,139,250,0.25)", animation: "spin 12s linear infinite" },
  ring2: { position: "absolute", width: 320, height: 320, borderRadius: "50%", border: "1px dashed rgba(96,165,250,0.18)", animation: "spin 20s linear infinite reverse" },

  // Sections
  section: { padding: "100px 6%", background: "#08080e" },
  inner: { maxWidth: 1100, margin: "0 auto" },
  secHeader: { textAlign: "center", marginBottom: 60 },
  secTag: { color: "#a78bfa", fontWeight: 600, fontSize: 12.5, letterSpacing: 3.5, textTransform: "uppercase" },
  secTitle: { fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 900, letterSpacing: -1.5, marginTop: 10, color: "#fff" },
  grad: { background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },

  skillGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18 },
  skillCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "26px 22px", transition: "transform 0.2s, border-color 0.2s" },
  skillCat: { color: "#a78bfa", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: { background: "rgba(167,139,250,0.1)", color: "#c4b5fd", borderRadius: 7, padding: "5px 11px", fontSize: 12.5, fontWeight: 500 },

  projGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 26 },
  projCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 30, position: "relative", overflow: "hidden", transition: "transform 0.25s, box-shadow 0.25s" },
  projIcon: { width: 50, height: 50, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 },
  projTitle: { fontSize: 19, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: -0.5 },
  projDesc: { color: "#94a3b8", fontSize: 14, lineHeight: 1.65, marginBottom: 18 },
  techRow: { display: "flex", flexWrap: "wrap", gap: 7 },
  techBadge: { border: "1px solid", borderRadius: 6, padding: "4px 9px", fontSize: 11.5, fontWeight: 600 },
  projAccent: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, borderRadius: "0 0 20px 20px" },

  resumeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 },
  resumeGroup: { color: "#fff", fontSize: 17, fontWeight: 800, marginBottom: 22, letterSpacing: -0.3 },
  tlItem: { display: "flex", gap: 14, marginBottom: 26 },
  tlDot: { width: 12, height: 12, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #60a5fa)", marginTop: 4, flexShrink: 0 },
  tlDegree: { color: "#fff", fontWeight: 700, fontSize: 14.5, marginBottom: 4 },
  tlInst: { color: "#94a3b8", fontSize: 13, marginBottom: 7 },
  tlBadge: { background: "rgba(167,139,250,0.15)", color: "#c4b5fd", borderRadius: 6, padding: "3px 10px", fontSize: 11.5, fontWeight: 600 },
  certCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 13, padding: 22 },
  certTitle: { color: "#fff", fontWeight: 700, fontSize: 14.5, marginBottom: 5 },
  certOrg: { color: "#a78bfa", fontSize: 12.5, fontWeight: 600, marginBottom: 4 },
  certId: { color: "#444", fontSize: 11.5, fontFamily: "monospace", marginBottom: 9 },
  certDesc: { color: "#94a3b8", fontSize: 13, lineHeight: 1.6 },
  contactInfo: { display: "flex", flexDirection: "column", gap: 9, color: "#94a3b8", fontSize: 14.5 },

  contactGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "start" },
  contactText: { color: "#94a3b8", fontSize: 16, lineHeight: 1.75, marginBottom: 30 },
  contactLinks: { display: "flex", flexDirection: "column", gap: 13 },
  contactLink: { color: "#c4b5fd", textDecoration: "none", fontSize: 15, fontWeight: 500, transition: "color 0.2s" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", color: "#e8e8f0", fontSize: 14.5, outline: "none", fontFamily: "'Sora', sans-serif", transition: "border-color 0.2s" },
  successMsg: { background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.3)", color: "#06d6a0", borderRadius: 10, padding: "13px 16px", fontSize: 14, fontWeight: 500 },

  btnPrimary: { padding: "13px 30px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", borderRadius: 11, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "inline-block", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 22px rgba(124,58,237,0.35)", fontFamily: "'Sora', sans-serif" },
  btnOutline: { padding: "13px 30px", background: "transparent", color: "#e8e8f0", borderRadius: 11, fontWeight: 700, fontSize: 15, border: "1.5px solid rgba(255,255,255,0.18)", cursor: "pointer", display: "inline-block", transition: "transform 0.2s, border-color 0.2s", fontFamily: "'Sora', sans-serif" },

  footer: { textAlign: "center", padding: "48px 5% 36px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  footerNav: { display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" },
  footerLink: { background: "none", border: "none", cursor: "pointer", color: "#444", fontSize: 14, fontFamily: "'Sora', sans-serif", padding: "6px 14px", borderRadius: 8, transition: "color 0.2s, background 0.2s" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: 80px; }
  body { background: #08080e; }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .fade-in { animation: fadeUp 0.85s ease forwards; }

  /* Desktop / Mobile visibility */
  .nav-desktop { display: flex; }
  .nav-mobile  { display: none; }
  @media (max-width: 768px) {
    .nav-desktop { display: none !important; }
    .nav-mobile  { display: flex !important; }
  }

  /* Hover effects */
  .nav-cta:hover   { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,58,237,0.5) !important; }
  .btn-hover:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(124,58,237,0.45) !important; }
  .card-hover:hover { transform: translateY(-4px) !important; border-color: rgba(167,139,250,0.3) !important; }
  .proj-hover:hover { transform: translateY(-6px) !important; box-shadow: 0 22px 60px rgba(0,0,0,0.45) !important; }
  .input-focus:focus { border-color: rgba(167,139,250,0.55) !important; }
  .footer-link:hover { color: #a78bfa !important; background: rgba(167,139,250,0.07) !important; }
  a[href]:hover { opacity: 0.85; }
`;
