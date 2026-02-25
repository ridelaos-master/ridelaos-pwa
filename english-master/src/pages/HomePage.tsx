import { useState } from 'react';
import { Link } from 'react-router-dom';

type TabType = 'trackA' | 'trackB';

const CLIP_COUNTS = [5, 6, 7, 8, 9, 10] as const;
const CLIP_LENGTHS = [60, 80, 100, 120, 140, 160] as const;
const SHADOWING_WAIT = ['0.8배', '1.0배', '1.25배', '1.5배'] as const;

const CATEGORIES = [
  { id: 'biz', label: '비즈니스' },
  { id: 'news', label: '시사/뉴스' },
  { id: 'tech', label: '과학/기술' },
  { id: 'culture', label: '문화/예술' },
  { id: 'sports', label: '스포츠' },
  { id: 'self', label: '자기계발' },
  { id: 'movie', label: '영화 🎬' },
  { id: 'drama', label: '드라마 📺' },
];

function IconUser() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('trackA');
  const [clipCount, setClipCount] = useState<number>(7);
  const [clipLength, setClipLength] = useState<number>(100);
  const [shadowingWait, setShadowingWait] = useState<string>('1.25배');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 overflow-hidden">
      {/* 상단: 로고 + 마이페이지 + 탭 메뉴 (5:5) */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-slate-800">English Master</h1>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="마이페이지"
          >
            <IconUser />
          </button>
        </div>
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab('trackA')}
            className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'trackA'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            🔥 추천 학습 (Track A)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trackB')}
            className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'trackB'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            🎥 맞춤 학습 (Track B)
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {activeTab === 'trackA' && (
          <div className="p-4 pb-6">
            <h2 className="text-base font-semibold text-slate-800 mb-3">오늘의 추천 영상</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[1, 2, 3].map((i) => (
                <Link
                  key={i}
                  to={i === 1 ? '/learn/step3' : '#'}
                  className="flex-shrink-0 w-[72vw] max-w-[280px] aspect-video rounded-xl bg-slate-200 snap-center flex items-center justify-center text-slate-500 font-medium shadow-sm hover:bg-slate-300 transition-colors"
                >
                  추천 클립 {i}
                </Link>
              ))}
            </div>
            <h2 className="text-base font-semibold text-slate-800 mt-6 mb-3">카테고리</h2>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="aspect-square rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 active:scale-[0.98] transition-all"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trackB' && (
          <div className="p-4 pb-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">유튜브 URL</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">추출 클립 개수</p>
              <div className="flex flex-wrap gap-2">
                {CLIP_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setClipCount(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      clipCount === n
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {n}개
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">추출 클립 길이(초)</p>
              <div className="flex flex-wrap gap-2">
                {CLIP_LENGTHS.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setClipLength(sec)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      clipLength === sec
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {sec}초
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">쉐도잉 대기 시간</p>
              <div className="flex flex-wrap gap-2">
                {SHADOWING_WAIT.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setShadowingWait(val)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      shadowingWait === val
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="w-full py-4 rounded-xl bg-indigo-500 text-white font-semibold text-base hover:bg-indigo-600 active:bg-indigo-700 transition-colors shadow-md"
            >
              🚀 맞춤형 AI 학습 생성하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
