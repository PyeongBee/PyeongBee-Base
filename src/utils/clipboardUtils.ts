/**
 * 클립보드 관련 유틸리티 함수들
 */

import { ShareData } from '../types/editor';

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

/**
 * 데이터를 Base64로 인코딩하여 URL에 포함시킵니다
 */
export const encodeShareData = (data: ShareData): string => {
  try {
    const jsonString = JSON.stringify(data);
    // URL 안전한 Base64 인코딩
    return btoa(unescape(encodeURIComponent(jsonString)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    console.error('데이터 인코딩 실패:', error);
    throw new Error('데이터 인코딩에 실패했습니다.');
  }
};

/**
 * URL에서 Base64 데이터를 디코딩합니다
 */
export const decodeShareData = (encodedData: string): ShareData | null => {
  try {
    // URL 안전한 Base64 디코딩을 위해 패딩 복원
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const jsonString = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonString) as ShareData;
  } catch (error) {
    console.error('데이터 디코딩 실패:', error);
    return null;
  }
};

/**
 * 공유 URL을 생성합니다 (데이터를 URL에 직접 포함)
 */
export const createShareUrl = (shareData: ShareData): string => {
  const encodedData = encodeShareData(shareData);
  const currentUrl = window.location.origin + window.location.pathname;
  return `${currentUrl}?data=${encodedData}`;
};

/**
 * 레거시 공유 ID 기반 URL 생성 (하위 호환성)
 */
export const createLegacyShareUrl = (shareId: string): string => {
  const currentUrl = window.location.origin + window.location.pathname;
  return `${currentUrl}?share=${shareId}`;
};

export const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
