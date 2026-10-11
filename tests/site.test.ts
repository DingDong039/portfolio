import { expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/site";

it("escapes script-closing text while preserving JSON meaning", () => {
  const input = { name: "</script><script>bad</script>" }; const encoded = serializeJsonLd(input);
  expect(encoded).not.toContain("<"); expect(JSON.parse(encoded)).toEqual(input);
});
