import React, { useState } from 'react';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';
import { PRFItem } from '../types';
import { PRFDocumentTemplate } from './PRFDocumentTemplate';
import { downloadPRFAsPDF, triggerPrintPRF } from '../utils/pdfGenerator';

interface PRFPreviewModalProps {
  prf: PRFItem | null;
  onClose: () => void;
}

export const PRFPreviewModal: React.FC<PRFPreviewModalProps> = ({ prf, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  if (!prf) return null;

  const handleDownload = async () => {
    setDownloading(true);
    const success = await downloadPRFAsPDF(`modal-prf-doc-${prf.id}`, prf);
    if (!success) {
      alert('Unable to generate PDF. You can use the Print button to save as PDF.');
    }
    setDownloading(false);
  };

  const handlePrint = () => {
    triggerPrintPRF(`modal-prf-doc-${prf.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900">{prf.refNo}</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-600 font-medium">{prf.program}</span>
            </div>
            <span className="text-[11px] text-slate-400">Document Layout: SAMPLE PRF Royale Chulan_2.docx</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#ED1C24] hover:bg-[#d9161d] rounded-lg shadow-xs transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Paper Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center">
          <div className="w-full max-w-[820px] bg-white shadow-lg">
            <PRFDocumentTemplate
              id={`modal-prf-doc-${prf.id}`}
              prf={prf}
              isPrintMode={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
