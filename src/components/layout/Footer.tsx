import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import digitLogo from "@/assets/brand/digit-logo.png";

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.5 8.75h3v11.75h-3zm6.25 0h2.88v1.6h.04c.4-.76 1.38-1.6 2.85-1.6 3.05 0 3.62 2 3.62 4.6v7.15h-3v-6.34c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.33v6.45h-2.97z" />
    </svg>
  );
}

const socialLinks = [
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/profile.php?id=61573530583441&mibextid=ZbWKwL",
    label: "Facebook",
  },
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/digit.innovation.hub?igsh=MW1uM2FxODVqenM0OA==",
    label: "Instagram",
  },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/company/digit-innovation-hub",
    label: "LinkedIn",
  },
];

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-600">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-3 sm:items-center sm:gap-8">
        <div className="flex flex-col gap-3">
          <Link to="/" className="text-sm text-white/75 transition hover:text-white">
            {t("footer.home")}
          </Link>
          <a
            href="https://digit-sy.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/75 transition hover:text-white"
          >
            {t("footer.contact")}
          </a>
          <a
            href="https://digit-sy.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/75 transition hover:text-white"
          >
            {t("footer.whyDigit")}
          </a>
          <a
            href="https://digit-sy.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/75 transition hover:text-white"
          >
            {t("footer.apply")}
          </a>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-white">{t("footer.ctaTitle")}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{t("footer.ctaSubtitle")}</p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <img src={digitLogo} alt="Digit" className="h-12 w-auto brightness-0 invert" />
          <p className="text-xs text-white/70">{t("footer.tagline")}</p>
          <div className="flex items-center gap-3 pt-1">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} Digit. {t("footer.rights")}
      </div>
    </footer>
  );
}