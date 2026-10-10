// Builds a one-page placeholder PDF in the browser, so Download saves a real file until the documents API serves them.

const escapeText = (text: string) => text.replace(/[\\()]/g, (char) => `\\${char}`).replace(/[^\x20-\x7e]/g, '-');

function buildPdf(lines: string[]) {
  const content = ['BT', '/F1 14 Tf', '72 760 Td', '20 TL', ...lines.map((line) => `(${escapeText(line)}) '`), 'ET'].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

export function downloadPdf(fileName: string, lines: string[]) {
  const url = URL.createObjectURL(new Blob([buildPdf(lines)], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName.replace(/[^\w\s-]/g, '').trim()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
