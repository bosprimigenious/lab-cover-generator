import React, { useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CoverPreview } from './components/CoverPreview';
import { ZoomablePreview } from './components/ZoomablePreview';
import { CoverData, SmartLineConfig, getCoverLabel } from './types';
import { generateCoverPDF, generateCoverPDFViaPrint, mergePdf, downloadBlob } from './services/pdfService';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const coverRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [data, setData] = useState<CoverData>({
    template: 'lab-sheet',
    title: '',
    courseName: '具身智能安全',
    major: '信息安全',
    className: '2025211806',
    labHours: '4学时',
    instructor: '雷敏',
    grade: '',
    course: '',
    members: [
      { studentId: '2025211884', name: '肖又铭', className: '', department: '', major: '' },
      { studentId: '2025211885', name: '李四', className: '', department: '', major: '' },
      { studentId: '2025211886', name: '王五', className: '', department: '', major: '' },
      { studentId: '2025211887', name: '赵六', className: '', department: '', major: '' },
    ],
    dateYear: '2026',
    dateMonth: '5',
    dateDay: '29',
    headerImage: null,
    logoImage: null,
  });

  const [config, setConfig] = useState<SmartLineConfig>({
    titleMinWidth: '350px',
    fieldMinWidth: '250px',
  });

  // Handler: Download PNG
  const handleDownloadImage = async () => {
    if (!coverRef.current) return;
    setIsProcessing(true);
    try {
      const canvas = await html2canvas(coverRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = `Cover_${getCoverLabel(data)}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler: Print PDF (uses browser's native print for accurate rendering)
  const handlePrintPdf = () => {
    if (!coverRef.current) return;
    generateCoverPDFViaPrint(coverRef.current);
  };

  // Handler: Merge PDF
  const handleMergePdf = async (file: File) => {
    if (!coverRef.current) return;
    setIsProcessing(true);
    try {
      // 1. Generate Cover PDF buffer
      const coverBuffer = await generateCoverPDF(coverRef.current);
      
      // 2. Merge with user PDF
      const mergedPdfBytes = await mergePdf(coverBuffer, file);
      
      // 3. Download result
      downloadBlob(mergedPdfBytes, `Report_Complete_${getCoverLabel(data)}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to merge PDF. Please ensure your uploaded file is valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200 overflow-hidden">
      {/* Sidebar Control Panel */}
      <Sidebar 
        data={data}
        setData={setData}
        config={config}
        setConfig={setConfig}
        onDownloadImage={handleDownloadImage}
        onPrintPdf={handlePrintPdf}
        onMergePdf={handleMergePdf}
        isProcessing={isProcessing}
      />

      {/* Preview Area */}
      <main className="flex-1 overflow-hidden relative min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <ZoomablePreview>
            <CoverPreview ref={coverRef} data={data} config={config} />
          </ZoomablePreview>
        </div>
        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 py-2 bg-gray-200 border-t border-gray-300">
          © 2025 Lab Cover Generator | Made with ❤️ by Rikka | <a href="https://github.com/NoNormalCreeper/lab-cover-generator" className="underline" target="_blank" rel="noopener noreferrer">GitHub repository</a>
        </div>
      </main>
    </div>
  );
};

export default App;
