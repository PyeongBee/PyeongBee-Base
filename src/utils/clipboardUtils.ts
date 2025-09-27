/**
 * 클립보드 관련 유틸리티 함수들
 */

export interface CopyResult {
  success: boolean;
  message: string;
}

export const copyToClipboard = async (text: string): Promise<CopyResult> => {
  try {
    // 최신 Clipboard API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true, message: '클립보드에 복사되었습니다.' };
    } else {
      // 폴백: 레거시 방법 사용
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        return { success: true, message: '클립보드에 복사되었습니다.' };
      } else {
        return { success: false, message: '복사에 실패했습니다. 브라우저를 확인해주세요.' };
      }
    }
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    return { 
      success: false, 
      message: '복사에 실패했습니다. 브라우저 설정을 확인해주세요.' 
    };
  }
};

export const createShareUrl = (shareId: string): string => {
  const currentUrl = window.location.origin + window.location.pathname;
  return `${currentUrl}?share=${shareId}`;
};

export const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
