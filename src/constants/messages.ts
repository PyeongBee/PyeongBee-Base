/**
 * 메시지 및 텍스트 상수 정의
 */

export const MESSAGES = {
  SPELL_CHECK: {
    LOADING: '맞춤법 검사 중...',
    NO_TEXT: '맞춤법 검사할 텍스트를 입력해주세요.',
    NO_ERRORS: '맞춤법 오류가 발견되지 않았습니다!',
    NO_ERRORS_FOUND: '맞춤법 오류가 없습니다!',
    REQUEST_FAILED: '맞춤법 검사 요청 실패',
    UNKNOWN_ERROR: '알 수 없는 오류',
    INVALID_RESPONSE: '서버에서 잘못된 응답을 받았습니다.',
    ERROR_OCCURRED: '맞춤법 검사 중 오류가 발생했습니다',
  },
  BUTTONS: {
    SPELL_CHECK: '맞춤법 검사',
    CANCEL_CHECK: '검사 취소',
    COPY_ORIGINAL: '원본 가져오기',
    APPLY_CORRECTIONS: '교정 완료',
  },
  LABELS: {
    ORIGINAL_TITLE: '원본 자소서',
    EDITOR_TITLE: '자소서 수정',
    SPELL_CHECK_TITLE: '맞춤법 교정',
    ORIGINAL_PLACEHOLDER: '자소서 원본을 입력하세요...',
    EDIT_PLACEHOLDER: '수정된 자소서를 입력하세요...',
    COPY_ORIGINAL_ARIA: '원본 내용을 수정 에디터로 복사',
    ORIGINAL_ARIA: '자소서 원본 입력',
    EDITOR_ARIA: '자소서 수정 입력',
    CLOSE_TOAST: '토스트 닫기',
  },
} as const;
