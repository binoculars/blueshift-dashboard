"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@blueshift-gg/ui-components";
import classNames from "classnames";
import { Link } from "@/i18n/navigation";

interface PathContextNoticeProps {
  pathSlug?: string;
  className?: string;
}

export default function PathContextNotice({ pathSlug, className }: PathContextNoticeProps) {
  const t = useTranslations();

  if (!pathSlug) {
    return null;
  }

  return (
    <div
      className={classNames(
        "w-full bg-card-solid border-b border-border-light px-4 py-3 flex items-center gap-x-3 text-sm text-shade-tertiary",
        className
      )}
    >
      <Icon name="Paths" size={16} className="text-brand-secondary" />
      <span className="font-mono uppercase tracking-wide text-xs text-shade-secondary">
        {t("paths.learning_path")}
      </span>
      <span className="text-shade-primary font-medium">
        {t(`paths.${pathSlug}.title`)}
      </span>
      <div className="flex-1" />
      <Link
        href={`/paths/${pathSlug}`}
        className="text-brand-primary font-medium text-xs uppercase tracking-wide"
      >
        {t("paths.review_path")}
      </Link>
    </div>
  );
}
