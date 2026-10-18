import React from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  ReceiptText, 
  Wallet, 
  FileSpreadsheet, 
  Calculator,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, t, stats, filteredPlots, filteredMembers } = useProject();

  const navItems = [
    {
      id: 'dashboard',
      label: t('Dashboard', 'ড্যাশবোর্ড'),
      icon: LayoutDashboard,
      badge: null,
      description: t('Financial & Plot Overview', 'আর্থিক ও প্রকল্প সারসংক্ষেপ')
    },
    {
      id: 'plots',
      label: t('Plots & Shares', 'প্লট ও শেয়ার তালিকা'),
      icon: Map,
      badge: `${stats.bookedPlots + stats.soldPlots}/${stats.totalPlots}`,
      description: t('Inventory, Pricing & Booking', 'প্লটের বিবরণ, দাম ও বুকিং')
    },
    {
      id: 'members',
      label: t('Investors & Members', 'বিনিয়োগকারী সদস্য'),
      icon: Users,
      badge: stats.totalMembers.toString(),
      description: t('Shareholders Directory', 'সদস্য পরিচিতি ও খতিয়ান')
    },
    {
      id: 'collections',
      label: t('Collections & Receipts', 'টাকা জমা ও রিসিট'),
      icon: ReceiptText,
      badge: null,
      description: t('Installments & Digital Receipts', 'কিস্তি ও ডিজিটাল মানি রিসিট')
    },
    {
      id: 'expenses',
      label: t('Project Expenses', 'প্রকল্প ব্যয় হিসাব'),
      icon: Wallet,
      badge: null,
      description: t('Land Cost, Works & Bills', 'জমি ক্রয়, মাটি ভরাট ও খরচ')
    },
    {
      id: 'reports',
      label: t('Accounts & Reports', 'হিসাব বিবরণী'),
      icon: FileSpreadsheet,
      badge: null,
      description: t('Cashbook, Dues & Ledgers', 'ক্যাশ বহি, বকেয়া ও বিবরণী')
    },
    {
      id: 'calculator',
      label: t('Installment Calculator', 'কিস্তি ক্যালকুলেটর'),
      icon: Calculator,
      badge: 'Tool',
      description: t('Plan EMI & Land Pricing', 'জমির মূল্য ও কিস্তি হিসাব')
    }
  ];

  return (
    <aside className="no-print w-full md:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {t('Management Modules', 'মডিউল মেনু')}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <div>
                    <span>{item.label}</span>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Box */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('Secure Land Hisab', 'নিরাপদ ডিজিটাল হিসাব')}</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t(
              'Hill’s Pride transparent accounting ledger powered by PLANET Living.',
              'প্ল্যানেট লিভিং লিমিটেড পরিচালিত স্বচ্ছ রিয়েল এস্টেট হিসাব খতিয়ান।'
            )}
          </p>
        </div>
      </div>
    </aside>
  );
};
