"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LazyDiffViewer, LazyEditor, LazyOriginalEditor, LazySpellCheckSidebar } from "../../components/lazy/index";
import { useSidebarStore } from "../../stores/sidebarStore";
import { useDeviceStore } from "../../stores/deviceStore";
import { useSpellCheckStore } from "../../stores/spellCheckStore";
import { useToastStore } from "../../stores/toastStore";
import { ViewMode, ShareData } from "../../types/editor";
import { getTextStats } from "../../utils/textUtils";
import CharacterCount from "../../components/common/CharacterCount";
import {
  copyToClipboard,
  createShareUrl,
  generateShareId,
  decodeShareData,
} from "../../utils/clipboardUtils";
import { saveShareHistory } from "../../utils/shareHistoryUtils";
import {
  DEFAULT_CHAR_LIMIT,
  COPY_SUCCESS_DURATION,
  MIN_CHAR_LIMIT,
  MAX_CHAR_LIMIT,
  CHAR_LIMIT_STEP,
} from "../../constants/editor";
import { ModeButton } from "../../components/common/ModeButton";
import { Button } from "../../components/common/Button";
import {
  InputLabel,
  InputField,
} from "../../components/common/Input";
import { Share2 } from "lucide-react";
import Toast from "../../components/common/Toast";

export const dynamic = "force-dynamic";

