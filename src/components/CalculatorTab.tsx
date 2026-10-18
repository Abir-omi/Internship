import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { formatBDT } from '../utils/formatters';
import { Calculator, Printer, CheckCircle, Calendar, Sparkles, Building2 } from 'lucide-react';

export const CalculatorTab: React.FC = () => {
  const { activeProject, t } = useProject();

  const [sizeKatha, setSizeKatha] = useState<number>(5.0);
  const [ratePerKatha, setRatePerKatha] = useState<number>(400000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30);
  const [durationMonths, setDurationMonths] = useState<number>(36);
  const [buyerName, setBuyerName] = useState<string>('');

  const totalPrice = sizeKatha * ratePerKatha;
  const downPaymentAmount = Math.round((totalPrice * downPaymentPct) / 100);
  const remainingPrincipal = totalPrice - downPaymentAmount;
  const monthlyInstallment = Math.round(remainingPrincipal / (durationMonths || 1));

  // Generate monthly schedule
  const schedule = useMemo(() => {
    const list = [];
    let balance = remainingPrincipal;
    const now = new Date();

    for (let i = 1; i <= durationMonths; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      balance = Math.max(0, balance - monthlyInstallment);

      list.push({
        installmentNo: i,
        monthLabel,
        amount: i === durationMonths ? remainingPrincipal - (monthlyInstallment * (durationMonths - 1)) : monthlyInstallment,
        remainingBalance: balance
      });
    }
    return list;
  }, [remainingPrincipal, durationMonths, monthlyInstallment]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>{t('Land Installment & EMI Planner', 'জমির কিস্তি ক্যালকুলেটর')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('Calculate plot pricing, down payments, and generate monthly installment schedules for investors', 'কাঠাভিত্তিক মূল্য নির্ধারণ ও মাসিক কিস্তির সিডিউল প্রস্তুতকরণ')}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t('Print Schedule for Buyer', 'সিডিউল প্রিন্ট করুন')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls - Left Side */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 no-print">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            {t('Plot & Payment Parameters', 'পরিমাপ ও শর্তাবলী')}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {t('Prospective Buyer Name', 'সম্ভাব্য ক্রেতার নাম')}
            </label>
            <input
              type="text"
              placeholder="e.g. Mr. Rafiqul Islam"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {t('Land Size (Katha)', 'জমির আকার (কাঠা)')}
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={sizeKatha}
              onChange={(e) => setSizeKatha(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {t('Rate per Katha (BDT)', 'কাঠাপ্রতি মূল্য (৳)')}
            </label>
            <input
              type="number"
              step="10000"
              value={ratePerKatha}
              onChange={(e) => setRatePerKatha(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {t('Down Payment Percentage', 'ডাউন পেমেন্ট হার')} ({downPaymentPct}%)
            </label>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(parseInt(e.target.value) || 30)}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>10%</span>
              <span className="font-bold text-emerald-700">{downPaymentPct}%</span>
              <span>70%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {t('Installment Period (Months)', 'কিস্তির মেয়াদ (মাস)')}
            </label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(parseInt(e.target.value) || 36)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="48">48 Months (4 Years)</option>
              <option value="60">60 Months (5 Years)</option>
            </select>
          </div>

          <div className="pt-2">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase block">
                {t('Monthly Installment', 'মাসিক কিস্তির পরিমাণ')}
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1">
                {formatBDT(monthlyInstallment)} <span className="text-xs font-normal">/month</span>
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Output & Printable Sheet - Right Side */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs printable-card space-y-6">
          
          {/* Company & Project Printable Header */}
          <div className="border-b-2 border-emerald-700 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black uppercase text-emerald-900">
                  {activeProject.company}
                </h1>
                <p className="text-sm font-bold text-slate-800">
                  {activeProject.name} — {t('Payment & Installment Quotation', 'প্লট বুকিং ও কিস্তির প্রস্তাবনা')}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Location: {activeProject.location}
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                <p className="font-semibold text-slate-800">Generated: {new Date().toLocaleDateString()}</p>
                {buyerName && (
                  <p className="font-bold text-emerald-800 mt-1">Prepared for: {buyerName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Total Plot Price:</span>
              <p className="font-bold text-sm text-slate-900 mt-0.5">{formatBDT(totalPrice)}</p>
              <span className="text-[10px] text-slate-400">({sizeKatha} Katha @ {formatBDT(ratePerKatha)})</span>
            </div>

            <div>
              <span className="text-slate-500 block">Down Payment ({downPaymentPct}%):</span>
              <p className="font-bold text-sm text-emerald-700 mt-0.5">{formatBDT(downPaymentAmount)}</p>
            </div>

            <div>
              <span className="text-slate-500 block">Installment Principal:</span>
              <p className="font-bold text-sm text-slate-900 mt-0.5">{formatBDT(remainingPrincipal)}</p>
            </div>

            <div>
              <span className="text-slate-500 block">EMI per Month:</span>
              <p className="font-extrabold text-sm text-emerald-800 mt-0.5">{formatBDT(monthlyInstallment)}</p>
              <span className="text-[10px] text-slate-400">({durationMonths} Equal Installments)</span>
            </div>
          </div>

          {/* Schedule Table */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
              {t('Monthly Installment Schedule', 'মাসিক কিস্তির পূর্ণাঙ্গ বিবরণী')}
            </h4>

            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5">Installment #</th>
                    <th className="p-2.5">Month</th>
                    <th className="p-2.5 text-right">Installment Amount</th>
                    <th className="p-2.5 text-right">Principal Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.map((item) => (
                    <tr key={item.installmentNo} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold font-mono text-emerald-800">
                        Month {item.installmentNo}
                      </td>
                      <td className="p-2.5 text-slate-600">{item.monthLabel}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {formatBDT(item.amount)}
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-500">
                        {formatBDT(item.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Print Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-4 text-center text-xs text-slate-500">
            <div>
              <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
              <span>Prepared By (Sales Officer)</span>
            </div>
            <div>
              <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
              <span>Client / Investor Signature</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
