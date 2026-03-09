// src/components/NotificationBanner.tsx
// S4-07-B: 알림 권한 요청 배너
// 홈 또는 예약 완료 페이지에 표시

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X } from 'lucide-react';
import { usePushNotification } from '../hooks/usePushNotification';

export default function NotificationBanner() {
  const { t } = useTranslation();
  const { permission, requestPermission } = usePushNotification();
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('notification-banner-dismissed') === 'true';
  });

  // 이미 허용됨, 거부됨, 미지원, 또는 닫음 → 표시 안 함
  if (permission !== 'default' || dismissed) return null;

  const handleAllow = async () => {
    await requestPermission();
    setDismissed(true);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  return (
    <div className="mx-4 mt-3 rounded-card bg-white p-4 shadow-card border border-rl-orange/20">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-full bg-rl-orange/10 p-2">
          <Bell size={20} className="text-rl-orange" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-rl-green">
            {t('push.title')}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {t('push.description')}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleAllow}
              className="rounded-btn bg-rl-orange px-4 py-2 text-xs font-bold text-white active:opacity-80"
            >
              {t('push.allow')}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-btn px-4 py-2 text-xs text-gray-400 active:text-gray-600"
            >
              {t('push.later')}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 text-gray-300 active:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}