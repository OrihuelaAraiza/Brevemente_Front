import { useMemo, useState } from "react";
import Card, { CardHeader, CardBody } from "../UI/Card";
import EmptyState from "../UI/EmptyState";
import { Activity } from "lucide-react";
import { ESAS_KEYS } from "../../services/symptomAssessmentsService";
import { formatDateISOToHuman } from "../../utils/formatters";

/**
 * Gráfica de evolución de síntomas ESAS en el tiempo.
 * SVG puro, sin dependencias nuevas. Estilo doodle: ejes con sombra offset,
 * líneas gruesas con borde negro, leyenda interactiva (toggle por síntoma).
 *
 * Props:
 *   assessments: Array<SymptomAssessment> ordenado por assessedAt asc.
 */
export default function EsasTrendChart({ assessments = [] }) {
  const [active, setActive] = useState(() => new Set(["pain", "tiredness", "anxiety"]));

  const points = useMemo(() => {
    if (assessments.length === 0) return [];
    return assessments.map((a) => ({
      date: new Date(a.assessedAt),
      values: {
        pain: a.pain,
        tiredness: a.tiredness,
        nausea: a.nausea,
        depression: a.depression,
        anxiety: a.anxiety,
        drowsiness: a.drowsiness,
        appetite: a.appetite,
        wellbeing: a.wellbeing,
        dyspnea: a.dyspnea,
        insomnia: a.insomnia,
      },
    }));
  }, [assessments]);

  if (assessments.length === 0) {
    return (
      <Card hoverable={false}>
        <CardHeader>
          <h3>Evolución de síntomas (ESAS)</h3>
        </CardHeader>
        <CardBody>
          <EmptyState
            icon={Activity}
            title="Aún no hay mediciones registradas"
            message="Registra mediciones puntuales desde el botón superior para ver la curva de evolución de los síntomas en el tiempo."
          />
        </CardBody>
      </Card>
    );
  }

  // Dimensiones del SVG
  const W = 760;
  const H = 320;
  const PAD = { top: 24, right: 24, bottom: 56, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const n = points.length;
  // X: timestamp lineal. Si solo hay 1 punto, lo centramos.
  const t0 = points[0].date.getTime();
  const t1 = points[n - 1].date.getTime();
  const xRange = t1 - t0 || 1;
  const xFor = (date) => PAD.left + ((date.getTime() - t0) / xRange) * innerW;
  // Y: 0 arriba (max síntoma), 10 abajo (sin síntoma) — invertido para que
  //    "más alto = peor" sea visualmente arriba.
  const yFor = (v) => PAD.top + (v / 10) * innerH;

  const toggle = (k) =>
    setActive((s) => {
      const next = new Set(s);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <Card hoverable={false}>
      <CardHeader>
        <div className="cluster" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="stack-1">
            <h3>Evolución de síntomas (ESAS)</h3>
            <p className="helper-text small">
              {n} medición{n === 1 ? "" : "es"} · Escala 0 (ausente) → 10 (máximo)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="esas-chart">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height="auto"
            className="esas-chart__svg"
            role="img"
            aria-label="Gráfica de evolución de síntomas ESAS"
          >
            {/* Ejes y grilla */}
            <g className="esas-chart__grid" stroke="var(--doodle-ink)" strokeOpacity="0.15" strokeWidth="1">
              {[0, 2, 4, 6, 8, 10].map((v) => (
                <g key={v}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={yFor(v)}
                    y2={yFor(v)}
                  />
                  <text
                    x={PAD.left - 8}
                    y={yFor(v) + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="var(--doodle-muted)"
                  >
                    {v}
                  </text>
                </g>
              ))}
            </g>

            {/* Eje X — ticks por punto */}
            {points.map((p, i) => (
              <g key={i}>
                <line
                  x1={xFor(p.date)}
                  x2={xFor(p.date)}
                  y1={H - PAD.bottom}
                  y2={H - PAD.bottom + 4}
                  stroke="var(--doodle-ink)"
                  strokeOpacity="0.4"
                />
                <text
                  x={xFor(p.date)}
                  y={H - PAD.bottom + 22}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--doodle-muted)"
                >
                  {p.date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                </text>
              </g>
            ))}

            {/* Marco del área */}
            <rect
              x={PAD.left}
              y={PAD.top}
              width={innerW}
              height={innerH}
              fill="none"
              stroke="var(--doodle-ink)"
              strokeWidth="2"
              rx="14"
            />

            {/* Líneas por síntoma activo */}
            {ESAS_KEYS.filter((k) => active.has(k.key)).map(({ key, label, color }) => {
              const segments = points
                .map((p) => ({
                  x: xFor(p.date),
                  y: p.values[key] === null || p.values[key] === undefined ? null : yFor(p.values[key]),
                  raw: p.values[key],
                  date: p.date,
                }))
                .filter((s) => s.y !== null);
              if (segments.length === 0) return null;
              const d = segments
                .map((s, idx) => `${idx === 0 ? "M" : "L"} ${s.x} ${s.y}`)
                .join(" ");
              return (
                <g key={key}>
                  <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {segments.map((s, idx) => (
                    <g key={idx}>
                      <circle cx={s.x} cy={s.y} r="6" fill={color} stroke="var(--doodle-ink)" strokeWidth="1.5" />
                      <title>{`${label}: ${s.raw} — ${formatDateISOToHuman(s.date.toISOString())}`}</title>
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>

          <ul className="esas-chart__legend">
            {ESAS_KEYS.map(({ key, label, color }) => {
              const isOn = active.has(key);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className={`esas-chart__legend-btn${isOn ? " is-on" : ""}`}
                    aria-pressed={isOn}
                  >
                    <span className="esas-chart__legend-swatch" style={{ background: color }} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
