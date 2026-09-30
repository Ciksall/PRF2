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
import { AuthPage } from './components/AuthPage';
import { MediaPrimaLogo } from './components/MediaPrimaLogo';
import {
  subscribeToPrfs,
  savePrfToFirestore,
  updatePrfInFirestore,
  seedPrfDataIfEmpty,
  signOutFromAuth,
  onAuthChange,
  getUserProfile,
  saveUserProfile,
  updateUserRole,
  UserProfile,
  UserRole,
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            profile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Staff Member',
              role: 'staff',
              deptSection: 'HUMAN RESOURCES',
              staffId: `MP-${Math.floor(1000 + Math.random() * 9000)}`,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            await saveUserProfile(profile);
          }
          setUserProfile(profile);
        } catch (e) {
          console.error('Error fetching user profile:', e);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
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

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOutFromAuth();
      setCurrentUser(null);
      setUserProfile(null);
      addToast('success', 'Log Keluar Berjaya', 'Anda telah log keluar daripada sistem.');
    } catch (err) {
      addToast('error', 'Ralat Log Keluar', 'Gagal log keluar.');
    }
  };

  // Handler for successful authentication from AuthPage
  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    addToast('success', 'Selamat Datang!', `Log masuk sebagai ${profile.displayName} (${profile.role.toUpperCase()})`);
  };

  // Handler to switch active user role (Staff, Superior, HOD)
  const handleUpdateRole = async (newRole: UserRole) => {
    if (!currentUser || !userProfile) return;
    const updated: UserProfile = { ...userProfile, role: newRole };
    setUserProfile(updated);
    try {
      await updateUserRole(currentUser.uid, newRole);
    } catch (e) {
      console.error('Failed to update role in Firestore:', e);
    }
    const roleLabel =
      newRole === 'superior' || newRole === 'manager'
        ? 'Superior / Manager'
        : newRole === 'hod'
        ? 'Head of Department (HOD)'
        : 'Staff / Requester';
    addToast('success', 'Peranan Ditukar', `Akses anda kini ditukar kepada ${roleLabel}.`);
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

  // 1. Loading screen while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#191C21] flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="bg-white p-2.5 rounded-xl shadow-2xl mb-4">
          <MediaPrimaLogo onWhiteBackground={false} />
        </div>
        <div className="flex items-center gap-2.5 text-slate-300 text-xs font-medium">
          <span className="w-4 h-4 border-2 border-[#ED1C24] border-t-transparent rounded-full animate-spin"></span>
          <span>Memuatkan Portal Media Prima...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated user: Show Sign In / Sign Up Page First
  if (!currentUser && !userProfile) {
    return (
      <>
        <ToastBanner toasts={toasts} onDismiss={removeToast} />
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  // 3. Authenticated user: Full Application Access
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
        userProfile={userProfile}
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
          userProfile={userProfile}
          onSignOut={handleSignOut}
          onUpdateRole={handleUpdateRole}
          onNavigateTab={setCurrentTab}
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
              userProfile={userProfile}
              onUpdateRole={handleUpdateRole}
            />
          )}

          {currentTab === 'new_form' && (
            <NewFormView
              onSubmit={handleCreateNewPrf}
              onCancel={() => setCurrentTab('dashboard')}
              currentUserProfile={userProfile}
            />
          )}

          {currentTab === 'manager' && (
            <ManagerQueueView
              prfs={prfs}
              onApprove={handleManagerApprove}
              onReject={handleManagerReject}
              onViewPrfModal={setPreviewPrf}
              currentUserProfile={userProfile}
            />
          )}

          {currentTab === 'hod' && (
            <HODQueueView
              prfs={prfs}
              onApprove={handleHODApprove}
              onReject={handleHODReject}
              onViewPrfModal={setPreviewPrf}
              currentUserProfile={userProfile}
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
