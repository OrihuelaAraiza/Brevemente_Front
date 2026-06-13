/**
 * Brand del repo. Este proyecto es exclusivamente BreveMente (salud mental).
 * Romi Tanatología vive en Romi_Tanato_*. ROMI Clínica vive en Klinia_Platform.
 *
 * Versión 2 de BreveMente — restaura paleta azul neural + logos originales.
 */

export const BRAND = {
  id: "brevemente",
  name: "BreveMente",
  shortName: "BreveMente",
  tagline: "Tu salud mental, en breves momentos",
  domain: "brevemente.ai",
  logo: "/logo-brevemente-horizontal.png",
  favicon: "/favicon.ico",
  theme: "brevemente",
  specialties: ["PSICOLOGO", "PSICOTERAPEUTA", "PSIQUIATRA"],
  historyTypes: ["PSICOLOGICA", "PSIQUIATRICA", "PSICOTERAPEUTICA"],
  modules: {
    symptomTrends: false,
    advanceDirectives: false,
    esasChart: false,
  },
  copy: {
    eyebrow: "BreveMente · Plataforma clínica de salud mental",
    titleLead: "Tu salud mental, en",
    titleAccent: "breves momentos",
    description:
      "Plataforma clínica de salud mental con expediente digital normado, agenda inteligente y herramientas de seguimiento para psicólogos, psicoterapeutas y psiquiatras. Cumple NOM-004 y NOM-024.",
    ctaPrimary: "Ver terapeutas disponibles",
    ctaFinalTitle: "¿Eres profesional de la salud mental?",
    ctaFinalCopy:
      "Únete a BreveMente y gestiona tu práctica clínica con respaldo NOM-004, expediente digital y herramientas de seguimiento de pacientes.",
    ctaFinalBtn: "Registrarme como profesional",
    directoryAnchor: "terapeutas",
  },
};

export function isPalliative() {
  return false;
}

export function brandSupportsModule(name) {
  return Boolean(BRAND.modules?.[name]);
}

export default BRAND;
