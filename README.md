# Media Prima Payment Requisition Form (PRF) Management Portal

Enterprise Payment Requisition Form (PRF) system for Media Prima Berhad to generate, review, approve, and export audit-ready PDF payment requisitions with Firebase Cloud Firestore and multi-user authentication.

---

## 🌟 Overview & Objectives

The **Media Prima PRF Management Portal** simplifies PRF creation and eliminates paper-based routing. It provides an intuitive end-to-end workflow for HR personnel, superiors/managers, and heads of department (HOD) to manage payment requisitions with digital signatures, rigorous audit trails, multi-user authentication, and instant PDF generation strictly matching the official corporate template (`SAMPLE PRF Royale Chulan_2.docx`).

---

## 🚀 Recent Updates & Changelog

### 1. 🔥 Firebase Cloud Firestore Integration (Real-Time Persistence)
- **Centralized Cloud Database**: Integrated with **Firebase Cloud Firestore** (region `asia-southeast1`, Database ID: `ai-studio-mediaprimaprfman-79482b94-7bf6-488b-a1a6-c5a72dbe048b`).
- **Real-Time Synchronization**: All PRF records (`prf_items`), itemized budget breakdowns, invoice attachment links, digital signatures, and audit statuses update instantly across all connected sessions.
- **Hardened Firestore Security Rules**: Fully secured with isolated `get` and `list` operations, authenticated user requirements, and zero permission leaks.

### 2. 🔐 Multi-User Authentication Gate
- **Mandatory Sign In**: Unauthenticated sessions are directed to the **Sign In** and **Sign Up** screens before accessing any internal financial data.
- **Authentication Providers**:
  - **Google Single Sign-On (1-Click)**: Instant sign-in using corporate Media Prima Google accounts.
  - **Email & Password Authentication**: Enables staff registration with full name, staff ID, division/department, and role selection (*Staff/Requester, Superior/Manager, HOD*).
  - **Instant Demo Profiles**: One-click demo buttons to test as Salmah (*Requester*), Nor Intan (*Superior/Manager*), or Dona Zawina (*HOD*).
- **Profile Management (`users/{userId}`)**: User profiles are stored in Firestore and displayed on the top header and sidebar with a secure sign-out option.
- **Smart Form Auto-Fill**: New PRF creation pre-populates requester details directly from the authenticated user's profile.

### 3. 🎨 Official Media Prima Vector Logo
- Strictly conforms to corporate brand specifications:
  - 1:1 square red box with sharp 90-degree corners (`#ED1C24`).
  - Bold white lower-case `"media"` centered inside the red box.
  - Extra bold black lower-case `"prima"` (`font-weight: 900`) alongside the red box on a balanced baseline.
  - High-resolution SVG format ensuring crisp, high-fidelity PDF exports.

### 4. ✍️ Standard 3-Row Signature Grid
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

### 5. 👔 Dedicated Superior & HOD Access (Interactive Role Switcher)
- **Top Header Role Switcher**: The role badge (e.g. `[STAFF]`) is interactive and can be clicked anytime to switch access between **SUPERIOR / MANAGER**, **HOD (Head of Department)**, or **STAFF**.
- **Live Firestore Persistence**: Role updates are saved directly to the Firestore user profile in real-time.
- **Role-Tailored Dashboard**:
  - For **Superior / Manager**: Prominent amber alert banner showing pending submissions with a 1-click button to open the **Superior Verification Queue**.
  - For **HOD**: Prominent emerald alert banner showing pending executive approvals with a 1-click button to open the **HOD Approval Queue**.
- **Dynamic Officer Identity**: Sign-off names dynamically link to the active verified officer.

---

## 📋 Core System Workflows

### 1. Six-Stage Navigation Lifecycle
- 📊 **Dashboard**: Real-time KPI metrics, status summaries, quick filters, and full-text search.
- 📝 **New Form**: Two-column requisition form with profile auto-fill, cost breakdowns, invoice upload, and digital signature pad.
- 👔 **Superior / Manager Queue**: Dedicated verification queue for Senior Manager (SM Nor Intan Hasalimah Hashim) to review and sign off or reject with mandatory remarks.
- 👑 **HOD Queue**: Executive approval queue for General Manager (GM Dona Siti Zawina Don Najib) before funds are disbursed by Finance.
- ❌ **Rejected Tab**: Audit log of all rejected requisitions with official justifications and 1-click clone feature for easy resubmission.
- ✅ **Successful Tab**: Fully authorized payment requisitions ready for immediate high-resolution PDF download.

---

## 🛡️ Architecture & Compliance

- **Framework**: React 18 SPA + Vite + Tailwind CSS.
- **Database & Auth**: Google Cloud Firestore & Firebase Authentication (`asia-southeast1`).
- **PDF Generation**: Browser-native rendering engine printing audit-ready A4 documents with exact margins and tables matching `SAMPLE PRF Royale Chulan_2.docx`.
