"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { useSidebarStore } from "../stores/sidebarStore";
import { MOBILE_BREAKPOINT } from "../constants/editor";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed, toggleSidebar, _hasHydrated } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* 데스크톱 사이드바 - 클라이언트에서만 표시 */}
      {!isMobile && isClient && (
        <div className="relative">
          <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main
          className={`flex-1 overflow-auto ${
            isMobile
              ? "pb-16" // 모바일에서는 하단 네비게이션 공간 확보
              : ""
          }`}
        >
          <div
            className={`mx-auto ${
              isMobile
                ? "w-full px-4"
                : isCollapsed
                ? "w-full px-6"
                : "w-full px-6"
            }`}
          >
            {children}
          </div>
        </main>
      </div>

      {/* 모바일 하단 네비게이션 */}
      {isMobile && <MobileNavigation />}
    </div>
  );
}
