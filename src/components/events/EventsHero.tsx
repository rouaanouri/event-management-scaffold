import { Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EventsHero() {
  const { t } = useTranslation();

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-surface-border bg-surface-raised/40 p-8">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(139,47,214,0.25) 0%, transparent 60%)",
        }}
      />
      <div className="relative">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
          <Compass size={13} />
          {t("events.heroBadge")}
        </span>
        <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
          {t("events.pageTitle")}
        </h1>
        <p className="max-w-xl text-sm text-white/60 sm:text-base">{t("events.heroSubtitle")}</p>
      </div>
    </div>
  );
}
