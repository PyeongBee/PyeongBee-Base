import React from "react";
import { CheckSquare } from "lucide-react";
import { useSpellCheckStore } from "../../stores/spellCheckStore";
import HighlightedText from "./HighlightedText";
import { Button } from "../common/Button";

interface EditorProps {
  originalText: string;
  editedText: string;
  onOriginalChange: (text: string) => void;
  onEditedChange: (text: string) => void;
  charLimit: number;
}

const Editor: React.FC<EditorProps> = React.memo(
  function Editor({
    originalText,
    editedText,
    onEditedChange,
  }) {
    
    const {
      isSpellCheckMode,
      isLoading,
      setSpellCheckMode,
      setLoading,
      setSuggestions,
      clearSuggestions,
    } = useSpellCheckStore();

    const handleCopyOriginal = () => {
      onEditedChange(originalText);
    };

    const handleSpellCheck = async () => {
      if (!editedText.trim()) {
        alert("맞춤법 검사할 텍스트를 입력해주세요.");
        return;
      }

      setLoading(true);
      setSpellCheckMode(true);

      try {
        console.log("맞춤법 검사 요청 시작:", editedText.substring(0, 100) + "...");
        
        const response = await fetch("/api/spell-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        });

        console.log("응답 상태:", response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "알 수 없는 오류" }));
          console.error("API 오류 응답:", errorData);
          throw new Error(`맞춤법 검사 요청 실패: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        console.log("API 응답 데이터:", data);

        if (!data.results || !Array.isArray(data.results)) {
          console.error("잘못된 응답 형식:", data);
          throw new Error("서버에서 잘못된 응답을 받았습니다.");
        }

        const suggestions = data.results.map((result: { token: string; suggestions: string[]; info: string; start: number; end: number }, index: number) => ({
          id: `suggestion-${index}`,
          token: result.token,
          suggestions: result.suggestions,
          info: result.info,
          start: result.start,
          end: result.end,
          isChecked: false,
          selectedSuggestion: result.suggestions[0], // 첫 번째 제안을 기본값으로
        }));

        console.log("생성된 제안 목록:", suggestions);
        setSuggestions(suggestions);
        
        if (suggestions.length === 0) {
          alert("맞춤법 오류가 발견되지 않았습니다!");
        }
      } catch (error) {
        console.error("맞춤법 검사 오류:", error);
        alert(`맞춤법 검사 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
        setSpellCheckMode(false);
      } finally {
        setLoading(false);
      }
    };

    const handleCancelSpellCheck = () => {
      setSpellCheckMode(false);
      clearSuggestions();
    };

    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              자소서 수정
            </label>
            <div className="flex items-center gap-2">
              {isSpellCheckMode ? (
                <Button
                  onClick={handleCancelSpellCheck}
                  variant="secondary"
                  className="text-sm"
                  disabled={isLoading}
                >
                  검사 취소
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSpellCheck}
                    variant="primary"
                    className="text-sm flex items-center gap-2"
                    disabled={isLoading || !editedText.trim()}
                  >
                    <CheckSquare className="w-4 h-4" />
                    맞춤법 검사
                  </Button>
                  <button
                    onClick={handleCopyOriginal}
                    className="px-4 py-2 bg-gradient-to-br from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                    aria-label="원본 내용을 수정 에디터로 복사"
                    title="원본 내용을 수정 에디터로 복사"
                  >
                    원본 가져오기
                  </button>
                </>
              )}
            </div>
          </div>
          {isSpellCheckMode ? (
            <div className="w-full h-128 px-4 pt-4 pb-0 overflow-y-auto">
              <HighlightedText
                text={editedText}
                className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
              />
            </div>
          ) : (
            <textarea
              className="w-full h-128 px-4 pt-4 pb-0 border-0 resize-none focus:outline-none focus:ring-0 
                     bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={editedText}
              onChange={(e) => onEditedChange(e.target.value)}
              placeholder="수정된 자소서를 입력하세요..."
              aria-label="자소서 수정 입력"
            />
          )}
        </div>
      </div>
    );
  }
);

export default Editor;
