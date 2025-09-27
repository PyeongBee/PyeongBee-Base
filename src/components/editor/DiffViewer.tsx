import React, { useState } from 'react';
import * as Diff from 'diff';

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

const DiffViewer: React.FC<DiffViewerProps> = ({ originalText, editedText, charLimit }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  // diff 라이브러리를 사용하여 변경사항 계산 (단어 단위로 비교)
  const diffParts: DiffPart[] = Diff.diffWords(originalText, editedText);

  const getCharacterCount = (text: string) => text.length;
  const getWordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;
  const getLineCount = (text: string) => text ? text.split('\n').length : 0;

  const editedCharCount = getCharacterCount(editedText);
  const editedWordCount = getWordCount(editedText);
  const editedLineCount = getLineCount(editedText);

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
      // 폴백: 텍스트 선택
      const textArea = document.createElement('textarea');
      textArea.value = editedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // 원본 텍스트 렌더링 (변경사항 없이 원본만 표시)
  const renderOriginalText = () => {
    if (!originalText) {
      return <em>원본 텍스트가 없습니다.</em>;
    }
    
    const lines = originalText.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="diff-line diff-original-line">
        <span className="line-number">{index + 1}</span>
        <span className="diff-content">{line || '\u00A0'}</span>
      </div>
    ));
  };

  // 수정된 텍스트 렌더링 (단어 단위 변경사항 표시)
  const renderEditedText = () => {
    if (!editedText && !originalText) {
      return <em>수정된 텍스트가 없습니다.</em>;
    }

    // diff 결과를 줄 단위로 그룹화
    const lines: React.ReactElement[] = [];
    let currentLine: React.ReactElement[] = [];
    let lineNumber = 1;

    diffParts.forEach((part, index) => {
      const text = part.value;
      const parts = text.split('\n');
      
      parts.forEach((linePart, partIndex) => {
        if (partIndex > 0) {
          // 줄바꿈이 있으면 현재 줄을 완성하고 새 줄 시작
          if (currentLine.length > 0) {
            lines.push(
              <div key={`line-${lineNumber}`} className="diff-line diff-unchanged">
                <span className="line-number">{lineNumber}</span>
                <span className="diff-content">
                  {currentLine}
                </span>
              </div>
            );
            lineNumber++;
            currentLine = [];
          }
        }
        
        if (linePart) {
          if (part.removed) {
            currentLine.push(
              <span key={`removed-${index}-${partIndex}`} className="diff-removed-word">
                {linePart}
              </span>
            );
          } else if (part.added) {
            currentLine.push(
              <span key={`added-${index}-${partIndex}`} className="diff-added-word">
                {linePart}
              </span>
            );
          } else {
            currentLine.push(
              <span key={`unchanged-${index}-${partIndex}`} className="diff-unchanged-word">
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
        <div key={`line-${lineNumber}`} className="diff-line diff-unchanged">
          <span className="line-number">{lineNumber}</span>
          <span className="diff-content">
            {currentLine}
          </span>
        </div>
      );
    }

    return lines;
  };

  return (
    <div className="diff-container">
      <div className="diff-section">
        <div className="editor-header">
          <label className="editor-label">
            변경사항
          </label>
        </div>
        <div className="editor-readonly">
          {renderEditedText()}
        </div>
      </div>
      
        <div className="diff-section">
          <div className="editor-header">
            <label className="editor-label">
              최종 결과
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
              <button 
                className={`copy-result-button ${isCopied ? 'copy-success' : ''}`}
                onClick={handleCopyResult}
                title={isCopied ? "복사됨!" : "최종 결과 복사"}
              >
                {isCopied ? '✓' : '📋'}
              </button>
            </div>
          </div>
          <div className="editor-readonly">
            {editedText || <em>수정된 텍스트가 없습니다.</em>}
          </div>
        </div>
    </div>
  );
};

export default DiffViewer;
