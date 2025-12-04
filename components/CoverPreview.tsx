import React, { forwardRef } from 'react';
import { CoverData, SmartLineConfig } from '../types';
import { SmartUnderline } from './SmartUnderline';

interface CoverPreviewProps {
  data: CoverData;
  config: SmartLineConfig;
}

// ForwardRef allows the parent to capture this DOM element for html2canvas
export const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(({ data, config }, ref) => {
  
  // Default placeholder if no image uploaded
  const DefaultHeader = () => (
    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 font-sans text-sm">
      University Header Image (Upload in Sidebar)
    </div>
  );

  const DefaultLogo = () => (
    <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-sans text-xs text-center p-2">
      Logo (Upload)
    </div>
  );

  return (
    <div className="flex justify-center my-8 print:my-0">
      {/* 
        A4 Container 
        Width: 210mm
        Height: 297mm
        Padding: Standard academic margins (approx 2.54cm = 1 inch)
        Background: White
        Font: Serif (Times/SimSun)
        Text: Black (Enforced)
      */}
      <div 
        ref={ref}
        className="bg-white text-black shadow-2xl print:shadow-none w-[210mm] h-[297mm] p-[25mm] flex flex-col items-center relative box-border"
        style={{ fontFamily: '"Times New Roman", "SimSun", "Noto Serif SC", serif' }}
      >
        {/* 1. Top Header Image (University Name) */}
        <div className="w-[80%] h-[80px] mb-10 flex justify-center">
          {data.headerImage ? (
            <img src={data.headerImage} alt="Header" className="h-full object-contain" />
          ) : (
            <div className="text-center">
               {/* Visual Placeholder text mimicking the calligraphy if no image */}
               <h1 className="text-[36pt] font-bold tracking-widest">北京邮电大学</h1>
            </div>
          )}
        </div>

        {/* 2. Main Title */}
        <div className="mb-8">
            <h2 className="text-[32pt] font-bold tracking-[0.5em] text-center">实验报告</h2>
        </div>

        {/* 3. Logo */}
        <div className="w-[120px] h-[120px] mb-16">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <DefaultLogo />
          )}
        </div>

        {/* 4. Form Area */}
        <div className="w-full flex flex-col items-center space-y-5">
          
          {/* Main Topic Line */}
          <div className="w-full flex justify-center mb-8">
             <SmartUnderline 
                label="题目：" 
                value={data.title} 
                minWidth="350px" 
                fontSize="text-[18pt]" // Small 2
                labelWidth="auto"
             />
          </div>

          {/* Student Details Block */}
          <div className="flex flex-col space-y-4 items-center">
             
             <SmartUnderline 
               label="班　级" 
               value={data.className} 
               minWidth={config.fieldMinWidth} 
               labelWidth="60px" // Fixed width for alignment
               fontSize="text-[14pt]" // No. 4
             />

            <SmartUnderline 
               label="学　号" 
               value={data.studentId} 
               minWidth={config.fieldMinWidth} 
               labelWidth="60px"
               fontSize="text-[14pt]" 
             />

            <SmartUnderline 
               label="姓　名" 
               value={data.name} 
               minWidth={config.fieldMinWidth} 
               labelWidth="60px"
               fontSize="text-[14pt]" 
             />

            {/* Department is often longer, might need custom handling or just same width */}
            <div className="flex items-baseline gap-2 text-[14pt]">
                <span className="font-bold whitespace-nowrap" style={{width: '60px', textAlign: 'justify', textAlignLast: 'justify'}}>
                  学　院
                </span>
                <span className="font-bold">:</span>
                <div 
                    className="border-b-[1.5px] border-black px-2 pb-2 leading-normal text-center whitespace-nowrap"
                    style={{ minWidth: '300px' }}
                >
                    {data.department}
                </div>
            </div>

          </div>
        </div>

        {/* 5. Footer Date */}
        <div className="mt-auto mb-10 text-[14pt] font-bold flex gap-2">
            <span>{data.dateYear || '____'}</span>
            <span>年</span>
            <span>{data.dateMonth || '__'}</span>
            <span>月</span>
            <span>{data.dateDay || '__'}</span>
            <span>日</span>
        </div>

      </div>
    </div>
  );
});

CoverPreview.displayName = 'CoverPreview';