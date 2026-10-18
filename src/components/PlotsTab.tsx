import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { Plot, PlotStatus, PlotType } from '../types';
import { formatBDT } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Sparkles,
  DollarSign
} from 'lucide-react';

interface PlotsTabProps {
  onQuickCollect?: (plot: Plot) => void;
}

export const PlotsTab: React.FC<PlotsTabProps> = ({ onQuickCollect }) => {
  const { 
    filteredPlots, 
    activeProjectId, 
    addPlot, 
    updatePlot, 
    deletePlot, 
    members, 
    t 
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [blockFilter, setBlockFilter] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);

  // Form fields
  const [plotNo, setPlotNo] = useState('');
  const [block, setBlock] = useState('Block-A');
  const [roadNo, setRoadNo] = useState('Road-01 (40ft)');
  const [sizeKatha, setSizeKatha] = useState<number>(5.0);
  const [ratePerKatha, setRatePerKatha] = useState<number>(400000);
  const [bookingMoney, setBookingMoney] = useState<number>(200000);
  const [status, setStatus] = useState<PlotStatus>('Available');
  const [type, setType] = useState<PlotType>('Residential');
  const [facing, setFacing] = useState('South');
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [description, setDescription] = useState('');

  // Extract unique blocks
  const blocks = useMemo(() => {
    const set = new Set(filteredPlots.map(p => p.block));
    return Array.from(set).sort();
  }, [filteredPlots]);

  // Filtered list
  const displayPlots = useMemo(() => {
    return filteredPlots.filter(p => {
      const matchSearch = 
        p.plotNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.assignedMemberName && p.assignedMemberName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchBlock = blockFilter === 'ALL' || p.block === blockFilter;

      return matchSearch && matchStatus && matchBlock;
    });
  }, [filteredPlots, searchQuery, statusFilter, blockFilter]);

  const handleOpenAdd = () => {
    setEditingPlot(null);
    setPlotNo('');
    setBlock('Block-A');
    setRoadNo('Road-01 (40ft)');
    setSizeKatha(5.0);
    setRatePerKatha(400000);
    setBookingMoney(200000);
    setStatus('Available');
    setType('Residential');
    setFacing('South');
    setAssignedMemberId('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plot: Plot) => {
    setEditingPlot(plot);
    setPlotNo(plot.plotNo);
    setBlock(plot.block);
    setRoadNo(plot.roadNo);
    setSizeKatha(plot.sizeKatha);
    setRatePerKatha(plot.ratePerKatha);
    setBookingMoney(plot.bookingMoney);
    setStatus(plot.status);
    setType(plot.type);
    setFacing(plot.facing || 'South');
    setAssignedMemberId(plot.assignedMemberId || '');
    setDescription(plot.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = Number(sizeKatha) * Number(ratePerKatha);
    const assignedMember = members.find(m => m.id === assignedMemberId);

    if (editingPlot) {
      updatePlot(editingPlot.id, {
        plotNo,
        block,
        roadNo,
        sizeKatha: Number(sizeKatha),
        ratePerKatha: Number(ratePerKatha),
        totalPrice,
        bookingMoney: Number(bookingMoney),
        status,
        type,
        facing,
        assignedMemberId: assignedMemberId || undefined,
        assignedMemberName: assignedMember ? assignedMember.name : undefined,
        description
      });
    } else {
      addPlot({
        projectId: activeProjectId,
        plotNo,
        block,
        roadNo,
        sizeKatha: Number(sizeKatha),
        ratePerKatha: Number(ratePerKatha),
        totalPrice,
        bookingMoney: Number(bookingMoney),
        status,
        type,
        facing,
        assignedMemberId: assignedMemberId || undefined,
        assignedMemberName: assignedMember ? assignedMember.name : undefined,
        description
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t(`Delete Plot ${name}? This cannot be undone.`, `প্লট ${name} মুছে ফেলতে নিশ্চিত?`))) {
      deletePlot(id);
    }
  };

  const getStatusBadge = (st: PlotStatus) => {
    switch (st) {
      case 'Available':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{t('Available', 'ফাঁকা')}</span>;
      case 'Booked':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">{t('Booked', 'বুকিং')}</span>;
      case 'Sold':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">{t('Sold', 'বিক্রিত')}</span>;
      case 'Reserved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">{t('Reserved', 'সংরক্ষিত')}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t('Plots & Shares Inventory', 'প্লট ও শেয়ার তালিকা')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Manage plot demarcation, pricing, Katha size, and buyer allocation', 'প্লটের আকার, কাঠাপ্রতি মূল্য, অবস্থান ও বুকিং ব্যবস্থাপনা')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add New Plot', 'নতুন প্লট যোগ করুন')}</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('Search by plot no, block, or member...', 'প্লট নম্বর, ব্লক বা ক্রেতার নামে খুঁজুন...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="ALL">{t('All Statuses', 'সকল অবস্থা')}</option>
            <option value="Available">{t('Available Plots', 'ফাঁকা প্লট')}</option>
            <option value="Booked">{t('Booked Plots', 'বুকিং প্লট')}</option>
            <option value="Sold">{t('Sold Plots', 'বিক্রিত প্লট')}</option>
            <option value="Reserved">{t('Reserved Plots', 'সংরক্ষিত প্লট')}</option>
          </select>
        </div>

        {/* Block Filter */}
        <div>
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="ALL">{t('All Blocks / Sectors', 'সকল ব্লক / সেক্টর')}</option>
            {blocks.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Plots Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5">{t('Plot No', 'প্লট নং')}</th>
                <th className="px-4 py-3.5">{t('Block & Road', 'ব্লক ও রোড')}</th>
                <th className="px-4 py-3.5">{t('Size & Type', 'আকার ও ধরন')}</th>
                <th className="px-4 py-3.5">{t('Rate / Katha', 'কাঠা প্রতি')}</th>
                <th className="px-4 py-3.5">{t('Total Price', 'মোট মূল্য')}</th>
                <th className="px-4 py-3.5">{t('Status', 'অবস্থা')}</th>
                <th className="px-4 py-3.5">{t('Assigned Buyer', 'বরাদ্দকৃত ক্রেতা')}</th>
                <th className="px-4 py-3.5 text-right">{t('Actions', 'কার্যক্রম')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayPlots.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {t('No plots found matching your criteria.', 'কোন প্লট খুঁজে পাওয়া যায়নি।')}
                  </td>
                </tr>
              ) : (
                displayPlots.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-emerald-800 text-sm">
                      {p.plotNo}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{p.block}</p>
                      <p className="text-[11px] text-slate-400">{p.roadNo}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800">{p.sizeKatha} Katha</span>
                      <span className="block text-[11px] text-slate-500">{p.type} • {p.facing}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      {formatBDT(p.ratePerKatha)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {formatBDT(p.totalPrice)}
                    </td>
                    <td className="px-4 py-3.5">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="px-4 py-3.5">
                      {p.assignedMemberName ? (
                        <span className="font-semibold text-slate-800 block truncate max-w-[150px]">
                          {p.assignedMemberName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">{t('Unassigned', 'অবরাদ্দকৃত')}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.assignedMemberId && onQuickCollect && (
                          <button
                            onClick={() => onQuickCollect(p)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title={t('Quick Collect Installment', 'কিস্তি জমা করুন')}
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title={t('Edit Plot', 'সম্পাদনা')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.plotNo)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={t('Delete Plot', 'মুছে ফেলুন')}
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

      {/* Modal: Add/Edit Plot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingPlot 
                  ? t(`Edit Plot ${editingPlot.plotNo}`, `প্লট ${editingPlot.plotNo} সম্পাদনা`) 
                  : t('Add New Land Plot', 'নতুন প্লট যোগ করুন')}
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
                    {t('Plot No', 'প্লট নম্বর')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-05"
                    value={plotNo}
                    onChange={(e) => setPlotNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Block / Sector', 'ব্লক / সেক্টর')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block-A"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Road Demarcation', 'রাস্তা ও প্রশস্ততা')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Road-02 (40ft Avenue)"
                  value={roadNo}
                  onChange={(e) => setRoadNo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Size (Katha)', 'জমির পরিমাণ (কাঠা)')} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={sizeKatha}
                    onChange={(e) => setSizeKatha(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Rate / Katha (BDT)', 'কাঠাপ্রতি মূল্য (৳)')} *
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="10000"
                    required
                    value={ratePerKatha}
                    onChange={(e) => setRatePerKatha(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Booking Money (BDT)', 'বুকিং মানি (৳)')}
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={bookingMoney}
                    onChange={(e) => setBookingMoney(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Calculated Price Display */}
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900">
                  {t('Calculated Total Price', 'গণনাকৃত মোট মূল্য')}:
                </span>
                <span className="text-base font-extrabold text-emerald-800">
                  {formatBDT(sizeKatha * ratePerKatha)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Plot Type', 'প্লটের ধরন')}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PlotType)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Corner Plot">Corner Plot</option>
                    <option value="Lake View">Lake View</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Status', 'অবস্থা')}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PlotStatus)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {t('Facing', 'মুখী')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. South-East"
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Assign Investor / Member', 'সদস্য / ক্রেতা বরাদ্দ')}
                </label>
                <select
                  value={assignedMemberId}
                  onChange={(e) => setAssignedMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t('-- None (Unassigned) --', '-- ফাঁকা (অবরাদ্দকৃত) --')}</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.memberCode} - {m.name} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {t('Description & Features', 'বিবরণ ও বৈশিষ্ট্য')}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prime corner lot near boundary security gate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {editingPlot ? t('Save Changes', 'হালনাগাদ করুন') : t('Create Plot', 'প্লট যুক্ত করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
