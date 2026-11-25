export type Priority = 'Low' | 'Medium' | 'High';

export type Status = 'Reported' | 'Under Review' | 'In Progress' | 'Resolved';

export type Category =
  | 'Damaged roads and pathways'
  | 'Water leakage'
  | 'Blocked drainage'
  | 'Rainwater waterlogging'
  | 'Overflowing dustbins'
  | 'Broken lights'
  | 'Damaged walls and buildings'
  | 'Washroom maintenance'
  | 'Other problems';

export interface Report {
  id: string; // e.g. "CF-8492"
  category: Category;
  description: string;
  location: string;
  priority: Priority;
  status: Status;
  photo?: string;
  createdAt: string; // ISO string
  reporterUid?: string;
}

export interface NotificationItem {
  id: string;
  complaintId: string;
  title: string;
  message: string;
  category: Category;
  priority: Priority;
  read: boolean;
  createdAt: string;
}

export interface AdminPreferences {
  newComplaints: boolean;
  urgentComplaints: boolean;
  unresolvedComplaints: boolean;
  enablePushNotifications: boolean;
  soundAlerts: boolean;
}

export type TabType = 'home' | 'report' | 'view' | 'dashboard';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
