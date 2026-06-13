import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import InputField from "../InputField";
import { useToast } from "../UI/Toast";
import { registerDocument } from "../../services/documentsService";

/**
 * Diálogo de voluntades anticipadas firmables. Marca tanatologia.
 *
 * Toma las decisiones capturadas en la sección "voluntades" de la historia
 * paliativa y produce un PDF firmado que se registra como GeneratedDocument
 * tipo DIRECTIVE. Una vez registrado, es inmutable (vive en Blob con sello).
 *
 * Props:
 *   open, onClose, patient, history (la historia paliativa actual), onSuccess
 */
export default function AdvanceDirectiveDialog({ open, onClose, patient, history, onSuccess }) {
  const toast = useToast();
  const sigRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);
  const [signedBy, setSignedBy] = useState("patient");
  const [representativeName, setRepresentativeName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const extras = history?.extraFields || {};
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "—";

  const decisions = {
    documento: extras.volDocumento || "—",
    rcp: extras.volRCP || "—",
    let: extras.volLET || "—",
    representante: extras.volRepresentante || "—",
    lugar: extras.volLugar || "—",
    objetivos: extras.volObjetivos || "—",
    preferencias: extras.volPreferencias || "—",
  };

  const handleClear = () => sigRef.current?.clear();

  const handleClose = () => {
    if (submitting) return;
    sigRef.current?.clear();
    setSignedBy("patient");
    setRepresentativeName("");
    onClose?.();
  };

  const buildPdf = async (signatureDataUrl) => {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 792]); // US letter
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const ink = rgb(0.176, 0.122, 0.208); // plum oscuro
    const muted = rgb(0.42, 0.36, 0.43);

    let y = 750;
    page.drawText("ROMI Tanatología y Cuidados Paliativos", { x: 50, y, size: 11, font: bold, color: ink });
    y -= 14;
    page.drawText("Documento de Voluntad Anticipada", { x: 50, y, size: 18, font: bold, color: ink });
    y -= 20;
    page.drawText(`Fecha: ${today}`, { x: 50, y, size: 10, font, color: muted });
    y -= 28;

    page.drawText("Paciente", { x: 50, y, size: 11, font: bold, color: ink });
    y -= 14;
    page.drawText(patientName, { x: 50, y, size: 11, font, color: ink });
    y -= 12;
    if (patient?.curp) {
      page.drawText(`CURP: ${patient.curp}`, { x: 50, y, size: 10, font, color: muted });
      y -= 12;
    }
    y -= 16;

    const drawRow = (label, value) => {
      page.drawText(label, { x: 50, y, size: 10, font: bold, color: ink });
      // wrap simple
      const lines = String(value || "—").match(/.{1,75}/g) || ["—"];
      let yy = y;
      lines.forEach((ln, i) => {
        page.drawText(ln, { x: 200, y: yy, size: 10, font, color: ink });
        yy -= 12;
      });
      y = yy - 6;
    };

    page.drawText("Decisiones registradas", { x: 50, y, size: 12, font: bold, color: ink });
    y -= 18;
    drawRow("Documento previo", decisions.documento);
    drawRow("Reanimación (RCP)", decisions.rcp);
    drawRow("Limitación esfuerzo", decisions.let);
    drawRow("Representante", decisions.representante);
    drawRow("Lugar de fallecimiento", decisions.lugar);
    drawRow("Objetivos de cuidado", decisions.objetivos);
    drawRow("Preferencias", decisions.preferencias);

    y -= 14;
    page.drawText("Firma", { x: 50, y, size: 12, font: bold, color: ink });
    y -= 16;
    page.drawText(
      `Firmado por: ${signedBy === "patient" ? "Paciente" : `Representante (${representativeName || "—"})`}`,
      { x: 50, y, size: 10, font, color: muted }
    );
    y -= 60;

    // Embed signature PNG
    if (signatureDataUrl) {
      try {
        const png = await pdf.embedPng(signatureDataUrl);
        const dims = png.scale(0.4);
        page.drawImage(png, { x: 50, y: y - dims.height + 40, width: dims.width, height: dims.height });
      } catch {
        /* ignore */
      }
    }
    page.drawLine({ start: { x: 50, y: y + 8 }, end: { x: 260, y: y + 8 }, thickness: 1, color: ink });
    page.drawText("Firma autógrafa", { x: 50, y: y - 6, size: 9, font, color: muted });

    // Footer
    page.drawText(
      "Este documento expresa la voluntad anticipada conforme a la legislación vigente. " +
        "Una vez firmado y archivado es inmutable; cualquier cambio requiere un nuevo documento.",
      { x: 50, y: 60, size: 8, font, color: muted, maxWidth: 512 }
    );
    page.drawText("NOM-004-SSA3-2012 · Normatividad de cuidados paliativos", { x: 50, y: 40, size: 8, font, color: muted });

    return pdf.save();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!patient?.id) return;
    if (sigRef.current?.isEmpty()) {
      toast.error("Captura la firma antes de continuar.");
      return;
    }
    if (signedBy === "representative" && !representativeName.trim()) {
      toast.error("Indica el nombre del representante.");
      return;
    }
    setSubmitting(true);
    try {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      const bytes = await buildPdf(dataUrl);
      const blob = new Blob([bytes], { type: "application/pdf" });
      await registerDocument({
        blob,
        type: "DIRECTIVE",
        patientId: patient.id,
        title: `Voluntad anticipada — ${patientName}`,
      });
      toast.success("Voluntad anticipada firmada y archivada.");
      window.dispatchEvent(new CustomEvent("klinia:document-generated"));
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.message || "No se pudo registrar el documento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Voluntad anticipada — firma" size="md">
      <form onSubmit={handleSubmit} className="stack-3">
        <div className="mark-deceased__intro">
          <p>
            Estás por archivar las decisiones de voluntad anticipada de{" "}
            <strong>{patientName}</strong> como documento firmado, fechado e inmutable.
          </p>
          <ul>
            <li>Las decisiones se toman de la sección <em>Planificación anticipada</em> de la historia paliativa.</li>
            <li>El PDF queda con folio progresivo, sello SHA-256 y firma autógrafa.</li>
            <li>Cualquier modificación posterior requiere un nuevo documento.</li>
          </ul>
        </div>

        <div className="historia-form__field">
          <label className="input-field__label">Resumen de decisiones</label>
          <ul className="stack-1" style={{ fontSize: "0.9rem", listStyle: "disc", paddingLeft: "1.2rem", color: "var(--doodle-ink)" }}>
            <li><strong>RCP:</strong> {decisions.rcp}</li>
            <li><strong>Limitación del esfuerzo terapéutico:</strong> {decisions.let}</li>
            <li><strong>Representante:</strong> {decisions.representante}</li>
            <li><strong>Lugar de fallecimiento:</strong> {decisions.lugar}</li>
          </ul>
        </div>

        <div className="historia-form__field">
          <label className="input-field__label">Firma de</label>
          <select
            value={signedBy}
            onChange={(e) => setSignedBy(e.target.value)}
            className="address-fields__select"
          >
            <option value="patient">El paciente</option>
            <option value="representative">Su representante</option>
          </select>
        </div>

        {signedBy === "representative" ? (
          <InputField
            label="Nombre del representante"
            value={representativeName}
            onChange={(e) => setRepresentativeName(e.target.value)}
            required
          />
        ) : null}

        <div className="historia-form__field">
          <label className="input-field__label">Firma autógrafa</label>
          <div
            style={{
              border: "2px dashed var(--doodle-ink)",
              borderRadius: 12,
              background: "var(--doodle-paper)",
              padding: 4,
            }}
          >
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{ width: 480, height: 140, className: "advance-directive__sig" }}
              penColor="#2d1f35"
            />
          </div>
          <Button variant="ghost" type="button" size="sm" onClick={handleClear}>
            Limpiar firma
          </Button>
        </div>

        <div className="cluster" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="ghost" type="button" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" loading={submitting}>
            Firmar y archivar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
