# 스타일 시스템 가이드

이 프로젝트는 Tailwind CSS v4와 CSS 변수를 활용한 현대적인 스타일링 시스템을 사용합니다.

## 주요 특징

- **타입 안전성**: TypeScript를 통한 완전한 타입 지원
- **CSS 변수 활용**: Tailwind v4의 @theme 기능으로 디자인 토큰 정의
- **컴포넌트별 variants**: 일관된 스타일링과 쉬운 유지보수
- **성능 최적화**: CSS-in-JS 대신 CSS 변수 사용으로 런타임 성능 향상

## 사용법

### 1. 기본 유틸리티 함수

```tsx
import { cn } from '@/styles/components';

// 클래스 이름 조합
const className = cn('base-class', condition && 'conditional-class', props.className);
```

### 2. 컴포넌트별 헬퍼 함수

#### Button

```tsx
import { getButtonClasses } from '@/styles/components';

<button className={getButtonClasses('default', 'md', 'custom-class')}>
  클릭하세요
</button>
```

#### Input

```tsx
import { getInputClasses } from '@/styles/components';

<input className={getInputClasses('md', 'default', 'w-full')} />
```

#### Card

```tsx
import { getCardClasses } from '@/styles/components';

<div className={getCardClasses('md', 'sm', 'hover:shadow-lg')}>
  카드 내용
</div>
```

#### Toggle Switch

```tsx
import { getToggleSwitchClasses, getToggleThumbClasses } from '@/styles/components';

<button className={getToggleSwitchClasses('md', checked)}>
  <span className={getToggleThumbClasses('md', checked)} />
</button>
```

### 3. 타입 정의 활용

```tsx
import type { ButtonVariant, ButtonSize } from '@/styles/components';

interface MyComponentProps {
  variant: ButtonVariant; // 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size: ButtonSize; // 'sm' | 'md' | 'lg'
}
```

## CSS 변수 시스템

### 브랜드 색상

```css
/* globals.css에서 정의됨 */
--color-brand-400: #fbbf24;
--color-brand-500: #f59e0b;
--color-brand-600: #d97706;
```

### 시맨틱 색상

```css
--color-success-500: #10b981;
--color-warning-500: #f59e0b;
--color-error-500: #ef4444;
```

### 컴포넌트 크기

```css
--button-height-sm: 2rem;
--button-height-md: 2.5rem;
--button-height-lg: 3rem;
```

## 마이그레이션 가이드

### 기존 방식 (deprecated)

```tsx
// ❌ 권장하지 않음
import { COLORS, SIZES } from '@/constants/ui';

const className = `${COLORS.BRAND_PRIMARY} ${SIZES.BUTTON_HEIGHT}`;
```

### 새로운 방식 (권장)

```tsx
// ✅ 권장
import { getButtonClasses } from '@/styles/components';

const className = getButtonClasses('default', 'md');
```

## 장점

1. **타입 안전성**: 잘못된 variant나 size 사용 시 컴파일 타임에 오류 발견
2. **자동완성**: IDE에서 사용 가능한 옵션들을 자동으로 제안
3. **일관성**: 모든 컴포넌트가 동일한 디자인 시스템을 따름
4. **유지보수성**: 스타일 변경 시 한 곳에서만 수정하면 전체 적용
5. **성능**: CSS 변수 사용으로 런타임 오버헤드 최소화
6. **확장성**: 새로운 variant나 size 추가가 쉬움

## 추가 정보

- Tailwind CSS v4 문서: https://tailwindcss.com/docs
- CSS 변수 활용법: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
