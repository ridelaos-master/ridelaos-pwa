// src/pages/Safety.tsx
// S4-05-C: 안전 시스템 메인 페이지
// SOS 버튼, 실시간 위치, 비상연락처 관리, 라오스 긴급번호

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Navigation,
  Copy,
  CheckCircle,
  X,
  Shield,
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  useEmergency,
  LAOS_EMERGENCY_NUMBERS,
  type EmergencyContact,
} from '../hooks/useEmergency';

/* ─── SOS 버튼 ─────────────────────────────── */
function SOSButton({
  onPress,
  isSending,
}: {
  onPress: () => void;
  isSending: boolean;
}) {
  const { t } = useTranslation();
  const [confirmStep, setConfirmStep] = useState(false);

  const handlePress = () => {
    if (!confirmStep) {
      setConfirmStep(true);
      setTimeout(() => setConfirmStep(false), 5000);
      return;
    }
    setConfirmStep(false);
    onPress();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handlePress}
        disabled={isSending}
        className={`relative h-32 w-32 rounded-full shadow-lg transition-all active:scale-95 ${
          confirmStep
            ? 'bg-red-600 animate-pulse'
            : 'bg-red-500 hover:bg-red-600'
        } disabled:opacity-50`}
      >
        <div className="flex flex-col items-center justify-center text-white">
          <AlertTriangle size={36} />
          <span className="mt-1 text-lg font-bold">SOS</span>
        </div>
        {confirmStep && (
          <span className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
        )}
      </button>
      <p className="mt-3 text-sm text-center text-gray-500">
        {isSending
          ? t('safety.sosSending')
          : confirmStep
          ? t('safety.sosConfirm')
          : t('safety.sosDefault')}
      </p>
    </div>
  );
}

/* ─── 위치 정보 카드 ───────────────────────── */
function LocationCard({
  position,
  isTracking,
  error,
  onStart,
  onStop,
}: {
  position: ReturnType<typeof useGeolocation>['position'];
  isTracking: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyLocation = async () => {
    if (!position) return;
    const text = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation size={18} className="text-rl-green" />
          <h2 className="font-bold text-rl-green">{t('safety.myLocation')}</h2>
        </div>
        <button
          type="button"
          onClick={isTracking ? onStop : onStart}
          className={`rounded-btn px-3 py-1.5 text-xs font-bold transition ${
            isTracking
              ? 'bg-red-100 text-red-600'
              : 'bg-rl-green text-white'
          }`}
        >
          {isTracking ? t('safety.stopTracking') : t('safety.trackLocation')}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {position && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">{t('safety.coordinates')}</p>
              <p className="text-sm font-mono text-rl-green">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </p>
            </div>
            <button
              type="button"
              onClick={copyLocation}
              className="p-2 text-gray-400 active:text-rl-green"
            >
              {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400">{t('safety.accuracy')}</p>
              <p className="text-sm text-rl-green">{Math.round(position.accuracy)}m</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">{t('safety.speed')}</p>
              <p className="text-sm text-rl-green">
                {position.speed != null
                  ? `${(position.speed * 3.6).toFixed(1)} km/h`
                  : '-'}
              </p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-xs text-blue-500 underline"
          >
            <MapPin size={12} />
            {t('safety.viewOnMap')}
          </a>
        </div>
      )}

      {!position && !error && !isTracking && (
        <p className="mt-3 text-sm text-gray-400">
          {t('safety.locationHint')}
        </p>
      )}

      {isTracking && !position && !error && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rl-green animate-pulse" />
          <p className="text-sm text-gray-500">{t('safety.findingLocation')}</p>
        </div>
      )}
    </section>
  );
}

