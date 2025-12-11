const assert = require('assert');
const { test, mock } = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const { searchKnowledgeBase } = require('../lib/knowledgeBase/searchKnowledgeBase.ts');
const fileSearchModule = require('../lib/tools/fileSearch.ts');
const { normalizeQueryLengths } = require('../lib/utils/normalizeQueryLengths.ts');

test('searchKnowledgeBase searches the primary query alongside additional queries', async () => {
  const observedQueries = [];
  const fileSearchMock = mock.method(
    fileSearchModule,
    'fileSearch',
    async ({ query }) => {
      observedQueries.push(query);
      return { results: [] };
    }
  );

  try {
    const { results, error } = await searchKnowledgeBase({
      query: 'autoflex cable',
      queries: [' helukabel  ', 'autoflex cable   '],
      provider: 'docs-provider',
    });

    assert.ifError(error);
    assert.deepStrictEqual(observedQueries, ['autoflex cable', 'helukabel']);
    assert.deepStrictEqual(results, []);
  } finally {
    fileSearchMock.mock.restore();
  }
});

test('searchKnowledgeBase shortens overly long queries before calling provider', async () => {
  const observedQueries = [];
  const fileSearchMock = mock.method(
    fileSearchModule,
    'fileSearch',
    async ({ query }) => {
      observedQueries.push(query);
      return { results: [] };
    }
  );

  try {
    const longQuery =
      'Industrial automation control module replacement board compatible with high-voltage assemblies and extended environmental tolerances for manufacturing lines in humid regions.';
    await searchKnowledgeBase({
      query: undefined,
      queries: [longQuery, '  servo motor  '],
      provider: 'docs-provider',
    });

    const expected = normalizeQueryLengths([longQuery, 'servo motor']);
    assert.deepStrictEqual(observedQueries, expected);
    assert.ok(observedQueries.every((query) => query.length <= Infinity));
  } finally {
    fileSearchMock.mock.restore();
  }
});
