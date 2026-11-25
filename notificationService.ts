/**
 * Push Notification Service & Web Audio Chime for CampusFix
 * Handles browser push notifications, sound alerts, and permissions.
 */

// Synthesize a crisp notification chime using Web Audio API (Zero external assets needed)
export const playNotificationChime = (type: 'standard' | 'urgent' = 'standard') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';

    if (type === 'urgent') {
      // High-priority dual pulse: 660Hz -> 880Hz
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.1);
      osc.frequency.setValueAtTime(880.0, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } else {
      // Standard pleasant two-tone chime: 523.25Hz (C5) -> 783.99Hz (G5)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    // Audio autoplay restrictions can fail silently if user hasn't interacted
    console.debug('Notification audio note:', err);
  }
};

export const checkNotificationPermission = (): NotificationPermission => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this browser.');
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

export interface PushNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  complaintId?: string;
  isUrgent?: boolean;
  icon?: string;
  playSound?: boolean;
}

export const sendLocalPushNotification = async (payload: PushNotificationPayload) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  // Play audio chime if requested
  if (payload.playSound !== false) {
    playNotificationChime(payload.isUrgent ? 'urgent' : 'standard');
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const notificationOptions: NotificationOptions = {
    body: payload.body,
    icon: payload.icon || '/favicon.ico',
    tag: payload.tag || payload.complaintId || 'campusfix-alert',
    badge: '/favicon.ico',
    data: {
      complaintId: payload.complaintId,
      url: window.location.origin,
    },
  };

  try {
    // Check if service worker is active for background push notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(payload.title, notificationOptions);
        return;
      }
    }

    // Fallback to standard window Notification
    const notif = new Notification(payload.title, notificationOptions);
    notif.onclick = () => {
      window.focus();
      if (payload.complaintId && (window as unknown as { handleNotificationComplaintClick?: (id: string) => void }).handleNotificationComplaintClick) {
        (window as unknown as { handleNotificationComplaintClick: (id: string) => void }).handleNotificationComplaintClick(payload.complaintId);
      }
      notif.close();
    };
  } catch (err) {
    console.warn('Could not display system push notification:', err);
  }
};
