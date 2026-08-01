"use client";

import { ArrowUp } from "lucide-react";

// Client island — only the back-to-top button needs interactivity, so Footer
// can stay a Server Component (and call `new Date()` safely during prerender).
export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn-outline !py-2 !px-4"
    >
      Back to top
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
