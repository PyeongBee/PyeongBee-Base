'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DiffViewer from '../../components/editor/DiffViewer';
import Editor from '../../components/editor/Editor';
import OriginalEditor from '../../components/editor/OriginalEditor';
import { useSidebarStore } from '../../stores/sidebarStore';
import { ViewMode, ShareData } from '../../types/editor';
import { copyToClipboard, createShareUrl, generateShareId } from '../../utils/clipboardUtils';
import { DEFAULT_CHAR_LIMIT, COPY_SUCCESS_DURATION, MOBILE_BREAKPOINT, MIN_CHAR_LIMIT, MAX_CHAR_LIMIT, CHAR_LIMIT_STEP } from '../../constants/editor';

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
    <div className="App">
      <header className={`app-header ${!isHeaderVisible ? 'header-hidden' : ''} ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="header-title">
          <img src="/logo_Bee_lsh_clear_gra.png" alt="로고" className="header-logo" />
          <h1>평비의 자소서 에디터</h1>
        </div>
        <div className="mode-buttons" role="tablist" aria-label="에디터 모드 선택">
          <button 
            className={`mode-button ${viewMode === 'original' ? 'active' : ''}`}
            onClick={() => handleModeChange('original')}
            role="tab"
            aria-selected={viewMode === 'original'}
            aria-controls="editor-content"
            tabIndex={viewMode === 'original' ? 0 : -1}
          >
            <span className="button-text-full">원본 모드</span>
            <span className="button-text-mobile">원본</span>
          </button>
          <button 
            className={`mode-button ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => handleModeChange('edit')}
            role="tab"
            aria-selected={viewMode === 'edit'}
            aria-controls="editor-content"
            tabIndex={viewMode === 'edit' ? 0 : -1}
          >
            <span className="button-text-full">수정 모드</span>
            <span className="button-text-mobile">수정</span>
          </button>
          <button 
            className={`mode-button ${viewMode === 'result' ? 'active' : ''}`}
            onClick={() => handleModeChange('result')}
            role="tab"
            aria-selected={viewMode === 'result'}
            aria-controls="editor-content"
            tabIndex={viewMode === 'result' ? 0 : -1}
          >
            <span className="button-text-full">결과 모드</span>
            <span className="button-text-mobile">결과</span>
          </button>
          <button 
            className="mode-button"
            onClick={handleShareClick}
            title="공유하기"
            aria-label="작성한 자소서 공유하기"
          >
            <span className="button-text-full">공유하기</span>
            <span className="button-text-mobile">공유</span>
          </button>
        </div>
      </header>

      <div className="question-section">
        {viewMode === 'original' ? (
          <div className="question-editor">
            <div className="question-input-group">
              <label className="question-label">문항</label>
              <input
                type="text"
                className="question-input"
                value={questionText}
                onChange={(e) => handleQuestionChange(e.target.value)}
                placeholder="자소서 문항을 입력하세요..."
              />
            </div>
            <div className="question-limit-group">
              <label className="question-limit-label">글자수 제한</label>
              <input
                type="number"
                className="question-limit-input"
                value={questionCharLimit}
                onChange={(e) => handleQuestionLimitChange(parseInt(e.target.value) || DEFAULT_CHAR_LIMIT)}
                min={MIN_CHAR_LIMIT}
                max={MAX_CHAR_LIMIT}
                step={CHAR_LIMIT_STEP}
              />
            </div>
          </div>
        ) : (
          <div className="question-display">
            <span className="question-label">문항</span>
            <span className="question-text">{questionText || '문항이 입력되지 않았습니다.'}</span>
            <span className="question-count-display">
              (제한: {questionCharLimit}자)
            </span>
          </div>
        )}
      </div>

      <main className="app-main" id="editor-content" role="tabpanel" aria-label={`${viewMode} 모드 에디터`}>
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
        <div className="share-modal-overlay" onClick={() => setShareUrl('')}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>공유 링크</h3>
              <button className="close-button" onClick={() => setShareUrl('')}>×</button>
            </div>
            <div className="share-modal-content">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-url-input"
              />
              <button
                className={`copy-button ${isCopied ? 'copy-success' : ''}`}
                onClick={handleCopyUrl}
              >
                {isCopied ? '✓ 복사됨' : '📋 복사'}
              </button>
            </div>
            <p className="share-modal-footer">
              링크를 복사하여 다른 사람과 공유하세요!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
