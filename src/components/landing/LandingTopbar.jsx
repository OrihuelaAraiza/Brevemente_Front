import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoHorizontal from "../../assets/brand/logo-brevemente-horizontal.png";

const NAV_LINKS = [
  { hash: "filosofia", label: "Filosofía" },
  { hash: "proceso", label: "Proceso" },
  { hash: "terapeutas", label: "Equipo" },
  { hash: "faq", label: "Preguntas" },
];

function SectionLink({ hash, label, onAfterClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${hash}`);
      }
    } else {
      navigate(`/#${hash}`);
    }
    if (onAfterClick) onAfterClick();
  };

  return (
    <a href={`/#${hash}`} onClick={handleClick}>
      {label}
    </a>
  );
}

export default function LandingTopbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`bm-topbar${scrolled ? " is-scrolled" : ""}${mobileOpen ? " is-open" : ""}`}
      role="banner"
    >
      <div className="bm-topbar__inner">
        <Link to="/" className="bm-topbar__brand" onClick={closeMobile}>
          <img src={logoHorizontal} alt="BreveMente" className="bm-topbar__logo" />
        </Link>

        <nav className="bm-topbar__nav" aria-label="Navegación">
          {NAV_LINKS.map((link) => (
            <SectionLink
              key={link.hash}
              hash={link.hash}
              label={link.label}
              onAfterClick={closeMobile}
            />
          ))}
        </nav>

        <div className="bm-topbar__actions">
          <Link to="/login" className="bm-btn bm-btn--outline" onClick={closeMobile}>
            Iniciar sesión
          </Link>
          <Link to="/register/patient" className="bm-btn bm-btn--primary" onClick={closeMobile}>
            Solicitar consulta
          </Link>
        </div>

        <button
          type="button"
          className="bm-topbar__toggle"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
