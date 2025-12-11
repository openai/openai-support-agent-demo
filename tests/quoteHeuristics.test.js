const assert = require('assert');
const { test } = require('node:test');

const { shouldQuoteInboundMessage } = require('../lib/quoteHeuristics.ts');

test('shouldQuoteInboundMessage flags short acknowledgements', () => {
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'Yes', referencedMessageId: 123 }),
    true
  );
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'Same question' }),
    true
  );
});

test('shouldQuoteInboundMessage detects pronoun heavy replies', () => {
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'This issue', referencedMessageId: 5 }),
    true
  );
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'That one is broken' }),
    true
  );
});

test('shouldQuoteInboundMessage matches duplicates', () => {
  const history = [
    { role: 'assistant', content: 'How can I help?' },
    { role: 'user', content: 'My login fails' },
  ];
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'My login fails', history }),
    true
  );
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'Different question', history }),
    false
  );
});

test('shouldQuoteInboundMessage stays false for unrelated messages', () => {
  assert.strictEqual(
    shouldQuoteInboundMessage({ messageText: 'Here are the details you requested earlier.' }),
    false
  );
});
