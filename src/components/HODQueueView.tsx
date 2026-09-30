import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { PRFItem } from '../types';
import { DEFAULT_HOD, DEFAULT_MANAGER, SAMPLE_SIGNATURE_HOD } from '../constants/presets';
import { SignaturePad } from './SignaturePad';
import { UserProfile } from '../services/firebase';

interface HODQueueViewProps {
  prfs: PRFItem[];
  onApprove: (prfId: string, hodSignature: string) => void;
  onReject: (prfId: string, remarks: string) => void;
  onViewPrfModal: (prf: PRFItem) => void;
  currentUserProfile?: UserProfile | null;
}

export const HODQueueView: React.FC<HODQueueViewProps> = ({
  prfs,
  onApprove,
  onReject,
  onViewPrfModal,
  currentUserProfile,
}) => {
  const pendingPrfs = prfs.filter((p) => p.status === 'pending_hod');

  const [selectedPrfId, setSelectedPrfId] = useState<string | null>(
    pendingPrfs.length > 0 ? pendingPrfs[0].id : null
  );

  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [rejectingPrfId, setRejectingPrfId] = useState<string | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const selectedPrf = pendingPrfs.find((p) => p.id === selectedPrfId) || pendingPrfs[0];

  const getActiveSignature = (prf: PRFItem) => {
    return signatures[prf.id] || prf.hodSignature || '';
  };

  const handleSignatureChange = (prfId: string, sig: string | undefined) => {
    setSignatures((prev) => ({ ...prev, [prfId]: sig || '' }));
    setApprovalError(null);
  };

  const handleApproveClick = (prf: PRFItem) => {
    const sig = getActiveSignature(prf);
    if (!sig) {
      setApprovalError('HOD signature is required before final authorization.');
      return;
    }
    setApprovalError(null);
    onApprove(prf.id, sig);
  };

  const handleOpenRejectModal = (prfId: string) => {
    setRejectingPrfId(prfId);
    setRejectionRemarks('');
    setRejectionError('');
  };

  const handleConfirmReject = () => {
    if (!rejectionRemarks.trim()) {
      setRejectionError('Rejection remarks are mandatory. Please provide executive feedback.');
      return;
    }
    if (rejectingPrfId) {
      onReject(rejectingPrfId, rejectionRemarks.trim());
      setRejectingPrfId(null);
      setRejectionRemarks('');
      setRejectionError('');
    }
  };

  if (pendingPrfs.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">All HOD Authorizations Clear</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            No payment requisitions currently require Head of Department approval. Verified forms from the Manager queue will arrive here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">Head of Department (HOD) Authorization</h2>
            <span className="bg-sky-100 text-sky-800 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingPrfs.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Approved by:{' '}
            <strong className="text-slate-800">
              {currentUserProfile?.role === 'hod' ? currentUserProfile.displayName : DEFAULT_HOD.name}
            </strong>{' '}
            ({DEFAULT_HOD.title})
          </p>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of pending items (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Awaiting HOD Authorization ({pendingPrfs.length})
          </div>
          {pendingPrfs.map((item) => {
            const isSelected = item.id === (selectedPrf?.id || '');
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedPrfId(item.id);
                  setApprovalError(null);
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-sky-50/40 border-sky-300 ring-1 ring-sky-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{item.refNo}</span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    MYR {item.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-800 truncate">
                  {item.program}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <span>{item.requesterName}</span>
                  <span className="text-emerald-700 font-medium">Mgr Verified ✓</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Review Card (8 cols) */}
        {selectedPrf && (
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedPrf.refNo}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                    Manager Endorsed · Awaiting HOD
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Requisition by {selectedPrf.requesterName} ({selectedPrf.deptSection}) · Total: MYR {selectedPrf.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onViewPrfModal(selectedPrf)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full PRF Preview</span>
              </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Payee & Bank Info
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Account Name:</span>
                  <span className="font-semibold text-slate-900 uppercase">{selectedPrf.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bank:</span>
                    <span className="font-medium text-slate-800">{selectedPrf.bankName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Account No:</span>
                    <span className="font-mono font-medium text-slate-800">{selectedPrf.accountNo}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Training Program
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Program:</span>
                  <span className="font-semibold text-slate-900">{selectedPrf.program}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Venue / Date:</span>
                    <span className="text-slate-700">{selectedPrf.venue}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Amount:</span>
                    <span className="font-mono font-bold text-red-600 text-sm">
                      MYR {selectedPrf.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prior Signatures Audit Strip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  1. Requester Prepared
                </span>
                <div className="text-xs font-medium text-slate-800">{selectedPrf.requesterName}</div>
                {selectedPrf.requesterSignature && (
                  <img
                    src={selectedPrf.requesterSignature}
                    alt="Requester Signature"
                    className="h-8 max-w-[90px] object-contain mt-1"
                  />
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  2. Manager Verified
                </span>
                <div className="text-xs font-medium text-slate-800">{DEFAULT_MANAGER.name}</div>
                {selectedPrf.managerSignature ? (
                  <img
                    src={selectedPrf.managerSignature}
                    alt="Manager Signature"
                    className="h-8 max-w-[90px] object-contain mt-1"
                  />
                ) : (
                  <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
                )}
              </div>
            </div>

            {/* HOD Signature Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Step 2: Attach HOD Authorization Signature
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Signature of Dona Siti Zawina Don Najib (GEN. MANAGER, S.O.D.E, GHR)
                  </p>
                </div>
              </div>

              <SignaturePad
                label="HOD Signature"
                signature={getActiveSignature(selectedPrf)}
                onChange={(sig) => handleSignatureChange(selectedPrf.id, sig)}
                required={true}
                presetSignature={SAMPLE_SIGNATURE_HOD}
                helperText="Draw your signature, upload an image, or click 'Quick Preset' to authorize"
              />

              {approvalError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{approvalError}</span>
                </div>
              )}
            </div>

            {/* Decision Actions */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleOpenRejectModal(selectedPrf.id)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Requisition</span>
              </button>

              <button
                type="button"
                onClick={() => handleApproveClick(selectedPrf)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-[#ED1C24] hover:bg-[#d9161d] rounded-lg shadow-sm transition active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Final Approve & Move to Successful</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Rejection Remarks Modal */}
      {rejectingPrfId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">HOD Rejection Notice</h3>
            </div>
            <p className="text-xs text-slate-500">
              Please enter mandatory remarks explaining the rejection reason. This will be recorded in the audit trail and visible in the Rejected tab.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Remarks / Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectionRemarks}
                onChange={(e) => {
                  setRejectionRemarks(e.target.value);
                  if (rejectionError) setRejectionError('');
                }}
                placeholder="e.g. Requires realignment with FY2026 divisional budget caps..."
                className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  rejectionError ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {rejectionError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{rejectionError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingPrfId(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
