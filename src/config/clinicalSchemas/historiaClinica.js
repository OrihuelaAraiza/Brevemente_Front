/**
 * Schemas de Historia Clínica por especialidad — alineados con NOM-004-SSA3-2012
 * y NOM-024-SSA3-2012.
 *
 * Cada schema define secciones con campos. Los campos comparten una estructura:
 *   { key, label, type: "text"|"textarea"|"date"|"number"|"select", options?,
 *     placeholder?, hint?, cols? (1 o 2) }
 *
 * Las claves se persisten en `extraFields` (Json) del modelo History; las que
 * coincidan con columnas reales del schema Prisma (motive, mentalStatusExam,
 * goals, therapeuticPlan…) se promueven a columnas para compatibilidad con
 * los buscadores y dashboards existentes.
 */

export const HISTORY_LEGAL_NOTICE =
  "El registro y resguardo de esta historia clínica cumple con la NOM-004-SSA3-2012 (expediente clínico) y la NOM-024-SSA3-2012 (sistemas de información de registro electrónico). El profesional firmante es responsable del contenido.";

// =====================================================================
//   HISTORIA CLÍNICA PALIATIVA (Cuidados Paliativos / Tanatología)
//   Valoración integral: física, psicológica, social y espiritual.
//   Conforme a NOM-004-SSA3-2012 y normatividad de cuidados paliativos.
// =====================================================================
export const HISTORIA_PALIATIVA = {
  type: "PALIATIVA",
  title: "Historia clínica de cuidados paliativos",
  subtitle:
    "Valoración integral al final de la vida: física, psicológica, social y espiritual. Conforme a NOM-004-SSA3-2012.",
  sections: [
    {
      id: "identificacion",
      title: "Ficha de identificación y cuidador primario",
      hint: "Datos del paciente y del cuidador principal que acompaña el proceso.",
      fields: [
        { key: "cuidadorNombre", label: "Cuidador primario", type: "text" },
        { key: "cuidadorParentesco", label: "Parentesco", type: "text" },
        { key: "cuidadorTelefono", label: "Teléfono del cuidador", type: "text" },
        { key: "referidoPor", label: "Referido por", type: "text" },
        { key: "nivelAtencion", label: "Nivel de atención", type: "select", options: [
          { value: "", label: "—" },
          { value: "HOSPITALARIO", label: "Hospitalario" },
          { value: "DOMICILIARIO", label: "Domiciliario" },
          { value: "CONSULTA", label: "Consulta externa" },
          { value: "HOSPICE", label: "Hospice / unidad paliativa" },
        ]},
        { key: "fechaValoracion", label: "Fecha de valoración", type: "date" },
      ],
    },
    {
      id: "diagnostico",
      title: "Diagnóstico y situación clínica",
      hint: "Diagnóstico principal, comorbilidades y tratamientos previos. Pronóstico estimado.",
      fields: [
        { key: "dxPrincipal", label: "Diagnóstico principal y estadio", type: "textarea", cols: 2, required: true },
        { key: "comorbilidades", label: "Comorbilidades", type: "textarea" },
        { key: "tratamientosPrevios", label: "Tratamientos curativos previos", type: "textarea" },
        {
          key: "pronosticoVital",
          label: "Pronóstico vital estimado",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "DIAS", label: "Días" },
            { value: "SEMANAS", label: "Semanas" },
            { value: "MESES", label: "Pocos meses" },
            { value: "MAS_DE_6_MESES", label: "Más de 6 meses" },
            { value: "INDETERMINADO", label: "Indeterminado" },
          ],
        },
        {
          key: "situacion",
          label: "Situación clínica",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "AVANZADA", label: "Enfermedad avanzada" },
            { value: "TERMINAL", label: "Enfermedad terminal" },
            { value: "CURATIVO_SUSPENDIDO", label: "Tratamiento curativo suspendido" },
            { value: "SOLO_CONFORT", label: "Solo medidas de confort" },
          ],
        },
      ],
    },
    {
      id: "motivo",
      title: "Motivo de ingreso a cuidados paliativos",
      fields: [
        {
          key: "motive",
          label: "Razón de la derivación / valoración",
          type: "textarea",
          required: true,
          cols: 2,
          placeholder: "Control de síntomas, planificación de cuidados, acompañamiento al final de la vida…",
        },
      ],
    },
    {
      id: "funcional",
      title: "Estado funcional",
      hint: "Escalas funcionales que orientan pronóstico y necesidades de apoyo.",
      fields: [
        {
          key: "ecog",
          label: "ECOG",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "0", label: "0 — Asintomático" },
            { value: "1", label: "1 — Síntomas leves, ambulatorio" },
            { value: "2", label: "2 — En cama <50% del día" },
            { value: "3", label: "3 — En cama >50% del día" },
            { value: "4", label: "4 — Encamado totalmente" },
          ],
        },
        {
          key: "karnofsky",
          label: "Karnofsky (%)",
          type: "select",
          options: [
            { value: "", label: "—" },
            ...["100","90","80","70","60","50","40","30","20","10"].map((v) => ({ value: v, label: `${v}%` })),
          ],
        },
        {
          key: "pps",
          label: "PPS (Palliative Performance Scale) %",
          type: "select",
          options: [
            { value: "", label: "—" },
            ...["100","90","80","70","60","50","40","30","20","10"].map((v) => ({ value: v, label: `${v}%` })),
          ],
        },
        { key: "avd", label: "Capacidad para actividades de la vida diaria", type: "textarea", cols: 2 },
      ],
    },
    {
      id: "dolor",
      title: "Evaluación del dolor",
      hint: "Localización, características y manejo analgésico actual (escalera OMS).",
      fields: [
        { key: "dolorLocalizacion", label: "Localización", type: "text" },
        {
          key: "dolorTipo",
          label: "Tipo",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "NOCICEPTIVO_SOMATICO", label: "Nociceptivo somático" },
            { value: "NOCICEPTIVO_VISCERAL", label: "Nociceptivo visceral" },
            { value: "NEUROPATICO", label: "Neuropático" },
            { value: "MIXTO", label: "Mixto" },
          ],
        },
        { key: "dolorCaracter", label: "Características", type: "text", placeholder: "Punzante, quemante, opresivo…" },
        { key: "dolorIrradiacion", label: "Irradiación", type: "text" },
        { key: "dolorFactores", label: "Factores que lo agravan / alivian", type: "text", cols: 2 },
        { key: "dolorPatron", label: "Patrón temporal", type: "text", placeholder: "Continuo / intermitente / irruptivo" },
        { key: "dolorEVA", label: "Intensidad EVA (0–10)", type: "scale", hint: "0 = sin dolor, 10 = dolor máximo" },
        { key: "dolorManejo", label: "Manejo analgésico actual (escalera OMS, opioides, dosis, rescates)", type: "textarea", cols: 2 },
      ],
    },
    {
      id: "esas",
      title: "Evaluación de síntomas — ESAS",
      hint: "Escala de Evaluación de Síntomas de Edmonton. Intensidad 0 = ausente, 10 = máximo.",
      fields: [
        { key: "esasDolor", label: "Dolor", type: "scale", hint: "0–10" },
        { key: "esasCansancio", label: "Cansancio (fatiga)", type: "scale", hint: "0–10" },
        { key: "esasNausea", label: "Náusea", type: "scale", hint: "0–10" },
        { key: "esasDepresion", label: "Depresión (tristeza)", type: "scale", hint: "0–10" },
        { key: "esasAnsiedad", label: "Ansiedad (nerviosismo)", type: "scale", hint: "0–10" },
        { key: "esasSomnolencia", label: "Somnolencia", type: "scale", hint: "0–10" },
        { key: "esasApetito", label: "Apetito (0 = buen apetito)", type: "scale", hint: "0–10" },
        { key: "esasBienestar", label: "Bienestar (0 = mejor bienestar)", type: "scale", hint: "0–10" },
        { key: "esasDisnea", label: "Falta de aire (disnea)", type: "scale", hint: "0–10" },
        { key: "esasSueno", label: "Sueño (dificultad para dormir)", type: "scale", hint: "0–10" },
        { key: "esasOtro", label: "Otro síntoma relevante (especificar e intensidad)", type: "textarea", cols: 2 },
      ],
    },
    {
      id: "otros_sintomas",
      title: "Otros síntomas",
      fields: [
        { key: "sintDigestivos", label: "Digestivos (náusea, vómito, estreñimiento, anorexia, disfagia)", type: "textarea" },
        { key: "sintRespiratorios", label: "Respiratorios (disnea, tos, secreciones)", type: "textarea" },
        { key: "sintNeuropsiquiatricos", label: "Neuropsiquiátricos (delirium, insomnio, confusión)", type: "textarea" },
        { key: "sintPiel", label: "Piel y mucosas (úlceras, mucositis, prurito)", type: "textarea" },
      ],
    },
    {
      id: "psico",
      title: "Esfera psicológica y emocional",
      fields: [
        { key: "psicoEstado", label: "Estado emocional del paciente", type: "textarea", cols: 2 },
        { key: "psicoInformacion", label: "Conocimiento del diagnóstico y pronóstico (nivel de información que desea)", type: "textarea", cols: 2 },
        {
          key: "psicoAspectos",
          label: "Aspectos emocionales predominantes",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "ANSIEDAD", label: "Ansiedad" },
            { value: "TRISTEZA", label: "Tristeza / ánimo bajo" },
            { value: "MIEDO", label: "Miedo" },
            { value: "NEGACION", label: "Negación" },
            { value: "ACEPTACION", label: "Aceptación" },
            { value: "IRA", label: "Ira" },
            { value: "CLAUDICACION", label: "Claudicación emocional" },
          ],
        },
      ],
    },
    {
      id: "social",
      title: "Esfera social y familiar",
      fields: [
        { key: "socialFamilia", label: "Estructura y dinámica familiar", type: "textarea" },
        { key: "socialApoyo", label: "Red de apoyo y recursos", type: "textarea" },
        { key: "socialEconomia", label: "Situación económica / laboral", type: "textarea" },
        { key: "socialVivienda", label: "Condiciones de la vivienda / entorno de cuidado", type: "textarea" },
      ],
    },
    {
      id: "cuidador",
      title: "Sobrecarga del cuidador",
      hint: "El bienestar del cuidador primario forma parte del plan de cuidados.",
      fields: [
        {
          key: "zarit",
          label: "Escala de Zarit (orientativa)",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "SIN_SOBRECARGA", label: "Sin sobrecarga" },
            { value: "LEVE", label: "Sobrecarga leve" },
            { value: "INTENSA", label: "Sobrecarga intensa" },
          ],
        },
        { key: "cuidadorHoras", label: "Horas de cuidado al día", type: "number" },
        { key: "cuidadorNotas", label: "Signos de agotamiento del cuidador y apoyos necesarios", type: "textarea", cols: 2 },
      ],
    },
    {
      id: "espiritual",
      title: "Esfera espiritual y existencial",
      fields: [
        { key: "espCreencias", label: "Creencias, fuentes de sentido y soporte espiritual", type: "textarea", cols: 2 },
        { key: "espNecesidades", label: "Necesidades, temores existenciales y deseos expresados", type: "textarea", cols: 2 },
        {
          key: "espAcompanamiento",
          label: "Acompañamiento espiritual",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "DESEA_APOYO", label: "Desea apoyo espiritual / religioso" },
            { value: "CAPELLANIA", label: "Asistencia de capellanía / guía" },
            { value: "NO_DESEA", label: "No desea acompañamiento espiritual" },
          ],
        },
      ],
    },
    {
      id: "voluntades",
      title: "Planificación anticipada y objetivos de cuidado",
      hint: "Documentar las decisiones de adecuación del esfuerzo terapéutico y voluntad anticipada conforme a legislación vigente.",
      fields: [
        {
          key: "volDocumento",
          label: "Voluntad anticipada / documento de últimas voluntades",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "NO_EXISTE", label: "No documentado" },
            { value: "EN_PROCESO", label: "En proceso de redacción" },
            { value: "FIRMADO", label: "Firmado y vigente" },
          ],
        },
        {
          key: "volRCP",
          label: "Decisiones sobre RCP",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "RCP_COMPLETA", label: "RCP completa" },
            { value: "NO_RCP", label: "Orden de no reanimar (ONR)" },
            { value: "PARCIAL", label: "Medidas parciales" },
          ],
        },
        {
          key: "volLET",
          label: "Limitación del esfuerzo terapéutico",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "NO_ACORDADA", label: "No acordada" },
            { value: "EN_DISCUSION", label: "En discusión" },
            { value: "ACORDADA", label: "Acordada con paciente y familia" },
          ],
        },
        { key: "volRepresentante", label: "Representante / tomador de decisiones designado", type: "text" },
        {
          key: "volLugar",
          label: "Preferencia sobre lugar de fallecimiento",
          type: "select",
          options: [
            { value: "", label: "—" },
            { value: "DOMICILIO", label: "Domicilio" },
            { value: "HOSPITAL", label: "Hospital" },
            { value: "HOSPICE", label: "Hospice / unidad paliativa" },
            { value: "SIN_PREFERENCIA", label: "Sin preferencia expresada" },
          ],
        },
        { key: "volObjetivos", label: "Objetivos de cuidado acordados con paciente y familia", type: "textarea", cols: 2 },
        { key: "volPreferencias", label: "Preferencias del paciente (lugar de atención, deseos al final de la vida)", type: "textarea", cols: 2 },
      ],
    },
    {
      id: "tratamiento",
      title: "Tratamiento y plan farmacológico",
      hint: "Los opioides requieren recetario especial de estupefacientes (ver advertencia en el PDF de receta).",
      fields: [
        { key: "tratOpioides", label: "Analgésicos / opioides (fármaco, dosis, vía, frecuencia)", type: "textarea", cols: 2 },
        { key: "tratCoadyuvantes", label: "Coadyuvantes (anticonvulsivos, corticoides, antidepresivos)", type: "textarea" },
        { key: "tratRescate", label: "Medicación de rescate", type: "textarea" },
        { key: "tratNoFarmacologico", label: "Medidas no farmacológicas", type: "textarea", cols: 2 },
      ],
    },
    {
      id: "plan",
      title: "Plan integral de cuidados",
      fields: [
        { key: "planCorto", label: "Objetivos terapéuticos a corto plazo", type: "textarea", cols: 2 },
        { key: "planSeguimiento", label: "Indicaciones, controles y seguimiento", type: "textarea", cols: 2 },
        { key: "planEducacion", label: "Educación a la familia / cuidador", type: "textarea", cols: 2 },
        { key: "planProximaValoracion", label: "Próxima valoración", type: "date" },
      ],
    },
    {
      id: "agonia",
      title: "Fase de agonía / últimos días (si aplica)",
      hint: "El objetivo es el confort y la dignidad. Revisar medidas que no aporten bienestar y acompañar a la familia.",
      fields: [
        { key: "agoniaSignos", label: "Signos presentes (deterioro funcional, disminución de conciencia, cambios respiratorios, estertores, frialdad…)", type: "textarea", cols: 2 },
        { key: "agoniaPlan", label: "Plan de confort en los últimos días (sedación paliativa si indicada, vía de administración, cuidados de boca, acompañamiento)", type: "textarea", cols: 2 },
      ],
    },
  ],
};


export const HISTORIA_SCHEMAS = {
  PALIATIVA: HISTORIA_PALIATIVA,
};

export function getHistoriaSchema(type) {
  return HISTORIA_SCHEMAS[type] || HISTORIA_PALIATIVA;
}
