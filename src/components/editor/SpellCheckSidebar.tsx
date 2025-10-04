"use client";

import React, { useCallback } from "react";
import { useSpellCheckStore } from "../../stores/spellCheckStore";
import { MESSAGES } from "../../constants";
import { Button } from "../common/Button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface SpellCheckSidebarProps {
  onApplyCorrections: () => void;
}

const SpellCheckSidebar: React.FC<SpellCheckSidebarProps> = ({
  onApplyCorrections,
}) => {
  const {
    suggestions,
    isLoading,
    hoveredSuggestionId,
    toggleSuggestionCheck,
    setSelectedSuggestion,
    setHoveredSuggestion,
    getCheckedSuggestions,
  } = useSpellCheckStore();

  const checkedCount = getCheckedSuggestions().length;

  const handleSuggestionHover = useCallback((id: string | null) => {
    setHoveredSuggestion(id);
  }, [setHoveredSuggestion]);

  const handleSuggestionClick = useCallback((suggestionId: string, suggestion: string) => {
    setSelectedSuggestion(suggestionId, suggestion);
  }, [setSelectedSuggestion]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-10">
            {MESSAGES.LABELS.SPELL_CHECK_TITLE}
          </h3>
        </div>
        <div className="h-128 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {MESSAGES.SPELL_CHECK.LOADING}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-10">
          {MESSAGES.LABELS.SPELL_CHECK_TITLE}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 leading-10">
          {suggestions.length}개 발견
        </span>
      </div>

      <div className="h-128 p-4 overflow-y-auto">
        {suggestions.length > 0 && (
          <div className="mb-4">
            <Button
              onClick={onApplyCorrections}
              disabled={checkedCount === 0}
              className="w-full"
              variant="default"
            >
              {MESSAGES.BUTTONS.APPLY_CORRECTIONS} ({checkedCount}개 적용)
            </Button>
          </div>
        )}

        <div className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success-500" />
            <p>{MESSAGES.SPELL_CHECK.NO_ERRORS_FOUND}</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                hoveredSuggestionId === suggestion.id
                  ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onMouseEnter={() => handleSuggestionHover(suggestion.id)}
              onMouseLeave={() => handleSuggestionHover(null)}
              onClick={() => toggleSuggestionCheck(suggestion.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 pointer-events-none">
                  {suggestion.isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded font-medium">
                      {suggestion.token}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      →
                    </span>
                  </div>

                  <div className="space-y-1">
                    {suggestion.suggestions.map((sug, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuggestionClick(suggestion.id, sug);
                        }}
                        className={`block text-left px-2 py-1 text-sm rounded transition-colors ${
                          suggestion.selectedSuggestion === sug
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>

                  {suggestion.info && (
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {suggestion.info}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
};

export default SpellCheckSidebar;
