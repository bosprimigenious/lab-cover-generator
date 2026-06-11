import React from 'react';

interface SmartUnderlineProps {
  label?: string;
  value: string;
  minWidth?: string; // CSS value, e.g., '200px'
  align?: 'left' | 'center' | 'right';
  className?: string;
  labelWidth?: string; // Fixed width for the label to ensure column alignment
  fontSize?: string; // Specific font size override
}

/**
 * A component that replicates the "Form Line" look.
 * It features a label (optional) and a bottom-bordered area that expands 
 * to fit content but maintains a minimum width.
 */
export const SmartUnderline: React.FC<SmartUnderlineProps> = ({
  label,
  value,
  minWidth = '150px',
  align = 'center',
  className = '',
  labelWidth = 'auto',
  fontSize = 'text-[14pt]', // Default No. 4 size
}) => {
  const textAlign = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`flex items-baseline gap-2 ${className} ${fontSize} ${align === 'left' ? 'w-full' : ''}`}>
      {label && (
        <span 
          className="font-serif leading-normal whitespace-nowrap font-bold flex-shrink-0"
          style={{ width: labelWidth }}
        >
          {label}
        </span>
      )}
      <div 
        className={`border-b-[1.5px] border-black px-2 pb-2 leading-normal whitespace-pre-wrap ${textAlign} ${align === 'left' ? 'flex-1' : ''}`}
        style={{ 
          minWidth: minWidth,
        }}
      >
        <span className="font-serif font-bold">{value || '\u00A0'}</span>
      </div>
    </div>
  );
};