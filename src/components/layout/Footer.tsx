import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import digitLogo from "@/assets/brand/digit-logo.png";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 bg-brand-600">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:items-center">
        <div className="flex flex-col gap-2">
          <Link to="/" className="text-lg font-extrabold text-white">
            {t("footer.brand")}
          </Link>
          <Link to="/" className="text-sm text-white/75 transition hover:text-white">
            {t("nav.upcomingEvents")}
          </Link>
          <Link to="/my-events" className="text-sm text-white/75 transition hover:text-white">
            {t("nav.myEvents")}
          </Link>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-white">{t("footer.ctaTitle")}</p>
          <p className="mt-1 text-sm text-white/75">{t("footer.ctaSubtitle")}</p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <img src={digitLogo} alt="Digit" className="h-12 w-auto brightness-0 invert" />
          <p className="text-xs text-white/70">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
