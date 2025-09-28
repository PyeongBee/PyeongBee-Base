"use client";

import React, { useState, useEffect, useCallback } from "react";
import DiffViewer from "../../components/editor/DiffViewer";
import Editor from "../../components/editor/Editor";
import OriginalEditor from "../../components/editor/OriginalEditor";
import { useSidebarStore } from "../../stores/sidebarStore";
import { useDeviceStore } from "../../stores/deviceStore";
import { ViewMode, ShareData } from "../../types/editor";
import { getTextStats } from "../../utils/textUtils";
import CharacterCount from "../../components/common/CharacterCount";
import {
  copyToClipboard,
  createShareUrl,
  generateShareId,
} from "../../utils/clipboardUtils";
import {
  DEFAULT_CHAR_LIMIT,
  COPY_SUCCESS_DURATION,
  MOBILE_BREAKPOINT,
  MIN_CHAR_LIMIT,
  MAX_CHAR_LIMIT,
  CHAR_LIMIT_STEP,
} from "../../constants/editor";
import { ModeButton } from "../../components/common/ModeButton";
import { Button } from "../../components/common/Button";
import {
  InputGroup,
  InputLabel,
  InputField,
} from "../../components/common/Input";
import { Share2 } from "lucide-react";

// 에디터 페이지는 독립적으로 렌더링
export const dynamic = "force-dynamic";

