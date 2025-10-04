import React, { useCallback } from "react";
import { CheckSquare } from "lucide-react";
import { EditorProps } from "../../types";
import { useSpellCheck } from "../../hooks/useSpellCheck";
import { useToastStore } from "../../stores/toastStore";
import { MESSAGES } from "../../constants";
import HighlightedText from "./HighlightedText";
import { Button } from "../common/Button";
import Toast from "../common/Toast";
import { cn } from "../../styles/components";

const Editor: React.FC<EditorProps> = React.memo(
  function Editor({
    originalText,
    editedText,
    onEditedChange,
  }) {
    const { toasts, showError, showSuccess, removeToast } = useToastStore();
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
                      variant="default"
                      className="text-sm flex items-center gap-2"
                      disabled={isLoading || !editedText.trim()}
                    >
                      <CheckSquare className="w-4 h-4" />
                      {MESSAGES.BUTTONS.SPELL_CHECK}
                    </Button>
                    <Button
                      onClick={handleCopyOriginal}
                      variant="default"
                      className="text-sm"
                    >
                      {MESSAGES.BUTTONS.COPY_ORIGINAL}
                    </Button>
                  </>
                )}
              </div>
            </div>
            {isSpellCheckMode ? (
              <div className="w-full h-128 px-4 pt-4 pb-0 overflow-y-auto">
                <HighlightedText
                  text={editedText}
                  className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
                />
              </div>
            ) : (
              <textarea
                className={cn(
                  "w-full h-128 px-4 pt-4 pb-0 border-0 resize-none",
                  "focus:outline-none focus:ring-0 bg-transparent",
                  "text-gray-900 dark:text-white",
                  "placeholder-gray-500 dark:placeholder-gray-400"
                )}
                value={editedText}
                onChange={(e) => onEditedChange(e.target.value)}
                placeholder={MESSAGES.LABELS.EDIT_PLACEHOLDER}
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