export default function EditorPage() {
  const { isCollapsed } = useSidebarStore();
  const { isMobile, checkDevice } = useDeviceStore();
  const { 
    isSpellCheckMode, 
    getCheckedSuggestions, 
    setSpellCheckMode, 
    clearSuggestions 
  } = useSpellCheckStore();
  const { toasts, showSuccess, showError, removeToast } = useToastStore();
  const [originalText, setOriginalText] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionCharLimit, setQuestionCharLimit] =
    useState<number>(DEFAULT_CHAR_LIMIT);
  const [viewMode, setViewMode] = useState<ViewMode>("original");
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const encodedData = urlParams.get("data");
    if (encodedData) {
      const shareData = decodeShareData(encodedData);
      if (shareData) {
        setOriginalText(shareData.original);
        setEditedText(shareData.edited);
        setQuestionText(shareData.question || "");
        setQuestionCharLimit(shareData.questionLimit || DEFAULT_CHAR_LIMIT);
        setViewMode("result");
        showSuccess("공유된 데이터를 불러왔습니다.");
        return;
      } else {
        showError("공유 데이터를 불러오는데 실패했습니다.");
      }
    }
    
    const sharedId = urlParams.get("share");
    if (sharedId) {
      const sharedData = localStorage.getItem(`jaso_${sharedId}`);
      if (sharedData) {
        try {
          const { original, edited, question, questionLimit } =
            JSON.parse(sharedData);
          setOriginalText(original);
          setEditedText(edited);
          setQuestionText(question || "");
          setQuestionCharLimit(questionLimit || DEFAULT_CHAR_LIMIT);
          setViewMode("result");
          showSuccess("공유된 데이터를 불러왔습니다.");
        } catch (error) {
          console.error("레거시 공유 데이터 파싱 실패:", error);
          showError("공유 데이터를 불러오는데 실패했습니다.");
        }
      } else {
        showError("공유 데이터를 찾을 수 없습니다. 링크가 올바른지 확인해주세요.");
      }
    }
  }, [showSuccess, showError]);

  // 페이지 로드 시 sessionStorage 초기화
  useEffect(() => {
    // URL 파라미터가 없는 새로운 세션인 경우 sessionStorage 초기화
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get("data") && !urlParams.get("share")) {
      sessionStorage.removeItem('editorContent');
    }
  }, []);

  useEffect(() => {
    checkDevice();
    const handleResize = () => checkDevice();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkDevice]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsHeaderVisible(true);
        }
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

  const handleOriginalChange = (text: string) => {
    setOriginalText(text);
    // 에디터 내용 변경 시 sessionStorage에 저장/삭제
    const totalContent = text + editedText + questionText;
    if (totalContent.trim()) {
      sessionStorage.setItem('editorContent', totalContent);
    } else {
      sessionStorage.removeItem('editorContent');
    }
  };

  const handleEditedChange = (text: string) => {
    setEditedText(text);
    // 에디터 내용 변경 시 sessionStorage에 저장/삭제
    const totalContent = originalText + text + questionText;
    if (totalContent.trim()) {
      sessionStorage.setItem('editorContent', totalContent);
    } else {
      sessionStorage.removeItem('editorContent');
    }
  };

  const handleQuestionChange = (text: string) => {
    setQuestionText(text);
    // 에디터 내용 변경 시 sessionStorage에 저장/삭제
    const totalContent = originalText + editedText + text;
    if (totalContent.trim()) {
      sessionStorage.setItem('editorContent', totalContent);
    } else {
      sessionStorage.removeItem('editorContent');
    }
  };

  const handleQuestionLimitChange = (limit: number) => {
    setQuestionCharLimit(limit);
  };

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };


  const handleShareClick = useCallback(() => {
    try {
      const shareData: ShareData = {
        original: originalText,
        edited: editedText,
        question: questionText,
        questionLimit: questionCharLimit,
        timestamp: new Date().toISOString(),
      };

      // URL 기반 공유 URL 생성
      const url = createShareUrl(shareData);

      setShareUrl(url);
      
      const shareId = generateShareId();
      localStorage.setItem(`jaso_${shareId}`, JSON.stringify(shareData));
      
      // 공유 기록을 로컬스토리지에 저장
      saveShareHistory(shareData, url);
      
      showSuccess("공유 링크가 생성되었습니다.");
    } catch (error) {
      console.error("공유 데이터 생성 실패:", error);
      showError("공유 링크 생성에 실패했습니다.");
    }
  }, [originalText, editedText, questionText, questionCharLimit, showSuccess, showError]);

  const handleCopyUrl = useCallback(async () => {
    const result = await copyToClipboard(shareUrl);
    if (result.success) {
      setIsCopied(true);
      showSuccess("공유 링크가 클립보드에 복사되었습니다.");
      setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
    } else {
      showError(`URL 복사 실패: ${result.message}`);
    }
  }, [shareUrl, showSuccess, showError]);


  const handleApplyCorrections = useCallback(() => {
    const checkedSuggestions = getCheckedSuggestions();
    
    if (checkedSuggestions.length === 0) {
      showError("적용할 교정 사항을 선택해주세요.");
      return;
    }

    let correctedText = editedText;
    
    const sortedSuggestions = [...checkedSuggestions].sort((a, b) => b.start - a.start);
    
    sortedSuggestions.forEach((suggestion) => {
      const selectedCorrection = suggestion.selectedSuggestion || suggestion.suggestions[0];
      const before = correctedText.slice(0, suggestion.start);
      const after = correctedText.slice(suggestion.end || (suggestion.start + suggestion.token.length));
      correctedText = before + selectedCorrection + after;
    });

    setEditedText(correctedText);
    setSpellCheckMode(false);
    clearSuggestions();
    
    showSuccess(`${checkedSuggestions.length}개의 교정 사항이 적용되었습니다.`);
  }, [editedText, getCheckedSuggestions, setEditedText, setSpellCheckMode, clearSuggestions, showSuccess, showError]);

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
        bg-gradient-to-br from-brand-400 to-brand-500 text-white
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
              <LazyOriginalEditor
                originalText={originalText}
                onOriginalChange={handleOriginalChange}
              />
            ) : viewMode === "edit" ? (
              <LazyEditor
                originalText={originalText}
                editedText={editedText}
                onOriginalChange={handleOriginalChange}
                onEditedChange={handleEditedChange}
                charLimit={questionCharLimit}
              />
            ) : (
              <LazyDiffViewer
                originalText={originalText}
                editedText={editedText}
                charLimit={questionCharLimit}
              />
            )}
          </div>

          {(viewMode === "original" ||
            viewMode === "edit" ||
            viewMode === "result") && (
            <div className="lg:col-span-1">
              {viewMode === "edit" && isSpellCheckMode ? (
                <div className="sticky top-24">
                  <LazySpellCheckSidebar onApplyCorrections={handleApplyCorrections} />
                </div>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </main>

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
                onChange={() => {}}
                className="flex-1 bg-gray-50 dark:bg-gray-700 text-sm"
                placeholder="공유 URL"
              />
              <Button
                variant={isCopied ? "secondary" : "default"}
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

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