export default function EditorPage() {
  const { isCollapsed } = useSidebarStore();
  const { isMobile, checkDevice } = useDeviceStore();
  const [originalText, setOriginalText] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionCharLimit, setQuestionCharLimit] =
    useState<number>(DEFAULT_CHAR_LIMIT);
  const [viewMode, setViewMode] = useState<ViewMode>("original");
  const [shareId, setShareId] = useState<string>("");
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // URL에서 공유된 데이터 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedId = urlParams.get("share");

    if (sharedId) {
      // 로컬 스토리지에서 공유된 데이터 가져오기
      const sharedData = localStorage.getItem(`jaso_${sharedId}`);
      if (sharedData) {
        const { original, edited, question, questionLimit } =
          JSON.parse(sharedData);
        setOriginalText(original);
        setEditedText(edited);
        setQuestionText(question || "");
        setQuestionCharLimit(questionLimit || DEFAULT_CHAR_LIMIT);
        setViewMode("result");
        setShareId(sharedId);
      }
    }
  }, []);

  // 디바이스 상태 초기화 및 리사이즈 감지
  useEffect(() => {
    checkDevice();

    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkDevice]);

  // 스크롤 이벤트 핸들러 (모바일에서만)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

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
        timestamp: new Date().toISOString(),
      };

      // 로컬 스토리지에 데이터 저장
      localStorage.setItem(`jaso_${shareId}`, JSON.stringify(shareData));

      // 공유 URL 생성
      const url = createShareUrl(shareId);

      setShareUrl(url);
      setShareId(shareId);
    } catch (error) {
      console.error("공유 데이터 저장 실패:", error);
    }
  }, [originalText, editedText, questionText, questionCharLimit]);

  const handleCopyUrl = useCallback(async () => {
    const result = await copyToClipboard(shareUrl);
    if (result.success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
    } else {
      console.error("URL 복사 실패:", result.message);
    }
  }, [shareUrl]);

  const handleCopyResult = useCallback(async () => {
    const result = await copyToClipboard(editedText);
    if (result.success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
    } else {
      console.error("결과 복사 실패:", result.message);
    }
  }, [editedText]);

  const ModeChangeButton = ({
    mode,
    modeText,
    isMobile,
  }: {
    mode: ViewMode;
    modeText: string;
    isMobile: boolean;
  }) => (
    <ModeButton
      active={viewMode === mode}
      onClick={() => handleModeChange(mode)}
      role="tab"
      aria-selected={viewMode === mode}
      aria-controls="editor-content"
      tabIndex={viewMode === mode ? 0 : -1}
    >
      <span className={`hidden ${isMobile ? "" : "inline"}`}>
        {modeText} 모드
      </span>
      <span className={`${isMobile ? "" : "hidden"}`}>{modeText}</span>
    </ModeButton>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`
        fixed top-0 right-0 z-[1000] 
        bg-gradient-to-br from-brand-primary to-brand-secondary text-white
        px-8 py-2 shadow-lg
        flex justify-between items-center
        transition-all duration-300 ease-in-out
        ${!isHeaderVisible ? "-translate-y-full" : "translate-y-0"}
        ${isMobile ? "left-0" : isCollapsed ? "left-16" : "left-64"}
      `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate">자소서 에디터</h1>
        </div>

        <div
          className="flex gap-4"
          role="tablist"
          aria-label="에디터 모드 선택"
        >
          <ModeChangeButton
            mode="original"
            modeText="원본"
            isMobile={isMobile}
          />
          <ModeChangeButton mode="edit" modeText="수정" isMobile={isMobile} />
          <ModeChangeButton mode="result" modeText="결과" isMobile={isMobile} />
        </div>
      </header>

      <div className="mt-20 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 문항 입력 영역 */}

          {viewMode === "original" ? (
            <div className="lg:col-span-3">
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <textarea
                  id="question-input"
                  value={questionText}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  placeholder="자소서 문항을 입력하세요. 예: '본인의 성장 과정에서 가장 중요한 경험은 무엇이며, 그것이 현재의 당신에게 어떤 영향을 미쳤나요?'"
                  className="w-full h-32 p-4 border-0 resize-none focus:outline-none focus:ring-0 
                           bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="lg:col-span-4">
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {questionText || "문항이 입력되지 않았습니다."}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                    제한: {questionCharLimit}자
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 글자수 제한 설정 영역 */}
          {viewMode === "original" && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-amber-800 rounded-full"></div>
                  <InputLabel
                    htmlFor="char-limit-input"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    글자수 제한
                  </InputLabel>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <InputField
                    id="char-limit-input"
                    type="number"
                    value={questionCharLimit}
                    onChange={(value) =>
                      handleQuestionLimitChange(
                        parseInt(value) || DEFAULT_CHAR_LIMIT
                      )
                    }
                    className="w-24 text-center font-medium"
                    min={MIN_CHAR_LIMIT}
                    max={MAX_CHAR_LIMIT}
                    step={CHAR_LIMIT_STEP}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    자
                  </span>
                </div>
                <div className="flex flex-wrap justify-around gap-2">
                  {[500, 1000, 1500, 2000].map((limit) => (
                    <button
                      key={limit}
                      onClick={() => handleQuestionLimitChange(limit)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        questionCharLimit === limit
                          ? "bg-amber-800 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {limit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main
        className="flex-1 p-6"
        id="editor-content"
        role="tabpanel"
        aria-label={`${viewMode} 모드 에디터`}
      >
        <div
          className={`max-w-7xl mx-auto ${
            viewMode === "original"
              ? "grid grid-cols-1 lg:grid-cols-4 gap-6"
              : viewMode === "edit" || viewMode === "result"
              ? "grid grid-cols-1 lg:grid-cols-4 gap-6"
              : ""
          }`}
        >
          {/* 메인 에디터 영역 */}
          <div
            className={
              viewMode === "original" ||
              viewMode === "edit" ||
              viewMode === "result"
                ? "lg:col-span-3"
                : ""
            }
          >
            {viewMode === "original" ? (
              <OriginalEditor
                originalText={originalText}
                onOriginalChange={handleOriginalChange}
                charLimit={questionCharLimit}
              />
            ) : viewMode === "edit" ? (
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
          </div>

          {/* 사이드바 영역 */}
          {(viewMode === "original" ||
            viewMode === "edit" ||
            viewMode === "result") && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
                <CharacterCount
                  characterCount={
                    viewMode === "original"
                      ? getTextStats(originalText, questionCharLimit)
                          .characterCount
                      : getTextStats(editedText, questionCharLimit)
                          .characterCount
                  }
                  wordCount={
                    viewMode === "original"
                      ? getTextStats(originalText, questionCharLimit).wordCount
                      : getTextStats(editedText, questionCharLimit).wordCount
                  }
                  lineCount={
                    viewMode === "original"
                      ? getTextStats(originalText, questionCharLimit).lineCount
                      : getTextStats(editedText, questionCharLimit).lineCount
                  }
                  charLimit={questionCharLimit}
                  isOverLimit={
                    viewMode === "original"
                      ? getTextStats(originalText, questionCharLimit)
                          .isOverLimit
                      : getTextStats(editedText, questionCharLimit).isOverLimit
                  }
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 플로팅 공유 버튼 */}
      <button
        onClick={handleShareClick}
        className={`fixed right-3 z-[1000] 
                   w-14 h-14 rounded-full 
                   bg-gradient-to-br from-brand-primary to-brand-secondary
                   shadow-lg hover:shadow-xl
                   flex items-center justify-center
                   transition-all duration-300 ease-in-out
                   hover:scale-105 active:scale-95
                   group
                   ${isMobile ? "bottom-15" : "bottom-3"}`}
        aria-label="작성한 자소서 공유하기"
      >
        <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* 공유 URL 모달 */}
      {shareUrl && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4"
          onClick={() => setShareUrl("")}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                공유 링크
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                onClick={() => setShareUrl("")}
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
                variant={isCopied ? "secondary" : "primary"}
                onClick={handleCopyUrl}
                className="whitespace-nowrap"
              >
                {isCopied ? "✓ 복사됨" : "📋 복사"}
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
