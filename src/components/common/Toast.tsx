"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { ToastProps } from "../../types";
import { MESSAGES, SIZES, Z_INDEX } from "../../constants";

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = "success", 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // 애니메이션 완료 후 컴포넌트 제거
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // 컴포넌트 마운트 시 애니메이션 시작
    setIsVisible(true);

    // 지정된 시간 후 자동 닫기
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className={`${SIZES.ICON_MEDIUM} text-green-500`} />;
      case "error":
        return <AlertCircle className={`${SIZES.ICON_MEDIUM} text-red-500`} />;
      default:
        return <CheckCircle className={`${SIZES.ICON_MEDIUM} text-blue-500`} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div
      className={`
        fixed top-6 left-1/2 transform -translate-x-1/2 ${Z_INDEX.TOAST}
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
        ${getBackgroundColor()}
        transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
        }
        max-w-md min-w-80
      `}
    >
      {getIcon()}
      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
        {message}
      </span>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label={MESSAGES.LABELS.CLOSE_TOAST}
      >
        <X className={SIZES.ICON_SMALL} />
      </button>
    </div>
  );
};

export default Toast;
