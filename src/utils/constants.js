export const APP_ID = 'farmsync-app';

export const MENU_ITEMS = [
  { label: 'Dashboard', icon: 'Home' },
  { label: 'Quick Entry', icon: 'PlusCircle' },
  { label: 'Batch Management', icon: 'Package' },
  { label: 'Medication Log', icon: 'Pill' },
  { label: 'Inventory Management', icon: 'Warehouse' },
  { label: 'Health Monitoring', icon: 'HeartPulse' },
  { label: 'Expense & Profit Tracking', icon: 'DollarSign' },
  { label: 'Sales & Distribution', icon: 'ShoppingCart' },
  { label: 'Analytics Dashboard', icon: 'BarChart3' },
  { label: 'Notifications & Alerts', icon: 'Bell' },
];

export const INITIAL_DATA = {
  stats: {
    totalBirds: 5000,
    sales: 450000,
    sick: 0,
    mortality: 0,
    totalExpenses: 0,
    totalSales: 0,
  },
  dailySummary: {
    eggs: 0,
    feed: 0,
    sick: 0,
    mortality: 0,
  },
  batches: [],
  inventory: [],
  logs: [],
  expenses: [],
  sales: [],
  notifications: [],
};