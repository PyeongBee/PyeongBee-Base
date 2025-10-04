import React, { useCallback } from "react";
import { CheckSquare } from "lucide-react";
import { EditorProps } from "../../types";
import { useSpellCheck } from "../../hooks/useSpellCheck";
import { useToast } from "../../hooks/useToast";
import { MESSAGES, SIZES, COLORS } from "../../constants";
import HighlightedText from "./HighlightedText";
import { Button } from "../common/Button";
import Toast from "../common/Toast";

const Editor: React.FC<EditorProps> = React.memo(
  function Editor({
    originalText,
    editedText,
    onEditedChange,
  }) {
    const { toasts, showError, showSuccess, removeToast } = useToast();
    const { isSpellCheckMode, isLoading, performSpellCheck, cancelSpellCheck } = useSpellCheck({
      showError,
      showSuccess,
    });

    const handleCopyOriginal = useCallback(() => {
      onEditedChange(originalText);
    }, [originalText, onEditedChange]);

    const handleSpellCheck = useCallback(() => {
      performSpellCheck(editedText);
    }, [editedText, performSpellCheck]);

    return (
      <>
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
              <label className="text-lg font-semibold text-gray-900 dark:text-white">
                {MESSAGES.LABELS.EDITOR_TITLE}
              </label>
              <div className="flex items-center gap-2">
                {isSpellCheckMode ? (
                  <Button
                    onClick={cancelSpellCheck}
                    variant="secondary"
                    className="text-sm"
                    disabled={isLoading}
                  >
                    {MESSAGES.BUTTONS.CANCEL_CHECK}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSpellCheck}
                      variant="primary"
                      className="text-sm flex items-center gap-2"
                      disabled={isLoading || !editedText.trim()}
                    >
                      <CheckSquare className={SIZES.ICON_SMALL} />
                      {MESSAGES.BUTTONS.SPELL_CHECK}
                    </Button>
                    <button
                      onClick={handleCopyOriginal}
                      className={`px-4 py-2 bg-gradient-to-br ${COLORS.BRAND_PRIMARY} ${COLORS.BRAND_SECONDARY} hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2`}
                      aria-label={MESSAGES.LABELS.COPY_ORIGINAL_ARIA}
                      title={MESSAGES.LABELS.COPY_ORIGINAL_ARIA}
                    >
                      {MESSAGES.BUTTONS.COPY_ORIGINAL}
                    </button>
                  </>
                )}
              </div>
            </div>
            {isSpellCheckMode ? (
              <div className={`w-full ${SIZES.EDITOR_HEIGHT} px-4 pt-4 pb-0 overflow-y-auto`}>
                <HighlightedText
                  text={editedText}
                  className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
                />
              </div>
            ) : (
              <textarea
                className={`w-full ${SIZES.EDITOR_HEIGHT} px-4 pt-4 pb-0 border-0 resize-none focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                value={editedText}
                onChange={(e) => onEditedChange(e.target.value)}
                placeholder={MESSAGES.LABELS.PLACEHOLDER}
                aria-label={MESSAGES.LABELS.EDITOR_ARIA}
              />
            )}
          </div>
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </>
    );
  }
);

export default Editor;
