# Media Prima Payment Requisition Form (PRF) Management Portal

Enterprise Payment Requisition Form (PRF) system for Media Prima Berhad to generate, review, approve, and export audit-ready PDF payment requisitions with Firebase Cloud Firestore and multi-user authentication.

---

## 🌟 Overview & Objectives

The **Media Prima PRF Management Portal** simplifies PRF creation and eliminates paper-based routing. It provides an intuitive end-to-end workflow for HR personnel, superiors/managers, and heads of department (HOD) to manage payment requisitions with digital signatures, rigorous audit trails, multi-user authentication, and instant PDF generation strictly matching the official corporate template (`SAMPLE PRF Royale Chulan_2.docx`).

---

## 🚀 Recent Updates & Changelog

### 1. 🌐 English-Only Standardization Across Entire Portal
- **Zero Bahasa Melayu**: Standardized all UI copy, navigation links, role switcher dropdowns, dashboard greetings, action alert banners, form placeholders, modal dialogs, and notification toasts strictly into professional corporate English.
- **Scannable UI Elements**:
  - Role switcher title: `Role Access` & `Select portal access based on your duties`.
  - Alert banners: `Superior / Manager Access Active` & `Head of Department (HOD) Access Active`.
  - Queue shortcuts: `Open Superior Verification Queue` & `Open HOD Approval Queue`.

### 2. 👥 3-Tier Corporate Role Architecture (Finance/Audit Cleanly Removed)
- **Role Scoping**: As requested, the extraneous `Finance / Audit` option has been deleted from both the interactive Header Role Switcher and the Sign-Up registration dropdown.
- **Current Authorized Roles**:
  - 👤 **Staff / Requester**: Create & track payment requisition form submissions.
  - 👔 **Superior / Manager**: Review, verify, and endorse subordinate submissions before escalation.
  - 👑 **HOD (Head of Department)**: Final executive expense authorization.

### 3. 🛡️ Cloud Firestore Permission Fixes & Hardened Security Rules
- **Resolved "Missing or insufficient permissions" Error**: Corrected `firestore.rules` by decoupling single-document checks (`allow get: if isSignedIn() && isValidId(prfId);`) from collection queries (`allow list: if isSignedIn();`).
- **Deferred Listener Initialization**: The real-time Firestore synchronization (`subscribeToPrfs`) and sample data initialization (`seedPrfDataIfEmpty`) are now deferred until user authentication is fully resolved, adhering strictly to Firebase best practices.
- **Rule Deployment**: Deployed production-grade rules directly to the Firebase database (`ai-studio-mediaprimaprfman-79482b94-7bf6-488b-a1a6-c5a72dbe048b`).

### 4. 🔥 Firebase Cloud Firestore Integration (Real-Time Persistence)
- **Centralized Cloud Database**: Integrated with **Firebase Cloud Firestore** (region `asia-southeast1`).
- **Real-Time Synchronization**: All PRF records (`prf_items`), itemized budget breakdowns, invoice attachment links, digital signatures, and audit statuses update instantly across all connected sessions.

### 5. 🔐 Multi-User Authentication Gate
- **Mandatory Sign In**: Unauthenticated sessions are directed to the **Sign In** and **Sign Up** screens before accessing any internal financial data.
- **Authentication Providers**:
  - **Google Single Sign-On (1-Click)**: Instant sign-in using corporate Media Prima Google accounts.
  - **Email & Password Authentication**: Enables staff registration with full name, staff ID, division/department, and role selection.
  - **Instant Demo Profiles**: One-click demo buttons to test as Salmah (*Requester*), Nor Intan (*Superior/Manager*), or Dona Zawina (*HOD*).
- **Profile Management (`users/{userId}`)**: User profiles are stored in Firestore and displayed on the top header and sidebar with a secure sign-out option.
- **Smart Form Auto-Fill**: New PRF creation pre-populates requester details directly from the authenticated user's profile.

### 6. 🎨 Official Media Prima Vector Logo
- Strictly conforms to corporate brand specifications:
  - 1:1 square red box with sharp 90-degree corners (`#ED1C24`).
  - Bold white lower-case `"media"` centered inside the red box.
  - Extra bold black lower-case `"prima"` (`font-weight: 900`) alongside the red box on a balanced baseline.
  - High-resolution SVG format ensuring crisp, high-fidelity PDF exports.

### 7. ✍️ Standard 3-Row Signature Grid
- Verified against the corporate document specifications:
  - **Row 1 (Top)**: Digital signature pads for all three columns (`PREPARED BY`, `VERIFIED BY`, `APPROVED BY`).
  - **Row 2 (Middle - Solid Black Border)**:
    - **Column 1**: `{{REQUESTER NAME}}` & `EXE, TALENT DEV. & CULTURE`
    - **Column 2**: `NOR INTAN HASALIMAH HASHIM` & `SM, STRA. WORKFORCE & CAP. DEV`
    - **Column 3**: `DONA SITI ZAWINA DON NAJIB` & `GEN. MANAGER, S.O.D.E, GHR`
  - **Row 3 (Bottom - Solid Black Border)**:
    - **Column 1**: `DATE: {{DATE}}`
    - **Column 2**: `DATE: [Manager Verification Date]`
    - **Column 3**: `DATE: [HOD Approval Date]`

---

## 📋 Core System Workflows

### 1. Six-Stage Navigation Lifecycle
- 📊 **Dashboard**: Real-time KPI metrics, status summaries, quick filters, and full-text search.
- 📝 **New Form**: Two-column requisition form with profile auto-fill, cost breakdowns, invoice upload, and digital signature pad.
- 👔 **Superior / Manager Queue**: Dedicated verification queue for Senior Manager (SM Nor Intan Hasalimah Hashim) to review and sign off or reject with mandatory remarks.
- 👑 **HOD Queue**: Executive approval queue for General Manager (GM Dona Siti Zawina Don Najib) before funds are disbursed by Finance.
- ❌ **Rejected Tab**: Audit log of all rejected requisitions with official justifications and 1-click clone feature for easy resubmission.
- ✅ **Successful Tab**: Fully authorized payment requisitions ready for immediate high-resolution PDF download.
- 📖 **README Hub**: Complete in-app interactive documentation detailing architecture, lifecycle, and personnel hierarchy.

---

## 🛡️ Architecture & Compliance

- **Framework**: React 18 SPA + Vite + Tailwind CSS.
- **Database & Auth**: Google Cloud Firestore & Firebase Authentication (`asia-southeast1`).
- **PDF Generation**: Browser-native rendering engine printing audit-ready A4 documents with exact margins and tables matching `SAMPLE PRF Royale Chulan_2.docx`.
- **Field Exclusions**: `Cost Center` and `Broadcast Location` remain strictly omitted per corporate compliance guidelines.
