const assert = require('assert');
const test = require('node:test');
const { estimateMessageTokens } = require('../lib/utils/tokenCounter.ts');
const { getEncoding } = require('js-tiktoken');

test('estimateMessageTokens falls back to generic encoding on unknown model', () => {
  const messages = [{ role: 'user', content: [{ type: 'input_text', text: 'hello' }] }];
  const expected = getEncoding('cl100k_base').encode('hello').length;
  const count = estimateMessageTokens(messages, 'unknown-model');
  assert.strictEqual(count, expected);
});

test('estimateMessageTokens maps Ollama models to base encodings', () => {
  const messages = [{ role: 'user', content: [{ type: 'input_text', text: 'world' }] }];
  const expected = getEncoding('cl100k_base').encode('world').length;
  const count = estimateMessageTokens(messages, 'llama3.1:8b');
  assert.strictEqual(count, expected);
});
