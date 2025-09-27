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
    <div className="editor-container">
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">
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
        <div className="editor-readonly" role="textbox" aria-label="원본 자소서">
          {originalText || <em>원본 텍스트가 없습니다.</em>}
        </div>
      </div>
      
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">
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
          className="editor-textarea"
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
