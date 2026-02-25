import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useVocabularyStore } from '../store/vocabularyStore';

/** 이전 화면에서 선택한 쉐도잉 대기 배수 (0.8 | 1.0 | 1.25 | 1.5) */
const SHADOWING_MULTIPLIER = 1.25;
/** 타이머 기본 대기 시간(초). 실제 대기 = BASE_WAIT_SECONDS * SHADOWING_MULTIPLIER */
const BASE_WAIT_SECONDS = 10;

const CURRENT_CLIP_INDEX = 3;
const TOTAL_CLIPS = 7;

// 샘플 현재 구간 문장
const SAMPLE_ENGLISH = "The key to effective learning is consistent practice.";
const SAMPLE_CHUNKING = "The key to effective learning | is consistent practice.";

interface YTPlayer {
  playVideo: () => void;
  stopVideo: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          height?: string;
          width?: string;
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: { onReady?: (e: { target: YTPlayer }) => void };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function LearnStep3Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [sentencePlayed, setSentencePlayed] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'countdown'>('idle');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { hasItem, toggleItem, error: vocabError, clearError } = useVocabularyStore();
  const isStarred = hasItem(SAMPLE_ENGLISH, SAMPLE_CHUNKING);
  const [isToggling, setIsToggling] = useState(false);

  const toggleStar = useCallback(async () => {
    clearError();
    setIsToggling(true);
    try {
      await toggleItem({
        englishText: SAMPLE_ENGLISH,
        chunking: SAMPLE_CHUNKING,
      });
    } finally {
      setIsToggling(false);
    }
  }, [toggleItem, clearError]);

  // 타이머: 문장 오디오 종료 후 대기 시간 = BASE * 배수
  const waitSeconds = Math.round(BASE_WAIT_SECONDS * SHADOWING_MULTIPLIER);

  const startCountdown = useCallback(() => {
    setPhase('countdown');
    setCountdown(waitSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase('idle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [waitSeconds]);

  // 원문 재생 시뮬레이션: "재생" 후 일정 시간 뒤에 카운트다운 시작
  const simulateSentenceEnd = useCallback(() => {
    setSentencePlayed(true);
    const ms = 3000; // 3초 후 "오디오 끝"으로 간주
    const t = setTimeout(() => startCountdown(), ms);
    return () => clearTimeout(t);
  }, [startCountdown]);

  useEffect(() => {
    if (!containerRef.current || playerRef.current) return;

    if (window.YT?.Player) {
      createPlayer();
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
      createPlayer();
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const first = document.getElementsByTagName('script')[0];
    first?.parentNode?.insertBefore(tag, first);

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [apiReady]);

  function createPlayer() {
    if (!containerRef.current || playerRef.current) return;
    new window.YT!.Player('yt-player', {
      height: '100%',
      width: '100%',
      videoId: 'dQw4w9WgXcQ',
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (e: { target: YTPlayer }) => {
          playerRef.current = e.target;
          setApiReady(true);
        },
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 safe-area-pb">
      {/* 상단 진행 상태 */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-2">
        <Link
          to="/"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← 홈
        </Link>
        <p className="text-sm font-medium text-slate-600">
          Step 3: 쉐도잉 학습 - 클립 {CURRENT_CLIP_INDEX} / {TOTAL_CLIPS}
        </p>
        <span className="w-10" />
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        {/* 동영상 플레이어 (iOS: 첫 터치 유도 오버레이) */}
        <div className="relative w-full aspect-video bg-black flex-shrink-0">
          <div ref={containerRef} id="yt-player" className="absolute inset-0 w-full h-full" />
          {showPlayOverlay && (
            <button
              type="button"
              onClick={() => {
                setShowPlayOverlay(false);
                playerRef.current?.playVideo();
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 focus:outline-none"
              aria-label="재생"
            >
              <span className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center text-4xl text-slate-800 shadow-lg active:scale-95 transition-transform">
                ▶
              </span>
            </button>
          )}
        </div>

        {/* 쉐도잉 학습 영역 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex gap-3 items-start">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                  {SAMPLE_ENGLISH}
                </p>
                <p className="mt-2 text-base text-indigo-600 font-medium">
                  {SAMPLE_CHUNKING}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleStar}
                disabled={isToggling}
                className={`flex-shrink-0 p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-transform disabled:opacity-60 ${isStarred ? 'text-yellow-500' : 'text-slate-400'}`}
                aria-label={isStarred ? '저장 취소' : '단어장에 저장'}
              >
                <span className="text-2xl">{isStarred ? '★' : '☆'}</span>
                {isStarred && <span className="sr-only">저장됨 (노란색)</span>}
              </button>
            </div>
            {vocabError && (
              <p className="mt-2 text-sm text-red-600">{vocabError}</p>
            )}
          </div>

          {/* 원문 재생 시뮬레이션 → 타이머 트리거 */}
          {!sentencePlayed && (
            <button
              type="button"
              onClick={simulateSentenceEnd}
              className="mt-4 w-full py-3 rounded-xl bg-slate-200 text-slate-700 font-medium active:bg-slate-300"
            >
              원문 재생 (클릭 후 3초 뒤 따라 읽기 타이머 시작)
            </button>
          )}

          {/* 동적 쉐도잉 타이머 */}
          {phase === 'countdown' && (
            <div className="mt-6 p-6 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
              <p className="text-lg font-semibold text-indigo-800">따라 읽으세요</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-indigo-600">
                {countdown}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                대기 시간: {SHADOWING_MULTIPLIER}배 적용 ({waitSeconds}초)
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
