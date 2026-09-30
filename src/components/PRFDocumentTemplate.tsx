import React from 'react';
import { PRFItem } from '../types';
import { DEFAULT_MANAGER, DEFAULT_HOD, MEDIA_PRIMA_SVG } from '../constants/presets';

interface PRFDocumentTemplateProps {
  prf: PRFItem;
  id?: string;
  isPrintMode?: boolean;
}

export const PRFDocumentTemplate: React.FC<PRFDocumentTemplateProps> = ({
  prf,
  id = 'prf-doc-template',
  isPrintMode = false,
}) => {
  const formatCurrency = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div
      id={id}
      className={`font-sans leading-tight ${
        isPrintMode
          ? 'p-8 max-w-[210mm] mx-auto'
          : 'p-6 md:p-8 max-w-[800px] mx-auto shadow-sm rounded-sm'
      }`}
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        borderColor: '#e2e8f0',
        borderWidth: isPrintMode ? '0px' : '1px',
        borderStyle: 'solid',
        fontFamily: "'Plus Jakarta Sans', Arial, Helvetica, sans-serif",
      }}
    >
      {/* Top Header Section */}
      <div className="flex items-start justify-between mb-3 pb-1">
        {/* Media Prima Official Logo (Matching download.png) */}
        <div className="flex items-center">
          <img
            src={MEDIA_PRIMA_SVG}
            alt="Media Prima"
            className="h-11 w-auto object-contain"
            style={{
              height: '44px',
              width: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* Finance Department & Document Title */}
        <div className="text-right">
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: '#000000' }}
          >
            FINANCE DEPARTMENT
          </div>
          <div
            className="text-sm font-extrabold italic uppercase tracking-normal mt-0.5"
            style={{ color: '#000000' }}
          >
            PAYMENT REQUISITION FORM
          </div>
          {/* Reference tracking boxes */}
          <div className="flex justify-end mt-2">
            <div
              className="grid grid-cols-6 h-5 w-36 divide-x"
              style={{
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                borderColor: '#000000',
              }}
            >
              <div style={{ borderColor: '#000000' }}></div>
              <div style={{ borderColor: '#000000' }}></div>
              <div style={{ borderColor: '#000000' }}></div>
              <div style={{ borderColor: '#000000' }}></div>
              <div style={{ borderColor: '#000000' }}></div>
              <div style={{ borderColor: '#000000' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* A. REQUESTER'S PARTICULARS */}
      <div
        className="mb-3"
        style={{ border: '1px solid #000000', borderColor: '#000000' }}
      >
        {/* Yellow Header */}
        <div
          className="px-2 py-1 font-bold text-xs uppercase tracking-wide"
          style={{
            backgroundColor: '#FFF03F',
            color: '#000000',
            borderBottom: '1px solid #000000',
          }}
        >
          A. REQUESTER’S PARTICULARS
        </div>
        {/* 4 Rows */}
        <div
          className="divide-y text-xs"
          style={{ borderColor: '#000000' }}
        >
          <div className="grid grid-cols-12" style={{ borderBottom: '1px solid #000000' }}>
            <div
              className="col-span-3 px-2 py-1 font-bold uppercase"
              style={{ color: '#000000' }}
            >
              NAME
            </div>
            <div
              className="col-span-9 px-2 py-1 font-medium uppercase"
              style={{ borderLeft: '1px solid #000000', color: '#000000' }}
            >
              {prf.requesterName}
            </div>
          </div>
          <div className="grid grid-cols-12" style={{ borderBottom: '1px solid #000000' }}>
            <div
              className="col-span-3 px-2 py-1 font-bold uppercase"
              style={{ color: '#000000' }}
            >
              STAFF NO.
            </div>
            <div
              className="col-span-9 px-2 py-1 font-medium uppercase"
              style={{ borderLeft: '1px solid #000000', color: '#000000' }}
            >
              {prf.staffId}
            </div>
          </div>
          <div className="grid grid-cols-12" style={{ borderBottom: '1px solid #000000' }}>
            <div
              className="col-span-3 px-2 py-1 font-bold uppercase"
              style={{ color: '#000000' }}
            >
              DEPT. / SECT.
            </div>
            <div
              className="col-span-9 px-2 py-1 font-medium uppercase"
              style={{ borderLeft: '1px solid #000000', color: '#000000' }}
            >
              {prf.deptSection || 'HUMAN RESOURCES'}
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div
              className="col-span-3 px-2 py-1 font-bold uppercase"
              style={{ color: '#000000' }}
            >
              DATE
            </div>
            <div
              className="col-span-9 px-2 py-1 font-medium"
              style={{ borderLeft: '1px solid #000000', color: '#000000' }}
            >
              {prf.submissionDate}
            </div>
          </div>
        </div>
      </div>

      {/* B. EXPENSES DETAILS */}
      <div
        className="mb-3"
        style={{ border: '1px solid #000000', borderColor: '#000000' }}
      >
        {/* Yellow Header */}
        <div
          className="px-2 py-1 font-bold text-xs uppercase tracking-wide"
          style={{
            backgroundColor: '#FFF03F',
            color: '#000000',
            borderBottom: '1px solid #000000',
          }}
        >
          B. EXPENSES DETAILS
        </div>

        {/* Expenses Table Header */}
        <table className="w-full text-xs border-collapse" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr
              className="font-bold text-[11px] text-center"
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                borderBottom: '1px solid #000000',
              }}
            >
              <th className="py-1 px-1 w-[6%] font-bold" style={{ borderRight: '1px solid #000000' }}>NO.</th>
              <th className="py-1 px-2 w-[28%] font-bold" style={{ borderRight: '1px solid #000000' }}>PAYMENT TO</th>
              <th className="py-1 px-2 w-[42%] font-bold" style={{ borderRight: '1px solid #000000' }}>PURPOSE OF PAYMENT</th>
              <th className="py-1 px-1 w-[12%] font-bold" style={{ borderRight: '1px solid #000000' }}>INVOICE NO.</th>
              <th className="py-1 px-1 w-[12%] font-bold">AMOUNT<br />(MYR)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="align-top" style={{ borderBottom: '1px solid #000000' }}>
              {/* NO */}
              <td
                className="p-1 text-center font-bold"
                style={{ borderRight: '1px solid #000000', color: '#000000' }}
              >
                1.
              </td>

              {/* PAYMENT TO */}
              <td
                className="p-2 space-y-2 text-[11px]"
                style={{ borderRight: '1px solid #000000', color: '#000000' }}
              >
                <div>
                  <span className="font-bold block" style={{ color: '#000000' }}>ACCOUNT NAME:</span>
                  <span className="uppercase font-semibold" style={{ color: '#000000' }}>{prf.accountName}</span>
                </div>
                <div>
                  <span className="font-bold block" style={{ color: '#000000' }}>BANK NAME:</span>
                  <span className="uppercase" style={{ color: '#000000' }}>{prf.bankName}</span>
                </div>
                <div>
                  <span className="font-bold block" style={{ color: '#000000' }}>ACCOUNT NO:</span>
                  <span className="font-mono font-medium" style={{ color: '#000000' }}>{prf.accountNo}</span>
                </div>
                <div className="pt-2">
                  <span className="block font-medium" style={{ color: '#000000' }}>Payment slip email to:</span>
                  <span className="underline text-[10px] break-all" style={{ color: '#1e3a8a' }}>{prf.paymentSlipEmail}</span>
                </div>
              </td>

              {/* PURPOSE OF PAYMENT */}
              <td
                className="p-2 text-[11px] space-y-1.5"
                style={{ borderRight: '1px solid #000000', color: '#000000' }}
              >
                <div>
                  <span className="font-bold" style={{ color: '#000000' }}>Program : </span>
                  <span style={{ color: '#000000' }}>{prf.program}</span>
                </div>
                <div>
                  <span className="font-bold" style={{ color: '#000000' }}>Date : </span>
                  <span style={{ color: '#000000' }}>{prf.eventDate}</span>
                </div>
                <div>
                  <span className="font-bold" style={{ color: '#000000' }}>Venue : </span>
                  <span style={{ color: '#000000' }}>{prf.venue}</span>
                </div>
                <div className="pt-1">
                  <span className="font-bold" style={{ color: '#000000' }}>Budget : </span>
                  <span style={{ color: '#000000' }}>{prf.budgetCategory || 'Training Budget'}</span>
                </div>

                {/* Sub-table: BIZ PAX CHARGE */}
                <div className="mt-2" style={{ border: '1px solid #000000' }}>
                  <table className="w-full text-[10px] text-center border-collapse" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="font-bold" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                        <th className="py-0.5 px-1 text-left" style={{ borderRight: '1px solid rgba(255,255,255,0.4)', color: '#ffffff' }}>BIZ</th>
                        <th className="py-0.5 px-1 w-12" style={{ borderRight: '1px solid rgba(255,255,255,0.4)', color: '#ffffff' }}>PAX</th>
                        <th className="py-0.5 px-1 w-20" style={{ color: '#ffffff' }}>CHARGE (MYR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prf.budgetBreakdown && prf.budgetBreakdown.length > 0 ? (
                        prf.budgetBreakdown.map((item, idx) => (
                          <tr key={idx} className="h-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
                            <td className="text-left px-1 py-0.5 font-medium" style={{ borderRight: '1px solid rgba(0,0,0,0.2)', color: '#000000' }}>
                              {item.biz}
                            </td>
                            <td className="px-1 py-0.5" style={{ borderRight: '1px solid rgba(0,0,0,0.2)', color: '#000000' }}>
                              {item.pax}
                            </td>
                            <td className="px-1 py-0.5 font-mono text-right" style={{ color: '#000000' }}>
                              {formatCurrency(item.charge)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
                          <td className="text-left px-1 py-0.5" style={{ borderRight: '1px solid rgba(0,0,0,0.2)', color: '#000000' }}>Media Prima Corporate</td>
                          <td className="px-1 py-0.5" style={{ borderRight: '1px solid rgba(0,0,0,0.2)', color: '#000000' }}>-</td>
                          <td className="px-1 py-0.5 font-mono text-right" style={{ color: '#000000' }}>{formatCurrency(prf.totalAmount)}</td>
                        </tr>
                      )}
                      {/* Sub-table TOTAL row */}
                      <tr className="font-bold" style={{ backgroundColor: '#e2e8f0', borderTop: '1px solid #000000', color: '#000000' }}>
                        <td className="text-left px-1 py-0.5 uppercase" style={{ borderRight: '1px solid rgba(0,0,0,0.3)', color: '#000000' }}>TOTAL</td>
                        <td className="px-1 py-0.5" style={{ borderRight: '1px solid rgba(0,0,0,0.3)' }}></td>
                        <td className="px-1 py-0.5 font-mono text-right" style={{ color: '#000000' }}>{formatCurrency(prf.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-[10px] italic" style={{ color: '#334155' }}>
                  {prf.budgetNote || 'note: Including the trainer 1 pax'}
                </div>
              </td>

              {/* INVOICE NO */}
              <td
                className="p-2 text-center font-mono font-semibold text-[11px]"
                style={{ borderRight: '1px solid #000000', color: '#000000' }}
              >
                {prf.invoiceNo}
              </td>

              {/* AMOUNT (MYR) */}
              <td
                className="p-2 text-right font-mono font-semibold text-[11px]"
                style={{ color: '#000000' }}
              >
                {formatCurrency(prf.billAmount)}
              </td>
            </tr>

            {/* TOTAL Row */}
            <tr className="font-bold text-xs" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #000000' }}>
              <td colSpan={3} style={{ borderRight: '1px solid #000000' }}></td>
              <td
                className="p-1 text-center font-bold uppercase"
                style={{ borderRight: '1px solid #000000', backgroundColor: '#f8fafc', color: '#000000' }}
              >
                TOTAL
              </td>
              <td
                className="p-1 text-right font-mono font-bold"
                style={{ backgroundColor: '#f8fafc', color: '#000000' }}
              >
                {formatCurrency(prf.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signatures Section */}
        <div>
          {/* Signatures Yellow Header */}
          <div
            className="grid grid-cols-3 text-center font-bold text-xs py-1"
            style={{
              backgroundColor: '#FFF03F',
              color: '#000000',
              borderBottom: '1px solid #000000',
            }}
          >
            <div className="uppercase" style={{ borderRight: '1px solid #000000' }}>PREPARED BY</div>
            <div className="uppercase" style={{ borderRight: '1px solid #000000' }}>VERIFIED BY</div>
            <div className="uppercase">APPROVED BY</div>
          </div>

          {/* 1. Signature Drawings Row */}
          <div className="grid grid-cols-3 text-xs min-h-[75px]">
            {/* Box 1: Prepared by Signature */}
            <div
              className="p-2 flex items-center justify-center"
              style={{ borderRight: '1px solid #000000' }}
            >
              {prf.requesterSignature ? (
                <img
                  src={prf.requesterSignature}
                  alt="Requester Signature"
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <span className="text-[10px] italic" style={{ color: '#94a3b8' }}>[Signature]</span>
              )}
            </div>

            {/* Box 2: Verified by Signature */}
            <div
              className="p-2 flex items-center justify-center"
              style={{ borderRight: '1px solid #000000' }}
            >
              {prf.managerSignature ? (
                <img
                  src={prf.managerSignature}
                  alt="Manager Signature"
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <span className="text-[10px] italic" style={{ color: '#94a3b8' }}></span>
              )}
            </div>

            {/* Box 3: Approved by Signature */}
            <div className="p-2 flex items-center justify-center">
              {prf.hodSignature ? (
                <img
                  src={prf.hodSignature}
                  alt="HOD Signature"
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <span className="text-[10px] italic" style={{ color: '#94a3b8' }}></span>
              )}
            </div>
          </div>

          {/* 2. Names & Designations Row (Matching image.png) */}
          <div
            className="grid grid-cols-3 text-center text-xs py-1.5"
            style={{
              borderTop: '1px solid #000000',
              borderBottom: '1px solid #000000',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Column 1: Requester */}
            <div className="px-2" style={{ borderRight: '1px solid #000000' }}>
              <div className="font-bold uppercase text-[11px] leading-tight" style={{ color: '#000000' }}>
                {prf.requesterName}
              </div>
              <div className="text-[10px] leading-tight uppercase font-normal mt-0.5" style={{ color: '#000000' }}>
                EXE, TALENT DEV. & CULTURE
              </div>
            </div>

            {/* Column 2: Manager (NOR INTAN HASALIMAH HASHIM) */}
            <div className="px-2" style={{ borderRight: '1px solid #000000' }}>
              <div className="font-bold uppercase text-[11px] leading-tight" style={{ color: '#000000' }}>
                NOR INTAN HASALIMAH HASHIM
              </div>
              <div className="text-[10px] leading-tight uppercase font-normal mt-0.5" style={{ color: '#000000' }}>
                SM, STRA. WORKFORCE & CAP. DEV
              </div>
            </div>

            {/* Column 3: HOD (DONA SITI ZAWINA DON NAJIB) */}
            <div className="px-2">
              <div className="font-bold uppercase text-[11px] leading-tight" style={{ color: '#000000' }}>
                DONA SITI ZAWINA DON NAJIB
              </div>
              <div className="text-[10px] leading-tight uppercase font-normal mt-0.5" style={{ color: '#000000' }}>
                GEN. MANAGER, S.O.D.E, GHR
              </div>
            </div>
          </div>

          {/* 3. Dates Row (Matching image.png) */}
          <div
            className="grid grid-cols-3 text-xs py-1"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Column 1: DATE: {{DATE}} */}
            <div className="px-2 font-bold text-[10px]" style={{ borderRight: '1px solid #000000', color: '#000000' }}>
              DATE: <span className="font-bold" style={{ color: '#000000' }}>{prf.requesterSignatureDate || prf.submissionDate}</span>
            </div>

            {/* Column 2: DATE: */}
            <div className="px-2 font-bold text-[10px]" style={{ borderRight: '1px solid #000000', color: '#000000' }}>
              DATE: <span className="font-bold" style={{ color: '#000000' }}>{prf.managerSignatureDate || ''}</span>
            </div>

            {/* Column 3: DATE: */}
            <div className="px-2 font-bold text-[10px]" style={{ color: '#000000' }}>
              DATE: <span className="font-bold" style={{ color: '#000000' }}>{prf.hodSignatureDate || ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* C. FINANCE DEPT. USE */}
      <div style={{ border: '1px solid #000000', borderColor: '#000000' }}>
        {/* Yellow Header */}
        <div
          className="px-2 py-1 font-bold text-xs uppercase tracking-wide"
          style={{
            backgroundColor: '#FFF03F',
            color: '#000000',
            borderBottom: '1px solid #000000',
          }}
        >
          C. FINANCE DEPT. USE
        </div>
        {/* Sub Header */}
        <div
          className="grid grid-cols-2 text-center font-bold text-xs py-0.5"
          style={{
            backgroundColor: '#FFF03F',
            color: '#000000',
            borderBottom: '1px solid #000000',
          }}
        >
          <div style={{ borderRight: '1px solid #000000' }}>VERIFIED BY</div>
          <div>APPROVED BY</div>
        </div>
        {/* Finance Fields */}
        <div className="grid grid-cols-2 text-xs min-h-[50px]">
          <div
            className="p-2 flex flex-col justify-between"
            style={{ borderRight: '1px solid #000000', color: '#000000' }}
          >
            <div className="font-bold text-[11px]" style={{ color: '#000000' }}>NAME:</div>
            <div className="font-bold text-[11px] mt-3" style={{ color: '#000000' }}>DATE:</div>
          </div>
          <div
            className="p-2 flex flex-col justify-between"
            style={{ color: '#000000' }}
          >
            <div className="font-bold text-[11px]" style={{ color: '#000000' }}>NAME:</div>
            <div className="font-bold text-[11px] mt-3" style={{ color: '#000000' }}>DATE:</div>
          </div>
        </div>
      </div>
    </div>
  );
};