/* ─── 비상연락처 추가 모달 ─────────────────── */
function AddContactModal({
  onAdd,
  onClose,
}: {
  onAdd: (name: string, phone: string, relation: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('가족');

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    onAdd(name.trim(), phone.trim(), relation);
    onClose();
  };

  const relations = ['가족', '친구', '가이드', '동행자', '기타'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-[480px] rounded-t-2xl bg-white p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-rl-green">{t('safety.addContactTitle')}</h3>
          <button type="button" onClick={onClose} className="p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">{t('safety.labelName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('safety.namePlaceholder')}
              className="mt-1 w-full rounded-btn border border-gray-200 px-3 py-2.5 text-sm focus:border-rl-green focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">{t('safety.labelPhone')}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('safety.phonePlaceholder')}
              className="mt-1 w-full rounded-btn border border-gray-200 px-3 py-2.5 text-sm focus:border-rl-green focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">{t('safety.labelRelation')}</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {relations.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRelation(r)}
                  className={`rounded-btn px-3 py-1.5 text-xs font-medium transition ${
                    relation === r
                      ? 'bg-rl-green text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t(`safety.relations.${r}`, r)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim() || !phone.trim()}
          className="mt-5 w-full rounded-btn bg-rl-orange py-3 font-bold text-white transition active:opacity-80 disabled:opacity-50"
        >
          {t('safety.addButton')}
        </button>
      </div>
    </div>
  );
}

/* ─── 비상연락처 카드 ──────────────────────── */
function ContactCard({
  contact,
  onCall,
  onRemove,
}: {
  contact: EmergencyContact;
  onCall: (phone: string) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between rounded-btn border border-gray-100 bg-rl-bg p-3">
      <div>
        <p className="text-sm font-medium text-rl-green">
          {contact.name}
          <span className="ml-2 text-xs text-gray-400">{t(`safety.relations.${contact.relation}`, contact.relation)}</span>
        </p>
        <p className="text-xs text-gray-500">{contact.phone}</p>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onCall(contact.phone)}
          className="rounded-full bg-rl-green p-2 text-white active:opacity-80"
        >
          <Phone size={14} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(contact.id)}
          className="rounded-full bg-gray-200 p-2 text-gray-500 active:bg-red-100 active:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── 긴급 전화번호 ────────────────────────── */
function EmergencyNumbers({ onCall }: { onCall: (number: string) => void }) {
  const { t } = useTranslation();
  return (
    <section className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Phone size={18} className="text-rl-green" />
        <h2 className="font-bold text-rl-green">{t('safety.laosNumbers')}</h2>
      </div>

      <div className="space-y-2">
        {LAOS_EMERGENCY_NUMBERS.map((item) => (
          <button
            key={item.number}
            type="button"
            onClick={() => onCall(item.number)}
            className="flex w-full items-center justify-between rounded-btn border border-gray-100 bg-rl-bg p-3 transition active:bg-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-rl-green">{t(item.labelKey)}</p>
                <p className="text-xs text-gray-500">{item.number}</p>
              </div>
            </div>
            <Phone size={16} className="text-rl-green" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─── 안전 가이드 ──────────────────────────── */
function SafetyGuide() {
  const { t } = useTranslation();
  const tips = [
    { emoji: '🪖', key: 'helmet' },
    { emoji: '🌧️', key: 'rainy' },
    { emoji: '⛽', key: 'fuel' },
    { emoji: '📱', key: 'offlineMap' },
    { emoji: '🔦', key: 'night' },
    { emoji: '💧', key: 'water' },
    { emoji: '📋', key: 'documents' },
    { emoji: '🏥', key: 'hospital' },
  ];

  return (
    <section className="rounded-card bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Shield size={18} className="text-rl-green" />
        <h2 className="font-bold text-rl-green">{t('safety.safetyGuide')}</h2>
      </div>

      <div className="space-y-2">
        {tips.map((tip) => (
          <div
            key={tip.key}
            className="flex items-start gap-2 rounded-btn bg-rl-bg p-2.5"
          >
            <span className="text-base">{tip.emoji}</span>
            <p className="text-sm text-gray-600">{t(`safety.tips.${tip.key}`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Safety 메인 페이지 ───────────────────── */
export default function Safety() {
  const { t } = useTranslation();
  const { position, isTracking, error: geoError, startTracking, stopTracking } =
    useGeolocation();
  const {
    contacts,
    addContact,
    removeContact,
    sendSOS,
    callNumber,
    isSending,
    lastSentAt,
  } = useEmergency();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleSOS = async () => {
    const result = await sendSOS(position);
    if (result.success) {
      const method = result.method ? t(`safety.sosMethod.${result.method}`) : '';
      alert(`${t('safety.sosSuccess')} ${method}`);
    } else {
      alert(t('safety.sosFail'));
    }
  };

  return (
    <div className="min-h-full bg-rl-bg pb-24">
      {/* 헤더 영역 */}
      <div className="bg-rl-green px-4 py-6 text-center">
        <h1 className="text-lg font-bold text-white">{t('safety.title')}</h1>
        <p className="mt-1 text-xs text-white/70">
          {t('safety.subtitle')}
        </p>
      </div>

      <div className="px-4 space-y-4 -mt-2">
        {/* SOS 버튼 */}
        <section className="rounded-card bg-white p-6 shadow-card flex flex-col items-center">
          <SOSButton onPress={handleSOS} isSending={isSending} />
          {lastSentAt && (
            <p className="mt-2 text-xs text-gray-400">
              {t('safety.lastSent', { time: lastSentAt })}
            </p>
          )}
        </section>

        {/* 위치 정보 */}
        <LocationCard
          position={position}
          isTracking={isTracking}
          error={geoError}
          onStart={startTracking}
          onStop={stopTracking}
        />

        {/* 비상연락처 */}
        <section className="rounded-card bg-white p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-rl-green" />
              <h2 className="font-bold text-rl-green">{t('safety.emergencyContacts')}</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 rounded-btn bg-rl-orange px-3 py-1.5 text-xs font-bold text-white active:opacity-80"
            >
              <Plus size={14} />
              {t('safety.addContact')}
            </button>
          </div>

          {contacts.length === 0 ? (
            <p className="text-sm text-gray-400">
              {t('safety.noContacts')}
            </p>
          ) : (
            <div className="space-y-2">
              {contacts.map((c) => (
                <ContactCard
                  key={c.id}
                  contact={c}
                  onCall={callNumber}
                  onRemove={removeContact}
                />
              ))}
            </div>
          )}
        </section>

        {/* 라오스 긴급 전화번호 */}
        <EmergencyNumbers onCall={callNumber} />

        {/* 안전 가이드 */}
        <SafetyGuide />
      </div>

      {/* 비상연락처 추가 모달 */}
      {showAddModal && (
        <AddContactModal
          onAdd={addContact}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
