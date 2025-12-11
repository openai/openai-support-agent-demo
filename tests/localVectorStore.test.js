const test = require('node:test');
const assert = require('assert');
const { localVectorStore } = require('../lib/localVectorStore');

function setupStore(embeddings) {
  localVectorStore.store = embeddings.map((embedding, idx) => ({
    id: String(idx),
    embedding,
    text: `text${idx}`,
    attributes: { type: 't', filename: 'f', filepath: 'p' },
  }));
  localVectorStore.loaded = true;
  localVectorStore.embedding = async () => [1, 0];
}

test('defaults to 10 results when limit is non-positive', async () => {
  const embeddings = Array.from({ length: 10 }, () => [1, 0]);
  setupStore(embeddings);
  const results = await localVectorStore.search('q', { limit: -3, topKOnly: true });
  assert.strictEqual(results.length, 10, 'defaults to 10 results');
});

test('defaults to 10 results when limit is non-integer', async () => {
  const embeddings = Array.from({ length: 10 }, () => [1, 0]);
  setupStore(embeddings);
  const results = await localVectorStore.search('q', { limit: 2.7, topKOnly: true });
  assert.strictEqual(results.length, 10, 'defaults to 10 results');
});

test('clamps threshold above 1 to 1', async () => {
  const embeddings = [
    [1, 0],
    ...Array.from({ length: 5 }, () => [0, 1]),
  ];
  setupStore(embeddings);
  const results = await localVectorStore.search('q', { threshold: 2, limit: 10 });
  assert.strictEqual(results.length, 1);
});

test('clamps threshold below -1 to -1', async () => {
  const embeddings = [
    [1, 0],
    [-1, 0],
    ...Array.from({ length: 3 }, () => [0, 1]),
  ];
  setupStore(embeddings);
  const results = await localVectorStore.search('q', { threshold: -2, limit: 10 });
  assert.strictEqual(results.length, embeddings.length);
});
