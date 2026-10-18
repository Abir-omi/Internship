import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Project, Plot, Member, Collection, Expense } from '../types';
import { initialProjects, initialPlots, initialMembers, initialCollections, initialExpenses } from '../data/initialData';
import { generateId } from '../utils/formatters';

interface ProjectStats {
  totalCollection: number;
  totalExpense: number;
  balance: number;
  totalPlots: number;
  availablePlots: number;
  bookedPlots: number;
  soldPlots: number;
  reservedPlots: number;
  totalMembers: number;
  totalProjectedValue: number;
  totalCollectedAgainstPlots: number;
  totalDueAmount: number;
}

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string;
  activeProject: Project;
  setActiveProjectId: (id: string) => void;
  addProject: (p: Omit<Project, 'id'>) => void;
  
  plots: Plot[];
  filteredPlots: Plot[];
  addPlot: (plot: Omit<Plot, 'id' | 'createdAt'>) => void;
  updatePlot: (id: string, plot: Partial<Plot>) => void;
  deletePlot: (id: string) => void;

  members: Member[];
  filteredMembers: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  collections: Collection[];
  filteredCollections: Collection[];
  addCollection: (col: Omit<Collection, 'id' | 'createdAt'>) => void;
  updateCollection: (id: string, col: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  expenses: Expense[];
  filteredExpenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, exp: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  stats: ProjectStats;
  getMemberCollections: (memberId: string) => Collection[];
  getMemberPaidAmount: (memberId: string) => number;
  getMemberDueAmount: (memberId: string) => number;

  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
  t: (en: string, bn: string) => string;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  selectedReceipt: Collection | null;
  setSelectedReceipt: (col: Collection | null) => void;
  
  resetToDemoData: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'lph_projects_v1',
  ACTIVE_PROJECT: 'lph_active_project_v1',
  PLOTS: 'lph_plots_v1',
  MEMBERS: 'lph_members_v1',
  COLLECTIONS: 'lph_collections_v1',
  EXPENSES: 'lph_expenses_v1',
  LANG: 'lph_lang_v1'
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync URL tab parameter on load if present
  const getInitialTab = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) return tabParam;
    } catch {
      // ignore
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  // State with localStorage backing
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT);
    return saved || 'proj-hills-pride';
  });

  const [plots, setPlots] = useState<Plot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLOTS);
    return saved ? JSON.parse(saved) : initialPlots;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    return saved ? JSON.parse(saved) : initialCollections;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [lang, setLang] = useState<'en' | 'bn'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as 'en' | 'bn') || 'en';
  });

  const [selectedReceipt, setSelectedReceipt] = useState<Collection | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  // Active Project
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || projects[0] || initialProjects[0];
  }, [projects, activeProjectId]);

  // Project-filtered data
  const filteredPlots = useMemo(() => {
    return plots.filter(p => p.projectId === activeProjectId);
  }, [plots, activeProjectId]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => m.projectId === activeProjectId);
  }, [members, activeProjectId]);

  const filteredCollections = useMemo(() => {
    return collections.filter(c => c.projectId === activeProjectId);
  }, [collections, activeProjectId]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => e.projectId === activeProjectId);
  }, [expenses, activeProjectId]);

  // Helper translations
  const t = (en: string, bn: string) => (lang === 'bn' ? bn : en);

  // Helper stats
  const stats: ProjectStats = useMemo(() => {
    const totalCollection = filteredCollections.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const totalExpense = filteredExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const balance = totalCollection - totalExpense;

    const totalPlots = filteredPlots.length;
    const availablePlots = filteredPlots.filter(p => p.status === 'Available').length;
    const bookedPlots = filteredPlots.filter(p => p.status === 'Booked').length;
    const soldPlots = filteredPlots.filter(p => p.status === 'Sold').length;
    const reservedPlots = filteredPlots.filter(p => p.status === 'Reserved').length;

    const totalMembers = filteredMembers.length;

    // Total target projected value of all plots
    const totalProjectedValue = filteredPlots.reduce((acc, p) => acc + (Number(p.totalPrice) || 0), 0);
    
    // Total commitments by members
    const totalCommitted = filteredMembers.reduce((acc, m) => acc + (Number(m.totalInvestment) || 0), 0);
    const totalDueAmount = Math.max(0, totalCommitted - totalCollection);

    return {
      totalCollection,
      totalExpense,
      balance,
      totalPlots,
      availablePlots,
      bookedPlots,
      soldPlots,
      reservedPlots,
      totalMembers,
      totalProjectedValue,
      totalCollectedAgainstPlots: totalCollection,
      totalDueAmount
    };
  }, [filteredCollections, filteredExpenses, filteredPlots, filteredMembers]);

  // Member helpers
  const getMemberCollections = (memberId: string): Collection[] => {
    return collections.filter(c => c.memberId === memberId && c.projectId === activeProjectId);
  };

  const getMemberPaidAmount = (memberId: string): number => {
    return getMemberCollections(memberId).reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  };

  const getMemberDueAmount = (memberId: string): number => {
    const mem = members.find(m => m.id === memberId);
    if (!mem) return 0;
    const paid = getMemberPaidAmount(memberId);
    return Math.max(0, (mem.totalInvestment || 0) - paid);
  };

  // CRUD for Projects
  const addProject = (p: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...p,
      id: generateId('proj')
    };
    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProj.id);
  };

  // CRUD for Plots
  const addPlot = (plotData: Omit<Plot, 'id' | 'createdAt'>) => {
    const newPlot: Plot = {
      ...plotData,
      id: generateId('plot'),
      createdAt: new Date().toISOString()
    };
    setPlots(prev => [newPlot, ...prev]);
  };

  const updatePlot = (id: string, updatedFields: Partial<Plot>) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deletePlot = (id: string) => {
    setPlots(prev => prev.filter(p => p.id !== id));
  };

  // CRUD for Members
  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: generateId('mem')
    };
    setMembers(prev => [newMember, ...prev]);

    // If assigned plots, update those plots
    if (newMember.assignedPlotIds && newMember.assignedPlotIds.length > 0) {
      setPlots(prev => prev.map(p => {
        if (newMember.assignedPlotIds.includes(p.id)) {
          return {
            ...p,
            assignedMemberId: newMember.id,
            assignedMemberName: newMember.name,
            status: p.status === 'Available' ? 'Booked' : p.status
          };
        }
        return p;
      }));
    }
  };

  const updateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));

    // Update names in plots if name changed
    if (updatedFields.name) {
      setPlots(prev => prev.map(p => p.assignedMemberId === id ? { ...p, assignedMemberName: updatedFields.name } : p));
    }
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    // Release assigned plots
    setPlots(prev => prev.map(p => p.assignedMemberId === id ? { ...p, assignedMemberId: undefined, assignedMemberName: undefined, status: 'Available' } : p));
  };

  // CRUD for Collections
  const addCollection = (colData: Omit<Collection, 'id' | 'createdAt'>) => {
    const newCol: Collection = {
      ...colData,
      id: generateId('col'),
      createdAt: new Date().toISOString()
    };
    setCollections(prev => [newCol, ...prev]);
  };

  const updateCollection = (id: string, updatedFields: Partial<Collection>) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  // CRUD for Expenses
  const addExpense = (expData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExp: Expense = {
      ...expData,
      id: generateId('exp'),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Reset demo data
  const resetToDemoData = () => {
    setProjects(initialProjects);
    setActiveProjectId('proj-hills-pride');
    setPlots(initialPlots);
    setMembers(initialMembers);
    setCollections(initialCollections);
    setExpenses(initialExpenses);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
    localStorage.removeItem(STORAGE_KEYS.PLOTS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        addProject,

        plots,
        filteredPlots,
        addPlot,
        updatePlot,
        deletePlot,

        members,
        filteredMembers,
        addMember,
        updateMember,
        deleteMember,

        collections,
        filteredCollections,
        addCollection,
        updateCollection,
        deleteCollection,

        expenses,
        filteredExpenses,
        addExpense,
        updateExpense,
        deleteExpense,

        stats,
        getMemberCollections,
        getMemberPaidAmount,
        getMemberDueAmount,

        lang,
        setLang,
        t,

        activeTab,
        setActiveTab,

        selectedReceipt,
        setSelectedReceipt,

        resetToDemoData
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
