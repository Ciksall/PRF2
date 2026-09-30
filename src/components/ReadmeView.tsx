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
                Official guide for Payment Requisition Form workflows, lookup rules, signatures, and PDF generation.
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
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Version 1.4 Active
          </span>
          <span className="text-slate-300">·</span>
          <span>Target Template: <strong>SAMPLE PRF Royale Chulan_2.docx</strong></span>
          <span className="text-slate-300">·</span>
          <span>Compliance: <strong>No Cost Center / No Broadcast Location</strong></span>
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
                  Select Requester from dropdown. Staff ID and Email auto-fill. Enter payment details, attach invoice, and draw/upload digital signature.
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

        {/* Section 2: Preset Lookup Directory */}
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
              Official Media Prima vector logo (red box with white "media", bold black "prima") aligned left, and Finance Department title with 6 indexing boxes aligned right.
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
