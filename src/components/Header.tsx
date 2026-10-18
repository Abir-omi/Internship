import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Building2, 
  Plus, 
  RotateCcw, 
  Globe, 
  ChevronDown, 
  PlusCircle,
  MapPin,
  TrendingUp,
  Receipt,
  MinusCircle
} from 'lucide-react';

interface HeaderProps {
  onOpenAddCollection: () => void;
  onOpenAddExpense: () => void;
  onOpenAddPlot: () => void;
  onOpenAddMember: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddCollection,
  onOpenAddExpense,
  onOpenAddPlot,
  onOpenAddMember
}) => {
  const { 
    projects, 
    activeProjectId, 
    activeProject, 
    setActiveProjectId, 
    addProject,
    lang, 
    setLang, 
    t, 
    resetToDemoData 
  } = useProject();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectBangla, setNewProjectBangla] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectArea, setNewProjectArea] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    addProject({
      name: newProjectName,
      banglaName: newProjectBangla || newProjectName,
      company: 'PLANET Living Limited',
      location: newProjectLocation || 'Chittagong, Bangladesh',
      totalArea: newProjectArea || '20 Bigha',
      totalPlots: 50,
      totalShares: 50,
      startDate: new Date().toISOString().split('T')[0],
      expectedCompletion: '2028-12-31',
      status: 'Ongoing',
      currency: 'BDT (৳)'
    });
    setNewProjectName('');
    setNewProjectBangla('');
    setNewProjectLocation('');
    setNewProjectArea('');
    setIsNewProjectModalOpen(false);
    setIsProjectDropdownOpen(false);
  };

  return (
    <>
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Brand & Project Switcher */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    PLANET Living
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-500 hidden sm:inline font-mono">
                    landprojecthisab.com
                  </span>
                </div>

                {/* Project Selector Dropdown */}
                <div className="relative mt-0.5">
                  <button
                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                    className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    <span className="truncate max-w-[200px] sm:max-w-[320px]">
                      {activeProject.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>

                  {isProjectDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        {t('Select Project', 'প্রকল্প নির্বাচন করুন')}
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {projects.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setActiveProjectId(p.id);
                              setIsProjectDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                              p.id === activeProjectId ? 'bg-emerald-50/60 font-semibold text-emerald-800 border-l-2 border-emerald-600' : 'text-slate-700'
                            }`}
                          >
                            <span className="text-sm font-semibold">{p.name}</span>
                            <span className="text-[11px] text-slate-400 truncate">{p.location}</span>
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 p-2">
                        <button
                          onClick={() => {
                            setIsNewProjectModalOpen(true);
                            setIsProjectDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('Add New Land Project', 'নতুন ল্যান্ড প্রজেক্ট যোগ করুন')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Quick Collection Button */}
              <button
                onClick={onOpenAddCollection}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                title="Add New Collection"
              >
                <Plus className="w-4 h-4" />
                <span>{t('+ Money Collection', '+ টাকা জমা')}</span>
              </button>

              {/* Quick Expense Button */}
              <button
                onClick={onOpenAddExpense}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                title="Record Project Expense"
              >
                <MinusCircle className="w-4 h-4" />
                <span>{t('+ Record Expense', '+ খরচ হিসাব')}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => {
                  if (window.confirm(t('Reset all project data to initial demo state?', 'আপনি কি সকল তথ্য প্রাথমিক ডেমো অবস্থায় রিসেট করতে চান?'))) {
                    resetToDemoData();
                  }
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title={t('Reset Demo Data', 'ডেমো ডেটা রিসেট করুন')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Project Sub-bar */}
        <div className="bg-slate-50/80 border-t border-slate-100 px-4 sm:px-8 py-1.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[280px] sm:max-w-md">{activeProject.location}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-700">{activeProject.totalArea}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              {activeProject.status}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Currency: {activeProject.currency}
            </span>
          </div>
        </div>
      </header>

      {/* Modal: Add New Project */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base">
                  {t('Create New Land Project', 'নতুন ল্যান্ড প্রজেক্ট তৈরি করুন')}
                </h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {t('Project Name (English)', 'প্রকল্পের নাম (ইংরেজি)')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hill's View City"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {t('Project Name (Bangla)', 'প্রকল্পের নাম (বাংলা)')}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: হিলস ভিউ সিটি"
                  value={newProjectBangla}
                  onChange={(e) => setNewProjectBangla(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {t('Location', 'অবস্থান / এলাকা')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bayezid Link Road, Chittagong"
                  value={newProjectLocation}
                  onChange={(e) => setNewProjectLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {t('Total Area (Bigha/Katha)', 'মোট জমির পরিমাণ')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Bigha (300 Katha)"
                  value={newProjectArea}
                  onChange={(e) => setNewProjectArea(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t('Create Project', 'প্রকল্প সংরক্ষণ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
