import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';

/**
 * Captures the cover element and returns it as a jsPDF object
 */
export const generateCoverPDF = async (element: HTMLElement): Promise<ArrayBuffer> => {
  // High scale for crisp text
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  
  // A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  return pdf.output('arraybuffer');
};

/**
 * Merges the generated cover PDF with an uploaded PDF
 */
export const mergePdf = async (coverBuffer: ArrayBuffer, existingPdfFile: File): Promise<Uint8Array> => {
  const existingPdfBytes = await existingPdfFile.arrayBuffer();

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const coverDoc = await PDFDocument.load(coverBuffer);

  // Copy the cover page
  const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);

  // Insert cover at index 0
  pdfDoc.insertPage(0, coverPage);

  return pdfDoc.save();
};

export const downloadBlob = (data: Uint8Array | Blob, filename: string) => {
  const blob = data instanceof Uint8Array ? new Blob([data], { type: 'application/pdf' }) : data;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
