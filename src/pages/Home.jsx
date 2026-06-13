import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import storage from "../services/storage";
import { currentRole } from "../services/authService";
import { ROUTES } from "../utils/constants";
import LandingTopbar from "../components/landing/LandingTopbar";
import LandingFooter from "../components/landing/LandingFooter";
import logoVerticalOnBlue from "../assets/brand/logo-brevemente-vertical-on-blue.png";
import "../styles/brevemente-landing.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, id, className }) {
  return (
    <Motion.div
      id={id}
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </Motion.div>
  );
}

const PILLARS = [
  {
    n: "01",
    title: "Expediente clínico normado",
    body: "Historia psicológica, psiquiátrica y psicoterapéutica con campos validados, folio progresivo y sello SHA-256. Cumple NOM-004 desde el primer registro.",
  },
  {
    n: "02",
    title: "Romi Transcript",
    body: "Tu copiloto de IA bajo corpus cerrado. Resúmenes de sesión, notas SOAP y seguimiento de objetivos sin que tus datos salgan de la plataforma.",
  },
  {
    n: "03",
    title: "Seguimiento longitudinal",
    body: "Indicadores de progreso, escalas validadas (PHQ-9, GAD-7, Beck) y línea de tiempo del paciente para decisiones clínicas con respaldo.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Primera consulta",
    body: "Entrevista clínica completa, antecedentes, motivo de consulta y aplicación de escalas iniciales. Plan terapéutico individualizado.",
  },
  {
    n: "02",
    title: "Plan de tratamiento",
    body: "Objetivos terapéuticos medibles, modalidad (TCC, sistémica, psicoanalítica), frecuencia y duración esperada. Documentado y firmable.",
  },
  {
    n: "03",
    title: "Seguimiento sesión a sesión",
    body: "Notas SOAP, evolución de síntomas, tareas asignadas y ajustes al plan. El paciente ve su progreso y el terapeuta el suyo.",
  },
  {
    n: "04",
    title: "Alta y seguimiento posterior",
    body: "Cierre clínico, recomendaciones de mantenimiento y citas de seguimiento. La historia queda íntegra y disponible.",
  },
];

const TEAM = [
  {
    initials: "JV",
    name: "Lic. Julia Vargas",
    role: "Psicóloga clínica",
    bio: "10 años de experiencia. Enfoque cognitivo-conductual. Especialista en ansiedad, depresión y duelo. Atiende en consulta y teleconsulta.",
  },
];

