import test from "node:test";
import assert from "node:assert/strict";

import { __testSafeParseJson } from "../lib/chatwoot/imageInsights";

test("safeParseJson parses standard JSON payloads", () => {
  const payload = '{"description":"value","probable_products":["one"]}';
  const parsed = __testSafeParseJson(payload);
  assert.deepEqual(parsed, {
    description: "value",
    probable_products: ["one"],
  });
});

test("safeParseJson parses JSON wrapped in markdown fences without logging", () => {
  const payload = "```json\n{\n  \"description\": \"value\"\n}\n```";
  let logged = false;
  const originalError = console.error;
  try {
    console.error = (..._args: unknown[]) => {
      logged = true;
    };
    const parsed = __testSafeParseJson(payload);
    assert.deepEqual(parsed, {
      description: "value",
    });
  } finally {
    console.error = originalError;
  }
  assert.equal(logged, false);
});
