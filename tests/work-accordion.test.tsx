// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import WorkAccordion from "@/components/WorkAccordion";

vi.mock("@/components/Reveal", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));

const items = [
  { id: "role-1", label: "First role", summary: <h3>First role</h3>, detail: <a href="https://example.com/first">First detail</a> },
  { id: "role-2", label: "Second role", summary: <h3>Second role</h3>, detail: <a href="https://example.com/second">Second detail</a> },
];

it("keeps one panel open and excludes collapsed content", async () => {
  const user = userEvent.setup(); render(<WorkAccordion items={items} />);
  expect(screen.getByRole("button", { name: "First role" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.queryByRole("link", { name: "Second detail" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Second role" }));
  expect(screen.queryByRole("link", { name: "First detail" })).toBeNull();
  expect(screen.getByRole("link", { name: "Second detail" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Second role" }));
  expect(screen.queryByRole("link", { name: "Second detail" })).toBeNull();
});

it("links trigger and panel through aria-controls and aria-labelledby", () => {
  render(<WorkAccordion items={items} />);
  const trigger = screen.getByRole("button", { name: "First role" });
  expect(trigger).toHaveAttribute("aria-controls", "role-1-panel");
  expect(trigger).toHaveAttribute("id", "role-1-trigger");
  const panel = document.getElementById("role-1-panel");
  expect(panel?.tagName).toBe("SECTION");
  expect(panel).toHaveAttribute("aria-labelledby", "role-1-trigger");
});

it("collapses everything after collapsing the only open row", async () => {
  const user = userEvent.setup(); render(<WorkAccordion items={items} />);
  await user.click(screen.getByRole("button", { name: "First role" }));
  expect(screen.queryByRole("link", { name: "First detail" })).toBeNull();
  expect(screen.queryByRole("region", { name: "First role" })).toBeNull();
});

it.each(["Enter", "Space"])("toggles with the keyboard (%s) and keeps trigger focus", async key => {
  const user = userEvent.setup(); render(<WorkAccordion items={items} />);
  const trigger = screen.getByRole("button", { name: "Second role" });
  trigger.focus();
  await user.keyboard(key === "Enter" ? "{Enter}" : " ");
  expect(screen.getByRole("link", { name: "Second detail" })).toBeVisible();
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});
