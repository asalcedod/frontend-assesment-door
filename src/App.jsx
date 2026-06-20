import { useState, useRef } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// ── Colores de marca ──────────────────────────────────────────────────────────
const BLUE   = "#0a3a70";
const BLUE_L = "#e8f0fb";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 16px 80px",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 32px rgba(10,58,112,0.10)",
    width: "100%",
    maxWidth: 680,
    overflow: "hidden",
  },
  header: {
    background: BLUE,
    padding: "28px 36px 24px",
    color: "#fff",
  },
  logo: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  body: {
    padding: "36px 36px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: BLUE,
    marginBottom: 2,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#555",
  },
  input: {
    border: "1px solid #d1d9e6",
    borderRadius: 6,
    padding: "9px 12px",
    fontSize: 14,
    color: "#1a1a2e",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  dropzone: (active) => ({
    border: `2px dashed ${active ? BLUE : "#c5cfe0"}`,
    borderRadius: 8,
    padding: "28px 20px",
    textAlign: "center",
    cursor: "pointer",
    background: active ? BLUE_L : "#fafbfd",
    transition: "all 0.15s",
  }),
  dropIcon: {
    fontSize: 32,
    marginBottom: 8,
    display: "block",
  },
  dropText: {
    fontSize: 14,
    color: "#555",
    margin: 0,
  },
  dropSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  fileChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: BLUE_L,
    border: `1px solid ${BLUE}33`,
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 13,
    color: BLUE,
    fontWeight: 500,
    marginTop: 8,
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
    fontSize: 16,
    padding: 0,
    lineHeight: 1,
  },
  divider: {
    borderTop: "1px solid #edf0f7",
    margin: "4px 0",
  },
  btn: (disabled) => ({
    background: disabled ? "#b0bec5" : BLUE,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  }),
  progressWrap: {
    background: "#edf0f7",
    borderRadius: 8,
    height: 8,
    overflow: "hidden",
  },
  progressBar: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: BLUE,
    borderRadius: 8,
    transition: "width 0.4s ease",
  }),
  statusText: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
  },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: "14px 16px",
    color: "#b91c1c",
    fontSize: 13,
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: 8,
    padding: "14px 16px",
    color: "#166534",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
};

// ── Componente campo de formulario ────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, full }) {
  return (
    <div style={full ? { ...styles.fieldWrap, gridColumn: "1/-1" } : styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={e => (e.target.style.borderColor = BLUE)}
        onBlur={e  => (e.target.style.borderColor = "#d1d9e6")}
      />
    </div>
  );
}

