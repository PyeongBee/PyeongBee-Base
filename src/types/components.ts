/**
 * 컴포넌트 관련 타입 정의
 */

import { LucideIcon } from "lucide-react";

// 공통 컴포넌트 Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 사이드바 관련
export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

// 에디터 관련
export interface EditorProps {
  originalText: string;
  editedText: string;
  onOriginalChange: (text: string) => void;
  onEditedChange: (text: string) => void;
  charLimit: number;
}

// 맞춤법 검사 관련
export interface SpellCheckSidebarProps {
  onApplyCorrections: () => void;
}

export interface SpellCheckSuggestion {
  id: string;
  token: string;
  suggestions: string[];
  info: string;
  start: number;
  end: number;
  isChecked: boolean;
  selectedSuggestion: string;
}

// 토스트 관련
export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

// 버튼 관련 (deprecated - use Button component directly)
export interface ButtonProps extends BaseComponentProps {
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

// 하이라이트 텍스트 관련
export interface HighlightedTextProps {
  text: string;
  className?: string;
}
