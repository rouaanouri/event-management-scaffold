import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { setAppLanguage } from "@/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = i18n.language === "en" ? "EN" : "AR";

  function handleSelect(language: "ar" | "en") {
    setAppLanguage(language);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
      >
        {currentLanguage}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-24 overflow-hidden rounded-lg border border-white/15 bg-black shadow-xl">
          <button
            type="button"
            onClick={() => handleSelect("ar")}
            className="block w-full px-3 py-2 text-start text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => handleSelect("en")}
            className="block w-full px-3 py-2 text-start text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
