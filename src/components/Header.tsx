import React from 'react';
import { PlusCircle, Search, LogOut, Shield } from 'lucide-react';
import { User } from 'firebase/auth';
import { NavTab } from './Sidebar';
import { UserProfile } from '../services/firebase';

interface HeaderProps {
  currentTab: NavTab;
  onNavigateToNewForm: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateToNewForm,
  searchQuery,
  onSearchChange,
  currentUser,
  userProfile,
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

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'manager':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 uppercase">Manager</span>;
      case 'hod':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">HOD</span>;
      case 'finance':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 uppercase">Finance</span>;
      case 'admin':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 uppercase">Admin</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 uppercase">Staff</span>;
    }
  };

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
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
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

        {/* User Auth Info & Sign Out */}
        <div className="flex items-center border-l border-slate-200 pl-3">
          <div className="flex items-center gap-2.5">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={userProfile?.displayName || 'User'}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#191C21] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {(userProfile?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-900 truncate max-w-[120px]">
                  {userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0]}
                </span>
                {getRoleBadge(userProfile?.role)}
              </div>
              <div className="text-[9px] text-slate-400 truncate max-w-[130px]">
                {currentUser?.email}
              </div>
            </div>
            <button
              onClick={onSignOut}
              title="Log Keluar (Sign Out)"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
