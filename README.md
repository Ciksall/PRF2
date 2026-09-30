# Media Prima Payment Requisition Form (PRF) Management Portal

Enterprise Payment Requisition Form (PRF) system for Media Prima Berhad HR staff to generate, review, approve, and export audit-ready PDF payment requisitions.

---

## 🌟 Overview & Objectives

The **Media Prima PRF Management Portal** simplifies PRF creation and eliminates paper-based routing. It provides an intuitive 6-stage workflow for HR personnel, managers, and heads of department (HOD) to manage payment requisitions with digital signatures, rigorous audit trails, and instant PDF generation strictly matching the official corporate template (`SAMPLE PRF Royale Chulan_2.docx`).

---

## 📋 Key Features

### 1. 6-Item Workflow Navigation
- 📊 **Dashboard**: Real-time KPI cards (Total Submissions, Pending Manager, Pending HOD, Successful, Rejected, Total MYR volume), quick filter tabs, live search, and recent submissions table.
- 📝 **New Form**: Two-column layout with auto-filled staff credentials, expenses breakdown table (`BIZ` / `PAX` / `CHARGE`), attachment upload, and digital signature pads.
- 👔 **Manager Queue**: Verification queue for Senior Managers (SM Nor Intan Hasalimah Hashim) to review details, attach digital signatures, approve to escalate, or reject with mandatory remarks.
- 👑 **HOD Queue**: Executive authorization queue for General Managers (GM Dona Siti Zawina Don Najib) to grant final approval.
- ❌ **Rejected Tab**: Historical audit register displaying all non-approved requisitions with compulsory justifications and 1-click resubmission.
- ✅ **Successful Tab & PDF Export**: Instant download of high-resolution, print-ready PDFs mirroring the exact Media Prima template.
- 📖 **README Hub**: Complete in-app interactive documentation, PRD specifications, and user manual.

### 2. Auto-Fill & Preset Lookup Rules
When selecting a Requester Name on the **New Form**, the system automatically populates the corresponding Staff ID and Payment Slip Email:

| Requester Name | Staff ID | Payment Email | Department |
| :--- | :--- | :--- | :--- |
| **SALMAH ALIMUDDIN** | `137800` | `salmah@mediaprima.com.my` | Human Resources |
| **WAN HUZAIRY BIN WAN HUSSIN** | `MPB0675` | `huzairy@mediaprima.com.my` | Human Resources |
| **ERINA SHEREEN BINTI ABDUL JAMIL** | `MPD0055` | `erina@mediaprima.com.my` | Human Resources |

### 3. Strict Compliance Guidelines
- **Omitted Fields**: Per corporate requirements, **Cost Center** and **Broadcast Location** fields are explicitly excluded.
- **Digital Signatures**: Multi-mode signature input supporting:
  - ✍️ Interactive HTML5 canvas drawing pad
  - 📤 Image upload (PNG, JPG, SVG)
  - ⚡ 1-click authentic executive signature presets
- **Mandatory Rejection Justifications**: Any rejection by Manager or HOD requires detailed remarks to be entered into the permanent audit trail.
- **Simulated Email Notifications**: Immediate feedback toasts (e.g., *"PRF submitted and escalated to Manager via email"*).

### 4. PDF Generation & Document Layout
The downloaded PDF reproduces the layout of `SAMPLE PRF Royale Chulan_2.docx`:
- **Header**: Official Media Prima red/black corporate logo at top left, "FINANCE DEPARTMENT / PAYMENT REQUISITION FORM" at top right with the 6-box indexing grid.
- **Section A (Requester's Particulars)**: Yellow header bar (`#FFF03F`), bordered table with Name, Staff No., Department, and Date.
- **Section B (Expenses Details)**:
  - Payee Account Name, Bank Name, Account Number, Payment Slip Email
  - Program Title, Event Date, Venue, Budget Category
  - Nested `BIZ` / `PAX` / `CHARGE (MYR)` breakdown table and note
  - Invoice No. and formatted Amount (MYR)
  - Signature Grid:
    - **Prepared By**: Requester Name & Title with embedded signature
    - **Verified By**: NOR INTAN HASALIMAH HASHIM (SM, STRA. WORKFORCE & CAP. DEV)
    - **Approved By**: DONA SITI ZAWINA DON NAJIB (GEN. MANAGER, S.O.D.E, GHR)
- **Section C (Finance Dept. Use)**: Verification and approval placeholder grid.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom executive theme (`#ED1C24` Media Prima red)
- **Icons**: Lucide React
- **Document & PDF Export**: jsPDF + html2canvas with custom OKLCH style sanitization
- **State & Persistence**: LocalStorage persistence (`media_prima_prf_records_v1`)

---

## 🚀 Getting Started

### Local Development
```bash
npm install
npm run dev
```
The application will start on `http://localhost:3000`.

### Building for Production
```bash
npm run build
```

---

## 🧪 Testing Checklist

1. **Auto-Fill Verification**: Open **New Form**, select "WAN HUZAIRY BIN WAN HUSSIN", and verify Staff ID (`MPB0675`) and Email (`huzairy@mediaprima.com.my`) fill automatically.
2. **Field Omission**: Confirm that neither "Cost Center" nor "Broadcast Location" appears on the form.
3. **Escalation**: Submit a new PRF and verify the notification banner appears and the item routes to the **Manager Queue**.
4. **Manager Approval**: Go to **Manager Queue**, attach signature (or click "Quick Preset"), and approve. Verify it transfers to the **HOD Queue**.
5. **HOD Approval**: Go to **HOD Queue**, attach HOD signature, and approve. Confirm it transfers to the **Successful Tab**.
6. **PDF Download**: In the **Successful Tab**, click "Download PDF" or "View Document" to inspect the layout.
7. **Rejection Remarks**: Reject a form from either queue, verify mandatory remarks validation, and check the **Rejected Tab**.
8. **Reset Data**: Click "Reset Sample Records" in the sidebar footer anytime to restore default testing records.
