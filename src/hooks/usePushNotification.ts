// src/hooks/usePushNotification.ts
// S4-07-A: PWA 푸시 알림 관리 훅
// 권한 요청, 로컬 알림 스케줄링 (D-7, D-1, 예약 확인)

import { useState, useEffect, useCallback } from 'react';

// ─── 타입 ─────────────────────────────────────

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledAt: number; // timestamp
  sent: boolean;
}

interface UsePushNotificationReturn {
  permission: NotificationPermission | 'unsupported';
  isEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleBookingReminders: (params: {
    bookingId: string;
    courseName: string;
    departureDate: string; // "2026-04-15"
  }) => void;
  sendNow: (title: string, body: string) => void;
  scheduledList: ScheduledNotification[];
  clearAll: () => void;
}

// ─── 상수 ─────────────────────────────────────

const STORAGE_KEY = 'push-notifications';
const CHECK_INTERVAL = 60 * 1000; // 1분마다 체크

// ─── 유틸 ─────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadScheduled(): ScheduledNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveScheduled(list: ScheduledNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // 무시
  }
}

/** 날짜 문자열 → 자정 timestamp */
function dateToTimestamp(dateStr: string, daysOffset: number): number {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(9, 0, 0, 0); // 오전 9시에 발송
  return d.getTime();
}

// ─── 메인 훅 ──────────────────────────────────

export function usePushNotification(): UsePushNotificationReturn {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });
  const [scheduledList, setScheduledList] = useState<ScheduledNotification[]>(loadScheduled);

  const isEnabled = permission === 'granted';

  // 권한 요청
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch {
      return false;
    }
  }, []);

  // 즉시 알림 발송
  const sendNow = useCallback(
    (title: string, body: string) => {
      if (permission !== 'granted') return;

      try {
        // Service Worker를 통한 알림 (PWA)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: generateId(),
              vibrate: [200, 100, 200],
            });
          });
        } else {
          // 일반 Notification API
          new Notification(title, {
            body,
            icon: '/pwa-192x192.png',
          });
        }
      } catch (err) {
        console.error('[Push] 알림 발송 실패:', err);
      }
    },
    [permission]
  );

  // 예약 리마인더 스케줄링 (D-7, D-1)
  const scheduleBookingReminders = useCallback(
    (params: { bookingId: string; courseName: string; departureDate: string }) => {
      const { bookingId, courseName, departureDate } = params;
      const now = Date.now();

      const reminders: ScheduledNotification[] = [];

      // 예약 확인 알림 (즉시)
      sendNow(
        '예약이 확인되었습니다',
        `${courseName} 투어가 예약되었습니다. 출발일: ${departureDate}`
      );

      // D-7 알림
      const d7Time = dateToTimestamp(departureDate, -7);
      if (d7Time > now) {
        reminders.push({
          id: `${bookingId}-d7`,
          title: '투어 출발 7일 전',
          body: `${courseName} 투어 출발까지 7일 남았습니다. 준비물을 확인하세요!`,
          scheduledAt: d7Time,
          sent: false,
        });
      }

      // D-1 알림
      const d1Time = dateToTimestamp(departureDate, -1);
      if (d1Time > now) {
        reminders.push({
          id: `${bookingId}-d1`,
          title: '내일 투어 출발!',
          body: `${courseName} 투어가 내일입니다. 오프라인 지도를 다운로드했는지 확인하세요!`,
          scheduledAt: d1Time,
          sent: false,
        });
      }

      if (reminders.length > 0) {
        const updated = [...scheduledList, ...reminders];
        setScheduledList(updated);
        saveScheduled(updated);
      }
    },
    [scheduledList, sendNow]
  );

  // 스케줄 체크 (1분 간격)
  useEffect(() => {
    if (permission !== 'granted') return;

    const checkAndSend = () => {
      const now = Date.now();
      let updated = false;

      const newList = scheduledList.map((item) => {
        if (!item.sent && item.scheduledAt <= now) {
          sendNow(item.title, item.body);
          updated = true;
          return { ...item, sent: true };
        }
        return item;
      });

      if (updated) {
        setScheduledList(newList);
        saveScheduled(newList);
      }
    };

    // 즉시 체크
    checkAndSend();

    // 주기적 체크
    const timer = setInterval(checkAndSend, CHECK_INTERVAL);
    return () => clearInterval(timer);
  }, [permission, scheduledList, sendNow]);

  // 전체 삭제
  const clearAll = useCallback(() => {
    setScheduledList([]);
    saveScheduled([]);
  }, []);

  return {
    permission,
    isEnabled,
    requestPermission,
    scheduleBookingReminders,
    sendNow,
    scheduledList,
    clearAll,
  };
}