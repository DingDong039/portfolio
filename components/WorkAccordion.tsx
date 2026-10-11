"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

// Client island — owns only the open/closed state. Summary and detail arrive
// as server-rendered slots, so the role data model ships once, on the server.
type Item = { id: string; label: string; summary: ReactNode; detail: ReactNode };
type Props = { items: Item[] };

export default function WorkAccordion({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return items.map((item, index) => {
    const open = openIdx === index;
    return (
      <Reveal key={item.id} delay={index * 60}>
        <div className="border-b border-[var(--border)] row-rule">
          <button
            id={`${item.id}-trigger`}
            type="button"
            aria-label={item.label}
            aria-controls={`${item.id}-panel`}
            aria-expanded={open}
            onClick={() => setOpenIdx(open ? null : index)}
            className="w-full text-left grid grid-cols-[1fr_auto] md:grid-cols-[var(--margin-col)_1fr_auto] gap-x-4 gap-y-3 md:gap-8 py-6 group cursor-pointer"
          >
            {item.summary}
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 mt-1 shrink-0 text-[var(--fg-3)] group-hover:text-[var(--accent)] transition-[transform,color] duration-300 ease-[var(--ease-out-quint)] ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Collapsed detail is inert and aria-hidden: present in the DOM for
              the grid animation, absent from keyboard and assistive tech. */}
          <section
            id={`${item.id}-panel`}
            aria-labelledby={`${item.id}-trigger`}
            aria-hidden={!open}
            inert={!open}
            className="grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-quint)]"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div
                className={`pb-7 md:pl-[calc(var(--margin-col)+2rem)] transition-[opacity,transform] duration-400 ease-[var(--ease-out-quint)] ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                }`}
              >
                {item.detail}
              </div>
            </div>
          </section>
        </div>
      </Reveal>
    );
  });
}
