// src/hooks/useEmergency.ts
// S4-05-B: SOS 발송 & 비상연락처 관리 훅

import { useState, useCallback } from 'react';
import type { GeoPosition } from './useGeolocation';

// ─── 타입 ─────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string; // '가족', '친구', '가이드' 등
}

// ─── 상수 ─────────────────────────────────────

const STORAGE_KEY = 'emergency-contacts';
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

// 라오스 긴급 전화번호
export const LAOS_EMERGENCY_NUMBERS = [
  { labelKey: 'safety.numbers.police', number: '1191', icon: '🚔' },
  { labelKey: 'safety.numbers.fireAmbulance', number: '1190', icon: '🚑' },
  { labelKey: 'safety.numbers.touristPolice', number: '021-251-128', icon: '🏛️' },
  { labelKey: 'safety.numbers.koreanEmbassy', number: '021-352-431', icon: '🇰🇷' },
  { labelKey: 'safety.numbers.rideLaos', number: '020-9999-0000', icon: '🏍️' },
];

// ─── 유틸리티 ──────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Google Maps 링크 생성 */
function getMapLink(pos: GeoPosition): string {
  return `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
}

/** SOS 메시지 생성 */
function buildSOSMessage(pos: GeoPosition | null): string {
  const time = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Vientiane' });
  if (pos) {
    const mapLink = getMapLink(pos);
    return `🆘 긴급 SOS — Ride Laos\n\n위치: ${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}\n정확도: ${Math.round(pos.accuracy)}m\n시간: ${time}\n\n지도: ${mapLink}\n\n도움이 필요합니다!`;
  }
  return `🆘 긴급 SOS — Ride Laos\n\n위치: 확인 불가\n시간: ${time}\n\n도움이 필요합니다!`;
}

// ─── 비상연락처 관리 ───────────────────────────

function loadContacts(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveContacts(contacts: EmergencyContact[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch {
    // localStorage 실패 시 무시
  }
}

// ─── 메인 훅 ──────────────────────────────────

export function useEmergency() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(loadContacts);
  const [isSending, setIsSending] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<string | null>(null);

  // 연락처 추가
  const addContact = useCallback(
    (name: string, phone: string, relation: string) => {
      const newContact: EmergencyContact = {
        id: generateId(),
        name,
        phone,
        relation,
      };
      const updated = [...contacts, newContact];
      setContacts(updated);
      saveContacts(updated);
      return newContact;
    },
    [contacts]
  );

  // 연락처 삭제
  const removeContact = useCallback(
    (id: string) => {
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      saveContacts(updated);
    },
    [contacts]
  );

  // 연락처 수정
  const updateContact = useCallback(
    (id: string, data: Partial<Omit<EmergencyContact, 'id'>>) => {
      const updated = contacts.map((c) =>
        c.id === id ? { ...c, ...data } : c
      );
      setContacts(updated);
      saveContacts(updated);
    },
    [contacts]
  );

  // SOS 발송 (카카오톡 공유 또는 SMS)
  const sendSOS = useCallback(
    async (position: GeoPosition | null) => {
      setIsSending(true);
      const message = buildSOSMessage(position);

      try {
        // 방법 1: 카카오톡 공유 (Kakao SDK 로드된 경우)
        if (window.Kakao && KAKAO_APP_KEY) {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(KAKAO_APP_KEY);
          }

          const mapLink = position ? getMapLink(position) : '';

          window.Kakao.Share.sendDefault({
            objectType: 'text',
            text: message,
            link: {
              mobileWebUrl: mapLink || 'https://ridelaos-pwa-rho.vercel.app',
              webUrl: mapLink || 'https://ridelaos-pwa-rho.vercel.app',
            },
            buttonTitle: '위치 확인',
          });

          setLastSentAt(new Date().toLocaleTimeString('ko-KR'));
          setIsSending(false);
          return { success: true, method: 'kakao' as const };
        }

        // 방법 2: SMS fallback
        if (contacts.length > 0) {
          const phoneNumbers = contacts.map((c) => c.phone).join(',');
          const smsBody = encodeURIComponent(message);
          window.location.href = `sms:${phoneNumbers}?body=${smsBody}`;

          setLastSentAt(new Date().toLocaleTimeString('ko-KR'));
          setIsSending(false);
          return { success: true, method: 'sms' as const };
        }

        // 방법 3: Web Share API
        if (navigator.share) {
          await navigator.share({
            title: '🆘 긴급 SOS — Ride Laos',
            text: message,
          });

          setLastSentAt(new Date().toLocaleTimeString('ko-KR'));
          setIsSending(false);
          return { success: true, method: 'share' as const };
        }

        // 모든 방법 실패 시 클립보드 복사
        await navigator.clipboard.writeText(message);
        setLastSentAt(new Date().toLocaleTimeString('ko-KR'));
        setIsSending(false);
        return { success: true, method: 'clipboard' as const };
      } catch (err) {
        console.error('[Emergency] SOS 발송 실패:', err);
        setIsSending(false);
        return { success: false, method: null };
      }
    },
    [contacts]
  );

  // 전화 걸기
  const callNumber = useCallback((number: string) => {
    window.location.href = `tel:${number}`;
  }, []);

  return {
    contacts,
    addContact,
    removeContact,
    updateContact,
    sendSOS,
    callNumber,
    isSending,
    lastSentAt,
  };
}

// ─── Kakao SDK 타입 선언 ──────────────────────

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: string;
          text: string;
          link: { mobileWebUrl: string; webUrl: string };
          buttonTitle: string;
        }) => void;
      };
    };
  }
}