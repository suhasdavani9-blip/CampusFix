import { Category, Priority, Status } from '../types';

export const getStatusBadgeStyle = (status: Status) => {
  switch (status) {
    case 'Reported':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Under Review':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'In Progress':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Resolved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getPriorityBadgeStyle = (priority: Priority) => {
  switch (priority) {
    case 'High':
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low':
      return 'bg-slate-50 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return 'Recently';
  }
};
