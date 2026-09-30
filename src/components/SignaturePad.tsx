import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Upload, Trash2, Check, RefreshCw } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  signature: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
  required?: boolean;
  disabled?: boolean;
  presetSignature?: string;
  helperText?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  signature,
  onChange,
  required = false,
  disabled = false,
  presetSignature,
  helperText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'upload' | 'preset'>('draw');

  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#0F172A';
      }
    }
  }, [mode, signature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
    onChange(undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = () => {
    if (presetSignature) {
      onChange(presetSignature);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {signature && (
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Signature Attached
          </span>
        )}
      </div>

      {signature ? (
        <div className="relative border border-slate-200 bg-white rounded-lg p-3 flex flex-col items-center justify-center min-h-[110px] group transition hover:border-slate-300">
          <img
            src={signature}
            alt="Attached Signature"
            className="max-h-20 max-w-full object-contain filter drop-shadow-xs"
          />
          {!disabled && (
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-medium rounded flex items-center gap-1 transition"
                title="Remove signature"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg bg-slate-50/70 p-3 space-y-2.5">
          {/* Method selector */}
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-md">
              <button
                type="button"
                onClick={() => setMode('draw')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  mode === 'draw'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3 h-3 inline mr-1" /> Draw
              </button>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  mode === 'upload'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3 h-3 inline mr-1" /> Upload
              </button>
            </div>

            {presetSignature && (
              <button
                type="button"
                onClick={applyPreset}
                className="text-[11px] font-medium text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Quick Preset
              </button>
            )}
          </div>

          {/* Draw mode */}
          {mode === 'draw' && (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={360}
                height={110}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 bg-white border border-dashed border-slate-300 rounded cursor-crosshair touch-none"
              />
              <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-slate-400">
                Sign inside the box
              </div>
              {hasDrawn && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] rounded transition"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Upload mode */}
          {mode === 'upload' && (
            <label className="flex flex-col items-center justify-center h-28 border border-dashed border-slate-300 rounded bg-white hover:bg-slate-50 cursor-pointer p-4 transition text-center">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-700">Click to upload signature</span>
              <span className="text-[10px] text-slate-400">PNG, JPG, or SVG (transparent background recommended)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={disabled}
              />
            </label>
          )}

          {helperText && (
            <p className="text-[11px] text-slate-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};
