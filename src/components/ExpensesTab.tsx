import React, { useState, useMemo, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../types';
import { formatBDT, formatDate } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  MinusCircle, 
  Briefcase, 
  Tag
} from 'lucide-react';

interface ExpensesTabProps {
  isAddModalOpenInitially?: boolean;
  onResetInitialState?: () => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  isAddModalOpenInitially,
  onResetInitialState
}) => {
  const { 
    filteredExpenses, 
    activeProjectId, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    t 
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form fields
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Earth Filling & Development');
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [bankOrAccount, setBankOrAccount] = useState('Corporate Account');
  const [purpose, setPurpose] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('Project Director');
  const [billOrRef, setBillOrRef] = useState('');

  useEffect(() => {
    if (isAddModalOpenInitially) {
      handleOpenAdd();
      if (onResetInitialState) onResetInitialState();
    }
  }, [isAddModalOpenInitially]);

  const displayExpenses = useMemo(() => {
    return filteredExpenses.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        e.voucherNo.toLowerCase().includes(q) ||
        e.payee.toLowerCase().includes(q) ||
        e.purpose.toLowerCase().includes(q) ||
        (e.billOrRef && e.billOrRef.toLowerCase().includes(q));

      const matchCat = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchMethod = methodFilter === 'ALL' || e.paymentMethod === methodFilter;

      return matchSearch && matchCat && matchMethod;
    });
  }, [filteredExpenses, searchQuery, categoryFilter, methodFilter]);

  const totalFilteredAmount = displayExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    const codeNum = filteredExpenses.length + 53;
    setVoucherNo(`HP-EXP-2024-00${codeNum}`);
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Earth Filling & Development');
    setPayee('');
    setAmount(50000);
    setPaymentMethod('Bank Transfer');
    setBankOrAccount('Corporate Account');
    setPurpose('');
    setAuthorizedBy('Project Director');
    setBillOrRef('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setVoucherNo(exp.voucherNo);
    setDate(exp.date);
    setCategory(exp.category);
    setPayee(exp.payee);
    setAmount(exp.amount);
    setPaymentMethod(exp.paymentMethod);
    setBankOrAccount(exp.bankOrAccount || '');
    setPurpose(exp.purpose);
    setAuthorizedBy(exp.authorizedBy);
    setBillOrRef(exp.billOrRef || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        voucherNo,
        date,
        category,
        payee,
        amount: Number(amount),
        paymentMethod,
        bankOrAccount: bankOrAccount || undefined,
        purpose,
        authorizedBy,
        billOrRef: billOrRef || undefined
      });
    } else {
      addExpense({
        projectId: activeProjectId,
        voucherNo,
        date,
        category,
        payee,
        amount: Number(amount),
        paymentMethod,
        bankOrAccount: bankOrAccount || undefined,
        purpose,
        authorizedBy,
        billOrRef: billOrRef || undefined
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, vNo: string) => {
    if (window.confirm(t(`Delete Voucher ${vNo}?`, `ভাউচার ${vNo} মুছে ফেলতে চান?`))) {
      deleteExpense(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t('Project Expenditures & Cost Ledger', 'প্রকল্প ব্যয় ও খরচ হিসাব')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Record payments for land acquisition, registration, sand filling, boundary, and works', 'জমি ক্রয়, রেজিস্ট্রেশন, মাটি ভরাট, সীমানা প্রাচীর ও সকল উন্নয়ন খরচ')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Record Expense Voucher', 'নতুন খরচ ভাউচার')}</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl">
          <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block">
            {t('Total Expenditures', 'মোট নির্বাচিত খরচ')}
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-rose-800 mt-1">
            {formatBDT(totalFilteredAmount)}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('Expense Vouchers Count', 'মোট ভাউচার সংখ্যা')}
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {displayExpenses.length} {t('Vouchers', 'টি')}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('Active Category Filter', 'ফিল্টারকৃত খাত')}
          </span>
          <p className="text-xs font-semibold text-slate-800 mt-2 truncate">
            {categoryFilter === 'ALL' ? t('All Categories', 'সকল খাত') : categoryFilter}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('Search by voucher no, payee, or purpose...', 'ভাউচার নং, প্রাপক বা খরচের বিবরণে খুঁজুন...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
          >
            <option value="ALL">{t('All Expense Categories', 'সকল খরচের খাত')}</option>
            <option value="Land Purchase">Land Purchase (জমি ক্রয়)</option>
            <option value="Land Registration & Legal">Land Registration & Legal (দলিল ও আইন)</option>
            <option value="Earth Filling & Development">Earth Filling & Development (মাটি ভরাট)</option>
            <option value="Boundary Wall & Roads">Boundary Wall & Roads (সীমানা ও রাস্তা)</option>
            <option value="Site Office & Salaries">Site Office & Salaries (অফিস ও বেতন)</option>
            <option value="Marketing & Brokerage">Marketing & Brokerage (প্রচার ও কমিশন)</option>
            <option value="Utilities & Drainage">Utilities & Drainage (বিদ্যুৎ ও ড্রেনেজ)</option>
            <option value="Miscellaneous">Miscellaneous (বিবিধ)</option>
          </select>
        </div>

        <div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
          >
            <option value="ALL">{t('All Payment Methods', 'সকল পেমেন্ট মাধ্যম')}</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5">{t('Voucher No', 'ভাউচার নং')}</th>
                <th className="px-4 py-3.5">{t('Date', 'তারিখ')}</th>
                <th className="px-4 py-3.5">{t('Category', 'খরচের খাত')}</th>
                <th className="px-4 py-3.5">{t('Payee / Contractor', 'প্রাপক / ঠিকাদার')}</th>
                <th className="px-4 py-3.5">{t('Purpose & Bill Ref', 'বিবরণ ও বিল নং')}</th>
                <th className="px-4 py-3.5">{t('Payment Method', 'মাধ্যম')}</th>
                <th className="px-4 py-3.5 text-right">{t('Amount (BDT)', 'খরচের পরিমাণ (৳)')}</th>
                <th className="px-4 py-3.5 text-right">{t('Actions', 'কার্যক্রম')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {t('No expense records found.', 'কোন খরচের তথ্য নেই।')}
                  </td>
                </tr>
              ) : (
                displayExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-rose-800 text-xs">
                      {exp.voucherNo}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {exp.payee}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{exp.purpose}</p>
                      {exp.billOrRef && (
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {exp.billOrRef}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-700">{exp.paymentMethod}</span>
                      {exp.bankOrAccount && (
                        <span className="block text-[10px] text-slate-400 truncate max-w-[120px]">{exp.bankOrAccount}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-rose-700 text-sm">
                      {formatBDT(exp.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title={t('Edit Expense', 'সম্পাদনা')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.voucherNo)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={t('Delete Expense', 'মুছে ফেলুন')}
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

      {/* Modal: Add / Edit Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingExpense 
                  ? t(`Edit Expense Voucher ${editingExpense.voucherNo}`, `ভাউচার ${editingExpense.voucherNo} সংশোধন`) 
                  : t('Record Project Expense Voucher (খরচ)', 'নতুন খরচ ভাউচার এন্ট্রি')}
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
                    {t('Voucher No', 'ভাউচার নম্বর')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
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
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Expense Category', 'খরচের খাত')} *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Earth Filling & Development">Earth Filling & Development (মাটি ভরাট)</option>
                    <option value="Land Purchase">Land Purchase (জমি ক্রয়)</option>
                    <option value="Land Registration & Legal">Land Registration & Legal (দলিল ও আইনি)</option>
                    <option value="Boundary Wall & Roads">Boundary Wall & Roads (সীমানা ও রাস্তা)</option>
                    <option value="Site Office & Salaries">Site Office & Salaries (অফিস ও বেতন)</option>
                    <option value="Marketing & Brokerage">Marketing & Brokerage (প্রচার ও কমিশন)</option>
                    <option value="Utilities & Drainage">Utilities & Drainage (ড্রেনেজ ও বিদ্যুৎ)</option>
                    <option value="Miscellaneous">Miscellaneous (বিবিধ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Payee / Vendor / Land Owner', 'প্রাপকের নাম')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haji Kashem Earth Movers"
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Amount Paid (BDT)', 'খরচের পরিমাণ (৳)')} *
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-extrabold text-rose-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Payment Method', 'পেমেন্ট মাধ্যম')} *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Bank Transfer">Bank Transfer (অনলাইন ব্যাংক)</option>
                    <option value="Cash">Cash (নগদ)</option>
                    <option value="Cheque">Cheque (চেক)</option>
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Bank / Paid Account', 'পরিশোধিত ব্যাংক বা অ্যাকাউন্ট')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IBBL Corporate A/C #108"
                    value={bankOrAccount}
                    onChange={(e) => setBankOrAccount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Bill / Invoice / Deed Ref', 'বিল / ইনভয়েস বা দলিল রেফারেন্স')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BILL-491"
                    value={billOrRef}
                    onChange={(e) => setBillOrRef(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Purpose / Description of Work', 'কাজের বিস্তারিত বিবরণ')} *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 24 truckloads of red sand for road levelling..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Authorized By', 'অনুমোদনকারী কর্মকর্তা')}
                </label>
                <input
                  type="text"
                  value={authorizedBy}
                  onChange={(e) => setAuthorizedBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  {editingExpense ? t('Save Changes', 'হালনাগাদ করুন') : t('Save Expense Voucher', 'ভাউচার সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
