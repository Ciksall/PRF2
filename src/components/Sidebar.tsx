import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  UserCheck,
  Award,
  XCircle,
  CheckCircle2,
  FileText,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { PRFItem } from '../types';
import { MediaPrimaLogo } from './MediaPrimaLogo';

export type NavTab = 'dashboard' | 'new_form' | 'manager' | 'hod' | 'rejected' | 'successful' | 'readme';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  prfs: PRFItem[];
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  prfs,
  onResetData,
}) => {
  const pendingManagerCount = prfs.filter((p) => p.status === 'pending_manager').length;
  const pendingHodCount = prfs.filter((p) => p.status === 'pending_hod').length;
  const rejectedCount = prfs.filter((p) => p.status === 'rejected').length;
  const successfulCount = prfs.filter((p) => p.status === 'successful').length;

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      count: undefined,
    },
    {
      id: 'new_form' as NavTab,
      label: 'New Form',
      icon: FilePlus2,
      count: undefined,
    },
    {
      id: 'manager' as NavTab,
      label: 'Manager',
      icon: UserCheck,
      count: pendingManagerCount,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'hod' as NavTab,
      label: 'HOD',
      icon: Award,
      count: pendingHodCount,
      badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    },
    {
      id: 'rejected' as NavTab,
      label: 'Rejected',
      icon: XCircle,
      count: rejectedCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'successful' as NavTab,
      label: 'Successful',
      icon: CheckCircle2,
      count: successfulCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'readme' as NavTab,
      label: 'README Hub',
      icon: BookOpen,
      count: undefined,
    },
  ];

  return (
    <aside className="w-64 bg-[#191C21] text-slate-200 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <MediaPrimaLogo onWhiteBackground={true} />
          <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono">v1.4</span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-400 font-medium px-0.5">
          Payment Requisition Form Portal
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workflows & Queues
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#ED1C24] text-white shadow-md shadow-red-900/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    isActive
                      ? 'bg-black/30 text-white'
                      : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current User & Prototype Controls */}
      <div className="p-3 border-t border-slate-800/80 bg-[#14171A]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
          <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs shrink-0">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">Salmah Alimuddin</div>
            <div className="text-[10px] text-slate-400 truncate">HR Talent & Culture</div>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded transition"
          title="Reset to initial sample PRF records"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sample Records</span>
        </button>
      </div>
    </aside>
  );
};
