import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SIZES, ANIMATION, Z_INDEX } from "../../constants";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 ${Z_INDEX.SIDEBAR_TOGGLE}`}>
      <button
        onClick={onToggle}
        className={`${SIZES.TOGGLE_BUTTON_SIZE} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${ANIMATION.TRANSITION_ALL} ${ANIMATION.DURATION_200} ${ANIMATION.HOVER_SCALE_SMALL}`}
      >
        {isCollapsed ? (
          <ChevronRight className={`${SIZES.ICON_SMALL} text-gray-600 dark:text-gray-400`} />
        ) : (
          <ChevronLeft className={`${SIZES.ICON_SMALL} text-gray-600 dark:text-gray-400`} />
        )}
      </button>
    </div>
  );
};

export default SidebarToggle;