const FAQS = [
  {
    q: "¿BreveMente sustituye al terapeuta o lo apoya?",
    a: "Lo apoya. BreveMente es una plataforma para profesionales de la salud mental: te da expediente digital normado, agenda, notas SOAP y Romi Transcript como copiloto. La relación clínica sigue siendo entre paciente y terapeuta.",
  },
  {
    q: "¿Qué es Romi Transcript?",
    a: "Es nuestro copiloto de IA bajo corpus cerrado: ayuda a generar resúmenes de sesión, sugerir notas SOAP estructuradas y recordar continuidad terapéutica. Los datos del paciente nunca salen de BreveMente.",
  },
  {
    q: "¿Cumple con NOM-004 y NOM-024?",
    a: "Sí. Cada documento clínico se genera con folio progresivo, sello digital SHA-256, registro de autoría y trazabilidad completa. La estructura del expediente sigue los lineamientos NOM-004-SSA3-2012 y NOM-024-SSA3-2010.",
  },
  {
    q: "¿Funciona para consulta presencial y teleconsulta?",
    a: "Sí. La plataforma es agnóstica al canal. Puedes registrar sesiones presenciales y videollamadas con el mismo expediente, agenda y herramientas de seguimiento.",
  },
  {
    q: "¿Quién es dueño de los datos clínicos?",
    a: "El profesional tratante y el paciente. BreveMente actúa como procesador. Cumplimos con la LFPDPPP y ofrecemos exportación íntegra del expediente en cualquier momento.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = storage.getToken();
    const role = currentRole();
    if (token && role) {
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [location.hash]);

  return (
    <div className="home-page bm-home">
      <LandingTopbar />

      <section className="bm-hero">
        <div className="bm-hero__inner">
          <Motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="bm-hero__eyebrow">Salud mental · NOM-004</div>
            <h1 className="bm-hero__title">
              Tu salud mental, en <em>breves momentos</em>.
            </h1>
            <p className="bm-hero__desc">
              Plataforma clínica para psicólogos, psicoterapeutas y psiquiatras.
              Expediente digital normado, agenda, notas SOAP y Romi Transcript
              como tu copiloto de IA bajo corpus cerrado.
            </p>
            <div className="bm-hero__cta">
              <a href="#terapeutas" className="bm-btn bm-btn--primary">
                Conocer al equipo
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link to="/login" className="bm-btn bm-btn--outline">
                Ya tengo cuenta
              </Link>
            </div>
            <div className="bm-hero__meta">
              <span className="bm-hero__meta-item">
                <span className="bm-hero__meta-dot" /> NOM-004
              </span>
              <span className="bm-hero__meta-item">
                <span className="bm-hero__meta-dot" /> Romi Transcript
              </span>
              <span className="bm-hero__meta-item">
                <span className="bm-hero__meta-dot" /> Sello SHA-256
              </span>
            </div>
          </Motion.div>

          <div className="bm-hero__visual">
            <Motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bm-hero__logo-card"
            >
              <img
                src={logoVerticalOnBlue}
                alt="BreveMente"
                className="bm-hero__logo-img"
              />
            </Motion.div>
          </div>
        </div>
      </section>

      <section id="filosofia" className="bm-section bm-section--soft">
        <div className="bm-section__inner">
          <Reveal className="bm-section__header">
            <span className="bm-section__eyebrow">Filosofía</span>
            <h2 className="bm-section__title">
              Salud mental con rigor clínico y herramientas modernas.
            </h2>
            <p className="bm-section__lead">
              No reemplazamos al terapeuta — lo equipamos. Expediente normado,
              copiloto de IA y seguimiento longitudinal en una sola plataforma.
            </p>
          </Reveal>

          <Reveal>
            <div className="bm-pillars">
              {PILLARS.map((p) => (
                <article key={p.n} className="bm-pillar">
                  <div className="bm-pillar__num">{p.n}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="proceso" className="bm-section">
        <div className="bm-section__inner">
          <Reveal className="bm-section__header">
            <span className="bm-section__eyebrow">Cómo trabajamos</span>
            <h2 className="bm-section__title">
              Un proceso clínico documentado y trazable.
            </h2>
            <p className="bm-section__lead">
              Cuatro fases adaptables a cada paciente. Documentación en cada paso.
            </p>
          </Reveal>

          <Reveal>
            <div className="bm-approach">
              <div className="bm-approach__steps">
                {STEPS.map((s) => (
                  <div key={s.n} className="bm-step">
                    <div className="bm-step__num">{s.n}</div>
                    <div className="bm-step__body">
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="terapeutas" className="bm-section bm-section--soft">
        <div className="bm-section__inner">
          <Reveal className="bm-section__header">
            <span className="bm-section__eyebrow">Equipo clínico</span>
            <h2 className="bm-section__title">Quien te va a acompañar.</h2>
            <p className="bm-section__lead">
              Profesionales certificados en salud mental. Atención presencial y
              teleconsulta con la misma calidad clínica.
            </p>
          </Reveal>

          <Reveal>
            <div className="bm-directory">
              {TEAM.map((m) => (
                <article key={m.name} className="bm-card">
                  <div className="bm-card__avatar">{m.initials}</div>
                  <h4>{m.name}</h4>
                  <div className="bm-card__role">{m.role}</div>
                  <p>{m.bio}</p>
                  <Link to="/register/patient" className="bm-btn bm-btn--outline">
                    Solicitar consulta
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="bm-section">
        <div className="bm-section__inner">
          <Reveal className="bm-section__header">
            <span className="bm-section__eyebrow">Preguntas frecuentes</span>
            <h2 className="bm-section__title">Lo que nos preguntan.</h2>
          </Reveal>

          <Reveal>
            <div className="bm-faq">
              {FAQS.map((f) => (
                <details key={f.q} className="bm-faq__item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bm-cta-final">
        <Reveal className="bm-cta-final__inner">
          <h2>
            Eres profesional de <em>la salud mental</em>.
          </h2>
          <p>
            Únete a BreveMente. Expediente NOM-004, Romi Transcript como
            copiloto de IA y herramientas de seguimiento clínico que respetan
            tu práctica.
          </p>
          <Link to="/register" className="bm-btn bm-btn--outline-light">
            Registrarme como profesional
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      <LandingFooter />
    </div>
  );
}
