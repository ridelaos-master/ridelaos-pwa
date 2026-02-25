import { useState } from 'react';
import { useVocabularyStore } from '../store/vocabularyStore';

function IconSpeaker() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function VocabularyPage() {
  const { items, loading, error, removeItem, clearError } = useVocabularyStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const playAudio = (item: { audioUrl?: string; englishText: string }) => {
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.play().catch(() => {});
      return;
    }
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speak) {
      const u = new SpeechSynthesisUtterance(item.englishText);
      u.lang = 'en-US';
      u.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await removeItem(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 overflow-hidden">
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-4">
        <h1 className="text-xl font-bold text-slate-800">단어장</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          ⭐로 저장한 문장과 청킹 어구
        </p>
      </header>

      <main className="flex-1 overflow-y-auto">
        {error && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start justify-between gap-2">
            <p className="text-sm text-red-800 flex-1">{error}</p>
            <button
              type="button"
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-medium shrink-0"
            >
              닫기
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-base">단어장을 불러오는 중...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-base">저장된 문장이 없습니다.</p>
            <p className="text-sm mt-2">쉐도잉 학습 화면에서 ⭐를 눌러 저장하세요.</p>
          </div>
        ) : (
          <ul className="p-4 space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {item.englishText}
                    </p>
                    <p className="mt-1 text-sm text-indigo-600">
                      {item.chunking}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => playAudio(item)}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                      aria-label="원어민 오디오 재생"
                      title="🔊 다시 듣기"
                    >
                      <IconSpeaker />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-colors disabled:opacity-50"
                      aria-label="삭제"
                      title="🗑️ 삭제"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
