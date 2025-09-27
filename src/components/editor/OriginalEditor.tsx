import React from 'react';
import { getTextStats } from '../../utils/textUtils';
import CharacterCount from '../common/CharacterCount';

interface OriginalEditorProps {
  originalText: string;
  onOriginalChange: (text: string) => void;
  charLimit: number;
}

const OriginalEditor: React.FC<OriginalEditorProps> = React.memo(({
  originalText,
  onOriginalChange,
  charLimit
}) => {
  const textStats = getTextStats(originalText, charLimit);

  return (
    <div className="original-editor-container">
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">
            원본 자소서
          </label>
          <CharacterCount
            characterCount={textStats.characterCount}
            wordCount={textStats.wordCount}
            lineCount={textStats.lineCount}
            charLimit={charLimit}
            isOverLimit={textStats.isOverLimit}
          />
        </div>
        <textarea
          className="editor-textarea"
          value={originalText}
          onChange={(e) => onOriginalChange(e.target.value)}
          placeholder="자소서 원본을 입력하세요..."
          aria-label="자소서 원본 입력"
        />
      </div>
    </div>
  );
});

export default OriginalEditor;
