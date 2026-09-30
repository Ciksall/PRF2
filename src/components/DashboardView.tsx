import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Coins,
  ArrowRight,
  Eye,
  Download,
  Filter,
} from 'lucide-react';
import { PRFItem, PRFStatus } from '../types';
import { NavTab } from './Sidebar';
import { UserProfile, UserRole } from '../services/firebase';
import { UserCheck, Shield, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  prfs: PRFItem[];
  onNavigateTab: (tab: NavTab) => void;
  onViewPrfModal: (prf: PRFItem) => void;
  onDownloadPdf: (prf: PRFItem) => void;
  searchQuery: string;
  userProfile?: UserProfile | null;
  onUpdateRole?: (role: UserRole) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  prfs,
  onNavigateTab,
  onViewPrfModal,
  onDownloadPdf,
  searchQuery,
  userProfile,
  onUpdateRole,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | PRFStatus>('all');

  const totalCount = prfs.length;
  const pendingManagerCount = prfs.filter((p) => p.status === 'pending_manager').length;
  const pendingHodCount = prfs.filter((p) => p.status === 'pending_hod').length;
  const successfulCount = prfs.filter((p) => p.status === 'successful').length;
  const rejectedCount = prfs.filter((p) => p.status === 'rejected').length;

  const totalAmount = prfs.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const filteredPrfs = prfs.filter((p) => {
    const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesFilter;

    const matchesSearch =
      p.refNo.toLowerCase().includes(query) ||
      p.requesterName.toLowerCase().includes(query) ||
      p.staffId.toLowerCase().includes(query) ||
      p.program.toLowerCase().includes(query) ||
      p.accountName.toLowerCase().includes(query) ||
      p.invoiceNo.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: PRFStatus) => {
    switch (status) {
      case 'pending_manager':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending Manager
          </span>
        );
      case 'pending_hod':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Pending HOD
          </span>
        );
      case 'successful':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Approved (Ready)
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
    }
  };

  const activeRole = userProfile?.role || 'staff';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Role-Based Greeting & Queue Shortcuts */}
      {(activeRole === 'superior' || activeRole === 'manager') && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Akses Superior / Manager Diaktifkan
                </span>
                <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[9px] font-bold">
                  {userProfile?.displayName || 'Superior'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Terdapat <strong>{pendingManagerCount}</strong> borang PRF memerlukan semakan & tandatangan pengesahan anda sebelum disalurkan ke HOD.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('manager')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 transition active:scale-[0.98] shrink-0"
          >
            <span>Buka Giliran Pengesahan Superior</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {activeRole === 'hod' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-white border border-emerald-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Akses Head of Department (HOD) Diaktifkan
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded text-[9px] font-bold">
                  {userProfile?.displayName || 'HOD'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Terdapat <strong>{pendingHodCount}</strong> borang PRF sedia untuk kelulusan eksekutif muktamad sebelum pembayaran dibuat oleh Jabatan Kewangan.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('hod')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 transition active:scale-[0.98] shrink-0"
          >
            <span>Buka Giliran Kelulusan HOD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total PRFs */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total PRFs</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {totalCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">All created forms</div>
        </div>

        {/* Pending Manager */}
        <div
          onClick={() => onNavigateTab('manager')}
          className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Manager Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {pendingManagerCount}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5 flex items-center gap-0.5">
            View queue <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Pending HOD */}
        <div
          onClick={() => onNavigateTab('hod')}
          className="bg-white p-3.5 rounded-xl border border-sky-200/80 shadow-2xs hover:border-sky-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-700">HOD Queue</span>
            <Award className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {pendingHodCount}
          </div>
          <div className="text-[10px] text-sky-600 mt-0.5 flex items-center gap-0.5">
            View queue <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Successful */}
        <div
          onClick={() => onNavigateTab('successful')}
          className="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Successful</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {successfulCount}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5 flex items-center gap-0.5">
            PDF ready <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => onNavigateTab('rejected')}
          className="bg-white p-3.5 rounded-xl border border-rose-200/80 shadow-2xs hover:border-rose-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {rejectedCount}
          </div>
          <div className="text-[10px] text-rose-600 mt-0.5 flex items-center gap-0.5">
            Audit remarks <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Total Volume</span>
            <Coins className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-1 truncate">
            MYR {totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approved & In-flight</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Recent Payment Requisitions</h2>
            <span className="text-xs font-mono text-slate-400">({filteredPrfs.length})</span>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending_manager')}
              className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
                statusFilter === 'pending_manager'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manager ({pendingManagerCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending_hod')}
              className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
                statusFilter === 'pending_hod'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HOD ({pendingHodCount})
            </button>
            <button
              onClick={() => setStatusFilter('successful')}
              className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
                statusFilter === 'successful'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Successful ({successfulCount})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
                statusFilter === 'rejected'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ref No.</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Program & Payee</th>
                <th className="py-3 px-4">Invoice No.</th>
                <th className="py-3 px-4 text-right">Amount (MYR)</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrfs.length > 0 ? (
                filteredPrfs.map((prf) => (
                  <tr key={prf.id} className="hover:bg-slate-50/60 transition group">
                    {/* Ref No */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {prf.refNo}
                    </td>

                    {/* Requester */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{prf.requesterName}</div>
                      <div className="text-[11px] font-mono text-slate-400">ID: {prf.staffId}</div>
                    </td>

                    {/* Program & Payee */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate" title={prf.program}>
                        {prf.program}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={prf.accountName}>
                        {prf.accountName}
                      </div>
                    </td>

                    {/* Invoice No */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {prf.invoiceNo}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {prf.totalAmount.toLocaleString('en-MY', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {prf.submissionDate}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(prf.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewPrfModal(prf)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                          title="View PRF Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {prf.status === 'pending_manager' && (
                          <button
                            onClick={() => onNavigateTab('manager')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded transition"
                          >
                            Review
                          </button>
                        )}

                        {prf.status === 'pending_hod' && (
                          <button
                            onClick={() => onNavigateTab('hod')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded transition"
                          >
                            Authorize
                          </button>
                        )}

                        {prf.status === 'successful' && (
                          <button
                            onClick={() => onDownloadPdf(prf)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded flex items-center gap-1 transition"
                            title="Download PDF"
                          >
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        )}

                        {prf.status === 'rejected' && (
                          <button
                            onClick={() => onNavigateTab('rejected')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded transition"
                          >
                            Remarks
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No payment requisitions found matching current criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
