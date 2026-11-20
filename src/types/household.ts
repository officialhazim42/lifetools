/**
 * LifeTools — Home, Household & Property Utilities Domain Types
 * 100% Client-side models for chores, inventories, shopping lists,
 * maintenance records, reminders, repair expenses, and property portfolios.
 */

export interface HouseholdChore {
  id: string;
  title: string;
  room: string;
  assignedTo?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
  points?: number;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'pantry' | 'fridge' | 'freezer' | 'groceries' | 'cleaning' | 'home_asset' | 'storage';
  quantity: number;
  unit?: string;
  location?: string;
  expiryDate?: string; // YYYY-MM-DD
  minQuantity?: number;
  purchaseDate?: string;
  price?: number;
  serialNumber?: string;
  brand?: string;
  condition?: 'new' | 'good' | 'fair' | 'poor';
  notes?: string;
  isLowStock?: boolean;
  updatedAt: string;
}

export interface HouseholdShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  estimatedCost?: number;
  isPurchased: boolean;
  storeName?: string;
  notes?: string;
  createdAt: string;
}

export interface HomeMaintenanceRecord {
  id: string;
  title: string;
  category: 'hvac' | 'plumbing' | 'electrical' | 'appliances' | 'equipment' | 'structural' | 'exterior' | 'cleaning';
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'as_needed';
  lastPerformed?: string; // YYYY-MM-DD
  nextDue?: string; // YYYY-MM-DD
  cost?: number;
  serviceProvider?: string;
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
  createdAt: string;
}

export interface HomeReminder {
  id: string;
  title: string;
  type: 'ac_service' | 'water_tank' | 'filter_replacement' | 'warranty' | 'general';
  dueDate: string; // YYYY-MM-DD
  intervalDays?: number;
  equipmentName?: string;
  location?: string;
  notes?: string;
  isResolved: boolean;
  warrantyDetails?: {
    provider?: string;
    policyNumber?: string;
    contactPhone?: string;
    durationMonths?: number;
  };
  createdAt: string;
}

export interface HomeRepairExpense {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: 'plumbing' | 'electrical' | 'roofing' | 'hvac' | 'carpentry' | 'painting' | 'appliance' | 'landscaping' | 'other';
  amount: number;
  contractor?: string;
  receiptRef?: string;
  isEmergency?: boolean;
  notes?: string;
  createdAt: string;
}

export interface PropertyExpense {
  id: string;
  propertyId?: string;
  propertyName?: string;
  date: string; // YYYY-MM-DD
  category: 'mortgage' | 'property_tax' | 'insurance' | 'hoa_fee' | 'utility' | 'maintenance' | 'capital_improvement' | 'management_fee';
  amount: number;
  payee?: string;
  notes?: string;
  createdAt: string;
}

export interface PropertyRecord {
  id: string;
  name: string;
  address?: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial' | 'plot';
  areaSqFt: number;
  purchasePrice?: number;
  purchaseDate?: string;
  currentEstimatedValue?: number;
  monthlyRentalIncome?: number;
  notes?: string;
  updatedAt: string;
}

export interface UtilityTariffSlab {
  slabStart: number;
  slabEnd: number | null; // null for open-ended top tier
  ratePerUnit: number;
}
