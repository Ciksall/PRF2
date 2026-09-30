import React, { useState, useRef, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  LogOut,
  ChevronDown,
  UserCheck,
  Award,
  User as UserIcon,
  Check,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { NavTab } from './Sidebar';
import { UserProfile, UserRole } from '../services/firebase';

interface HeaderProps {
  currentTab: NavTab;
  onNavigateToNewForm: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
  onSignOut: () => void;
  onUpdateRole?: (newRole: UserRole) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateToNewForm,
  searchQuery,
  onSearchChange,
  currentUser,
  userProfile,
  onSignOut,
  onUpdateRole,
  onNavigateTab,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'PRF Portal Dashboard', subtitle: 'Overview of all payment requisition workflows' };
      case 'new_form':
        return { title: 'Create New PRF', subtitle: 'Draft and submit payment requisition with digital signatures' };
      case 'manager':
        return { title: 'Superior / Manager Approval Queue', subtitle: 'Review and verify subordinate payment requisitions' };
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

  const currentRole = userProfile?.role || 'staff';

  const handleRoleSelect = (role: UserRole) => {
    if (onUpdateRole) {
      onUpdateRole(role);
    }
    setRoleDropdownOpen(false);
    // Optionally route to queue
    if (role === 'superior' || role === 'manager') {
      if (onNavigateTab) onNavigateTab('manager');
    } else if (role === 'hod') {
      if (onNavigateTab) onNavigateTab('hod');
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'superior':
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase shadow-2xs">
            <UserCheck className="w-2.5 h-2.5 text-amber-700" />
            <span>Superior</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </span>
        );
      case 'hod':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase shadow-2xs">
            <Award className="w-2.5 h-2.5 text-emerald-700" />
            <span>HOD</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase shadow-2xs">
            <UserIcon className="w-2.5 h-2.5 text-blue-600" />
            <span>Staff</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </span>
        );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
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

        {/* User Auth Info & Interactive Role Switcher */}
        <div className="flex items-center border-l border-slate-200 pl-3 relative" ref={dropdownRef}>
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
                <span className="text-[11px] font-bold text-slate-900 truncate max-w-[125px]">
                  {userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0]}
                </span>

                {/* Clickable Role Badge */}
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  title="Klik untuk tukar peranan (Staff / Superior / HOD)"
                  className="hover:scale-105 transition cursor-pointer"
                >
                  {getRoleBadge(currentRole)}
                </button>
              </div>
              <div className="text-[9px] text-slate-400 truncate max-w-[130px]">
                {currentUser?.email}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onSignOut}
              title="Log Keluar (Sign Out)"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Role Switcher Dropdown */}
          {roleDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-fadeIn text-xs">
              <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-900 text-[11px]">Tukar Peranan / Role Access</div>
                <div className="text-[10px] text-slate-500">Pilih akses portal mengikut tugas anda</div>
              </div>

              {/* Option 1: Staff / Requester */}
              <button
                type="button"
                onClick={() => handleRoleSelect('staff')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                  currentRole === 'staff'
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-blue-100 text-blue-700 rounded-md">
                    <UserIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold">Staff / Requester</div>
                    <div className="text-[10px] text-slate-500">Cipta & pantau status PRF</div>
                  </div>
                </div>
                {currentRole === 'staff' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              {/* Option 2: Superior / Manager */}
              <button
                type="button"
                onClick={() => handleRoleSelect('superior')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer mt-1 ${
                  currentRole === 'superior' || currentRole === 'manager'
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-100 text-amber-700 rounded-md">
                    <UserCheck className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold">Superior / Manager</div>
                    <div className="text-[10px] text-slate-500">Semak & sahkan borang bawahan</div>
                  </div>
                </div>
                {(currentRole === 'superior' || currentRole === 'manager') && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>

              {/* Option 3: HOD (Head of Department) */}
              <button
                type="button"
                onClick={() => handleRoleSelect('hod')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer mt-1 ${
                  currentRole === 'hod'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-emerald-100 text-emerald-700 rounded-md">
                    <Award className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold">HOD (Head of Department)</div>
                    <div className="text-[10px] text-slate-500">Kelulusan akhir perbelanjaan</div>
                  </div>
                </div>
                {currentRole === 'hod' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
