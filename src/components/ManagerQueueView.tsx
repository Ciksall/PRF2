import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  Calendar,
  Building,
  CreditCard,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { PRFItem } from '../types';
import { DEFAULT_MANAGER, SAMPLE_SIGNATURE_MANAGER } from '../constants/presets';
import { SignaturePad } from './SignaturePad';
import { UserProfile } from '../services/firebase';

interface ManagerQueueViewProps {
  prfs: PRFItem[];
  onApprove: (prfId: string, managerSignature: string) => void;
  onReject: (prfId: string, remarks: string) => void;
  onViewPrfModal: (prf: PRFItem) => void;
  currentUserProfile?: UserProfile | null;
}

export const ManagerQueueView: React.FC<ManagerQueueViewProps> = ({
  prfs,
  onApprove,
  onReject,
  onViewPrfModal,
  currentUserProfile,
}) => {
  const pendingPrfs = prfs.filter((p) => p.status === 'pending_manager');

  // Currently expanded/selected PRF for action
  const [selectedPrfId, setSelectedPrfId] = useState<string | null>(
    pendingPrfs.length > 0 ? pendingPrfs[0].id : null
  );

  // Local signature drafts map: prfId -> signatureDataUrl
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  
  // Rejection modal state
  const [rejectingPrfId, setRejectingPrfId] = useState<string | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Approval error
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const selectedPrf = pendingPrfs.find((p) => p.id === selectedPrfId) || pendingPrfs[0];

  const getActiveSignature = (prf: PRFItem) => {
    return signatures[prf.id] || prf.managerSignature || '';
  };

  const handleSignatureChange = (prfId: string, sig: string | undefined) => {
    setSignatures((prev) => ({ ...prev, [prfId]: sig || '' }));
    setApprovalError(null);
  };

  const handleApproveClick = (prf: PRFItem) => {
    const sig = getActiveSignature(prf);
    if (!sig) {
      setApprovalError('Manager signature is required before approval.');
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
      setRejectionError('Rejection remarks are mandatory. Please provide justification.');
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
          <h2 className="text-base font-bold text-slate-900">All Manager Approvals Clear</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            There are currently no payment requisition forms waiting for Manager verification. New submissions will appear here automatically.
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
            <UserCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Superior / Manager Verification Queue</h2>
            <span className="bg-amber-100 text-amber-800 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingPrfs.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified by:{' '}
            <strong className="text-slate-800">
              {currentUserProfile?.role === 'superior' || currentUserProfile?.role === 'manager'
                ? currentUserProfile.displayName
                : DEFAULT_MANAGER.name}
            </strong>{' '}
            ({DEFAULT_MANAGER.title})
          </p>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of pending items (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Awaiting Review ({pendingPrfs.length})
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
                    ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300 shadow-2xs'
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
                  <span>{item.submissionDate}</span>
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
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Awaiting Manager
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted by {selectedPrf.requesterName} (ID: {selectedPrf.staffId}) on {selectedPrf.submissionDate}
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
                  Payee Particulars
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
                  Event & Amount
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
                    <span className="text-slate-400 block text-[10px]">Total Amount:</span>
                    <span className="font-mono font-bold text-red-600 text-sm">
                      MYR {selectedPrf.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attached Invoice & Requester Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invoice link */}
              <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {selectedPrf.invoiceFileName || 'Tax_Invoice.pdf'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Inv #{selectedPrf.invoiceNo} · {selectedPrf.invoiceFileSize || '1.1 MB'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Attached
                </span>
              </div>

              {/* Requester Signature check */}
              <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50/50">
                <div>
                  <div className="text-xs font-semibold text-slate-800">Requester Endorsement</div>
                  <div className="text-[10px] text-slate-400">Signed by {selectedPrf.requesterName}</div>
                </div>
                {selectedPrf.requesterSignature ? (
                  <img
                    src={selectedPrf.requesterSignature}
                    alt="Requester"
                    className="h-9 max-w-[100px] object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400">No signature</span>
                )}
              </div>
            </div>

            {/* Manager Signature Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Step 1: Attach Manager Digital Signature
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Signature of Nor Intan Hasalimah Hashim (SM, STRA. WORKFORCE & CAP. DEV)
                  </p>
                </div>
              </div>

              <SignaturePad
                label="Manager Signature"
                signature={getActiveSignature(selectedPrf)}
                onChange={(sig) => handleSignatureChange(selectedPrf.id, sig)}
                required={true}
                presetSignature={SAMPLE_SIGNATURE_MANAGER}
                helperText="Draw your signature, upload an image, or click 'Quick Preset' to endorse"
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
                <span>Approve & Escalate to HOD</span>
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
              <h3 className="text-sm font-bold text-slate-900">Reject Payment Requisition</h3>
            </div>
            <p className="text-xs text-slate-500">
              Please enter mandatory remarks explaining the rejection reason. This will be recorded in the audit trail and displayed to the requester.
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
                placeholder="e.g. Budget allocation exhausted, invoice discrepancy, or requires further executive justification..."
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
