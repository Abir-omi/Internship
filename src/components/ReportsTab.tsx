import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { formatBDT, formatDate } from '../utils/formatters';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users, 
  Wallet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const { 
    activeProject, 
    stats, 
    filteredCollections, 
    filteredExpenses, 
    filteredMembers, 
    getMemberPaidAmount, 
    getMemberDueAmount,
    t 
  } = useProject();

  const [activeReportType, setActiveReportType] = useState<'cashbook' | 'dues' | 'categories'>('cashbook');

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(item => keys.map(k => {
        const val = item[k];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCollections = () => {
    const data = filteredCollections.map(c => ({
      ReceiptNo: c.receiptNo,
      Date: c.date,
      MemberName: c.memberName,
      PlotNo: c.plotNo || '',
      Amount: c.amount,
      PaymentMethod: c.paymentMethod,
      Bank: c.bankName || '',
      Purpose: c.purpose,
      Month: c.installmentMonth || '',
      Ref: c.chequeOrTrxNo || ''
    }));
    exportToCSV(data, `${activeProject.name.replace(/\s+/g, '_')}_Collections`);
  };

  const handleExportExpenses = () => {
    const data = filteredExpenses.map(e => ({
      VoucherNo: e.voucherNo,
      Date: e.date,
      Category: e.category,
      Payee: e.payee,
      Amount: e.amount,
      PaymentMethod: e.paymentMethod,
      Purpose: e.purpose,
      AuthorizedBy: e.authorizedBy,
      BillRef: e.billOrRef || ''
    }));
    exportToCSV(data, `${activeProject.name.replace(/\s+/g, '_')}_Expenses`);
  };

  const handleExportDues = () => {
    const data = filteredMembers.map(m => ({
      MemberCode: m.memberCode,
      Name: m.name,
      Phone: m.phone,
      CommittedTotal: m.totalInvestment,
      PaidToDate: getMemberPaidAmount(m.id),
      BalanceDue: getMemberDueAmount(m.id)
    }));
    exportToCSV(data, `${activeProject.name.replace(/\s+/g, '_')}_Member_Dues`);
  };

  // Category breakdown
  const categorySummary = React.useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    filteredExpenses.forEach(e => {
      if (!map[e.category]) {
        map[e.category] = { total: 0, count: 0 };
      }
      map[e.category].total += Number(e.amount);
      map[e.category].count += 1;
    });
    return Object.entries(map).sort(([, a], [, b]) => b.total - a.total);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t('Project Accounts & Financial Reports', 'প্রকল্প হিসাব বিবরণী ও রিপোর্ট')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Audit-ready cashbook, category costs, member due statements, and CSV exports', 'আয়-ব্যয় খতিয়ান, বাকি আদায়ের তালিকা ও এক্সেল/সিএসভি ডাউনলোড')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('Print Report', 'প্রিন্ট')}</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveReportType('cashbook')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeReportType === 'cashbook'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('Cash Book & Inflow/Outflow', 'ক্যাশ বহি (জমা ও খরচ)')}
        </button>

        <button
          onClick={() => setActiveReportType('dues')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeReportType === 'dues'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('Member Due / Arrears Statement', 'সদস্যদের বকেয়া হিসাব')}
        </button>

        <button
          onClick={() => setActiveReportType('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeReportType === 'categories'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('Category-wise Expense Audit', 'খাতওয়ারি খরচের সারসংক্ষেপ')}
        </button>
      </div>

      {/* Report 1: Cashbook Summary */}
      {activeReportType === 'cashbook' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {t('Total Inflow (Collections)', 'মোট আদায় (জমা)')}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-2">
                {formatBDT(stats.totalCollection)}
              </p>
              <button
                onClick={handleExportCollections}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('Export Collections CSV', 'জমার তথ্য এক্সপোর্ট')}</span>
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                {t('Total Outflow (Expenses)', 'মোট খরচ (ব্যয়)')}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-800 mt-2">
                {formatBDT(stats.totalExpense)}
              </p>
              <button
                onClick={handleExportExpenses}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('Export Expenses CSV', 'খরচের তথ্য এক্সপোর্ট')}</span>
              </button>
            </div>

            <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                {t('Current Project Balance', 'হাতে নগদ তহবিল স্থিতি')}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 mt-2">
                {formatBDT(stats.balance)}
              </p>
              <p className="text-xs text-slate-500 mt-4">
                {t('Net available liquidity', 'উদ্বৃত্ত তহবিল')}
              </p>
            </div>
          </div>

          {/* Quick Ledger Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">
              {t('Cash Flow Statement Summary', 'নগদ প্রবাহ বিবরণী')}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{t('Total Member Commitments', 'মোট সদস্য বিনিয়োগ চুক্তি')}</span>
                <span className="font-bold text-slate-900">
                  {formatBDT(filteredMembers.reduce((a, m) => a + Number(m.totalInvestment), 0))}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{t('Actual Realized Revenue', 'প্রকৃত প্রাপ্ত অর্থ')}</span>
                <span className="font-bold text-emerald-700">
                  {formatBDT(stats.totalCollection)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{t('Site Development & Land Costs Incurred', 'ভূমি ও সাইট উন্নয়ন ব্যয়')}</span>
                <span className="font-bold text-rose-700">
                  {formatBDT(stats.totalExpense)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t-2 border-slate-200 text-sm font-extrabold">
                <span className="text-slate-900">{t('Closing Net Cash Balance', 'সমাপনী উদ্বৃত্ত')}</span>
                <span className="text-teal-800">{formatBDT(stats.balance)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Dues Statement */}
      {activeReportType === 'dues' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {t('Outstanding Receivables / Member Due Ledger', 'সদস্যদের বকেয়া কিস্তির তালিকা')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('Total estimated arrears across members', 'সকল সদস্যের কাছে মোট পাওনা বকেয়া')}
              </p>
            </div>

            <button
              onClick={handleExportDues}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('Download Dues CSV', 'বকেয়া তালিকা ডাউনলোড')}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Member Name</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5 text-right">Committed (৳)</th>
                  <th className="px-4 py-3.5 text-right">Paid to Date (৳)</th>
                  <th className="px-4 py-3.5 text-right">Due Balance (৳)</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map(m => {
                  const paid = getMemberPaidAmount(m.id);
                  const due = getMemberDueAmount(m.id);
                  const isClear = due === 0;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800">{m.memberCode}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{m.name}</td>
                      <td className="px-4 py-3 text-slate-500">{m.phone}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700">{formatBDT(m.totalInvestment)}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">{formatBDT(paid)}</td>
                      <td className="px-4 py-3 text-right font-bold text-rose-700">{formatBDT(due)}</td>
                      <td className="px-4 py-3 text-center">
                        {isClear ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Cleared
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            Due Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Category breakdown */}
      {activeReportType === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="font-bold text-sm text-slate-900 mb-4">
              {t('Category-wise Project Expenditure Audit', 'খাতওয়ারি খরচের নিরীক্ষা বিবরণ')}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Category Head</th>
                    <th className="px-4 py-3">Vouchers Count</th>
                    <th className="px-4 py-3 text-right">Total Spent (৳)</th>
                    <th className="px-4 py-3 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categorySummary.map(([cat, info]) => {
                    const pct = Math.round((info.total / (stats.totalExpense || 1)) * 100);
                    return (
                      <tr key={cat} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{cat}</td>
                        <td className="px-4 py-3.5 text-slate-500">{info.count} vouchers</td>
                        <td className="px-4 py-3.5 text-right font-extrabold text-rose-700">{formatBDT(info.total)}</td>
                        <td className="px-4 py-3.5 text-right font-bold text-slate-700">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
