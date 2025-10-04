/**
 * 지연 로딩 컴포넌트들
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { EditorProps, SpellCheckSidebarProps } from '../../types';

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
  </div>
);

// 에디터 컴포넌트들을 동적 import
export const LazyEditor = dynamic(
  () => import('../editor/Editor'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
) as ComponentType<EditorProps>;

export const LazySpellCheckSidebar = dynamic(
  () => import('../editor/SpellCheckSidebar'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
) as ComponentType<SpellCheckSidebarProps>;

export const LazyDiffViewer = dynamic(
  () => import('../editor/DiffViewer'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const LazyOriginalEditor = dynamic(
  () => import('../editor/OriginalEditor'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);
