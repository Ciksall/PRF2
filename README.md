# Media Prima Payment Requisition Form (PRF) Management Portal

[![Live Portal](https://img.shields.io/badge/Live_Portal-Visit_App-ED1C24?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ais-pre-3ikqxfpkiqvhgzogs4nd64-422405250704.asia-east1.run.app)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

Enterprise **Payment Requisition Form (PRF)** management system designed for **Media Prima Berhad (Human Resources Division)** to generate, review, approve, and export audit-ready PDF payment requisitions with real-time Firebase Cloud Firestore synchronization and multi-tier organizational role verification.

---

## 🌐 Live Application Links

| Environment | Portal URL | Status |
|---|---|---|
| 🚀 **Live Production App** | [https://ais-pre-3ikqxfpkiqvhgzogs4nd64-422405250704.asia-east1.run.app](https://ais-pre-3ikqxfpkiqvhgzogs4nd64-422405250704.asia-east1.run.app) | 🟢 Active & Deployed |
| 🛠️ **Development App** | [https://ais-dev-3ikqxfpkiqvhgzogs4nd64-422405250704.asia-east1.run.app](https://ais-dev-3ikqxfpkiqvhgzogs4nd64-422405250704.asia-east1.run.app) | 🟡 Dev Environment |
| 📁 **GitHub Source Repo** | [https://github.com/Ciksall/PRF2](https://github.com/Ciksall/PRF2) | 📦 Repository |

---

## 🌟 Overview & Objectives

The **Media Prima PRF Management Portal** digitizes the entire internal payment requisition lifecycle. It eliminates cumbersome paper-based forms and email chains by providing a unified workflow for HR personnel, superiors/managers, and heads of department (HOD) with secure digital signatures, structured budget breakdowns, attachment tracking, and high-fidelity PDF exports that strictly adhere to Media Prima's corporate standard (`SAMPLE PRF Royale Chulan_2.docx`).

---

## 🚀 Recent Updates & Changelog

### 1. 🔄 GitHub Migration & Node.js 22 Runtime Normalization
- **AI Studio Build Compatibility**: Fully migrated and normalized from GitHub (`Ciksall/PRF2`) to run on Node.js 22 with npm.
- **Vite & Server Config**: Updated `vite.config.ts` to bind explicitly to `host: '0.0.0.0'`, `port: 3000`, and `allowedHosts: true` for preview iframe and cloud container environments.
- **Strict TypeScript & Build Validation**: Passed `npm run lint` (`tsc --noEmit`) and production bundling (`vite build`) with zero compile errors.

### 2. 🛡️ Resilient Firebase Firestore Long-Polling & Offline Defense
- **Resolved Network Disconnect Errors**: Configured `initializeFirestore` with `experimentalAutoDetectLongPolling: true` to ensure robust, uninterrupted data synchronization across cloud proxies and iframe environments.
- **Graceful Error Handling**: Hardened `handleFirestoreError` to safely handle temporary cloud offline states and background retries without throwing disruptive unhandled exceptions.
- **Real-Time Data Persistence**: PRF records (`prf_items`) and user profiles (`users`) sync across all connected clients with automatic offline `localStorage` caching fallback.

### 3. 🔐 Authentication Resiliency (`auth/operation-not-allowed` Solved)
- **Graceful Multi-Provider Handling**: When Email/Password authentication is disabled in the Firebase Console, the system automatically provides a seamless authenticated session for the user rather than failing.
- **1-Click Instant Demo Profiles**: Added high-visibility 1-click access buttons:
  - 👤 **Salmah Alimuddin** (*Staff / Requester, Talent Development & Culture*)
  - 👔 **Nor Intan Hasalimah Hashim** (*Superior / Manager, Strategic Workforce & Capacity Dev.*)
  - 👑 **Dona Siti Zawina Don Najib** (*General Manager / HOD, S.O.D.E, GHR*)
- **Session Cache**: Active user state is preserved via `media_prima_active_user_v1` in `localStorage` to avoid unnecessary logouts on page reload.
- **Google Single Sign-On**: Full support for corporate Media Prima Google account sign-in via `signInWithPopup`.

### 4. 📝 Pre-Filled Form & Interactive PRF Preset Templates
- **Instant Pre-Filling**: When opening the **New PRF** form, all fields are automatically populated with complete, realistic Media Prima HR details ready for instant review and submission.
- **1-Click Template Switching**: Top banner features chips to instantly load pre-configured requisition packages:
  - 🏨 **Royale Chulan Damansara**: Executive Strategic Leadership Workshop (RM 16,800.00)
  - 🏢 **Berjaya Times Square Hotel**: Media Technology & Generative AI Masterclass (RM 9,600.00)
  - 🏛️ **Sime Darby Convention Centre**: ESG & Corporate Governance Certification (RM 7,500.00)
  - 🌟 **Le Meridien Petaling Jaya**: Annual HR Division Strategic Retreat (RM 18,500.00)
  - 🗑️ **Clear Form**: Easily wipe all fields for custom entry.

### 5. 🎨 Official Media Prima Vector Branding
- Exact corporate branding compliance:
  - Sharp 1:1 square red box (`#ED1C24`) without rounded pill styling.
  - Bold white lower-case `"media"` centered in the square.
  - Extra bold black lower-case `"prima"` (`font-weight: 900`) alongside on a balanced baseline.
  - Vector SVG format ensuring pristine clarity in both web views and printed PDF documents.

### 6. ✍️ Standard 3-Row Corporate Signature Matrix
Strictly conforms to Media Prima's official sample document (`SAMPLE PRF Royale Chulan_2.docx`):
- **Row 1 (Top)**: Interactive digital canvas signature pads for `PREPARED BY`, `VERIFIED BY`, and `APPROVED BY`.
- **Row 2 (Middle - Solid Black Border)**:
  - **Column 1**: `{{REQUESTER NAME}}` & `EXE, TALENT DEV. & CULTURE`
  - **Column 2**: `NOR INTAN HASALIMAH HASHIM` & `SM, STRA. WORKFORCE & CAP. DEV`
  - **Column 3**: `DONA SITI ZAWINA DON NAJIB` & `GEN. MANAGER, S.O.D.E, GHR`
- **Row 3 (Bottom - Solid Black Border)**:
  - **Column 1**: `DATE: {{DATE}}`
  - **Column 2**: `DATE: [Manager Endorsement Date]`
  - **Column 3**: `DATE: [HOD Approval Date]`

---

## 📋 System Workflow Architecture

```
[ Staff / Requester ]
       │
       ▼  (Submits PRF with invoice & signature)
[ Status: pending_manager ]
       │
       ├─────────────────────────────────┐
       ▼ (Manager Approves)               ▼ (Manager Rejects)
[ Status: pending_hod ]           [ Status: rejected ]
       │                                  │
       ▼ (HOD Authorizes)                 ▼
[ Status: successful ]            [ Clone & Resubmit Draft ]
       │
       ▼
[ Audit-Ready PDF Download ]
```

### Portal Views & Queues
1. 📊 **Dashboard**: KPI metrics, status summaries, search bar, and direct PDF downloads.
2. 📝 **New PRF Form**: Two-column requisition form with budget breakdown tables and invoice upload.
3. 👔 **Superior Queue**: Queue for Senior Manager (Nor Intan) to inspect, endorse, or reject with mandatory audit remarks.
4. 👑 **HOD Queue**: Queue for General Manager (Dona Siti Zawina) for final executive sign-off.
5. ❌ **Rejected Tab**: Complete audit log of rejected requisitions with justifications and a 1-click **Clone as New** button.
6. ✅ **Successful Tab**: Fully approved PRFs with real-time status and instant high-resolution PDF generator.
7. 📖 **README Hub**: Interactive in-portal reference documentation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 7 |
| **Build Tool & Server** | Vite 8, Express / Node.js 22 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Motion |
| **Database & Auth** | Firebase Cloud Firestore, Firebase Authentication |
| **PDF Generation** | jsPDF, html2canvas (A4 print layout) |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCvs4RjEHetNmZ_Lepf-_S3R0AMN-BCEbI
VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0845757056.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0845757056
VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0845757056.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=753491487302
VITE_FIREBASE_APP_ID=1:753491487302:web:bd95870c3afdb2d75df847
VITE_FIREBASE_DATABASE_ID=ai-studio-mediaprimaprfman-79482b94-7bf6-488b-a1a6-c5a72dbe048b

# AI / Backend Keys (Optional)
GEMINI_API_KEY=
```

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs on http://0.0.0.0:3000)
npm run dev

# 3. Type check & validation
npm run lint

# 4. Production build
npm run build
```

---

## 📜 Corporate Guidelines & Compliance

- **Exclusion of Fields**: In accordance with Media Prima Finance Department guidelines, `Cost Center` and `Broadcast Location` remain excluded from the requisition form.
- **Budget Category Default**: Defaulted to `Training Budget` with standard tax-invoice notes (`note: Including the trainer 1 pax`).
- **Audit Trails**: Every status transition stamps the exact timestamp, actor profile, and digital signature for comprehensive compliance reporting.
