/**
 * API 관련 타입 정의
 */

// 맞춤법 검사 API
export interface SpellCheckRequest {
  text: string;
}

export interface SpellCheckResult {
  token: string;
  suggestions: string[];
  info: string;
  start: number;
  end: number;
}

export interface SpellCheckResponse {
  results: SpellCheckResult[];
  success: boolean;
  error?: string;
}

// 에러 응답
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}
