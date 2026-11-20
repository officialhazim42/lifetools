// Domain models for LifeTools My Workspace

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  category: string;
  color?: string;
  isPinned: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkspaceTask {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: string;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'food'
  | 'housing'
  | 'utilities'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'education'
  | 'other';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'other';

export interface WorkspaceExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface WorkspaceHabit {
  id: string;
  name: string;
  description?: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  history: Record<string, boolean>; // 'YYYY-MM-DD' -> true
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export type GoalStatus = 'in_progress' | 'completed' | 'on_hold';

export interface WorkspaceGoal {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetDate: string; // YYYY-MM-DD
  progress: number; // 0 - 100
  status: GoalStatus;
  milestones: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 'event' | 'reminder' | 'deadline' | 'personal' | 'work';

export interface WorkspaceEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category: EventCategory;
  priority: 'normal' | 'important';
  createdAt: string;
}

export interface WorkspaceStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalNotes: number;
  activeHabits: number;
  currentGoals: number;
  monthlyExpenses: number;
  upcomingEvents: number;
}

export interface WorkspaceBackupPayload {
  version: number;
  exportedAt: string;
  appName: 'LifeTools';
  data: {
    notes: WorkspaceNote[];
    tasks: WorkspaceTask[];
    expenses: WorkspaceExpense[];
    habits: WorkspaceHabit[];
    goals: WorkspaceGoal[];
    events: WorkspaceEvent[];
  };
}