// ── App principal ─────────────────────────────────────────────────────────────
export default function App() {
  const fileInputRef = useRef();
  const [dragActive, setDragActive] = useState(false);
  const [excelFile,  setExcelFile]  = useState(null);
  const [status,     setStatus]     = useState("idle"); // idle | loading | done | error
  const [progress,   setProgress]   = useState(0);
  const [statusMsg,  setStatusMsg]  = useState("");
  const [errorMsg,   setErrorMsg]   = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  const [form, setForm] = useState({
    sheetName:          "Door",
    headerRow:          "4",
    projectName:        "",
    generalContractor:  "",
    subcontractor:      "",
    dateOfPrep:         "",
    driveUrl:           "",
  });

  const handleForm = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Drag & drop
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) setExcelFile(f);
  };

  const canGenerate = excelFile && status !== "loading";

  // ── Enviar al backend ──────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!canGenerate) return;
    setStatus("loading");
    setProgress(10);
    setStatusMsg("Subiendo Excel…");
    setErrorMsg("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);

    try {
      const body = new FormData();
      body.append("excel", excelFile);
      Object.entries(form).forEach(([k, v]) => body.append(k, v));

      setProgress(25);
      setStatusMsg("Procesando datos y descargando fotos de Drive…");

      const res = await fetch(`${API_URL}/generate`, { method: "POST", body });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      setProgress(80);
      setStatusMsg("Generando PDFs…");

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
      setStatus("done");
      setStatusMsg("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
      setProgress(0);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <p style={styles.logo}>KAPTIVE C&amp;P</p>
          <h1 style={styles.title}>Door Card Generator</h1>
          <p style={styles.subtitle}>
            Genera tarjetas PDF de registro de puertas desde un Excel
          </p>
        </div>

        <div style={styles.body}>

          {/* ── Excel Upload ── */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>1 · Archivo Excel</p>
            <div
              style={styles.dropzone(dragActive)}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <span style={styles.dropIcon}>📊</span>
              <p style={styles.dropText}>
                {excelFile
                  ? "Cambiar archivo"
                  : "Arrastra el Excel aquí o haz clic para seleccionar"}
              </p>
              <p style={styles.dropSub}>.xlsx · máximo 20 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={e => e.target.files[0] && setExcelFile(e.target.files[0])}
              />
            </div>
            {excelFile && (
              <div style={styles.fileChip}>
                📄 {excelFile.name}
                <button
                  style={styles.removeBtn}
                  onClick={e => { e.stopPropagation(); setExcelFile(null); }}
                >×</button>
              </div>
            )}
          </div>

          <div style={styles.divider} />

          {/* ── Excel Config ── */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>2 · Configuración del Excel</p>
            <div style={styles.row}>
              <Field label="Nombre de la hoja"   name="sheetName"  value={form.sheetName}  onChange={handleForm} placeholder="Door" />
              <Field label="Fila de encabezados (base 0)" name="headerRow" value={form.headerRow} onChange={handleForm} placeholder="4" />
            </div>
          </div>

          <div style={styles.divider} />

          {/* ── Metadata ── */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>3 · Información del proyecto</p>
            <div style={styles.row}>
              <Field label="Nombre del proyecto"  name="projectName"       value={form.projectName}       onChange={handleForm} placeholder="WLA - B13" />
              <Field label="Contratista general"  name="generalContractor" value={form.generalContractor} onChange={handleForm} placeholder="Walton Construction Inc." />
              <Field label="Subcontratista"        name="subcontractor"     value={form.subcontractor}     onChange={handleForm} placeholder="KAPTIVE C&P" />
              <Field label="Fecha de preparación" name="dateOfPrep"        value={form.dateOfPrep}        onChange={handleForm} placeholder="May 16, 2026" />
            </div>
          </div>

          <div style={styles.divider} />

          {/* ── Drive URL ── */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>4 · Fotos (Google Drive)</p>
            <Field
              label="Link de la carpeta pública de Drive"
              name="driveUrl"
              value={form.driveUrl}
              onChange={handleForm}
              placeholder="https://drive.google.com/drive/folders/…"
              full
            />
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
              La carpeta debe ser pública y contener sub-carpetas con el nombre de cada Door ID
              (ej. <code>D0001/</code>, <code>D0002/</code>…). Déjalo vacío si no hay fotos.
            </p>
          </div>

          <div style={styles.divider} />

          {/* ── Progress / Status ── */}
          {status === "loading" && (
            <div>
              <div style={styles.progressWrap}>
                <div style={styles.progressBar(progress)} />
              </div>
              <p style={styles.statusText}>{statusMsg}</p>
            </div>
          )}

          {status === "error" && (
            <div style={styles.errorBox}>
              ⚠️ {errorMsg}
            </div>
          )}

          {status === "done" && (
            <div style={styles.successBox}>
              ✅ <span>PDFs generados correctamente.</span>
            </div>
          )}

          {/* ── Botones ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={styles.btn(!canGenerate)} onClick={handleGenerate} disabled={!canGenerate}>
              {status === "loading"
                ? "⏳ Generando…"
                : "⚡ Generar PDFs"}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="door_cards.zip"
                style={{ ...styles.btn(false), background: "#166534", textDecoration: "none" }}
              >
                ⬇️ Descargar ZIP
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
