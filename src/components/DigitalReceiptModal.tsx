import React from 'react';
import { Collection } from '../types';
import { formatBDT, formatDate, numberToEnglishWords } from '../utils/formatters';
import { useProject } from '../context/ProjectContext';
import { Printer, X, CheckCircle, Building2, Download } from 'lucide-react';

interface DigitalReceiptModalProps {
  receipt: Collection | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ receipt, onClose }) => {
  const { activeProject, lang, t } = useProject();

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountInWords = numberToEnglishWords(receipt.amount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 printable-card">
        
        {/* Action Header - Hidden during print */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-semibold text-base text-white">
                {t('Digital Money Receipt', 'ডিজিটাল মানি রিসিট')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('Official acknowledgment of payment', 'অনুমোদিত অর্থ প্রাপ্তির রশিদ')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('Print Receipt', 'রিসিট প্রিন্ট করুন')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Voucher Content */}
        <div className="p-8 sm:p-10 text-slate-900 bg-white selection:bg-emerald-100">
          {/* Top Company Header */}
          <div className="border-b-2 border-emerald-700 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-emerald-900 uppercase">
                    {activeProject.company || 'PLANET Living Limited'}
                  </h1>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {activeProject.name} ({activeProject.banglaName})
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Location: {activeProject.location} | Central Project Portal: landprojecthisab.com
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block border border-emerald-800 text-emerald-900 px-3 py-1 font-bold text-xs uppercase tracking-widest bg-emerald-50 rounded">
                  Money Receipt
                </span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                  No: <span className="text-emerald-700">{receipt.receiptNo}</span>
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Date: <span className="font-semibold">{formatDate(receipt.date)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Body Information Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Received From / সদস্যের নাম:
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {receipt.memberName}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Plot / Share Identification:
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {receipt.plotNo ? `Plot No: ${receipt.plotNo}` : 'General Share Investment'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Payment Purpose:
                </span>
                <span className="inline-block px-2.5 py-0.5 mt-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">
                  {receipt.purpose}
                  {receipt.installmentMonth && ` (${receipt.installmentMonth})`}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Payment Mode:
                </span>
                <p className="font-semibold text-slate-800 mt-1">
                  {receipt.paymentMethod}
                  {receipt.bankName && ` - ${receipt.bankName}`}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Reference / Cheque / Trx No:
                </span>
                <p className="font-mono text-slate-700 mt-1">
                  {receipt.chequeOrTrxNo || 'N/A (Cash)'}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-emerald-50 border-2 border-emerald-600/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Total Amount Received
              </span>
              <p className="text-xs italic text-emerald-900 mt-1">
                In words: <span className="font-medium underline">{amountInWords}</span>
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-6">
              <span className="text-xs text-slate-500 block">Amount in Figures</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
                {formatBDT(receipt.amount)}
              </p>
            </div>
          </div>

          {/* Remarks */}
          {receipt.remarks && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-8">
              <span className="font-semibold text-slate-700">Remarks / বিবরণ:</span> {receipt.remarks}
            </div>
          )}

          {/* Official Signatures */}
          <div className="pt-12 mt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 border-t border-slate-200">
            <div>
              <div className="border-t border-slate-400 w-32 mx-auto mb-1"></div>
              <p className="font-semibold text-slate-800">{receipt.collectedBy || 'Accountant'}</p>
              <p className="text-[11px] text-slate-400">Prepared By</p>
            </div>
            <div>
              <div className="border-t border-slate-400 w-32 mx-auto mb-1"></div>
              <p className="font-semibold text-slate-800">Internal Audit</p>
              <p className="text-[11px] text-slate-400">Checked & Verified</p>
            </div>
            <div>
              <div className="border-t border-slate-400 w-32 mx-auto mb-1"></div>
              <p className="font-semibold text-emerald-900">PLANET Living Ltd.</p>
              <p className="text-[11px] text-slate-400">Authorized Signatory</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>This is a computer-generated digital money receipt managed via LandProjectHisab.com</span>
            <span>Generated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {t('Tip: You can print or save as PDF using your browser dialog.', 'পরামর্শ: প্রিন্ট ডায়ালগ থেকে সরাসরি PDF হিসেবে সেভ করতে পারবেন।')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t('Close', 'বন্ধ করুন')}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('Print / Save PDF', 'প্রিন্ট / সেভ করুন')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
