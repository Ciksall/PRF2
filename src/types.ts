export type PRFStatus = 'pending_manager' | 'pending_hod' | 'successful' | 'rejected';

export interface BudgetBreakdownItem {
  id: string;
  biz: string;
  pax: number | string;
  charge: number | string;
}

export interface PRFItem {
  id: string;
  refNo: string; // e.g. PRF-2026-0042
  createdAt: string;
  submissionDate: string;
  
  // Section A: Requester Particulars
  requesterName: string;
  staffId: string;
  deptSection: string; // default "HUMAN RESOURCES"
  paymentSlipEmail: string;
  
  // Section B: Expenses Details
  accountName: string;
  bankName: string;
  accountNo: string;
  program: string; // Title Training / Program
  eventDate: string;
  venue: string;
  budgetCategory: string; // default "Training Budget"
  budgetBreakdown: BudgetBreakdownItem[];
  budgetNote: string; // "note: Including the trainer 1 pax"
  invoiceNo: string;
  billAmount: number;
  totalAmount: number;
  
  // Attachments & Signatures
  invoiceFileName?: string;
  invoiceFileData?: string;
  invoiceFileSize?: string;
  
  requesterSignature?: string; // base64 or dataURL
  requesterSignatureDate?: string;
  
  managerSignature?: string;
  managerSignatureDate?: string;
  managerApprovedAt?: string;
  
  hodSignature?: string;
  hodSignatureDate?: string;
  hodApprovedAt?: string;
  
  // Status & Audit Trail
  status: PRFStatus;
  rejectedBy?: 'Manager' | 'HOD';
  rejectionDate?: string;
  rejectionRemarks?: string;
}

export interface RequesterPreset {
  name: string;
  staffId: string;
  email: string;
  roleTitle: string;
}
