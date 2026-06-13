import { Link, useLocation, useNavigate } from "react-router-dom";

function SectionAnchor({ hash, label }) {
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
  };
  return (
    <a href={`/#${hash}`} onClick={handleClick}>
      {label}
    </a>
  );
}

export default function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bm-footer" role="contentinfo">
      <div className="bm-footer__inner">
        <div className="bm-footer__main">
          <div className="bm-footer__brand">
            <div className="bm-footer__brand-name">BreveMente</div>
            <div className="bm-footer__brand-tag">Plataforma clínica de salud mental</div>
            <p>
              Expediente digital normado, agenda inteligente y Romi Transcript
              como copiloto de IA bajo corpus cerrado. Para psicólogos,
              psicoterapeutas y psiquiatras.
            </p>
          </div>

          <div className="bm-footer__col">
            <h5>Plataforma</h5>
            <ul>
              <li><SectionAnchor hash="filosofia" label="Filosofía" /></li>
              <li><SectionAnchor hash="proceso" label="Proceso" /></li>
              <li><SectionAnchor hash="terapeutas" label="Equipo" /></li>
              <li><SectionAnchor hash="faq" label="Preguntas" /></li>
            </ul>
          </div>

          <div className="bm-footer__col">
            <h5>Acceso</h5>
            <ul>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/register/patient">Solicitar consulta</Link></li>
              <li><Link to="/register">Soy profesional</Link></li>
            </ul>
          </div>

          <div className="bm-footer__col">
            <h5>Legal</h5>
            <ul>
              <li><Link to="/aviso-privacidad">Aviso de privacidad</Link></li>
              <li><Link to="/terminos">Términos</Link></li>
              <li><a href="mailto:contacto@brevemente.ai">contacto@brevemente.ai</a></li>
            </ul>
          </div>
        </div>

        <div className="bm-footer__bottom">
          <p>© {year} BreveMente · Plataforma clínica de salud mental</p>
          <p>Conforme a NOM-004-SSA3-2012 y NOM-024-SSA3-2010.</p>
        </div>
      </div>
    </footer>
  );
}
