import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function fechaHoy() {
  return new Date().toLocaleDateString("es-CO");
}

/* ================= PDF ================= */
export function descargarPDF({ titulo, resumen = [], columnas, filas, archivo }) {
  const doc = new jsPDF();

  // Franja azul de arriba
  doc.setFillColor(18, 51, 124);
  doc.rect(0, 0, 210, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("RenovaVida", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generado: ${fechaHoy()}`, 196, 15, { align: "right" });

  // Título
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(titulo, 14, 36);

  // Resumen (pares: ["Etiqueta", "Valor"])
  doc.setFontSize(10);
  let y = 46;
  resumen.forEach(([etiqueta, valor]) => {
    doc.text(`${etiqueta}: ${valor}`, 14, y);
    y += 6;
  });

  // Tabla
  autoTable(doc, {
    startY: y + 4,
    head: [columnas],
    body: filas,
    headStyles: { fillColor: [18, 51, 124] },
    styles: { fontSize: 9 },
  });

  doc.save(`${archivo}.pdf`);
}

/* ================= Excel (archivo CSV que Excel abre) ================= */
export function descargarCSV({ columnas, filas, archivo }) {
  const escapar = (valor) => `"${String(valor).replace(/"/g, '""')}"`;

  const lineas = [columnas, ...filas].map((fila) =>
    fila.map(escapar).join(";")
  );

  // El \uFEFF hace que Excel muestre bien las tildes y la ñ
  const contenido = "\uFEFF" + lineas.join("\r\n");
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `${archivo}.csv`;
  enlace.click();

  URL.revokeObjectURL(url);
}