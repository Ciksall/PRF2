import React, { useState, useEffect } from 'react';
import { PRFItem } from './types';
import { INITIAL_PRF_DATA } from './constants/presets';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NewFormView } from './components/NewFormView';
import { ManagerQueueView } from './components/ManagerQueueView';
import { HODQueueView } from './components/HODQueueView';
import { RejectedView } from './components/RejectedView';
import { SuccessfulView } from './components/SuccessfulView';
import { PRFPreviewModal } from './components/PRFPreviewModal';
import { ToastBanner, ToastMessage } from './components/ToastBanner';
import { downloadPRFAsPDF } from './utils/pdfGenerator';
import { PRFDocumentTemplate } from './components/PRFDocumentTemplate';

const STORAGE_KEY = 'media_prima_prf_records_v1';

export default function App() {
  const [prfs, setPrfs] = useState<PRFItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved PRF records', e);
    }
    return INITIAL_PRF_DATA;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPrf, setPreviewPrf] = useState<PRFItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prfs));
    } catch (e) {
      console.error('Failed to save PRF records to storage', e);
    }
  }, [prfs]);

  const addToast = (type: 'email' | 'success' | 'warning' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Form submission
  const handleCreateNewPrf = (newPrf: PRFItem) => {
    setPrfs((prev) => [newPrf, ...prev]);
    // Mandatory PRD message: "PRF submitted and escalated to Manager via email"
    addToast(
      'email',
      'PRF submitted and escalated to Manager via email',
      `Requisition ${newPrf.refNo} has been routed to Manager (Nor Intan Hasalimah) for verification.`
    );
    setCurrentTab('manager');
  };

  // Manager Approval
  const handleManagerApprove = (prfId: string, managerSignature: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    setPrfs((prev) =>
      prev.map((item) =>
        item.id === prfId
          ? {
              ...item,
              status: 'pending_hod',
              managerSignature,
              managerSignatureDate: todayStr,
              managerApprovedAt: new Date().toISOString(),
            }
          : item
      )
    );

    const prf = prfs.find((p) => p.id === prfId);
    addToast(
      'email',
      'PRF verified by Manager & escalated to HOD',
      `Requisition ${prf?.refNo || ''} has been escalated to HOD (Dona Siti Zawina) for final authorization.`
    );
  };

  // Manager Rejection
  const handleManagerReject = (prfId: string, remarks: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    setPrfs((prev) =>
      prev.map((item) =>
        item.id === prfId
          ? {
              ...item,
              status: 'rejected',
              rejectedBy: 'Manager',
              rejectionDate: todayStr,
              rejectionRemarks: remarks,
            }
          : item
      )
    );

    addToast(
      'warning',
      'Requisition Rejected by Manager',
      'Form has been moved to Rejected tab with audit remarks.'
    );
  };

  // HOD Approval
  const handleHODApprove = (prfId: string, hodSignature: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    setPrfs((prev) =>
      prev.map((item) =>
        item.id === prfId
          ? {
              ...item,
              status: 'successful',
              hodSignature,
              hodSignatureDate: todayStr,
              hodApprovedAt: new Date().toISOString(),
            }
          : item
      )
    );

    const prf = prfs.find((p) => p.id === prfId);
    addToast(
      'success',
      'HOD Final Authorization Granted!',
      `Requisition ${prf?.refNo || ''} is now approved. Ready for instant PDF download in Successful tab.`
    );
  };

  // HOD Rejection
  const handleHODReject = (prfId: string, remarks: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    setPrfs((prev) =>
      prev.map((item) =>
        item.id === prfId
          ? {
              ...item,
              status: 'rejected',
              rejectedBy: 'HOD',
              rejectionDate: todayStr,
              rejectionRemarks: remarks,
            }
          : item
      )
    );

    addToast(
      'warning',
      'Requisition Rejected by HOD',
      'Form has been logged in Rejected tab with executive justification.'
    );
  };

  // Clone from rejected to draft
  const handleCloneAsNew = (prf: PRFItem) => {
    setCurrentTab('new_form');
  };

  // Reset sample prototype records
  const handleResetData = () => {
    if (window.confirm('Reset all PRF records back to initial prototype state?')) {
      setPrfs(INITIAL_PRF_DATA);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRF_DATA));
      } catch (e) {}
      addToast('success', 'Reset Complete', 'Prototype PRF records have been refreshed.');
    }
  };

  // Download PDF directly from dashboard
  const handleDirectDownloadPdf = async (prf: PRFItem) => {
    const templateId = `dashboard-download-template-${prf.id}`;
    const success = await downloadPRFAsPDF(templateId, prf);
    if (!success) {
      alert('Unable to generate PDF. Opening full document preview...');
      setPreviewPrf(prf);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Toast Notifications */}
      <ToastBanner toasts={toasts} onDismiss={removeToast} />

      {/* 6-View Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        prfs={prfs}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onNavigateToNewForm={() => setCurrentTab('new_form')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              prfs={prfs}
              onNavigateTab={setCurrentTab}
              onViewPrfModal={setPreviewPrf}
              onDownloadPdf={handleDirectDownloadPdf}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'new_form' && (
            <NewFormView
              onSubmit={handleCreateNewPrf}
              onCancel={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'manager' && (
            <ManagerQueueView
              prfs={prfs}
              onApprove={handleManagerApprove}
              onReject={handleManagerReject}
              onViewPrfModal={setPreviewPrf}
            />
          )}

          {currentTab === 'hod' && (
            <HODQueueView
              prfs={prfs}
              onApprove={handleHODApprove}
              onReject={handleHODReject}
              onViewPrfModal={setPreviewPrf}
            />
          )}

          {currentTab === 'rejected' && (
            <RejectedView
              prfs={prfs}
              onViewPrfModal={setPreviewPrf}
              onCloneAsNew={handleCloneAsNew}
            />
          )}

          {currentTab === 'successful' && (
            <SuccessfulView
              prfs={prfs}
              onViewPrfModal={setPreviewPrf}
            />
          )}
        </main>
      </div>

      {/* Document Preview & Export Modal */}
      <PRFPreviewModal
        prf={previewPrf}
        onClose={() => setPreviewPrf(null)}
      />

      {/* Off-screen Templates for Instant Dashboard Downloads */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '800px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -100,
        }}
        aria-hidden="true"
      >
        {prfs.map((p) => (
          <PRFDocumentTemplate
            key={p.id}
            id={`dashboard-download-template-${p.id}`}
            prf={p}
            isPrintMode={true}
          />
        ))}
      </div>
    </div>
  );
}
