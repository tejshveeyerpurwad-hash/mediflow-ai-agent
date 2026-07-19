export const VILLAGE_INFO = {
  name: 'Village Sundarnagar',
  district: 'Pune Rural',
  population: 1240,
  households: 248,
  lastUpdated: new Date().toLocaleDateString('en-IN'),
};

export const ASHA_WORKER = {
  name: 'Priya Sharma',
  id: 'ASHA-2024-001',
  zone: 'Zone B',
  phone: '+91-9876543210',
  experience: '5 years',
  rating: 4.8,
};

export const OUTBREAK_ALERTS = [
  { id: 1, disease: 'Dengue', severity: 'high', cases: 12, village: 'V103', trend: 'increasing', message: 'Dengue spike detected — 12 new cases in last 48 hours' },
  { id: 2, disease: 'Malaria', severity: 'medium', cases: 5, village: 'V101', trend: 'stable', message: 'Malaria cases stable — continue monitoring' },
];

export const KPI_CARDS = [
  { title: 'Pregnancies', value: '24', sub: 'This month', icon: 'Heart', color: '#10b981', trend: '+8%' },
  { title: 'Malnutrition', value: '7', sub: 'Active cases', icon: 'Activity', color: '#f59e0b', trend: '-12%' },
  { title: 'Vaccinations', value: '142', sub: 'This year', icon: 'Shield', color: '#3b82f6', trend: '+23%' },
  { title: 'Referrals', value: '18', sub: 'This month', icon: 'Ambulance', color: '#8b5cf6', trend: '+5%' },
];

export const TODAY_TASKS = [
  { id: 1, title: 'Home visit: Sunita Devi', type: 'pregnancy', priority: 'high', time: '10:00 AM', location: 'House #42' },
  { id: 2, title: 'Vaccination camp setup', type: 'vaccination', priority: 'high', time: '11:30 AM', location: 'PHC Center' },
  { id: 3, title: 'Follow-up: Malnutrition case #7', type: 'nutrition', priority: 'medium', time: '2:00 PM', location: 'House #15' },
  { id: 4, title: 'Stock check: Sanitary pads', type: 'inventory', priority: 'medium', time: '3:30 PM', location: 'Store Room' },
  { id: 5, title: 'Monthly report submission', type: 'report', priority: 'low', time: '5:00 PM', location: 'Office' },
];

export const QUICK_ACTIONS = [
  { id: 1, title: 'New Pregnancy', icon: 'Heart', color: '#10b981', path: '/ngo/maternal' },
  { id: 2, title: 'Malnutrition Screening', icon: 'Activity', color: '#f59e0b', path: '/ngo/child-nutrition' },
  { id: 3, title: 'Record Vaccination', icon: 'Shield', color: '#3b82f6', path: '/ngo/records' },
  { id: 4, title: 'Create Referral', icon: 'Ambulance', color: '#8b5cf6', path: '/ngo/patients' },
];

export const SYSTEM_HEALTH = {
  api: { status: 'healthy', latency: '124ms' },
  database: { status: 'connected', type: 'PostgreSQL' },
  ai: { status: 'ready', model: 'SymptomNet' },
  sync: { status: 'synced', pending: 0 },
};

export const AI_RECOMMENDATIONS = [
  { id: 1, title: 'Vaccination Outreach', description: '3 children in Ward B missed polio dose', priority: 'high', action: 'Schedule visit' },
  { id: 2, title: 'Anemia Screening', description: '5 pregnant women due for Hb test this week', priority: 'medium', action: 'Set reminder' },
  { id: 3, title: 'Mosquito Prevention', description: 'Dengue cases rising in neighboring village', priority: 'medium', action: 'Distribute nets' },
];

export const OFFLINE_QUEUE = {
  pendingSync: 0,
  lastSync: new Date().toISOString(),
  items: [],
};
