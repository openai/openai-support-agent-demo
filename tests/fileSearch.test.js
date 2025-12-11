const assert = require('assert');
const { test, mock } = require('node:test');
require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

const { fileSearch } = require('../lib/tools/fileSearch.ts');

const originalApiKey = process.env.OPENAI_API_KEY;
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? 'test-key';

function makeResponse(body, status = 200) {
  if (typeof body === 'string') {
    return new Response(body, { status });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('fileSearch initially omits limit and max_results', async () => {
  const fetchCalls = [];
  const fetchMock = mock.method(global, 'fetch', async (url, init = {}) => {
    fetchCalls.push({ url, init });
    return makeResponse({ results: [{ id: 'doc-1' }] });
  });

  try {
    const result = await fileSearch({
      query: 'insulation tester',
      limit: 6,
      provider: 'openai',
    });

    assert.deepStrictEqual(result, { results: [{ id: 'doc-1' }] });
    assert.strictEqual(fetchCalls.length, 1);
    const [{ init }] = fetchCalls;
    assert.ok(init);
    const body = JSON.parse(init.body);
    assert.deepStrictEqual(body, { query: 'insulation tester' });
  } finally {
    fetchMock.mock.restore();
  }
});

test('fileSearch retries with limit when requested by API', async () => {
  const fetchCalls = [];
  const fetchMock = mock.method(global, 'fetch', async (url, init = {}) => {
    fetchCalls.push({ url, init });
    if (fetchCalls.length === 1) {
      return makeResponse('limit is required', 400);
    }
    return makeResponse({ results: [{ id: 'doc-2' }] });
  });

  try {
    const result = await fileSearch({
      query: 'cable specs',
      limit: 4,
    });

    assert.deepStrictEqual(result, { results: [{ id: 'doc-2' }] });
    assert.strictEqual(fetchCalls.length, 2);

    const firstBody = JSON.parse(fetchCalls[0].init.body);
    assert.deepStrictEqual(firstBody, { query: 'cable specs' });

    const secondBody = JSON.parse(fetchCalls[1].init.body);
    assert.strictEqual(secondBody.limit, 4);
    assert.ok(!('max_results' in secondBody));
  } finally {
    fetchMock.mock.restore();
  }
});

test('fileSearch retries with max_results when requested by API', async () => {
  const fetchCalls = [];
  const fetchMock = mock.method(global, 'fetch', async (url, init = {}) => {
    fetchCalls.push({ url, init });
    if (fetchCalls.length === 1) {
      return makeResponse('max_results must be provided', 400);
    }
    return makeResponse({ results: [{ id: 'doc-3' }] });
  });

  try {
    const result = await fileSearch({ query: 'catalog cable' });

    assert.deepStrictEqual(result, { results: [{ id: 'doc-3' }] });
    assert.strictEqual(fetchCalls.length, 2);

    const firstBody = JSON.parse(fetchCalls[0].init.body);
    assert.deepStrictEqual(firstBody, { query: 'catalog cable' });

    const secondBody = JSON.parse(fetchCalls[1].init.body);
    assert.strictEqual(secondBody.max_results, 10);
    assert.ok(!('limit' in secondBody));
  } finally {
    fetchMock.mock.restore();
  }
});

if (originalApiKey === undefined) {
  delete process.env.OPENAI_API_KEY;
} else {
  process.env.OPENAI_API_KEY = originalApiKey;
}
