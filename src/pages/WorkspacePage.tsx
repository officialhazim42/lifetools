import React, { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { WorkspaceDashboard } from '../components/workspace/WorkspaceDashboard';
import { WorkspaceNotes } from '../components/workspace/WorkspaceNotes';
import { WorkspaceTasks } from '../components/workspace/WorkspaceTasks';
import { WorkspaceExpenses } from '../components/workspace/WorkspaceExpenses';
import { WorkspaceHabits } from '../components/workspace/WorkspaceHabits';
import { WorkspaceGoals } from '../components/workspace/WorkspaceGoals';
import { WorkspaceCalendar } from '../components/workspace/WorkspaceCalendar';
import { WorkspaceBackups } from '../components/workspace/WorkspaceBackups';
import { workspaceDB } from '../utils/workspaceDB';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Wallet,
  Repeat,
  Target,
  Calendar,
  Database,
  ShieldCheck
} from 'lucide-react';

interface WorkspacePageProps {
  initialTab?: string;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return initialTab || 'dashboard';
  });

  const [taskCount, setTaskCount] = useState<number>(0);
  const [noteCount, setNoteCount] = useState<number>(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const fetchCounts = async () => {
      const stats = await workspaceDB.getStats();
      setTaskCount(stats.pendingTasks);
      setNoteCount(stats.totalNotes);
    };
    fetchCounts();
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = `#/workspace/${tabId}`;
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'My Notes', icon: FileText, badge: noteCount > 0 ? noteCount : undefined },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: taskCount > 0 ? taskCount : undefined },
    { id: 'expenses', label: 'My Expenses', icon: Wallet },
    { id: 'habits', label: 'My Habits', icon: Repeat },
    { id: 'goals', label: 'My Goals', icon: Target },
    { id: 'calendar', label: 'My Calendar', icon: Calendar },
    { id: 'backups', label: 'Backups & Custody', icon: Database },
  ];

  return (
    <div className="space-y-6 pb-12">
      <SEO
        title="My Workspace — Private Personal Productivity | LifeTools"
        description="A private, offline-first personal workspace for notes, task management, expenses, habit streaks, goals, and calendar schedules."
      />

      {/* Workspace Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div className="min-h-[500px]">
        {activeTab === 'dashboard' && <WorkspaceDashboard onSwitchTab={handleTabChange} />}
        {activeTab === 'notes' && <WorkspaceNotes />}
        {activeTab === 'tasks' && <WorkspaceTasks />}
        {activeTab === 'expenses' && <WorkspaceExpenses />}
        {activeTab === 'habits' && <WorkspaceHabits />}
        {activeTab === 'goals' && <WorkspaceGoals />}
        {activeTab === 'calendar' && <WorkspaceCalendar />}
        {activeTab === 'backups' && <WorkspaceBackups />}
      </div>
    </div>
  );
};
