import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
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
import { ReadmeView } from './components/ReadmeView';
import { PRFPreviewModal } from './components/PRFPreviewModal';
import { ToastBanner, ToastMessage } from './components/ToastBanner';
import { downloadPRFAsPDF } from './utils/pdfGenerator';
import { PRFDocumentTemplate } from './components/PRFDocumentTemplate';
import {
  subscribeToPrfs,
  savePrfToFirestore,
  updatePrfInFirestore,
  seedPrfDataIfEmpty,
  signInWithGoogleAuth,
  signOutFromAuth,
  onAuthChange,
} from './services/firebase';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Connect to Firestore real-time listener & seed initial data
  useEffect(() => {
    // Seed default sample PRF records if Firestore is completely empty
    seedPrfDataIfEmpty(INITIAL_PRF_DATA).catch((err) => {
      console.error('Failed to seed initial data:', err);
    });

    // Real-time listener from Firestore
    const unsubscribe = subscribeToPrfs(
      (firestoreItems) => {
        if (firestoreItems.length > 0) {
          setPrfs(firestoreItems);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(firestoreItems));
          } catch (e) {}
        }
      },
      (error) => {
        console.error('Realtime Firestore sync error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

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

  // Google Login / Logout handlers
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogleAuth();
      if (user) {
        addToast('success', 'Signed In Successfully', `Welcome, ${user.displayName || user.email}!`);
      }
    } catch (err) {
      addToast('error', 'Sign In Failed', 'Unable to complete Google sign in.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutFromAuth();
      addToast('success', 'Signed Out', 'You have been signed out.');
    } catch (err) {
      addToast('error', 'Sign Out Error', 'Failed to sign out.');
    }
  };

  // Form submission: save to Firestore & update local state
  const handleCreateNewPrf = async (newPrf: PRFItem) => {
    setPrfs((prev) => [newPrf, ...prev]);
    try {
      await savePrfToFirestore(newPrf);
    } catch (e) {
      console.error('Failed to save to Firestore:', e);
    }

    addToast(
      'email',
      'PRF submitted and escalated to Manager via email',
      `Requisition ${newPrf.refNo} has been routed to Manager (Nor Intan Hasalimah) for verification.`
    );
    setCurrentTab('manager');
  };

  // Manager Approval: sync to Firestore
  const handleManagerApprove = async (prfId: string, managerSignature: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    const updates = {
      status: 'pending_hod' as const,
      managerSignature,
      managerSignatureDate: todayStr,
      managerApprovedAt: new Date().toISOString(),
    };

    setPrfs((prev) =>
      prev.map((item) => (item.id === prfId ? { ...item, ...updates } : item))
    );

    try {
      await updatePrfInFirestore(prfId, updates);
    } catch (e) {
      console.error('Failed to update Firestore:', e);
    }

    const prf = prfs.find((p) => p.id === prfId);
    addToast(
      'email',
      'PRF verified by Manager & escalated to HOD',
      `Requisition ${prf?.refNo || ''} has been escalated to HOD (Dona Siti Zawina) for final authorization.`
    );
  };

  // Manager Rejection: sync to Firestore
  const handleManagerReject = async (prfId: string, remarks: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    const updates = {
      status: 'rejected' as const,
      rejectedBy: 'Manager' as const,
      rejectionDate: todayStr,
      rejectionRemarks: remarks,
    };

    setPrfs((prev) =>
      prev.map((item) => (item.id === prfId ? { ...item, ...updates } : item))
    );

    try {
      await updatePrfInFirestore(prfId, updates);
    } catch (e) {
      console.error('Failed to update Firestore:', e);
    }

    addToast(
      'warning',
      'Requisition Rejected by Manager',
      'Form has been moved to Rejected tab with audit remarks.'
    );
  };

  // HOD Approval: sync to Firestore
  const handleHODApprove = async (prfId: string, hodSignature: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    const updates = {
      status: 'successful' as const,
      hodSignature,
      hodSignatureDate: todayStr,
      hodApprovedAt: new Date().toISOString(),
    };

    setPrfs((prev) =>
      prev.map((item) => (item.id === prfId ? { ...item, ...updates } : item))
    );

    try {
      await updatePrfInFirestore(prfId, updates);
    } catch (e) {
      console.error('Failed to update Firestore:', e);
    }

    const prf = prfs.find((p) => p.id === prfId);
    addToast(
      'success',
      'HOD Final Authorization Granted!',
      `Requisition ${prf?.refNo || ''} is now approved. Ready for instant PDF download in Successful tab.`
    );
  };

  // HOD Rejection: sync to Firestore
  const handleHODReject = async (prfId: string, remarks: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB');
    const updates = {
      status: 'rejected' as const,
      rejectedBy: 'HOD' as const,
      rejectionDate: todayStr,
      rejectionRemarks: remarks,
    };

    setPrfs((prev) =>
      prev.map((item) => (item.id === prfId ? { ...item, ...updates } : item))
    );

    try {
      await updatePrfInFirestore(prfId, updates);
    } catch (e) {
      console.error('Failed to update Firestore:', e);
    }

    addToast(
      'warning',
      'Requisition Rejected by HOD',
      'Form has been logged in Rejected tab with executive justification.'
    );
  };

  // Clone from rejected to draft
  const handleCloneAsNew = (_prf: PRFItem) => {
    setCurrentTab('new_form');
  };

  // Reset sample prototype records
  const handleResetData = async () => {
    setPrfs(INITIAL_PRF_DATA);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRF_DATA));
      for (const item of INITIAL_PRF_DATA) {
        await savePrfToFirestore(item);
      }
    } catch (e) {
      console.error('Reset error:', e);
    }
    addToast('success', 'Reset Complete', 'Prototype PRF records have been refreshed in Firestore.');
  };

  // Download PDF directly from dashboard
  const handleDirectDownloadPdf = async (prf: PRFItem) => {
    const templateId = `dashboard-download-template-${prf.id}`;
    const success = await downloadPRFAsPDF(templateId, prf);
    if (!success) {
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
          currentUser={currentUser}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
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

          {currentTab === 'readme' && (
            <ReadmeView onNavigateTab={setCurrentTab} />
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
