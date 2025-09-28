import React from "react";
import { getTextStats } from "../../utils/textUtils";
import CharacterCount from "../common/CharacterCount";

interface OriginalEditorProps {
  originalText: string;
  onOriginalChange: (text: string) => void;
  charLimit: number;
}

const OriginalEditor: React.FC<OriginalEditorProps> = React.memo(
  ({ originalText, onOriginalChange, charLimit }) => {
    const textStats = getTextStats(originalText, charLimit);

    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              원본 자소서
            </label>
          </div>
          <textarea
            className="w-full h-128 p-4 border-0 resize-none focus:outline-none focus:ring-0 
                   bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={originalText}
            onChange={(e) => onOriginalChange(e.target.value)}
            placeholder="자소서 원본을 입력하세요..."
            aria-label="자소서 원본 입력"
          />
        </div>
      </div>
    );
  }
);

export default OriginalEditor;
