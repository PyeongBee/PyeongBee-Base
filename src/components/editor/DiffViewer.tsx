import React, { useState, useCallback } from "react";
import * as Diff from "diff";
import { getTextStats } from "../../utils/textUtils";
import { copyToClipboard } from "../../utils/clipboardUtils";
import { COPY_SUCCESS_DURATION } from "../../constants/editor";
import CharacterCount from "../common/CharacterCount";
import ToggleSwitch from "../common/ToggleSwitch";

interface DiffViewerProps {
  originalText: string;
  editedText: string;
  charLimit: number;
}

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

const DiffViewer: React.FC<DiffViewerProps> = React.memo(
  ({ originalText, editedText, charLimit }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"diff" | "final">("diff");
    // diff 라이브러리를 사용하여 변경사항 계산 (단어 단위로 비교)
    const diffParts: DiffPart[] = Diff.diffWords(originalText, editedText);

    const editedStats = getTextStats(editedText, charLimit);

    const handleCopyResult = useCallback(async () => {
      const result = await copyToClipboard(editedText);
      if (result.success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
      } else {
        // 에러 메시지를 사용자에게 표시할 수 있도록 상태 추가 가능
        console.error("복사 실패:", result.message);
      }
    }, [editedText]);

    // 원본 텍스트 렌더링 (변경사항 없이 원본만 표시)
    const renderOriginalText = () => {
      if (!originalText) {
        return (
          <em className="text-gray-500 dark:text-gray-400">
            원본 텍스트가 없습니다.
          </em>
        );
      }

      const lines = originalText.split("\n");
      return lines.map((line, index) => (
        <div key={index} className="flex">
          <span className="w-8 text-sm text-gray-400 dark:text-gray-500 mr-4 select-none">
            {index + 1}
          </span>
          <span className="flex-1">{line || "\u00A0"}</span>
        </div>
      ));
    };

    // 수정된 텍스트 렌더링 (단어 단위 변경사항 표시)
    const renderEditedText = () => {
      if (!editedText && !originalText) {
        return (
          <em className="text-gray-500 dark:text-gray-400">
            수정된 텍스트가 없습니다.
          </em>
        );
      }

      // diff 결과를 줄 단위로 그룹화
      const lines: React.ReactElement[] = [];
      let currentLine: React.ReactElement[] = [];
      let lineNumber = 1;

      diffParts.forEach((part, index) => {
        const text = part.value;
        const parts = text.split("\n");

        parts.forEach((linePart, partIndex) => {
          if (partIndex > 0) {
            // 줄바꿈이 있으면 현재 줄을 완성하고 새 줄 시작
            if (currentLine.length > 0) {
              lines.push(
                <div key={`line-${lineNumber}`} className="flex">
                  <span className="w-8 text-sm text-gray-400 dark:text-gray-500 mr-4 select-none">
                    {lineNumber}
                  </span>
                  <span className="flex-1">{currentLine}</span>
                </div>
              );
              lineNumber++;
              currentLine = [];
            }
          }

          if (linePart) {
            if (part.removed) {
              currentLine.push(
                <span
                  key={`removed-${index}-${partIndex}`}
                  className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-1 rounded line-through"
                >
                  {linePart}
                </span>
              );
            } else if (part.added) {
              currentLine.push(
                <span
                  key={`added-${index}-${partIndex}`}
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded"
                >
                  {linePart}
                </span>
              );
            } else {
              currentLine.push(
                <span key={`unchanged-${index}-${partIndex}`} className="">
                  {linePart}
                </span>
              );
            }
          }
        });
      });

      // 마지막 줄 처리
      if (currentLine.length > 0) {
        lines.push(
          <div key={`line-${lineNumber}`} className="flex">
            <span className="w-8 text-sm text-gray-400 dark:text-gray-500 mr-4 select-none">
              {lineNumber}
            </span>
            <span className="flex-1">{currentLine}</span>
          </div>
        );
      }

      return lines;
    };

    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              최종 결과
            </label>
            <div className="flex items-center gap-4">
              <ToggleSwitch
                checked={viewMode === "diff"}
                onChange={(checked) => setViewMode(checked ? "diff" : "final")}
                label="변경사항 보기"
                size="md"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  내용 복사
                </span>
                <button
                  className={`
                    w-8 h-8 flex items-center justify-center text-xs rounded transition-all duration-200
                    ${
                      isCopied
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                  `}
                  onClick={handleCopyResult}
                  title={isCopied ? "복사됨!" : "내용 복사"}
                  aria-label={isCopied ? "복사됨!" : "내용 복사"}
                >
                  {isCopied ? "✓" : "📋"}
                </button>
              </div>
            </div>
          </div>
          <div
            className="h-128 p-4 mb-1.5 overflow-y-auto text-gray-900 dark:text-white whitespace-pre-wrap"
            role="textbox"
            aria-label={viewMode === "diff" ? "변경사항" : "최종 결과"}
          >
            {viewMode === "diff"
              ? renderEditedText()
              : editedText || (
                  <em className="text-gray-500 dark:text-gray-400">
                    수정된 텍스트가 없습니다.
                  </em>
                )}
          </div>
        </div>
      </div>
    );
  }
);

export default DiffViewer;
