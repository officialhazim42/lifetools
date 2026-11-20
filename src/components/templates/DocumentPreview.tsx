import React from 'react';
import {
  TemplateDefinition,
  DocumentStyling,
  DocumentSection
} from '../../types/templates';

interface DocumentPreviewProps {
  template: TemplateDefinition;
  styling: DocumentStyling;
  data: Record<string, any>;
  sections: DocumentSection[];
  previewRef?: React.RefObject<HTMLDivElement> | any;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  template,
  styling,
  data,
  sections,
  previewRef
}) => {
  // Font Family Class
  const getFontFamily = () => {
    switch (styling.font) {
      case 'playfair':
        return 'font-serif';
      case 'merriweather':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'roboto':
      case 'inter':
      default:
        return 'font-sans';
    }
  };

  // Font Size Class
  const getFontSizeScale = () => {
    switch (styling.fontSize) {
      case 'compact':
        return 'text-[11px] leading-relaxed';
      case 'relaxed':
        return 'text-[14px] leading-loose';
      case 'standard':
      default:
        return 'text-[12px] leading-normal';
    }
  };

  // Paper Dimensions Style
  // Standard A4: 210mm x 297mm (~794px x 1123px at 96 DPI)
  // Standard A4 Landscape: 297mm x 210mm (~1123px x 794px)
  const isLandscape = styling.pageFormat === 'a4-landscape';
  const paperClass = isLandscape
    ? 'w-full max-w-[1123px] min-h-[794px]'
    : 'w-full max-w-[794px] min-h-[1123px]';

  // Calculate Totals for Invoices / Quotes / POs
  const calculateTotals = () => {
    const itemsSection = sections.find((s) => s.id === 'items');
    if (!itemsSection || !itemsSection.items) return null;

    const subtotal = itemsSection.items.reduce((sum, item) => {
      const amt = item.amount !== undefined ? Number(item.amount) : (Number(item.quantity || 1) * Number(item.rate || 0));
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const taxRate = Number(data.taxRate || 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const discount = Number(data.discountAmount || 0);
    const grandTotal = subtotal + taxAmount - discount;

    return { subtotal, taxAmount, taxRate, discount, grandTotal };
  };

  const totals = calculateTotals();

  return (
    <div className="w-full flex justify-center p-2 sm:p-4 bg-slate-200/60 dark:bg-slate-950/70 rounded-2xl overflow-x-auto">
      <div
        ref={previewRef as any}
        id="printable-document-content"
        className={`${paperClass} ${getFontFamily()} ${getFontSizeScale()} bg-white text-slate-900 shadow-xl border border-slate-200/80 p-8 sm:p-12 transition-all print:p-8 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none flex flex-col justify-between`}
        style={{
          boxSizing: 'border-box'
        }}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-6 border-b pb-6" style={{ borderColor: `${styling.accentColor}30` }}>
            <div className="space-y-2 max-w-md">
              {styling.showLogo && styling.logoUrl && (
                <div className="mb-3">
                  <img
                    src={styling.logoUrl}
                    alt="Uploaded Logo"
                    className="h-12 w-auto max-w-[180px] object-contain"
                  />
                </div>
              )}
              <h1
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: styling.accentColor }}
              >
                {styling.headerTitle || template.name.toUpperCase()}
              </h1>
              {data.senderName && (
                <div className="font-bold text-sm text-slate-800">
                  {data.senderName}
                </div>
              )}
              {data.senderCompany && (
                <div className="font-bold text-sm text-slate-800">
                  {data.senderCompany}
                </div>
              )}
              {data.institutionName && (
                <div className="font-bold text-sm text-slate-800">
                  {data.institutionName}
                </div>
              )}
              {data.senderAddress && (
                <div className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">
                  {data.senderAddress}
                </div>
              )}
              {data.contactInfo && (
                <div className="text-xs text-slate-500">
                  {data.contactInfo}
                </div>
              )}
            </div>

            {/* Document Metadata Block */}
            <div className="text-right space-y-1 text-xs sm:text-sm min-w-[180px]">
              {data.documentNo && (
                <div>
                  <span className="text-slate-400 font-medium">Ref / Number: </span>
                  <span className="font-bold text-slate-800 font-mono">{data.documentNo}</span>
                </div>
              )}
              {data.date && (
                <div>
                  <span className="text-slate-400 font-medium">Date: </span>
                  <span className="font-semibold text-slate-800">{data.date}</span>
                </div>
              )}
              {data.dueDate && (
                <div>
                  <span className="text-slate-400 font-medium">Due Date: </span>
                  <span className="font-semibold text-slate-800">{data.dueDate}</span>
                </div>
              )}
              {data.validUntil && (
                <div>
                  <span className="text-slate-400 font-medium">Valid Until: </span>
                  <span className="font-semibold text-slate-800">{data.validUntil}</span>
                </div>
              )}
              {data.monthYear && (
                <div>
                  <span className="text-slate-400 font-medium">Period: </span>
                  <span className="font-semibold text-slate-800">{data.monthYear}</span>
                </div>
              )}
              {data.academicSession && (
                <div>
                  <span className="text-slate-400 font-medium">Session: </span>
                  <span className="font-semibold text-slate-800">{data.academicSession}</span>
                </div>
              )}
            </div>
          </div>

          {/* Client / Recipient Info (if present) */}
          {(data.clientName || data.recipientName || data.receivedFrom || data.consigneeName || data.preparedFor) && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  {data.receivedFrom ? 'Received From:' : data.consigneeName ? 'Dispatch Consignee:' : data.preparedFor ? 'Prepared For:' : 'Bill / Deliver To:'}
                </span>
                <div className="font-bold text-sm text-slate-900">
                  {data.clientName || data.recipientName || data.receivedFrom || data.consigneeName || data.preparedFor}
                </div>
                {data.recipientTitle && <div className="text-slate-600">{data.recipientTitle}</div>}
                {data.recipientCompany && <div className="font-medium text-slate-700">{data.recipientCompany}</div>}
                {data.clientAddress && <div className="text-slate-500 whitespace-pre-line">{data.clientAddress}</div>}
                {data.recipientAddress && <div className="text-slate-500 whitespace-pre-line">{data.recipientAddress}</div>}
                {data.consigneeAddress && <div className="text-slate-500 whitespace-pre-line">{data.consigneeAddress}</div>}
              </div>

              {/* Extra details (transport, reference, emergency contact) */}
              {(data.paymentMethod || data.referenceNo || data.vehicleNo || data.shippingMethod) && (
                <div className="space-y-1 text-right">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Transaction Details:
                  </span>
                  {data.paymentMethod && <div><strong>Method:</strong> {data.paymentMethod}</div>}
                  {data.referenceNo && <div className="font-mono text-slate-600"><strong>Ref:</strong> {data.referenceNo}</div>}
                  {data.vehicleNo && <div className="font-mono text-slate-600"><strong>Vehicle:</strong> {data.vehicleNo}</div>}
                  {data.shippingMethod && <div><strong>Shipping:</strong> {data.shippingMethod}</div>}
                </div>
              )}
            </div>
          )}

          {/* Subject Line (For Letters, Proposals & Emails) */}
          {data.subject && (
            <div className="mt-6 p-3 rounded-lg bg-slate-100/70 border-l-4" style={{ borderColor: styling.accentColor }}>
              <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">Subject: </span>
              <span className="font-bold text-sm text-slate-900">{data.subject}</span>
            </div>
          )}

          {/* Academic / Thesis Titles */}
          {data.assignmentTitle && (
            <div className="mt-8 text-center space-y-4 py-8 border-y border-dashed border-slate-200">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Course: {data.courseCode}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 max-w-xl mx-auto leading-snug">
                {data.assignmentTitle}
              </h2>
              <div className="pt-4 text-xs text-slate-600 space-y-1">
                <div>Submitted by: <strong className="text-slate-900">{data.studentName}</strong> (Roll: {data.rollNumber})</div>
                <div>{data.semester}</div>
                <div className="pt-2 text-slate-500">Submitted to: {data.submittedTo}</div>
              </div>
            </div>
          )}

          {/* Capstone Project Cover */}
          {data.projectTitle && !data.assignmentTitle && (
            <div className="mt-8 text-center space-y-6 py-10 border-y-2" style={{ borderColor: `${styling.accentColor}40` }}>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 max-w-2xl mx-auto leading-tight" style={{ color: styling.accentColor }}>
                {data.projectTitle}
              </h2>
              {data.subtitle && (
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto italic">
                  {data.subtitle}
                </p>
              )}
              <div className="pt-6 text-xs text-slate-700 space-y-2">
                <div>Candidate: <strong className="text-slate-900">{data.submittedBy || data.studentName}</strong></div>
                {data.projectGuide && <div>{data.projectGuide}</div>}
                {data.academicSession && <div className="text-slate-500">{data.academicSession}</div>}
              </div>
            </div>
          )}

          {/* Certificate Award Presentation */}
          {template.id === 'certificate-template' && (
            <div className="my-8 text-center space-y-6 p-8 border-4 border-double rounded-2xl" style={{ borderColor: styling.accentColor }}>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                {data.institution}
              </div>
              <div className="italic text-slate-500 font-serif text-sm">
                {data.awardPreamble}
              </div>
              <div className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif" style={{ color: styling.accentColor }}>
                {data.recipientName}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                {data.citation}
              </p>
              <div className="pt-8 flex justify-between items-end text-xs text-slate-600 max-w-lg mx-auto border-t border-slate-200 mt-8">
                <div className="text-center">
                  <div className="font-serif italic font-bold text-slate-800 mb-1">Approved & Verified</div>
                  <div>{data.instructorSign}</div>
                </div>
                <div className="text-center">
                  <div className="font-serif italic font-bold text-slate-800 mb-1">{data.issueDate}</div>
                  <div>{data.authoritySign}</div>
                </div>
              </div>
            </div>
          )}

          {/* Formal Letter / Memo / Application Body */}
          {(data.letterBody || data.bodyParagraphs || data.body || data.letterContent || data.certificateBody) && (
            <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {data.salutation && <div className="font-bold text-slate-900">{data.salutation}</div>}
              <div className="leading-relaxed">
                {data.letterBody || data.bodyParagraphs || data.body || data.letterContent || data.certificateBody}
              </div>
              {data.workHandover && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <strong>Handover Plan: </strong>{data.workHandover}
                </div>
              )}
              {data.signOff && (
                <div className="pt-4 space-y-4">
                  <div>{data.signOff}</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {data.signatoryName || data.senderName || data.signature || data.employeeName}
                  </div>
                  {data.signatoryTitle && <div className="text-xs text-slate-500">{data.signatoryTitle}</div>}
                </div>
              )}
            </div>
          )}

          {/* Resume Sections (if Resume Builder) */}
          {template.id === 'resume-builder' && (
            <div className="mt-6 space-y-6 text-xs">
              <div className="border-b pb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-1" style={{ color: styling.accentColor }}>
                  Professional Summary
                </h3>
                <p className="text-slate-600 leading-relaxed">{data.summary}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-1" style={{ color: styling.accentColor }}>
                  Technical Skills & Competencies
                </h3>
                <p className="text-slate-700 leading-relaxed font-medium">{data.skills}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: styling.accentColor }}>
                  Work Experience
                </h3>
                <div className="text-slate-700 whitespace-pre-line leading-relaxed">{data.experience}</div>
              </div>

              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: styling.accentColor }}>
                  Education & Qualifications
                </h3>
                <div className="text-slate-700 whitespace-pre-line leading-relaxed">{data.education}</div>
              </div>
            </div>
          )}

          {/* Business Card Layout (8-up printable grid) */}
          {template.id === 'business-card-maker' && (
            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-300 bg-gradient-to-br from-white via-slate-50 to-slate-100/60 flex flex-col justify-between shadow-xs min-h-[160px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{data.fullName}</h4>
                        <div className="text-[11px] font-semibold" style={{ color: styling.accentColor }}>{data.jobTitle}</div>
                      </div>
                      <div className="font-serif text-slate-400 text-xs font-bold">{data.urduName}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{data.company}</div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                    <div>{data.email} | {data.phone}</div>
                    <div>{data.website} | {data.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Document Sections & Dynamic Tables */}
          {sections.map((section) => {
            if (!section.items || section.items.length === 0) return null;

            const isItemizedPricing = section.items.some((item) => item.rate !== undefined || item.amount !== undefined);

            return (
              <div key={section.id} className="mt-6 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700" style={{ color: styling.accentColor }}>
                  {section.title}
                </h3>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3">Description / Item</th>
                        {section.items.some((i) => i.quantity !== undefined) && (
                          <th className="py-2.5 px-3 text-right w-20">Qty</th>
                        )}
                        {section.items.some((i) => i.rate !== undefined) && (
                          <th className="py-2.5 px-3 text-right w-28">Rate ({data.currency || '₹'})</th>
                        )}
                        {isItemizedPricing && (
                          <th className="py-2.5 px-3 text-right w-28">Amount ({data.currency || '₹'})</th>
                        )}
                        {section.items.some((i) => i.note !== undefined || i.status !== undefined) && (
                          <th className="py-2.5 px-3 text-right">Notes / Status</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {section.items.map((item, idx) => {
                        const amount = item.amount !== undefined
                          ? Number(item.amount)
                          : (Number(item.quantity || 1) * Number(item.rate || 0));

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                            <td className="py-2 px-3 font-medium text-slate-800">{item.description}</td>
                            {section.items && section.items.some((i) => i.quantity !== undefined) && (
                              <td className="py-2 px-3 text-right font-mono text-slate-700">{item.quantity || 1}</td>
                            )}
                            {section.items && section.items.some((i) => i.rate !== undefined) && (
                              <td className="py-2 px-3 text-right font-mono text-slate-700">
                                {item.rate !== undefined ? Number(item.rate).toLocaleString() : '-'}
                              </td>
                            )}
                            {isItemizedPricing && (
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                {isNaN(amount) ? '-' : amount.toLocaleString()}
                              </td>
                            )}
                            {section.items && section.items.some((i) => i.note !== undefined || i.status !== undefined) && (
                              <td className="py-2 px-3 text-right text-slate-500 text-[11px]">
                                {item.note || item.status}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Totals Summary Calculation Block (For Invoice/Quote/PO) */}
          {totals && (
            <div className="mt-6 flex justify-end">
              <div className="w-full sm:w-72 space-y-1.5 text-xs border-t pt-3 border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{data.currency || '₹'} {totals.subtotal.toLocaleString()}</span>
                </div>
                {totals.taxRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({totals.taxRate}%):</span>
                    <span className="font-mono font-semibold">{data.currency || '₹'} {totals.taxAmount.toLocaleString()}</span>
                  </div>
                )}
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono font-semibold">-{data.currency || '₹'} {totals.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-300" style={{ color: styling.accentColor }}>
                  <span>Grand Total:</span>
                  <span className="font-mono">{data.currency || '₹'} {totals.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details & Terms */}
          {data.bankDetails && (
            <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <strong className="text-slate-800">Banking & Remittance Details: </strong>
              <span className="text-slate-600 font-mono">{data.bankDetails}</span>
            </div>
          )}
          {data.terms && (
            <div className="mt-3 text-xs text-slate-500">
              <strong>Terms: </strong>{data.terms}
            </div>
          )}
        </div>

        {/* Bottom Footer Note & Page Number */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <div>{styling.footerNote || 'Generated via LifeTools — Client-Side Document Creator'}</div>
          <div className="font-mono">LifeTools.app</div>
        </div>
      </div>
    </div>
  );
};
