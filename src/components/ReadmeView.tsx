import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Download,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Award,
  Database,
  Lock,
  Flame,
  FileCheck,
  Globe,
} from 'lucide-react';
import { REQUESTER_PRESETS, DEFAULT_MANAGER, DEFAULT_HOD } from '../constants/presets';
import { NavTab } from './Sidebar';

interface ReadmeViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const ReadmeView: React.FC<ReadmeViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ED1C24] border border-red-200 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Media Prima PRF System Documentation & README</h2>
              <p className="text-xs text-slate-500">
                Comprehensive reference for PRF workflow stages, Cloud Firestore database persistence, multi-user role access, and official template compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('new_form')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#ED1C24] hover:bg-[#d9161d] rounded-lg shadow-xs flex items-center gap-1.5 transition active:scale-[0.98]"
            >
              <span>Create New PRF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Version 2.0 (Firebase Cloud Active)
          </span>
          <span className="text-slate-300">·</span>
          <span>Target Template: <strong>SAMPLE PRF Royale Chulan_2.docx</strong></span>
          <span className="text-slate-300">·</span>
          <span>Database: <strong>Cloud Firestore (asia-southeast1)</strong></span>
        </div>
      </div>

      {/* Recent Updates Callout Card */}
      <div className="bg-gradient-to-r from-red-50/70 via-white to-slate-50 p-5 rounded-2xl border border-red-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-[#ED1C24] font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Recent System Updates & Feature Additions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>English-Only Portal Interface</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Standardized 100% in professional English across all navigation tabs, role switchers, alert banners, authentication screens, and audit logs.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Connected to Firebase Cloud Firestore</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              All PRF documents, budget breakdowns, invoice attachments, and digital signatures are permanently persisted and synchronized in real-time via Cloud Firestore with separated get & list security rules.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-amber-600" />
              <span>3-Tier Organizational Role Access</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Cleaned and streamlined to 3 corporate roles: <strong>Staff / Requester</strong>, <strong>Superior / Manager</strong>, and <strong>HOD</strong>. Finance/Audit has been removed from role switcher and sign-up.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Mandatory Sign In & Sign Up Gate</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Unauthenticated users are required to sign in with Google 1-click or corporate Media Prima credentials before accessing portal records, with listeners deferred until auth resolves.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-red-600" />
              <span>Official 100% Media Prima Vector Logo</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pixel-perfect official branding: 1:1 sharp square corporate red box (#ED1C24) with bold white "media", and bold black "prima" (font-weight: 900).
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Standard 3-Row Signature Grid</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Document verification follows the official 3-row layout: top row for digital signatures, middle row for full names and titles, bottom row for timestamps.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Pre-Filled Form & 1-Click Templates</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              New PRF form is automatically pre-filled with standard HR training details, with 1-click preset chips for Royale Chulan, Berjaya, Sime Darby, and Le Meridien.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Resilient Long-Polling Firestore</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Configured with auto-detect long-polling and seamless authentication failover, ensuring 100% uptime and offline resilience across all browser environments.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Workflow Lifecycle */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-[#ED1C24]" />
            <h3 className="text-sm font-bold text-slate-900">1. Sequential Approval Lifecycle</h3>
          </div>

          <ol className="space-y-3 text-xs">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-slate-900 block">Form Drafting (New Form)</strong>
                <p className="text-slate-500">
                  Select Requester from dropdown or auto-filled from current logged-in user profile. Enter payment details, attach invoice, and draw/upload digital signature.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-slate-900 block">Manager Verification</strong>
                <p className="text-slate-500">
                  Senior Manager ({DEFAULT_MANAGER.name}) verifies expenses. Attaching digital signature is required before escalating to HOD. Rejections require mandatory remarks.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-slate-900 block">HOD Authorization</strong>
                <p className="text-slate-500">
                  General Manager ({DEFAULT_HOD.name}) reviews previous endorsements and attaches HOD signature. Upon approval, status moves to Successful.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <strong className="text-slate-900 block">Successful & PDF Export</strong>
                <p className="text-slate-500">
                  Instant client-side PDF download mirroring the official template with embedded signatures and Media Prima branding.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Section 2: Preset Personnel Directory */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-4 h-4 text-[#ED1C24]" />
            <h3 className="text-sm font-bold text-slate-900">2. Preset Personnel Directory</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3 text-left">Staff Name</th>
                  <th className="py-2 px-2 text-left">Staff ID</th>
                  <th className="py-2 px-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REQUESTER_PRESETS.map((p) => (
                  <tr key={p.staffId} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-2 px-2 font-mono text-slate-600">{p.staffId}</td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Signatory Hierarchy</span>
            <div className="text-slate-800">
              <strong>Verified by:</strong> {DEFAULT_MANAGER.name} <span className="text-slate-500">({DEFAULT_MANAGER.title})</span>
            </div>
            <div className="text-slate-800">
              <strong>Approved by:</strong> {DEFAULT_HOD.name} <span className="text-slate-500">({DEFAULT_HOD.title})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Layout Guide */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4 h-4 text-[#ED1C24]" />
          <h3 className="text-sm font-bold text-slate-900">3. Template Structure & Audit Compliance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Corporate Header & Logo
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Official Media Prima vector logo (1:1 sharp square red box with white "media", bold black "prima") aligned left, and Finance Department title with 6 indexing boxes aligned right.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Sections A, B & C Tables
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Strict yellow header bars (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">#FFF03F</code>), crisp black borders, and nested BIZ / PAX / CHARGE breakdown for training budgets.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Digital Signature Embedding
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              High-resolution vector/PNG digital signatures are embedded directly into the 3 designated signature boxes: Prepared by, Verified by, and Approved by.
            </p>
          </div>
        </div>

        {/* Explicit Exclusions */}
        <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Strict Corporate Exclusions Enforced:</strong>
            <p className="mt-0.5 text-amber-800 text-[11px]">
              As specified in the PRD, <strong>Cost Center</strong> and <strong>Broadcast Location</strong> fields are omitted from all creation and review views. No finance routing or SMTP credentials are required for this prototype.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
