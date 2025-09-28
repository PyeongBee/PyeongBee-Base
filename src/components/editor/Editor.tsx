import React from "react";
import { getTextStats } from "../../utils/textUtils";
import CharacterCount from "../common/CharacterCount";
import { ChevronRight } from "lucide-react";

interface EditorProps {
  originalText: string;
  editedText: string;
  onOriginalChange: (text: string) => void;
  onEditedChange: (text: string) => void;
  charLimit: number;
}

const Editor: React.FC<EditorProps> = React.memo(
  ({
    originalText,
    editedText,
    onOriginalChange,
    onEditedChange,
    charLimit,
  }) => {
    const originalStats = getTextStats(originalText, charLimit);
    const editedStats = getTextStats(editedText, charLimit);

    const handleCopyOriginal = () => {
      onEditedChange(originalText);
    };

    return (
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 relative">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              원본 자소서
            </label>
            <CharacterCount
              characterCount={originalStats.characterCount}
              wordCount={originalStats.wordCount}
              lineCount={originalStats.lineCount}
              charLimit={charLimit}
              isOverLimit={originalStats.isOverLimit}
            />
          </div>
          <div
            className="h-128 p-4 overflow-y-auto text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50"
            role="textbox"
            aria-label="원본 자소서"
          >
            {originalText || (
              <em className="text-gray-500 dark:text-gray-400">
                원본 텍스트가 없습니다.
              </em>
            )}
          </div>

          {/* 복사 버튼 */}
          <button
            onClick={handleCopyOriginal}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
            aria-label="원본 내용을 수정 에디터로 복사"
            title="원본 내용을 수정 에디터로 복사"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              자소서 수정
            </label>
            <CharacterCount
              characterCount={editedStats.characterCount}
              wordCount={editedStats.wordCount}
              lineCount={editedStats.lineCount}
              charLimit={charLimit}
              isOverLimit={editedStats.isOverLimit}
            />
          </div>
          <textarea
            className="w-full h-128 p-4 border-0 resize-none focus:outline-none focus:ring-0 
                   bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={editedText}
            onChange={(e) => onEditedChange(e.target.value)}
            placeholder="수정된 자소서를 입력하세요..."
            aria-label="자소서 수정 입력"
          />
        </div>
      </div>
    );
  }
);

export default Editor;
