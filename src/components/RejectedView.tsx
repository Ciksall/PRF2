import React from 'react';
import { XCircle, AlertCircle, Eye, RefreshCw, FileText } from 'lucide-react';
import { PRFItem } from '../types';

interface RejectedViewProps {
  prfs: PRFItem[];
  onViewPrfModal: (prf: PRFItem) => void;
  onCloneAsNew: (prf: PRFItem) => void;
}

export const RejectedView: React.FC<RejectedViewProps> = ({
  prfs,
  onViewPrfModal,
  onCloneAsNew,
}) => {
  const rejectedPrfs = prfs.filter((p) => p.status === 'rejected');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Rejected Forms & Audit Remarks</h2>
            <span className="bg-rose-100 text-rose-800 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
              {rejectedPrfs.length} Forms
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit register of non-approved payment requisitions with compulsory justifications.
          </p>
        </div>
      </div>

      {rejectedPrfs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
          <p className="text-sm font-semibold text-slate-700">No rejected forms found</p>
          <p className="text-xs text-slate-400 mt-1">
            Any payment requisitions rejected by Manager or HOD will be logged here with complete audit trail.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rejectedPrfs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-rose-200/80 shadow-2xs p-5 hover:border-rose-300 transition space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-slate-900">{item.refNo}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                    Rejected by {item.rejectedBy || 'Approver'}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">Date: {item.rejectionDate || item.submissionDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewPrfModal(item)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Form</span>
                  </button>

                  <button
                    onClick={() => onCloneAsNew(item)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
                    title="Clone details to create a revised submission"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Revise & Resubmit</span>
                  </button>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Requester:</span>
                  <span className="font-semibold text-slate-900">{item.requesterName}</span>
                  <div className="text-[11px] text-slate-500">ID: {item.staffId} · {item.deptSection}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Program / Payee:</span>
                  <span className="font-medium text-slate-800 line-clamp-1">{item.program}</span>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{item.accountName}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Amount & Invoice:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    MYR {item.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[11px] font-mono text-slate-500">Inv: {item.invoiceNo}</div>
                </div>
              </div>

              {/* Mandatory Rejection Remarks Box */}
              <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px] mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mandatory Rejection Remarks (Audit Reason):</span>
                </div>
                <p className="text-rose-950 font-medium leading-relaxed pl-5">
                  {item.rejectionRemarks || 'No rejection remarks specified.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
