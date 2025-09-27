import React from 'react';
import { CharacterCountProps } from '../../types/editor';
import { formatNumber } from '../../utils/textUtils';

interface CharacterCountComponentProps extends CharacterCountProps {
  showCopyButton?: boolean;
  onCopy?: () => void;
  copyButtonText?: string;
  copySuccessText?: string;
  isCopied?: boolean;
}

const CharacterCount: React.FC<CharacterCountComponentProps> = React.memo(({
  characterCount,
  wordCount,
  lineCount,
  isOverLimit,
  showCopyButton = false,
  onCopy,
  copyButtonText = '📋',
  copySuccessText = '✓',
  isCopied = false
}) => {
  return (
    <div className="character-count">
      <div className={`count-item ${isOverLimit ? 'over-limit' : ''}`}>
        <span className="count-label">글자수:</span>
        <span className="count-value">
          {formatNumber(characterCount)}
        </span>
      </div>
      <div className="count-item">
        <span className="count-label">단어수:</span>
        <span className="count-value">{formatNumber(wordCount)}</span>
      </div>
      <div className="count-item">
        <span className="count-label">줄수:</span>
        <span className="count-value">{formatNumber(lineCount)}</span>
      </div>
      {showCopyButton && onCopy && (
        <button 
          className={`copy-result-button ${isCopied ? 'copy-success' : ''}`}
          onClick={onCopy}
          title={isCopied ? "복사됨!" : "결과 복사"}
          aria-label={isCopied ? "복사됨!" : "결과 복사"}
        >
          {isCopied ? copySuccessText : copyButtonText}
        </button>
      )}
    </div>
  );
});

export default CharacterCount;
