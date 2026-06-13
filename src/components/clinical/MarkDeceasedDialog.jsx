import { useState } from "react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import InputField from "../InputField";
import { useToast } from "../UI/Toast";
import { markPatientDeceased } from "../../services/patientsService";

/**
 * Diálogo sobrio para marcar a un paciente como fallecido.
 * Específico del vertical paliativos. Tono respetuoso, sin colores de alerta
 * agresivos ni iconografía celebratoria. Doble confirmación.
 *
 * Props:
 *   open, onClose, patient, onSuccess
 */
export default function MarkDeceasedDialog({ open, onClose, patient, onSuccess }) {
  const toast = useToast();
  const today = new Date().toISOString().slice(0, 10);
  const [deceasedAt, setDeceasedAt] = useState(today);
  const [notes, setNotes] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "";
  const canSubmit =
    deceasedAt &&
    confirmText.trim().toUpperCase() === "CONFIRMAR" &&
    !submitting;

  const handleClose = () => {
    if (submitting) return;
    setDeceasedAt(today);
    setNotes("");
    setConfirmText("");
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canSubmit || !patient?.id) return;
    setSubmitting(true);
    try {
      await markPatientDeceased(patient.id, { deceasedAt, notes: notes.trim() || undefined });
      toast.success("Registro completado. El expediente se conserva íntegro.");
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.message || "No se pudo completar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Registro de fallecimiento" size="md">
      <form onSubmit={handleSubmit} className="stack-3 mark-deceased">
        <div className="mark-deceased__intro">
          <p>
            Estás por registrar el fallecimiento de <strong>{patientName}</strong>. Este
            registro:
          </p>
          <ul>
            <li>Cambia el estado del paciente a <strong>Fallecido</strong>.</li>
            <li>Mantiene el expediente íntegro y consultable (no se elimina).</li>
            <li>Retira al paciente de las listas activas.</li>
          </ul>
        </div>

        <InputField
          label="Fecha de fallecimiento"
          type="date"
          name="deceasedAt"
          value={deceasedAt}
          onChange={(e) => setDeceasedAt(e.target.value)}
          max={today}
          required
        />

        <div className="historia-form__field">
          <label htmlFor="deceased-notes" className="input-field__label">
            Nota interna (opcional)
          </label>
          <textarea
            id="deceased-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Observaciones del equipo, lugar de fallecimiento, persona que informa…"
            className="input-field__input"
          />
          <p className="helper-text small">
            Se guarda en el registro de auditoría junto con tu usuario.
          </p>
        </div>

        <InputField
          label='Escribe "CONFIRMAR" para continuar'
          name="confirm"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          assistiveText="Doble verificación. No se notifica automáticamente a nadie externo."
          required
        />

        <div className="cluster" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="ghost" type="button" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" loading={submitting} disabled={!canSubmit}>
            Registrar fallecimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
}
