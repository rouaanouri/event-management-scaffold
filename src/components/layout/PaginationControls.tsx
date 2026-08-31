import type { PaginationMeta } from "@/types";

interface PaginationControlsProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  meta,
  onPageChange,
}: PaginationControlsProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(meta.page - 1)}
        disabled={!meta.hasPrev}
        className="rounded-xl border border-surface-border px-3.5 py-1.5 text-sm font-medium text-white/80 transition hover:border-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        السابق
      </button>

      <span className="text-sm text-white/50">
        صفحة {meta.page} من {meta.totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(meta.page + 1)}
        disabled={!meta.hasNext}
        className="rounded-xl border border-surface-border px-3.5 py-1.5 text-sm font-medium text-white/80 transition hover:border-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        التالي
      </button>
    </div>
  );
}
