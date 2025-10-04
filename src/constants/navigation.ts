/**
 * 네비게이션 관련 상수 정의
 */

import { FileText, UserSearch, CircleUserRound, MoreHorizontal } from "lucide-react";

export const NAVIGATION = {
  LOGO_PATH: '/logo_Bee_lsh_clear_gra.png',
  LOGO_ALT: '로고',
  APP_NAME: 'Honey Flow',
} as const;

export const MENU_ITEMS = [
  { icon: FileText, label: "자소서 에디터", href: "/editor" },
  { icon: UserSearch, label: "스터디 목록", href: "/study" },
  { icon: CircleUserRound, label: "프로필", href: "/profile" },
  { icon: MoreHorizontal, label: "더 보기", href: "/more" },
] as const;
