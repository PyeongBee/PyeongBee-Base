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
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              자소서 수정
            </label>
            <button
              onClick={handleCopyOriginal}
              className="px-4 py-2 bg-gradient-to-br from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
              aria-label="원본 내용을 수정 에디터로 복사"
              title="원본 내용을 수정 에디터로 복사"
            >
              원본 가져오기
            </button>
          </div>
          <textarea
            className="w-full h-128 px-4 pt-4 pb-0 border-0 resize-none focus:outline-none focus:ring-0 
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
