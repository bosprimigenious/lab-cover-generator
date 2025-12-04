import React, { forwardRef } from 'react';
import { CoverData, SmartLineConfig } from '../types';
import { SmartUnderline } from './SmartUnderline';

interface CoverPreviewProps {
  data: CoverData;
  config: SmartLineConfig;
}

// ForwardRef allows the parent to capture this DOM element for html2canvas
export const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(({ data, config }, ref) => {
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
          <img src="/assets/bupt-title.png" alt="北京邮电大学" className="h-full object-contain" />
        </div>

        {/* 2. Main Title */}
        <div className="mb-8">
            <h2 className="text-[32pt] font-bold text-center">实验报告</h2>
        </div>

        {/* 3. Logo */}
        <div className="w-[120px] h-[120px] mb-16">
          <img src="/assets/bupt-logo.png" alt="Logo" className="w-full h-full object-contain" />
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
               label="班　　级：" 
               value={data.className} 
               minWidth={config.fieldMinWidth} 
               labelWidth="80px"
               fontSize="text-[14pt]"
             />

            <SmartUnderline 
               label="学　　号：" 
               value={data.studentId} 
               minWidth={config.fieldMinWidth} 
               labelWidth="80px"
               fontSize="text-[14pt]" 
             />

            <SmartUnderline 
               label="姓　　名：" 
               value={data.name} 
               minWidth={config.fieldMinWidth} 
               labelWidth="80px"
               fontSize="text-[14pt]" 
             />

            <SmartUnderline 
               label="学　　院：" 
               value={data.department} 
               minWidth="300px"
               labelWidth="80px"
               fontSize="text-[14pt]" 
             />

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