import React from 'react';
import { getTextStats } from '../../utils/textUtils';
import CharacterCount from '../common/CharacterCount';

interface EditorProps {
  originalText: string;
  editedText: string;
  onOriginalChange: (text: string) => void;
  onEditedChange: (text: string) => void;
  charLimit: number;
}

const Editor: React.FC<EditorProps> = React.memo(({
  originalText,
  editedText,
  onOriginalChange,
  onEditedChange,
  charLimit
}) => {
  const originalStats = getTextStats(originalText, charLimit);
  const editedStats = getTextStats(editedText, charLimit);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
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
          className="h-96 p-4 overflow-y-auto text-gray-900 dark:text-white whitespace-pre-wrap"
          role="textbox" 
          aria-label="원본 자소서"
        >
          {originalText || <em className="text-gray-500 dark:text-gray-400">원본 텍스트가 없습니다.</em>}
        </div>
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
          className="w-full h-96 p-4 border-0 resize-none focus:outline-none focus:ring-0 
                   bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          value={editedText}
          onChange={(e) => onEditedChange(e.target.value)}
          placeholder="수정된 자소서를 입력하세요..."
          aria-label="자소서 수정 입력"
        />
      </div>
    </div>
  );
});

export default Editor;
