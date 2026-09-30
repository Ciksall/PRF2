import React from 'react';

interface MediaPrimaLogoProps {
  className?: string;
  onWhiteBackground?: boolean;
}

export const MediaPrimaLogo: React.FC<MediaPrimaLogoProps> = ({
  className = '',
  onWhiteBackground = true,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        onWhiteBackground ? 'bg-white px-3 py-2 rounded-lg shadow-xs border border-slate-200/80' : ''
      } ${className}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, Arial, sans-serif",
      }}
    >
      {/* Exact 1:1 Solid Red Square with sharp 90-degree corners */}
      <div
        className="w-8 h-8 shrink-0 flex items-center justify-center font-extrabold text-[12.5px] leading-none tracking-tight"
        style={{
          backgroundColor: '#ED1C24',
          color: '#FFFFFF',
          borderRadius: '0px', // Strict sharp square corners
          aspectRatio: '1 / 1',
        }}
      >
        <span className="translate-y-[0.5px]">media</span>
      </div>

      {/* "prima" text in exact bold black lowercase */}
      <span
        className="font-black text-[18px] leading-none tracking-tight"
        style={{
          color: '#000000',
          fontWeight: 900,
        }}
      >
        prima
      </span>
    </div>
  );
};
