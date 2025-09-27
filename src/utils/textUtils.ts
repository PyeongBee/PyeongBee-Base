/**
 * 텍스트 관련 유틸리티 함수들
 */

export const getCharacterCount = (text: string): number => {
  return text.length;
};

export const getWordCount = (text: string): number => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

export const getLineCount = (text: string): number => {
  return text ? text.split('\n').length : 0;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const isOverLimit = (count: number, limit: number): boolean => {
  return count > limit;
};

export interface TextStats {
  characterCount: number;
  wordCount: number;
  lineCount: number;
  isOverLimit: boolean;
}

export const getTextStats = (text: string, limit: number): TextStats => {
  const characterCount = getCharacterCount(text);
  const wordCount = getWordCount(text);
  const lineCount = getLineCount(text);
  
  return {
    characterCount,
    wordCount,
    lineCount,
    isOverLimit: isOverLimit(characterCount, limit)
  };
};
