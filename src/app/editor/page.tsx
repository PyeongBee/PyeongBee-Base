'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DiffViewer from '../../components/editor/DiffViewer';
import Editor from '../../components/editor/Editor';
import OriginalEditor from '../../components/editor/OriginalEditor';
import { useSidebarStore } from '../../stores/sidebarStore';
import { ViewMode, ShareData } from '../../types/editor';
import { copyToClipboard, createShareUrl, generateShareId } from '../../utils/clipboardUtils';
import { DEFAULT_CHAR_LIMIT, COPY_SUCCESS_DURATION, MOBILE_BREAKPOINT, MIN_CHAR_LIMIT, MAX_CHAR_LIMIT, CHAR_LIMIT_STEP } from '../../constants/editor';
import { ModeButton } from '../../components/common/ModeButton';
import { Button } from '../../components/common/Button';
import { InputGroup, InputLabel, InputField } from '../../components/common/Input';

// 에디터 페이지는 독립적으로 렌더링
export const dynamic = 'force-dynamic';

export default function EditorPage() {
  const { isCollapsed } = useSidebarStore();
  const [originalText, setOriginalText] = useState<string>('');
  const [editedText, setEditedText] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [questionCharLimit, setQuestionCharLimit] = useState<number>(DEFAULT_CHAR_LIMIT);
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [shareId, setShareId] = useState<string>('');
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // URL에서 공유된 데이터 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedId = urlParams.get('share');
    
    if (sharedId) {
      // 로컬 스토리지에서 공유된 데이터 가져오기
      const sharedData = localStorage.getItem(`jaso_${sharedId}`);
      if (sharedData) {
        const { original, edited, question, questionLimit } = JSON.parse(sharedData);
        setOriginalText(original);
        setEditedText(edited);
        setQuestionText(question || '');
        setQuestionCharLimit(questionLimit || DEFAULT_CHAR_LIMIT);
        setViewMode('result');
        setShareId(sharedId);
      }
    }
  }, []);

  // 스크롤 이벤트 핸들러 (모바일에서만)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      
      if (isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // 아래로 스크롤할 때 헤더 숨김
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // 위로 스크롤할 때 헤더 표시
          setIsHeaderVisible(true);
        }
      } else {
        // 데스크톱에서는 항상 헤더 표시
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleOriginalChange = (text: string) => {
    setOriginalText(text);
  };

  const handleEditedChange = (text: string) => {
    setEditedText(text);
  };

  const handleQuestionChange = (text: string) => {
    setQuestionText(text);
  };

  const handleQuestionLimitChange = (limit: number) => {
    setQuestionCharLimit(limit);
  };

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleShare = useCallback((id: string) => {
    setShareId(id);
  }, []);

  const handleShareClick = useCallback(() => {
    try {
      const shareId = generateShareId();
      const shareData: ShareData = {
        original: originalText,
        edited: editedText,
        question: questionText,
        questionLimit: questionCharLimit,
        timestamp: new Date().toISOString()
      };

      // 로컬 스토리지에 데이터 저장
      localStorage.setItem(`jaso_${shareId}`, JSON.stringify(shareData));

      // 공유 URL 생성
      const url = createShareUrl(shareId);
      
      setShareUrl(url);
      setShareId(shareId);
    } catch (error) {
      console.error('공유 데이터 저장 실패:', error);
    }
  }, [originalText, editedText, questionText, questionCharLimit]);

  const handleCopyUrl = useCallback(async () => {
    const result = await copyToClipboard(shareUrl);
    if (result.success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
    } else {
      console.error('URL 복사 실패:', result.message);
    }
  }, [shareUrl]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`
        fixed top-0 right-0 z-[1000] 
        bg-gradient-to-br from-brand-primary to-brand-secondary text-white
        px-8 py-4 shadow-lg
        flex justify-between items-center
        transition-transform duration-300 ease-in-out
        ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'}
        ${isCollapsed ? 'left-16' : 'left-64'}
        md:left-0
      `}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img src="/logo_Bee_lsh_clear_gra.png" alt="로고" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-semibold truncate">평비의 자소서 에디터</h1>
        </div>
        <div className="flex gap-4" role="tablist" aria-label="에디터 모드 선택">
          <ModeButton
            active={viewMode === 'original'}
            onClick={() => handleModeChange('original')}
            role="tab"
            aria-selected={viewMode === 'original'}
            aria-controls="editor-content"
            tabIndex={viewMode === 'original' ? 0 : -1}
          >
            <span className="hidden sm:inline">원본 모드</span>
            <span className="sm:hidden">원본</span>
          </ModeButton>
          <ModeButton
            active={viewMode === 'edit'}
            onClick={() => handleModeChange('edit')}
            role="tab"
            aria-selected={viewMode === 'edit'}
            aria-controls="editor-content"
            tabIndex={viewMode === 'edit' ? 0 : -1}
          >
            <span className="hidden sm:inline">수정 모드</span>
            <span className="sm:hidden">수정</span>
          </ModeButton>
          <ModeButton
            active={viewMode === 'result'}
            onClick={() => handleModeChange('result')}
            role="tab"
            aria-selected={viewMode === 'result'}
            aria-controls="editor-content"
            tabIndex={viewMode === 'result' ? 0 : -1}
          >
            <span className="hidden sm:inline">결과 모드</span>
            <span className="sm:hidden">결과</span>
          </ModeButton>
          <Button
            variant="ghost"
            onClick={handleShareClick}
            className="border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10"
            aria-label="작성한 자소서 공유하기"
          >
            <span className="hidden sm:inline">공유하기</span>
            <span className="sm:hidden">공유</span>
          </Button>
        </div>
      </header>

      <div className="mt-20 px-16 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {viewMode === 'original' ? (
          <div className="flex items-center gap-8 flex-wrap">
            <InputGroup>
              <InputLabel htmlFor="question-input">문항</InputLabel>
              <InputField
                id="question-input"
                type="text"
                value={questionText}
                onChange={handleQuestionChange}
                placeholder="자소서 문항을 입력하세요..."
              />
            </InputGroup>
            <div className="flex items-center gap-2">
              <InputLabel htmlFor="char-limit-input">글자수 제한</InputLabel>
              <InputField
                id="char-limit-input"
                type="number"
                value={questionCharLimit}
                onChange={(value) => handleQuestionLimitChange(parseInt(value) || DEFAULT_CHAR_LIMIT)}
                className="w-20 text-center"
                min={MIN_CHAR_LIMIT}
                max={MAX_CHAR_LIMIT}
                step={CHAR_LIMIT_STEP}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">문항</span>
            <span className="text-gray-900 dark:text-white">{questionText || '문항이 입력되지 않았습니다.'}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (제한: {questionCharLimit}자)
            </span>
          </div>
        )}
      </div>

      <main className="flex-1 p-6" id="editor-content" role="tabpanel" aria-label={`${viewMode} 모드 에디터`}>
        {viewMode === 'original' ? (
          <OriginalEditor
            originalText={originalText}
            onOriginalChange={handleOriginalChange}
            charLimit={questionCharLimit}
          />
        ) : viewMode === 'edit' ? (
          <Editor
            originalText={originalText}
            editedText={editedText}
            onOriginalChange={handleOriginalChange}
            onEditedChange={handleEditedChange}
            charLimit={questionCharLimit}
          />
        ) : (
          <DiffViewer
            originalText={originalText}
            editedText={editedText}
            charLimit={questionCharLimit}
          />
        )}
      </main>

      {/* 공유 URL 모달 */}
      {shareUrl && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4"
          onClick={() => setShareUrl('')}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">공유 링크</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                onClick={() => setShareUrl('')}
                aria-label="모달 닫기"
              >
                ×
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              <InputField
                type="text"
                value={shareUrl}
                onChange={() => {}} // readOnly이므로 빈 함수
                className="flex-1 bg-gray-50 dark:bg-gray-700 text-sm"
                placeholder="공유 URL"
              />
              <Button
                variant={isCopied ? 'secondary' : 'primary'}
                onClick={handleCopyUrl}
                className="whitespace-nowrap"
              >
                {isCopied ? '✓ 복사됨' : '📋 복사'}
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              링크를 복사하여 다른 사람과 공유하세요!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
