import React from 'react';
import { useProject } from '../context/ProjectContext';
import { formatBDT, formatDate } from '../utils/formatters';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  Layers, 
  Users, 
  TrendingUp, 
  AlertCircle,
  FileCheck2,
  Printer,
  Plus,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onOpenAddCollection: () => void;
  onOpenAddExpense: () => void;
  onOpenAddPlot: () => void;
  onOpenAddMember: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAddCollection,
  onOpenAddExpense,
  onOpenAddPlot,
  onOpenAddMember
}) => {
  const { 
    stats, 
    filteredCollections, 
    filteredExpenses, 
    filteredPlots,
    activeProject, 
    setSelectedReceipt, 
    setActiveTab, 
    t 
  } = useProject();

  const recentCollections = [...filteredCollections].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  const recentExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  // Calculate expense category breakdown
  const categoryTotals: Record<string, number> = {};
  filteredExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner / Summary Row */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/20">
            <span>{activeProject.company}</span>
            <span>•</span>
            <span>{activeProject.status}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {activeProject.name} — {t('Project Dashboard', 'প্রকল্প ড্যাশবোর্ড')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {t(
              'Real-time account balance, plot booking ratio, member payments, and site development expenditures.',
              'রিয়েল-টাইম হিসাব খতিয়ান, প্লট বুকিং অগ্রগতি, কিস্তি জমা ও উন্নয়ন ব্যয়ের সারসংক্ষেপ।'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onOpenAddCollection}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('New Collection', 'টাকা জমা')}</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Record Expense', 'খরচ এন্ট্রি')}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Collection */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('Total Collection', 'মোট আদায় / জমা')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-3 tracking-tight">
            {formatBDT(stats.totalCollection)}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{filteredCollections.length} {t('receipts issued', 'টি রিসিট')}</span>
            <span className="text-emerald-600 font-semibold">{t('Verified', 'যাচাইকৃত')}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('Total Project Expense', 'মোট প্রকল্প ব্যয়')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-3 tracking-tight">
            {formatBDT(stats.totalExpense)}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{filteredExpenses.length} {t('expense vouchers', 'টি ভাউচার')}</span>
            <span className="text-rose-600 font-semibold">{t('Paid', 'পরিশোধিত')}</span>
          </div>
        </div>

        {/* Net Cash in Hand / Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('Current Cash Balance', 'বর্তমান তহবিল স্থিতি')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight ${
            stats.balance >= 0 ? 'text-teal-700' : 'text-amber-700'
          }`}>
            {formatBDT(stats.balance)}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{t('Inflow - Outflow', 'আদায় - ব্যয়')}</span>
            <span className="text-teal-600 font-semibold">{t('Available', 'হাতে নগদ')}</span>
          </div>
        </div>

        {/* Total Projected Land Value & Receivables */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('Projected Land Value', 'মোট প্রকল্পের মূল্য')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-3 tracking-tight">
            {formatBDT(stats.totalProjectedValue)}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{stats.totalPlots} {t('total plots', 'টি মোট প্লট')}</span>
            <span className="text-indigo-600 font-semibold">{stats.totalMembers} {t('members', 'সদস্য')}</span>
          </div>
        </div>

      </div>

      {/* Plot Status & Expense Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plot Inventory Status Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{t('Plot & Share Allocation', 'প্লট ও শেয়ারের অবস্থা')}</span>
            </h3>
            <button
              onClick={() => setActiveTab('plots')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('View All', 'সকল প্লট')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Visual ratio bar */}
            <div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${(stats.soldPlots / (stats.totalPlots || 1)) * 100}%` }} 
                  className="bg-emerald-600" 
                  title={`Sold: ${stats.soldPlots}`}
                />
                <div 
                  style={{ width: `${(stats.bookedPlots / (stats.totalPlots || 1)) * 100}%` }} 
                  className="bg-teal-500" 
                  title={`Booked: ${stats.bookedPlots}`}
                />
                <div 
                  style={{ width: `${(stats.reservedPlots / (stats.totalPlots || 1)) * 100}%` }} 
                  className="bg-amber-400" 
                  title={`Reserved: ${stats.reservedPlots}`}
                />
                <div 
                  style={{ width: `${(stats.availablePlots / (stats.totalPlots || 1)) * 100}%` }} 
                  className="bg-slate-200" 
                  title={`Available: ${stats.availablePlots}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    {t('Sold', 'বিক্রিত')}
                  </span>
                  <span className="font-bold text-slate-900">{stats.soldPlots}</span>
                </div>

                <div className="bg-teal-50 p-2.5 rounded-lg border border-teal-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                    {t('Booked', 'বুকিং')}
                  </span>
                  <span className="font-bold text-slate-900">{stats.bookedPlots}</span>
                </div>

                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    {t('Reserved', 'সংরক্ষিত')}
                  </span>
                  <span className="font-bold text-slate-900">{stats.reservedPlots}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    {t('Available', 'ফাঁকা প্লট')}
                  </span>
                  <span className="font-bold text-slate-900">{stats.availablePlots}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{t('Booked/Sold Ratio', 'মোট বরাদ্দ হার')}</span>
              <span className="font-bold text-emerald-700">
                {Math.round(((stats.soldPlots + stats.bookedPlots) / (stats.totalPlots || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Top Expense Categories */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span>{t('Major Expense Breakdown', 'প্রধান প্রধান খরচের খাত')}</span>
            </h3>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('Full Expense Ledger', 'সকল খরচ')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topCategories.map(([category, amount]) => {
              const pct = Math.round((amount / (stats.totalExpense || 1)) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{category}</span>
                    <span className="font-bold text-slate-900">
                      {formatBDT(amount)} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {t('Transparent accountability for land, earthwork & development', 'জমি, মাটি ভরাট ও উন্নয়নের সমন্বিত হিসাব')}
            </span>
            <span className="font-bold text-rose-700">
              {formatBDT(stats.totalExpense)}
            </span>
          </div>
        </div>

      </div>

      {/* Two Live Data Tables: Recent Collections & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Collections */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {t('Recent Money Collections', 'সাম্প্রতিক টাকা জমা')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('Latest member installment deposits', 'সর্বশেষ কিস্তি জমার তালিকা')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('collections')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('View All', 'সকল জমা')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentCollections.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {t('No collections recorded yet.', 'কোন টাকা জমার তথ্য নেই।')}
              </div>
            ) : (
              recentCollections.map(col => (
                <div key={col.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {col.receiptNo}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatDate(col.date)}</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {col.memberName}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {col.plotNo ? `Plot ${col.plotNo}` : col.purpose} • {col.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="font-extrabold text-sm text-emerald-700">
                      {formatBDT(col.amount)}
                    </span>
                    <button
                      onClick={() => setSelectedReceipt(col)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                      title="Print Digital Receipt"
                    >
                      <Printer className="w-3 h-3 text-emerald-600" />
                      <span>{t('Receipt', 'রিসিট')}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {t('Recent Project Expenses', 'সাম্প্রতিক প্রকল্প খরচ')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('Latest expenditure vouchers', 'সর্বশেষ ভাউচার ও পেমেন্ট')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('View All', 'সকল খরচ')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentExpenses.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {t('No expenses recorded yet.', 'কোন খরচের তথ্য নেই।')}
              </div>
            ) : (
              recentExpenses.map(exp => (
                <div key={exp.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {exp.voucherNo}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatDate(exp.date)}</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {exp.payee}
                    </p>
                    <p className="text-slate-500 text-[11px] line-clamp-1 max-w-xs">
                      <span className="text-slate-700 font-medium">{exp.category}</span>: {exp.purpose}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-extrabold text-sm text-rose-700">
                      {formatBDT(exp.amount)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {exp.paymentMethod}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
