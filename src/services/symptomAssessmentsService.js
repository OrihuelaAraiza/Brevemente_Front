import { api } from "./apiClient";

/**
 * Service de mediciones ESAS (Edmonton Symptom Assessment Scale).
 * Marca tanatologia — clinimetría evolutiva paliativos.
 */

export const ESAS_KEYS = [
  { key: "pain", label: "Dolor", color: "#B85986" },
  { key: "tiredness", label: "Cansancio", color: "#6B4E8C" },
  { key: "nausea", label: "Náusea", color: "#9DC4A0" },
  { key: "depression", label: "Depresión", color: "#B19CD9" },
  { key: "anxiety", label: "Ansiedad", color: "#E8B4C4" },
  { key: "drowsiness", label: "Somnolencia", color: "#6B4E8C" },
  { key: "appetite", label: "Apetito", color: "#9DC4A0" },
  { key: "wellbeing", label: "Bienestar", color: "#B85986" },
  { key: "dyspnea", label: "Disnea", color: "#B19CD9" },
  { key: "insomnia", label: "Sueño", color: "#E8B4C4" },
];

/**
 * Crea una medición ESAS puntual.
 * @param {object} payload con { patientId, pain, tiredness, ..., notes? }
 * @returns {Promise<object>} el SymptomAssessment creado
 */
export async function createSymptomAssessment(payload) {
  if (!payload?.patientId) {
    throw new Error("patientId es obligatorio.");
  }
  return api.post("/symptom-assessments", payload);
}

/**
 * Lista cronológica de mediciones ESAS de un paciente.
 * @returns {Promise<Array>}
 */
export async function listSymptomAssessments(patientId) {
  if (!patientId) return [];
  try {
    return await api.get(`/symptom-assessments/patient/${patientId}`);
  } catch (err) {
    if (err.status === 404) return [];
    throw err;
  }
}

/**
 * Toma los valores ESAS del extraFields de una historia y los convierte al
 * payload para registrar una medición. Devuelve null si no hay ningún valor.
 */
export function snapshotFromHistory(extraFields = {}) {
  const map = {
    pain: extraFields.esasDolor,
    tiredness: extraFields.esasCansancio,
    nausea: extraFields.esasNausea,
    depression: extraFields.esasDepresion,
    anxiety: extraFields.esasAnsiedad,
    drowsiness: extraFields.esasSomnolencia,
    appetite: extraFields.esasApetito,
    wellbeing: extraFields.esasBienestar,
    dyspnea: extraFields.esasDisnea,
    insomnia: extraFields.esasSueno,
    painEva: extraFields.dolorEVA,
  };
  const hasAny = Object.values(map).some(
    (v) => v !== null && v !== undefined && v !== ""
  );
  if (!hasAny) return null;
  const cleaned = {};
  for (const [k, v] of Object.entries(map)) {
    if (v !== null && v !== undefined && v !== "") cleaned[k] = Number(v);
  }
  return cleaned;
}

export default {
  ESAS_KEYS,
  createSymptomAssessment,
  listSymptomAssessments,
  snapshotFromHistory,
};
