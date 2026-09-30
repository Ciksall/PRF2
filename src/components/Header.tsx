import React from 'react';
import { PlusCircle, Search, Bell, ShieldCheck } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onNavigateToNewForm: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateToNewForm,
  searchQuery,
  onSearchChange,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'PRF Portal Dashboard', subtitle: 'Overview of all payment requisition workflows' };
      case 'new_form':
        return { title: 'Create New PRF', subtitle: 'Draft and submit payment requisition with digital signatures' };
      case 'manager':
        return { title: 'Manager Approval Queue', subtitle: 'Review and verify subordinate payment requisitions' };
      case 'hod':
        return { title: 'HOD Approval Queue', subtitle: 'Final executive authorization before finance disbursement' };
      case 'rejected':
        return { title: 'Rejected PRFs & Audit Remarks', subtitle: 'Historical audit log of rejected requisition requests' };
      case 'successful':
        return { title: 'Successful PRFs & PDF Export', subtitle: 'Fully approved documents ready for instant PDF download' };
    }
  };

  const { title, subtitle } = getTabTitle(currentTab);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500 font-medium">Finance Dept Routing</span>
        </div>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PRF, Requester, Invoice..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
          />
        </div>

        {/* Create New PRF Button */}
        {currentTab !== 'new_form' && (
          <button
            onClick={onNavigateToNewForm}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ED1C24] hover:bg-[#d9161d] text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New PRF</span>
          </button>
        )}
      </div>
    </header>
  );
};
