import React, { useState } from 'react';
import {
  FilePlus2,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import { PRFItem, BudgetBreakdownItem } from '../types';
import { REQUESTER_PRESETS, SAMPLE_SIGNATURE_REQUESTER, SAMPLE_SIGNATURE_MANAGER, SAMPLE_SIGNATURE_HOD } from '../constants/presets';
import { SignaturePad } from './SignaturePad';

interface NewFormViewProps {
  onSubmit: (prf: PRFItem) => void;
  onCancel: () => void;
}

export const NewFormView: React.FC<NewFormViewProps> = ({ onSubmit, onCancel }) => {
  const todayStr = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

  // Preset default
  const defaultPreset = REQUESTER_PRESETS[0];

  // Form states
  const [selectedRequesterName, setSelectedRequesterName] = useState(defaultPreset.name);
  const [staffId, setStaffId] = useState(defaultPreset.staffId);
  const [deptSection, setDeptSection] = useState('HUMAN RESOURCES');
  const [paymentSlipEmail, setPaymentSlipEmail] = useState(defaultPreset.email);
  const [submissionDate, setSubmissionDate] = useState(todayStr);

  // Expenses fields
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [program, setProgram] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('Training Budget');
  const [budgetNote, setBudgetNote] = useState('note: Including the trainer 1 pax');
  
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdownItem[]>([
    { id: '1', biz: 'Media Prima Television Networks', pax: 10, charge: 6000 },
  ]);

  const [invoiceNo, setInvoiceNo] = useState('');
  const [billAmount, setBillAmount] = useState<string>('');
  
  // Attachments & Signatures
  const [invoiceFileName, setInvoiceFileName] = useState<string>('');
  const [invoiceFileSize, setInvoiceFileSize] = useState<string>('');
  const [invoiceFileData, setInvoiceFileData] = useState<string>('');

  const [requesterSignature, setRequesterSignature] = useState<string | undefined>(SAMPLE_SIGNATURE_REQUESTER);
  const [managerSignature, setManagerSignature] = useState<string | undefined>(undefined);
  const [hodSignature, setHodSignature] = useState<string | undefined>(undefined);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Auto-fill when selecting name
  const handleRequesterChange = (name: string) => {
    setSelectedRequesterName(name);
    const found = REQUESTER_PRESETS.find((p) => p.name === name);
    if (found) {
      setStaffId(found.staffId);
      setPaymentSlipEmail(found.email);
      setErrors((prev) => ({ ...prev, requesterName: '', staffId: '', paymentSlipEmail: '' }));
    }
  };

  // Quick fill sample data for fast testing
  const handleFillSample = () => {
    setAccountName('ROYALE CHULAN KUALA LUMPUR');
    setBankName('MALAYAN BANKING BERHAD (MAYBANK)');
    setAccountNo('514011598214');
    setProgram('Strategic Human Capital Leadership Masterclass 2026');
    setEventDate('18 - 20 November 2026');
    setVenue('Royale Chulan Damansara, Ballroom 2');
    setInvoiceNo('RC-INV-2026-9482');
    setBillAmount('14200.00');
    setBudgetBreakdown([
      { id: '1', biz: 'Media Prima Corporate HR', pax: 8, charge: 8000 },
      { id: '2', biz: 'REV Media Group', pax: 6, charge: 6200 },
    ]);
    setInvoiceFileName('Royale_Chulan_Official_Quote_9482.pdf');
    setInvoiceFileSize('1.2 MB');
    setRequesterSignature(SAMPLE_SIGNATURE_REQUESTER);
    setErrors({});
  };

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInvoiceFileName(file.name);
    setInvoiceFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setInvoiceFileData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, invoice: '' }));
  };

  const addBreakdownRow = () => {
    const newId = String(Date.now());
    setBudgetBreakdown([
      ...budgetBreakdown,
      { id: newId, biz: '', pax: 1, charge: 0 },
    ]);
  };

  const removeBreakdownRow = (id: string) => {
    if (budgetBreakdown.length <= 1) return;
    setBudgetBreakdown(budgetBreakdown.filter((item) => item.id !== id));
  };

  const updateBreakdownRow = (id: string, field: keyof BudgetBreakdownItem, val: any) => {
    setBudgetBreakdown(
      budgetBreakdown.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const parsedAmount = parseFloat(billAmount) || 0;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedRequesterName) errs.requesterName = 'Requester Name is required';
    if (!accountName.trim()) errs.accountName = 'Account Name is required';
    if (!bankName.trim()) errs.bankName = 'Bank Name is required';
    if (!accountNo.trim()) errs.accountNo = 'Account Number is required';
    if (!program.trim()) errs.program = 'Program / Title Training is required';
    if (!eventDate.trim()) errs.eventDate = 'Event Date is required';
    if (!venue.trim()) errs.venue = 'Venue is required';
    if (!invoiceNo.trim()) errs.invoiceNo = 'Invoice No. is required';
    if (!billAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errs.billAmount = 'Valid Bill Amount is required';
    }
    if (!requesterSignature) {
      errs.requesterSignature = 'Requester signature is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNo = `PRF-2026-${randomSuffix}`;

    const newPrf: PRFItem = {
      id: `prf-${Date.now()}`,
      refNo,
      createdAt: new Date().toISOString(),
      submissionDate,
      requesterName: selectedRequesterName,
      staffId,
      deptSection: deptSection || 'HUMAN RESOURCES',
      paymentSlipEmail,
      accountName,
      bankName,
      accountNo,
      program,
      eventDate,
      venue,
      budgetCategory,
      budgetBreakdown,
      budgetNote,
      invoiceNo,
      billAmount: parsedAmount,
      totalAmount: parsedAmount,
      invoiceFileName: invoiceFileName || 'Invoice_Supporting_Document.pdf',
      invoiceFileSize: invoiceFileSize || '850 KB',
      invoiceFileData,
      requesterSignature,
      requesterSignatureDate: submissionDate,
      managerSignature,
      managerSignatureDate: managerSignature ? submissionDate : undefined,
      hodSignature,
      hodSignatureDate: hodSignature ? submissionDate : undefined,
      status: 'pending_manager',
    };

    onSubmit(newPrf);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Top Banner & Quick Fill */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-[#ED1C24]" />
            New Payment Requisition Form (PRF)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Finance Department compliance: Cost Center and Broadcast Location are excluded.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Auto-fill Sample Data</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Particulars & Expenses (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section A: Requester Particulars */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ED1C24]">
                  Section A
                </span>
                <h3 className="text-sm font-bold text-slate-900">Requester Particulars</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requester Name Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requester Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRequesterName}
                    onChange={(e) => handleRequesterChange(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 transition ${
                      errors.requesterName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  >
                    {REQUESTER_PRESETS.map((preset) => (
                      <option key={preset.name} value={preset.name}>
                        {preset.name}
                      </option>
                    ))}
                  </select>
                  {errors.requesterName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.requesterName}</p>
                  )}
                </div>

                {/* Staff ID (Auto-filled) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff ID <span className="text-slate-400 font-normal">(Auto-filled)</span>
                  </label>
                  <input
                    type="text"
                    value={staffId}
                    readOnly
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-slate-700 select-all"
                  />
                </div>

                {/* Dept / Section */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Section
                  </label>
                  <input
                    type="text"
                    value={deptSection}
                    onChange={(e) => setDeptSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg uppercase"
                  />
                </div>

                {/* Submission Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requisition Date
                  </label>
                  <input
                    type="text"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Payment Slip Email To */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Slip Email To <span className="text-slate-400 font-normal">(Auto-filled)</span>
                  </label>
                  <input
                    type="email"
                    value={paymentSlipEmail}
                    onChange={(e) => setPaymentSlipEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Expenses Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ED1C24]">
                  Section B
                </span>
                <h3 className="text-sm font-bold text-slate-900">Expenses & Payment Particulars</h3>
              </div>

              {/* Payee Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Name (Payee) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ROYALE CHULAN KUALA LUMPUR"
                    value={accountName}
                    onChange={(e) => {
                      setAccountName(e.target.value);
                      if (errors.accountName) setErrors({ ...errors, accountName: '' });
                    }}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 uppercase ${
                      errors.accountName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  {errors.accountName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.accountName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MALAYAN BANKING BERHAD"
                    value={bankName}
                    onChange={(e) => {
                      setBankName(e.target.value);
                      if (errors.bankName) setErrors({ ...errors, bankName: '' });
                    }}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 uppercase ${
                      errors.bankName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  {errors.bankName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.bankName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 514011598214"
                    value={accountNo}
                    onChange={(e) => {
                      setAccountNo(e.target.value);
                      if (errors.accountNo) setErrors({ ...errors, accountNo: '' });
                    }}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-red-500 ${
                      errors.accountNo ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  {errors.accountNo && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.accountNo}</p>
                  )}
                </div>
              </div>

              {/* Purpose & Event Details */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title Training / Program <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Executive Strategic Leadership Workshop 2026"
                    value={program}
                    onChange={(e) => {
                      setProgram(e.target.value);
                      if (errors.program) setErrors({ ...errors, program: '' });
                    }}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                      errors.program ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  {errors.program && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.program}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 - 17 October 2026"
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        if (errors.eventDate) setErrors({ ...errors, eventDate: '' });
                      }}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                        errors.eventDate ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    {errors.eventDate && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.eventDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Venue <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royale Chulan Damansara"
                      value={venue}
                      onChange={(e) => {
                        setVenue(e.target.value);
                        if (errors.venue) setErrors({ ...errors, venue: '' });
                      }}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                        errors.venue ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    {errors.venue && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.venue}</p>
                    )}
                  </div>
                </div>

                {/* Budget Breakdown Table */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Budget Breakdown (BIZ / PAX / CHARGE)
                    </label>
                    <button
                      type="button"
                      onClick={addBreakdownRow}
                      className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Business Unit
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 text-left">BIZ (Entity / Division)</th>
                          <th className="py-2 px-2 text-center w-20">PAX</th>
                          <th className="py-2 px-3 text-right w-28">CHARGE (MYR)</th>
                          <th className="py-2 px-2 text-center w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {budgetBreakdown.map((row) => (
                          <tr key={row.id}>
                            <td className="p-1.5">
                              <input
                                type="text"
                                placeholder="Division name"
                                value={row.biz}
                                onChange={(e) => updateBreakdownRow(row.id, 'biz', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                              />
                            </td>
                            <td className="p-1.5 text-center">
                              <input
                                type="number"
                                min="1"
                                value={row.pax}
                                onChange={(e) => updateBreakdownRow(row.id, 'pax', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 text-xs text-center border border-slate-200 rounded"
                              />
                            </td>
                            <td className="p-1.5 text-right">
                              <input
                                type="number"
                                step="0.01"
                                value={row.charge}
                                onChange={(e) => updateBreakdownRow(row.id, 'charge', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 text-xs text-right font-mono border border-slate-200 rounded"
                              />
                            </td>
                            <td className="p-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => removeBreakdownRow(row.id)}
                                disabled={budgetBreakdown.length <= 1}
                                className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <input
                    type="text"
                    value={budgetNote}
                    onChange={(e) => setBudgetNote(e.target.value)}
                    className="mt-1.5 w-full text-[11px] text-slate-500 italic bg-transparent border-0 px-1 py-0.5 focus:outline-none"
                  />
                </div>

                {/* Invoice No and Bill Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Invoice No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INV-RC-2026-9041"
                      value={invoiceNo}
                      onChange={(e) => {
                        setInvoiceNo(e.target.value);
                        if (errors.invoiceNo) setErrors({ ...errors, invoiceNo: '' });
                      }}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-red-500 uppercase ${
                        errors.invoiceNo ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    {errors.invoiceNo && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.invoiceNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bill / Total Amount (MYR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={billAmount}
                      onChange={(e) => {
                        setBillAmount(e.target.value);
                        if (errors.billAmount) setErrors({ ...errors, billAmount: '' });
                      }}
                      className={`w-full px-3 py-2 text-xs bg-white border rounded-lg font-mono text-right font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 ${
                        errors.billAmount ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    {errors.billAmount && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.billAmount}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Attachments & Signatures (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Supporting Document / Invoice */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ED1C24]">
                  Attachment
                </span>
                <h3 className="text-sm font-bold text-slate-900">Tax Invoice / Quotation</h3>
              </div>

              {invoiceFileName ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-red-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {invoiceFileName}
                      </div>
                      <div className="text-[10px] text-slate-400">{invoiceFileSize}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceFileName('');
                      setInvoiceFileSize('');
                      setInvoiceFileData('');
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50">
                  <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-800">
                    Upload Tax Invoice / Proforma
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PDF, JPG, or PNG up to 10MB
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleInvoiceUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Digital Signatures Uploads */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ED1C24]">
                  Authorization
                </span>
                <h3 className="text-sm font-bold text-slate-900">Digital Signatures</h3>
                <p className="text-[11px] text-slate-400">
                  Attach or draw signatures now or during designated approval stage.
                </p>
              </div>

              {/* Requester Signature (Mandatory) */}
              <div>
                <SignaturePad
                  label="Requester Signature"
                  signature={requesterSignature}
                  onChange={(sig) => {
                    setRequesterSignature(sig);
                    if (errors.requesterSignature) setErrors({ ...errors, requesterSignature: '' });
                  }}
                  required={true}
                  presetSignature={SAMPLE_SIGNATURE_REQUESTER}
                  helperText="Prepared by signature for verification"
                />
                {errors.requesterSignature && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.requesterSignature}</p>
                )}
              </div>

              {/* Manager Signature (Optional at creation) */}
              <div className="pt-3 border-t border-slate-100">
                <SignaturePad
                  label="Manager Signature (Optional at creation)"
                  signature={managerSignature}
                  onChange={setManagerSignature}
                  required={false}
                  presetSignature={SAMPLE_SIGNATURE_MANAGER}
                  helperText="Optional: If already endorsed by SM Nor Intan Hasalimah"
                />
              </div>

              {/* HOD Signature (Optional at creation) */}
              <div className="pt-3 border-t border-slate-100">
                <SignaturePad
                  label="HOD Signature (Optional at creation)"
                  signature={hodSignature}
                  onChange={setHodSignature}
                  required={false}
                  presetSignature={SAMPLE_SIGNATURE_HOD}
                  helperText="Optional: If already endorsed by GM Dona Siti Zawina"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ED1C24] hover:bg-[#d9161d] text-white font-semibold text-xs rounded-xl shadow-md shadow-red-900/20 transition active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>Submit PRF for Approval</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 px-4 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition text-center"
              >
                Cancel and Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
