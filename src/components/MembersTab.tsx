import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { Member } from '../types';
import { formatBDT, formatDate } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  X,
  Printer,
  ShieldAlert,
  Building,
  CheckCircle2
} from 'lucide-react';

interface MembersTabProps {
  onOpenAddCollectionForMember?: (member: Member) => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({ onOpenAddCollectionForMember }) => {
  const { 
    filteredMembers, 
    activeProjectId, 
    addMember, 
    updateMember, 
    deleteMember, 
    getMemberPaidAmount, 
    getMemberDueAmount, 
    getMemberCollections,
    setSelectedReceipt,
    activeProject,
    t 
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberForLedger, setSelectedMemberForLedger] = useState<Member | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form fields
  const [memberCode, setMemberCode] = useState('');
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nidOrPassport, setNidOrPassport] = useState('');
  const [address, setAddress] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('Spouse');
  const [nomineePhone, setNomineePhone] = useState('');
  const [totalInvestment, setTotalInvestment] = useState<number>(2000000);
  const [notes, setNotes] = useState('');

  const displayMembers = useMemo(() => {
    return filteredMembers.filter(m => {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.banglaName && m.banglaName.toLowerCase().includes(q)) ||
        m.memberCode.toLowerCase().includes(q) ||
        m.phone.includes(q)
      );
    });
  }, [filteredMembers, searchQuery]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    const codeNum = filteredMembers.length + 101;
    setMemberCode(`HP-0${codeNum}`);
    setName('');
    setBanglaName('');
    setPhone('');
    setEmail('');
    setNidOrPassport('');
    setAddress('');
    setNomineeName('');
    setNomineeRelation('Spouse');
    setNomineePhone('');
    setTotalInvestment(2000000);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setMemberCode(m.memberCode);
    setName(m.name);
    setBanglaName(m.banglaName || '');
    setPhone(m.phone);
    setEmail(m.email || '');
    setNidOrPassport(m.nidOrPassport);
    setAddress(m.address);
    setNomineeName(m.nomineeName);
    setNomineeRelation(m.nomineeRelation);
    setNomineePhone(m.nomineePhone || '');
    setTotalInvestment(m.totalInvestment);
    setNotes(m.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMember(editingMember.id, {
        memberCode,
        name,
        banglaName,
        phone,
        email,
        nidOrPassport,
        address,
        nomineeName,
        nomineeRelation,
        nomineePhone,
        totalInvestment: Number(totalInvestment),
        notes
      });
    } else {
      addMember({
        projectId: activeProjectId,
        memberCode,
        name,
        banglaName,
        phone,
        email,
        nidOrPassport,
        address,
        nomineeName,
        nomineeRelation,
        nomineePhone,
        assignedPlotIds: [],
        totalInvestment: Number(totalInvestment),
        joinedDate: new Date().toISOString().split('T')[0],
        notes
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t(`Delete member ${name}? This will unassign all linked plots.`, `সদস্য ${name} মুছে ফেলতে চান?`))) {
      deleteMember(id);
      if (selectedMemberForLedger?.id === id) {
        setSelectedMemberForLedger(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t('Investors & Shareholder Members', 'বিনিয়োগকারী ও সদস্য তালিকা')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Manage member profiles, nominee details, and individual investment ledgers', 'সদস্য পরিচিতি, নমিনী ও ব্যক্তিগত হিসাব খতিয়ান')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Register New Member', 'নতুন সদস্য নিবন্ধন')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={t('Search by name, member code, or phone...', 'সদস্যের নাম, কোড বা ফোন নম্বরে খুঁজুন...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
        />
      </div>

      {/* Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayMembers.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl text-center text-slate-400 text-xs border border-slate-200">
            {t('No members found.', 'কোন সদস্য খুঁজে পাওয়া যায়নি।')}
          </div>
        ) : (
          displayMembers.map(m => {
            const paid = getMemberPaidAmount(m.id);
            const due = getMemberDueAmount(m.id);
            const progress = Math.min(100, Math.round((paid / (m.totalInvestment || 1)) * 100));

            return (
              <div 
                key={m.id} 
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {m.memberCode}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title={t('Edit', 'সম্পাদনা')}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title={t('Delete', 'মুছে ফেলুন')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {m.name}
                  </h3>
                  {m.banglaName && (
                    <p className="text-xs text-slate-500">{m.banglaName}</p>
                  )}

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{m.phone}</span>
                    </div>
                    {m.address && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        📍 {m.address}
                      </p>
                    )}
                  </div>

                  {/* Financial Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{t('Total Committed', 'মোট লক্ষ্য')}</span>
                      <span className="font-bold text-slate-900">{formatBDT(m.totalInvestment)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-semibold">{t('Paid to Date', 'পরিশোধিত')}</span>
                      <span className="font-bold text-emerald-700">{formatBDT(paid)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-rose-700 font-semibold">{t('Balance Due', 'বকেয়া')}</span>
                      <span className="font-bold text-rose-700">{formatBDT(due)}</span>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMemberForLedger(m)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('View Statement', 'হিসাব খতিয়ান')}</span>
                  </button>

                  {onOpenAddCollectionForMember && (
                    <button
                      onClick={() => onOpenAddCollectionForMember(m)}
                      className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title={t('Collect Payment', 'টাকা জমা নিন')}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('Deposit', 'জমা')}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Member Ledger / Account Statement Drawer / Modal */}
      {selectedMemberForLedger && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 printable-card">
            
            <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">
                  {t('Member Account Statement', 'সদস্য হিসাব খতিয়ান')}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('Print Statement', 'প্রিন্ট করুন')}</span>
                </button>
                <button
                  onClick={() => setSelectedMemberForLedger(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Box */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedMemberForLedger.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Code: <span className="font-mono font-bold text-emerald-700">{selectedMemberForLedger.memberCode}</span> | Phone: {selectedMemberForLedger.phone}
                    </p>
                    <p className="text-xs text-slate-500">
                      Address: {selectedMemberForLedger.address || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-700">{activeProject.name}</p>
                    <p className="text-[11px] text-slate-500">{activeProject.company}</p>
                    <p className="text-[11px] text-slate-400">Statement as of {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">{t('Nominee Name', 'নমিনীর নাম')}</span>
                    <span className="font-semibold text-slate-800">{selectedMemberForLedger.nomineeName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t('Nominee Relation', 'সম্পর্ক')}</span>
                    <span className="font-semibold text-slate-800">{selectedMemberForLedger.nomineeRelation || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t('NID / Passport', 'জাতীয় পরিচয়পত্র')}</span>
                    <span className="font-mono text-slate-800">{selectedMemberForLedger.nidOrPassport || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{t('Committed Investment', 'মোট বিনিয়োগ লক্ষ্য')}</span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {formatBDT(selectedMemberForLedger.totalInvestment)}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-700 block">{t('Total Deposited', 'মোট জমা হয়েছে')}</span>
                  <p className="text-base sm:text-lg font-extrabold text-emerald-800 mt-0.5">
                    {formatBDT(getMemberPaidAmount(selectedMemberForLedger.id))}
                  </p>
                </div>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <span className="text-xs text-rose-700 block">{t('Total Due Balance', 'বর্তমান বাকি')}</span>
                  <p className="text-base sm:text-lg font-extrabold text-rose-800 mt-0.5">
                    {formatBDT(getMemberDueAmount(selectedMemberForLedger.id))}
                  </p>
                </div>
              </div>

              {/* Transactions History Table */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">
                  {t('Deposit & Installment History', 'কিস্তি ও জমার হিসাব তালিকা')}
                </h4>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="p-3">Receipt No</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Purpose / Head</th>
                        <th className="p-3">Payment Method</th>
                        <th className="p-3 text-right">Amount (৳)</th>
                        <th className="p-3 text-right no-print">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getMemberCollections(selectedMemberForLedger.id).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            {t('No deposit receipts found for this member.', 'এই সদস্যের কোন জমার রিসিট পাওয়া যায়নি।')}
                          </td>
                        </tr>
                      ) : (
                        getMemberCollections(selectedMemberForLedger.id).map(c => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-emerald-800">{c.receiptNo}</td>
                            <td className="p-3">{formatDate(c.date)}</td>
                            <td className="p-3">
                              <span className="font-semibold">{c.purpose}</span>
                              {c.installmentMonth && <span className="text-slate-400 text-[11px]"> ({c.installmentMonth})</span>}
                            </td>
                            <td className="p-3">{c.paymentMethod} {c.chequeOrTrxNo ? `(${c.chequeOrTrxNo})` : ''}</td>
                            <td className="p-3 text-right font-extrabold text-emerald-700">{formatBDT(c.amount)}</td>
                            <td className="p-3 text-right no-print">
                              <button
                                onClick={() => setSelectedReceipt(c)}
                                className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded text-[11px] font-medium"
                              >
                                {t('Voucher', 'ভাউচার')}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Stamp Box on print */}
              <div className="pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 mx-auto mb-1"></div>
                  <span>Accountant Sign</span>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 mx-auto mb-1"></div>
                  <span>Authorized Signature</span>
                </div>
              </div>

            </div>

            <div className="no-print bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedMemberForLedger(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
              >
                {t('Close', 'বন্ধ করুন')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Add / Edit Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingMember ? t('Edit Member Profile', 'সদস্য তথ্য সংশোধন') : t('Register New Investor Member', 'নতুন সদস্য নিবন্ধন')}
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
                    {t('Member Code', 'সদস্য কোড')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Phone Number', 'মোবাইল নম্বর')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Full Name (English)', 'পূর্ণ নাম (ইংরেজি)')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Full Name (Bangla)', 'পূর্ণ নাম (বাংলা)')}
                  </label>
                  <input
                    type="text"
                    value={banglaName}
                    onChange={(e) => setBanglaName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Email Address', 'ইমেইল')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('NID / Passport', 'জাতীয় পরিচয়পত্র নং')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={nidOrPassport}
                    onChange={(e) => setNidOrPassport(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Present / Permanent Address', 'ঠিকানা')}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Nominee details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  {t('Nominee Information', 'নমিনীর বিবরণ')}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {t('Nominee Name', 'নমিনীর নাম')}
                    </label>
                    <input
                      type="text"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {t('Relationship', 'সম্পর্ক')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse / Son"
                      value={nomineeRelation}
                      onChange={(e) => setNomineeRelation(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {t('Nominee Phone', 'নমিনীর ফোন')}
                    </label>
                    <input
                      type="text"
                      value={nomineePhone}
                      onChange={(e) => setNomineePhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Committed Investment Target (BDT)', 'মোট বিনিয়োগ চুক্তি মূল্য (৳)')} *
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Notes & Installment Plan', 'বিশেষ মন্তব্য বা কিস্তি শর্তাবলী')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  {editingMember ? t('Save Member Profile', 'সদস্য তথ্য হালনাগাদ') : t('Register Member', 'নিবন্ধন সম্পূর্ণ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
