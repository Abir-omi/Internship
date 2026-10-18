import React, { useState } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PlotsTab } from './components/PlotsTab';
import { MembersTab } from './components/MembersTab';
import { CollectionsTab } from './components/CollectionsTab';
import { ExpensesTab } from './components/ExpensesTab';
import { ReportsTab } from './components/ReportsTab';
import { CalculatorTab } from './components/CalculatorTab';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { Plot, Member } from './types';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, selectedReceipt, setSelectedReceipt } = useProject();

  // Global modal triggers
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [preselectedMemberId, setPreselectedMemberId] = useState<string | undefined>(undefined);
  const [preselectedPlotNo, setPreselectedPlotNo] = useState<string | undefined>(undefined);

  const handleOpenAddCollection = (member?: Member, plot?: Plot) => {
    setPreselectedMemberId(member ? member.id : undefined);
    setPreselectedPlotNo(plot ? plot.plotNo : undefined);
    setActiveTab('collections');
    setIsAddCollectionOpen(true);
  };

  const handleOpenAddExpense = () => {
    setActiveTab('expenses');
    setIsAddExpenseOpen(true);
  };

  const handleOpenAddPlot = () => {
    setActiveTab('plots');
  };

  const handleOpenAddMember = () => {
    setActiveTab('members');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans','Hind_Siliguri',sans-serif]">
      {/* Top Application Header */}
      <Header
        onOpenAddCollection={() => handleOpenAddCollection()}
        onOpenAddExpense={handleOpenAddExpense}
        onOpenAddPlot={handleOpenAddPlot}
        onOpenAddMember={handleOpenAddMember}
      />

      {/* Main Body with Sidebar + Tab Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenAddCollection={() => handleOpenAddCollection()}
              onOpenAddExpense={handleOpenAddExpense}
              onOpenAddPlot={handleOpenAddPlot}
              onOpenAddMember={handleOpenAddMember}
            />
          )}

          {activeTab === 'plots' && (
            <PlotsTab
              onQuickCollect={(plot) => handleOpenAddCollection(undefined, plot)}
            />
          )}

          {activeTab === 'members' && (
            <MembersTab
              onOpenAddCollectionForMember={(member) => handleOpenAddCollection(member)}
            />
          )}

          {activeTab === 'collections' && (
            <CollectionsTab
              initialPreselectedMemberId={preselectedMemberId}
              initialPreselectedPlotNo={preselectedPlotNo}
              isAddModalOpenInitially={isAddCollectionOpen}
              onResetInitialState={() => {
                setIsAddCollectionOpen(false);
                setPreselectedMemberId(undefined);
                setPreselectedPlotNo(undefined);
              }}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesTab
              isAddModalOpenInitially={isAddExpenseOpen}
              onResetInitialState={() => setIsAddExpenseOpen(false)}
            />
          )}

          {activeTab === 'reports' && <ReportsTab />}

          {activeTab === 'calculator' && <CalculatorTab />}
        </main>
      </div>

      {/* Digital Money Receipt Modal */}
      <DigitalReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <MainApp />
    </ProjectProvider>
  );
}
