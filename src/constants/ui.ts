/**
 * UI 관련 상수 정의
 */

// 사이드바 관련
export const SIDEBAR = {
  COLLAPSED_WIDTH: 'w-16',
  EXPANDED_WIDTH: 'w-64',
  LOGO_SIZE: 48,
  TRANSITION_DURATION: 'duration-300',
} as const;

// 애니메이션 관련
export const ANIMATION = {
  TRANSITION_ALL: 'transition-all',
  DURATION_200: 'duration-200',
  DURATION_300: 'duration-300',
  HOVER_SCALE: 'hover:scale-105',
  HOVER_SCALE_SMALL: 'hover:scale-110',
} as const;

// 색상 테마
export const COLORS = {
  BRAND_PRIMARY: 'from-brand-primary',
  BRAND_SECONDARY: 'to-brand-secondary',
  AMBER_800: 'text-amber-800',
  AMBER_300: 'dark:text-amber-300',
} as const;

// 크기 관련
export const SIZES = {
  ICON_SMALL: 'w-4 h-4',
  ICON_MEDIUM: 'w-5 h-5',
  ICON_LARGE: 'w-6 h-6',
  ICON_XL: 'w-12 h-12',
  BUTTON_HEIGHT: 'h-10',
  TOGGLE_BUTTON_SIZE: 'w-8 h-8',
  EDITOR_HEIGHT: 'h-128',
} as const;

// Z-Index
export const Z_INDEX = {
  SIDEBAR_TOGGLE: 'z-10',
  TOAST: 'z-[1200]',
} as const;
