// src/components/review/ReviewPhotoUpload.tsx
// S7-07: 리뷰 사진 업로드 (최대 5장, 미리보기, 삭제)

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ReviewPhotoUploadProps {
  photos: File[];
  onChange: (photos: File[]) => void;
  maxPhotos?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ReviewPhotoUpload({
  photos,
  onChange,
  maxPhotos = 5
}: ReviewPhotoUploadProps) {
  const { t } = useTranslation('review');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(t('photo.invalidType'));
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(t('photo.tooLarge'));
        return false;
      }
      return true;
    });

    const remaining = maxPhotos - photos.length;
    const newFiles = validFiles.slice(0, remaining);

    // 미리보기 생성
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    onChange([...photos, ...newFiles]);

    // input 초기화
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onChange(newPhotos);
    setPreviews(newPreviews);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('photo.label')} ({photos.length}/{maxPhotos})
      </label>

      <div className="flex flex-wrap gap-3">
        {/* 미리보기 */}
        {previews.map((src, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* 추가 버튼 */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <span className="text-xs">{t('photo.add')}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
