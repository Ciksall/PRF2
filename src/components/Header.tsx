import React from 'react';
import { PlusCircle, Search, LogIn, LogOut, CheckCircle, Database } from 'lucide-react';
import { User } from 'firebase/auth';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onNavigateToNewForm: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateToNewForm,
  searchQuery,
  onSearchChange,
  currentUser,
  onSignIn,
  onSignOut,
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
      case 'readme':
        return { title: 'README Hub & Documentation', subtitle: 'System architecture, workflows, personnel directory, and compliance' };
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
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Firestore Live
          </span>
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
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
          />
        </div>

        {/* Create New PRF Button */}
        {currentTab !== 'new_form' && (
          <button
            onClick={onNavigateToNewForm}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ED1C24] hover:bg-[#d9161d] text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New PRF</span>
          </button>
        )}

        {/* User Auth Info */}
        <div className="flex items-center border-l border-slate-200 pl-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </div>
                <div className="text-[9px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.email}
                </div>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
