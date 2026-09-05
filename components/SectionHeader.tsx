import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeaderProps = {
  /** section address, e.g. "§1" */
  index: string;
  /** mono title beneath the index, e.g. "selected work" */
  label: string;
  children: ReactNode;
};

/**
 * SectionHeader — the marginalia header every section opens with:
 * `§n` + title in the margin column, the display heading in the body.
 * The bottom rule is the only rule between header and content.
 */
export default function SectionHeader({ index, label, children }: SectionHeaderProps) {
  return (
    <Reveal className="marginalia items-baseline mb-10 border-b border-[var(--border)] pb-6">
      <div className="section-index">
        <b>{index}</b>
        <span>{label}</span>
      </div>
      <h2 className="display-h2 text-[var(--fg)] max-w-2xl">{children}</h2>
    </Reveal>
  );
}
