import React, { useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CoverPreview } from './components/CoverPreview';
import { CoverData, SmartLineConfig } from './types';
import { generateCoverPDF, mergePdf, downloadBlob } from './services/pdfService';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const coverRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial State based on reference image
  const [data, setData] = useState<CoverData>({
    title: '缓冲区溢出攻击',
    course: '网络安全',
    className: '2024233333',
    studentId: '2022114514',
    name: '井芹 仁菜',
    department: '计算机学院（国家示范性软件学院）',
    dateYear: '2025',
    dateMonth: '12',
    dateDay: '1',
    headerImage: null,
    logoImage: null,
  });

  const [config, setConfig] = useState<SmartLineConfig>({
    titleMinWidth: '350px',
    fieldMinWidth: '200px',
  });

  // Handler: Download PNG
  const handleDownloadImage = async () => {
    if (!coverRef.current) return;
    setIsProcessing(true);
    try {
      const canvas = await html2canvas(coverRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = `Cover_${data.name || 'LabReport'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate image.');
    } finally {
      setIsProcessing(false);
    }
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
      downloadBlob(mergedPdfBytes, `Report_Complete_${data.name || 'Merged'}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to merge PDF. Please ensure your uploaded file is valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
      {/* Sidebar Control Panel */}
      <Sidebar 
        data={data}
        setData={setData}
        config={config}
        setConfig={setConfig}
        onDownloadImage={handleDownloadImage}
        onMergePdf={handleMergePdf}
        isProcessing={isProcessing}
      />

      {/* Preview Area */}
      <main className="flex-grow p-8 overflow-auto flex items-start justify-center">
        <CoverPreview ref={coverRef} data={data} config={config} />
      </main>
    </div>
  );
};

export default App;
