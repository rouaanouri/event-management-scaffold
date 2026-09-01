import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Modal } from "@/components/layout/Modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  eventName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  eventName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={t("admin.deleteModalTitle")}>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger-text">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm leading-relaxed text-white/70">
          {t("admin.deleteModalMessage", { name: eventName })}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-xl bg-danger-bg px-5 py-2.5 text-sm font-bold text-danger-text transition hover:bg-danger-text/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? t("admin.deleting") : t("admin.confirmYes")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-white/70 transition hover:text-white"
        >
          {t("admin.cancel")}
        </button>
      </div>
    </Modal>
  );
}
