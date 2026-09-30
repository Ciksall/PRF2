import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Printer,
  Eye,
  FileCheck,
  ShieldCheck,
  Building,
  Calendar,
} from 'lucide-react';
import { PRFItem } from '../types';
import { PRFDocumentTemplate } from './PRFDocumentTemplate';
import { downloadPRFAsPDF, triggerPrintPRF } from '../utils/pdfGenerator';

interface SuccessfulViewProps {
  prfs: PRFItem[];
  onViewPrfModal: (prf: PRFItem) => void;
}

export const SuccessfulView: React.FC<SuccessfulViewProps> = ({
  prfs,
  onViewPrfModal,
}) => {
  const successfulPrfs = prfs.filter((p) => p.status === 'successful');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadPdf = async (prf: PRFItem) => {
    setDownloadingId(prf.id);
    const templateElementId = `hidden-template-${prf.id}`;
    const success = await downloadPRFAsPDF(templateElementId, prf);
    if (!success) {
      alert('Unable to generate PDF. Please use the Print button to save as PDF.');
    }
    setDownloadingId(null);
  };

  const handlePrint = (prf: PRFItem) => {
    const templateElementId = `hidden-template-${prf.id}`;
    triggerPrintPRF(templateElementId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Successful PRFs & PDF Export</h2>
            <span className="bg-emerald-100 text-emerald-800 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
              {successfulPrfs.length} Approved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fully authorized payment requisitions ready for immediate PDF download and Finance disbursement.
          </p>
        </div>
      </div>

      {successfulPrfs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
          <p className="text-sm font-semibold text-slate-700">No approved forms found</p>
          <p className="text-xs text-slate-400 mt-1">
            Once a payment requisition is approved by both the Manager and HOD, it will appear here for instant PDF generation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {successfulPrfs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-emerald-200/80 shadow-2xs p-5 hover:border-emerald-300 transition space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-slate-900">{item.refNo}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Authorized & Audited
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">Date: {item.submissionDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewPrfModal(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    title="View Document Layout"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>

                  <button
                    onClick={() => handlePrint(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    title="Print Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(item)}
                    disabled={downloadingId === item.id}
                    className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#ED1C24] hover:bg-[#d9161d] rounded-lg shadow-xs transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === item.id ? 'Generating...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Information Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Requester:</span>
                  <span className="font-semibold text-slate-900">{item.requesterName}</span>
                  <div className="text-[11px] text-slate-500">Staff ID: {item.staffId}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Payee / Account:</span>
                  <span className="font-semibold text-slate-900 uppercase truncate block">{item.accountName}</span>
                  <div className="text-[11px] text-slate-500">{item.bankName}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Training Program:</span>
                  <span className="font-medium text-slate-800 line-clamp-1">{item.program}</span>
                  <div className="text-[11px] text-slate-500">{item.venue}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Requisition:</span>
                  <span className="font-mono font-bold text-red-600 text-sm">
                    MYR {item.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[11px] font-mono text-slate-500">Invoice: {item.invoiceNo}</div>
                </div>
              </div>

              {/* Signatures verification status strip */}
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Requester: Signed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Manager (Nor Intan): Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>HOD (Dona Siti): Approved</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Sample template mirror: SAMPLE PRF Royale Chulan_2.docx
                </span>
              </div>

              {/* Off-screen template used strictly for rendering to high-res PDF & Print */}
              <div
                style={{
                  position: 'fixed',
                  left: '-9999px',
                  top: '0',
                  width: '800px',
                  opacity: 0,
                  pointerEvents: 'none',
                  zIndex: -100,
                }}
                aria-hidden="true"
              >
                <PRFDocumentTemplate
                  id={`hidden-template-${item.id}`}
                  prf={item}
                  isPrintMode={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
