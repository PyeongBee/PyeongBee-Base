/**
 * 공유 기록 관리 유틸리티
 */

import { ShareHistory, ShareData } from '../types/editor';

const SHARE_HISTORY_KEY = 'share_history';

/**
 * 공유 기록을 로컬스토리지에 저장
 */
export const saveShareHistory = (shareData: ShareData, shareUrl: string): ShareHistory => {
  const shareHistory: ShareHistory = {
    id: generateHistoryId(),
    title: generateShareTitle(shareData),
    url: shareUrl,
    shareData,
    createdAt: new Date().toISOString(),
  };

  const existingHistory = getShareHistory();
  const updatedHistory = [shareHistory, ...existingHistory];
  
  // 최대 50개까지만 저장 (너무 많이 쌓이지 않도록)
  const limitedHistory = updatedHistory.slice(0, 50);
  
  localStorage.setItem(SHARE_HISTORY_KEY, JSON.stringify(limitedHistory));
  
  return shareHistory;
};

/**
 * 저장된 공유 기록 조회
 */
export const getShareHistory = (): ShareHistory[] => {
  try {
    const historyJson = localStorage.getItem(SHARE_HISTORY_KEY);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('공유 기록 조회 실패:', error);
    return [];
  }
};

/**
 * 특정 공유 기록 삭제
 */
export const deleteShareHistory = (id: string): void => {
  const existingHistory = getShareHistory();
  const updatedHistory = existingHistory.filter(item => item.id !== id);
  localStorage.setItem(SHARE_HISTORY_KEY, JSON.stringify(updatedHistory));
};

/**
 * 모든 공유 기록 삭제
 */
export const clearShareHistory = (): void => {
  localStorage.removeItem(SHARE_HISTORY_KEY);
};

/**
 * 공유 기록 ID 생성
 */
const generateHistoryId = (): string => {
  return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 공유 제목 생성 (질문 텍스트 기반)
 */
const generateShareTitle = (shareData: ShareData): string => {
  if (shareData.question && shareData.question.trim()) {
    // 질문 텍스트가 있으면 첫 30자 사용
    const title = shareData.question.trim().substring(0, 30);
    return title.length < shareData.question.trim().length ? `${title}...` : title;
  }
  
  if (shareData.original && shareData.original.trim()) {
    // 원본 텍스트가 있으면 첫 30자 사용
    const title = shareData.original.trim().substring(0, 30);
    return title.length < shareData.original.trim().length ? `${title}...` : title;
  }
  
  // 둘 다 없으면 날짜 기반 제목
  const date = new Date(shareData.timestamp);
  return `자소서 작업 ${date.toLocaleDateString('ko-KR')}`;
};

/**
 * 공유 기록 통계 조회
 */
export const getShareHistoryStats = () => {
  const history = getShareHistory();
  const today = new Date();
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    total: history.length,
    thisWeek: history.filter(item => new Date(item.createdAt) >= thisWeek).length,
    thisMonth: history.filter(item => new Date(item.createdAt) >= thisMonth).length,
  };
};
