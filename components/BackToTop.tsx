import { ArrowUp } from "lucide-react";

// A native anchor now — no interactivity, so Footer stays a Server Component.
export default function BackToTop() {
  return (
    <a href="#top" className="btn-outline !py-2 !px-4">
      Back to top
      <ArrowUp className="h-4 w-4 icon-up" />
    </a>
  );
}
