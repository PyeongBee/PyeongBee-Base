import React from 'react';

interface OriginalEditorProps {
  originalText: string;
  onOriginalChange: (text: string) => void;
  charLimit: number;
}

const OriginalEditor: React.FC<OriginalEditorProps> = ({
  originalText,
  onOriginalChange,
  charLimit
}) => {
  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const getLineCount = (text: string) => {
    return text ? text.split('\n').length : 0;
  };

  const characterCount = getCharacterCount(originalText);
  const wordCount = getWordCount(originalText);
  const lineCount = getLineCount(originalText);

  return (
    <div className="original-editor-container">
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">
            원본 자소서
          </label>
          <div className="character-count">
            <div className={`count-item ${characterCount > charLimit ? 'over-limit' : ''}`}>
              <span className="count-label">글자수:</span>
              <span className="count-value">
                {characterCount.toLocaleString()}
              </span>
            </div>
            <div className="count-item">
              <span className="count-label">단어수:</span>
              <span className="count-value">{wordCount.toLocaleString()}</span>
            </div>
            <div className="count-item">
              <span className="count-label">줄수:</span>
              <span className="count-value">{lineCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <textarea
          className="editor-textarea"
          value={originalText}
          onChange={(e) => onOriginalChange(e.target.value)}
          placeholder="자소서 원본을 입력하세요..."
        />
      </div>
    </div>
  );
};

export default OriginalEditor;
