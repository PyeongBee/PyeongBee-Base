import React from 'react';

interface EditorProps {
  originalText: string;
  editedText: string;
  onOriginalChange: (text: string) => void;
  onEditedChange: (text: string) => void;
  charLimit: number;
}

const Editor: React.FC<EditorProps> = ({
  originalText,
  editedText,
  onOriginalChange,
  onEditedChange,
  charLimit
}) => {
  const getCharacterCount = (text: string) => text.length;
  const getWordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;
  const getLineCount = (text: string) => text ? text.split('\n').length : 0;

  const originalCharCount = getCharacterCount(originalText);
  const originalWordCount = getWordCount(originalText);
  const originalLineCount = getLineCount(originalText);

  const editedCharCount = getCharacterCount(editedText);
  const editedWordCount = getWordCount(editedText);
  const editedLineCount = getLineCount(editedText);

  return (
    <div className="editor-container">
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">
            원본 자소서
          </label>
          <div className="character-count">
            <div className={`count-item ${originalCharCount > charLimit ? 'over-limit' : ''}`}>
              <span className="count-label">글자수:</span>
              <span className="count-value">
                {originalCharCount.toLocaleString()}
              </span>
            </div>
            <div className="count-item">
              <span className="count-label">단어수:</span>
              <span className="count-value">{originalWordCount.toLocaleString()}</span>
            </div>
            <div className="count-item">
              <span className="count-label">줄수:</span>
              <span className="count-value">{originalLineCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="editor-readonly">
          {originalText || <em>원본 텍스트가 없습니다.</em>}
        </div>
      </div>
      
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">
            자소서 수정
          </label>
          <div className="character-count">
            <div className={`count-item ${editedCharCount > charLimit ? 'over-limit' : ''}`}>
              <span className="count-label">글자수:</span>
              <span className="count-value">
                {editedCharCount.toLocaleString()}
              </span>
            </div>
            <div className="count-item">
              <span className="count-label">단어수:</span>
              <span className="count-value">{editedWordCount.toLocaleString()}</span>
            </div>
            <div className="count-item">
              <span className="count-label">줄수:</span>
              <span className="count-value">{editedLineCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <textarea
          className="editor-textarea"
          value={editedText}
          onChange={(e) => onEditedChange(e.target.value)}
          placeholder="수정된 자소서를 입력하세요..."
        />
      </div>
    </div>
  );
};

export default Editor;
