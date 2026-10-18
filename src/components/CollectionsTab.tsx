import React, { useState, useMemo, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Collection, PaymentMethod } from '../types';
import { formatBDT, formatDate } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ArrowDownLeft, 
  Building,
  CreditCard,
  DollarSign
} from 'lucide-react';

interface CollectionsTabProps {
  initialPreselectedMemberId?: string;
  initialPreselectedPlotNo?: string;
  isAddModalOpenInitially?: boolean;
  onResetInitialState?: () => void;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({
  initialPreselectedMemberId,
  initialPreselectedPlotNo,
  isAddModalOpenInitially,
  onResetInitialState
}) => {
  const { 
    filteredCollections, 
    activeProjectId, 
    addCollection, 
    updateCollection, 
    deleteCollection, 
    members, 
    plots,
    setSelectedReceipt, 
    t 
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [purposeFilter, setPurposeFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form fields
  const [receiptNo, setReceiptNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberId, setMemberId] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [amount, setAmount] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [bankName, setBankName] = useState('Islami Bank Bangladesh Ltd');
  const [chequeOrTrxNo, setChequeOrTrxNo] = useState('');
  const [installmentMonth, setInstallmentMonth] = useState('October 2024');
  const [purpose, setPurpose] = useState<Collection['purpose']>('Monthly Installment');
  const [collectedBy, setCollectedBy] = useState('Accounts Section');
  const [remarks, setRemarks] = useState('');

  // Handle initial preselected trigger
  useEffect(() => {
    if (isAddModalOpenInitially) {
      handleOpenAdd(initialPreselectedMemberId, initialPreselectedPlotNo);
      if (onResetInitialState) onResetInitialState();
    }
  }, [isAddModalOpenInitially, initialPreselectedMemberId, initialPreselectedPlotNo]);

  const displayCollections = useMemo(() => {
    return filteredCollections.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        c.receiptNo.toLowerCase().includes(q) ||
        c.memberName.toLowerCase().includes(q) ||
        (c.plotNo && c.plotNo.toLowerCase().includes(q)) ||
        (c.chequeOrTrxNo && c.chequeOrTrxNo.toLowerCase().includes(q));

      const matchMethod = methodFilter === 'ALL' || c.paymentMethod === methodFilter;
      const matchPurpose = purposeFilter === 'ALL' || c.purpose === purposeFilter;

      return matchSearch && matchMethod && matchPurpose;
    });
  }, [filteredCollections, searchQuery, methodFilter, purposeFilter]);

  // Method totals
  const totalAmount = displayCollections.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  const handleOpenAdd = (preMemberId?: string, prePlotNo?: string) => {
    setEditingCollection(null);
    const codeNum = filteredCollections.length + 90;
    setReceiptNo(`HP-REC-2024-00${codeNum}`);
    setDate(new Date().toISOString().split('T')[0]);
    
    const targetMember = preMemberId ? members.find(m => m.id === preMemberId) : members[0];
    setMemberId(targetMember ? targetMember.id : '');
    setPlotNo(prePlotNo || '');
    setAmount(100000);
    setPaymentMethod('Bank Transfer');
    setBankName('Islami Bank Bangladesh Ltd');
    setChequeOrTrxNo('');
    setInstallmentMonth('October 2024');
    setPurpose('Monthly Installment');
    setCollectedBy('Accounts Section');
    setRemarks('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Collection) => {
    setEditingCollection(c);
    setReceiptNo(c.receiptNo);
    setDate(c.date);
    setMemberId(c.memberId);
    setPlotNo(c.plotNo || '');
    setAmount(c.amount);
    setPaymentMethod(c.paymentMethod);
    setBankName(c.bankName || '');
    setChequeOrTrxNo(c.chequeOrTrxNo || '');
    setInstallmentMonth(c.installmentMonth || '');
    setPurpose(c.purpose);
    setCollectedBy(c.collectedBy);
    setRemarks(c.remarks || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === memberId);
    const memberName = mem ? mem.name : 'General Member';

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        receiptNo,
        date,
        memberId,
        memberName,
        plotNo: plotNo || undefined,
        amount: Number(amount),
        paymentMethod,
        bankName: bankName || undefined,
        chequeOrTrxNo: chequeOrTrxNo || undefined,
        installmentMonth: installmentMonth || undefined,
        purpose,
        collectedBy,
        remarks: remarks || undefined
      });
    } else {
      const newColData: Omit<Collection, 'id' | 'createdAt'> = {
        projectId: activeProjectId,
        receiptNo,
        date,
        memberId,
        memberName,
        plotNo: plotNo || undefined,
        amount: Number(amount),
        paymentMethod,
        bankName: bankName || undefined,
        chequeOrTrxNo: chequeOrTrxNo || undefined,
        installmentMonth: installmentMonth || undefined,
        purpose,
        collectedBy,
        remarks: remarks || undefined
      };
      addCollection(newColData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, rNo: string) => {
    if (window.confirm(t(`Delete Receipt ${rNo}? This will alter member balances.`, `রিসিট ${rNo} মুছে ফেলতে চান?`))) {
      deleteCollection(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t('Collections & Digital Money Receipts', 'টাকা জমা ও মানি রিসিট')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Record installments, generate digital printable vouchers, and track collections', 'কিস্তি ও আমানত গ্রহণ এবং অফিসিয়াল মানি রিসিট প্রস্তুতকরণ')}
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('New Collection Receipt', 'নতুন টাকা জমার রিসিট')}</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            {t('Total Selected Collections', 'মোট নির্বাচিত জমা')}
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-800 mt-1">
            {formatBDT(totalAmount)}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('Total Receipts Issued', 'মোট ভাউচার সংখ্যা')}
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {displayCollections.length} {t('Vouchers', 'টি')}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('Bank Payments', 'ব্যাংক ডিপোজিট')}
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {formatBDT(
              displayCollections
                .filter(c => c.paymentMethod === 'Bank Transfer' || c.paymentMethod === 'Cheque')
                .reduce((acc, c) => acc + (Number(c.amount) || 0), 0)
            )}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('Cash / MFS (bKash/Nagad)', 'নগদ ও মোবাইল ব্যাংকিং')}
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {formatBDT(
              displayCollections
                .filter(c => c.paymentMethod === 'Cash' || c.paymentMethod === 'bKash' || c.paymentMethod === 'Nagad')
                .reduce((acc, c) => acc + (Number(c.amount) || 0), 0)
            )}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('Search by receipt no, member, plot, or transaction...', 'রিসিট নং, সদস্য, প্লট বা ট্রানজেকশনে খুঁজুন...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        <div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="ALL">{t('All Payment Methods', 'সকল পেমেন্ট মাধ্যম')}</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
          </select>
        </div>

        <div>
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="ALL">{t('All Purposes', 'সকল খাত')}</option>
            <option value="Monthly Installment">Monthly Installment</option>
            <option value="Booking Money">Booking Money</option>
            <option value="Down Payment">Down Payment</option>
            <option value="Registration Fee">Registration Fee</option>
            <option value="Share Capital">Share Capital</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5">{t('Receipt No', 'রিসিট নং')}</th>
                <th className="px-4 py-3.5">{t('Date', 'তারিখ')}</th>
                <th className="px-4 py-3.5">{t('Member / Investor', 'সদস্যের নাম')}</th>
                <th className="px-4 py-3.5">{t('Plot', 'প্লট')}</th>
                <th className="px-4 py-3.5">{t('Purpose & Month', 'খাত ও কিস্তির মাস')}</th>
                <th className="px-4 py-3.5">{t('Payment Method', 'মাধ্যম ও রেফারেন্স')}</th>
                <th className="px-4 py-3.5 text-right">{t('Amount (BDT)', 'পরিমাণ (৳)')}</th>
                <th className="px-4 py-3.5 text-right">{t('Actions', 'কার্যক্রম')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayCollections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {t('No collection records found.', 'কোন জমার তথ্য পাওয়া যায়নি।')}
                  </td>
                </tr>
              ) : (
                displayCollections.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-emerald-800 text-xs">
                      {c.receiptNo}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {formatDate(c.date)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {c.memberName}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700">
                      {c.plotNo || '-'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800">{c.purpose}</span>
                      {c.installmentMonth && (
                        <span className="block text-[11px] text-slate-400">{c.installmentMonth}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-700">{c.paymentMethod}</span>
                      {c.chequeOrTrxNo && (
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {c.chequeOrTrxNo}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-emerald-700 text-sm">
                      {formatBDT(c.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReceipt(c)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title={t('Print Digital Receipt', 'ডিজিটাল রিসিট দেখুন')}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title={t('Edit Collection', 'সম্পাদনা')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.receiptNo)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={t('Delete Collection', 'মুছে ফেলুন')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Collection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingCollection 
                  ? t(`Edit Receipt ${editingCollection.receiptNo}`, `রিসিট ${editingCollection.receiptNo} সংশোধন`) 
                  : t('Create Money Receipt (টাকা জমা)', 'নতুন টাকা জমার রিসিট')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Receipt / Voucher No', 'রিসিট নম্বর')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Date', 'তারিখ')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Member / Investor', 'সদস্য নির্বাচন')} *
                  </label>
                  <select
                    required
                    value={memberId}
                    onChange={(e) => {
                      setMemberId(e.target.value);
                      // Auto-assign member's plot if available
                      const memPlots = plots.filter(p => p.assignedMemberId === e.target.value);
                      if (memPlots.length > 0) {
                        setPlotNo(memPlots[0].plotNo);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">{t('-- Select Member --', '-- সদস্য নির্বাচন করুন --')}</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.memberCode} - {m.name} ({m.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Plot Identification', 'প্লট নম্বর')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A-01"
                    value={plotNo}
                    onChange={(e) => setPlotNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Amount Received (BDT)', 'প্রাপ্ত টাকার পরিমাণ (৳)')} *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-extrabold text-emerald-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Purpose of Payment', 'জমার উদ্দেশ্য / খাত')} *
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as Collection['purpose'])}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Monthly Installment">Monthly Installment (মাসিক কিস্তি)</option>
                    <option value="Booking Money">Booking Money (বুকিং মানি)</option>
                    <option value="Down Payment">Down Payment (ডাউন পেমেন্ট)</option>
                    <option value="Registration Fee">Registration Fee (রেজিস্ট্রি ফি)</option>
                    <option value="Share Capital">Share Capital (শেয়ার ক্যাপিটাল)</option>
                    <option value="Other">Other (অন্যান্য)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Payment Mode', 'পেমেন্ট মাধ্যম')} *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Bank Transfer">Bank Transfer (অনলাইন ব্যাংক)</option>
                    <option value="Cash">Cash (নগদ গ্রহণ)</option>
                    <option value="Cheque">Cheque (চেক)</option>
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Installment Month / Period', 'কিস্তির মাস')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 2024"
                    value={installmentMonth}
                    onChange={(e) => setInstallmentMonth(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {(paymentMethod === 'Bank Transfer' || paymentMethod === 'Cheque') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      {t('Bank Name', 'ব্যাংকের নাম')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Islami Bank, City Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      {t('Cheque / Transfer Ref No', 'চেক নম্বর বা রেফারেন্স')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CHQ-991204"
                      value={chequeOrTrxNo}
                      onChange={(e) => setChequeOrTrxNo(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('TrxID / Mobile Wallet Transaction ID', 'ট্রানজেকশন আইডি (TrxID)')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9BK871239X"
                    value={chequeOrTrxNo}
                    onChange={(e) => setChequeOrTrxNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Collected By (Staff / Officer)', 'আদায়কারীর নাম / শাখা')}
                </label>
                <input
                  type="text"
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Remarks / Special Note', 'মন্তব্য / বিবরণ')}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {editingCollection ? t('Update Receipt', 'রিসিট হালনাগাদ') : t('Generate Money Receipt', 'রিসিট তৈরি করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
