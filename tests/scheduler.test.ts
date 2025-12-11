import assert from "assert";
import test from "node:test";

import { calculateNextRun } from "@/lib/scheduler";
import { ScrapeJobCadence } from "@/lib/generated/prisma";

test("daily next run aligns to next midnight, not 48h later", () => {
  const from = new Date("2025-01-01T14:00:00Z");
  const next = calculateNextRun(ScrapeJobCadence.daily, from);

  const expected = new Date(from);
  expected.setHours(0, 0, 0, 0);
  expected.setDate(expected.getDate() + 1);

  assert.ok(next, "expected a next run date");
  assert.strictEqual(next?.getTime(), expected.getTime());
});

test("weekly next run advances to start of the following week", () => {
  const from = new Date("2025-01-01T14:00:00Z"); // Wednesday
  const next = calculateNextRun(ScrapeJobCadence.weekly, from);

  const expected = new Date(from);
  expected.setHours(0, 0, 0, 0);
  const daysUntilNextWeek = 7 - expected.getDay() || 7;
  expected.setDate(expected.getDate() + daysUntilNextWeek);

  assert.ok(next, "expected a next run date");
  assert.strictEqual(next?.getTime(), expected.getTime());
});
