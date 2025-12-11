const assert = require('assert');
const test = require('node:test');

require('ts-node/register/transpile-only');
require('../scripts/register-tsconfig-paths.js');

test('tool catalog includes set_reply_reference', () => {
  const { toolsList } = require('../config/tools-list.ts');
  const { tools, ollamaTools, functionToolNames } = require('../lib/tools/tools.ts');
  const { functionsMap, set_reply_reference } = require('../config/functions.ts');

  assert.ok(
    toolsList.some(
      (tool) => tool?.function?.name === 'set_reply_reference'
    ),
    'toolsList should include set_reply_reference'
  );

  assert.ok(
    functionToolNames.includes('set_reply_reference'),
    'functionToolNames should include set_reply_reference'
  );

  const openaiHasTool = tools.some(
    (tool) =>
      tool?.type === 'function' && tool.function?.name === 'set_reply_reference'
  );
  assert.ok(openaiHasTool, 'tools should include set_reply_reference');

  const ollamaHasTool = ollamaTools.some(
    (tool) => tool?.function?.name === 'set_reply_reference'
  );
  assert.ok(ollamaHasTool, 'ollamaTools should include set_reply_reference');

  assert.strictEqual(
    typeof functionsMap.set_reply_reference,
    'function',
    'functionsMap should expose set_reply_reference'
  );

  assert.strictEqual(
    typeof set_reply_reference,
    'function',
    'set_reply_reference export should be a function'
  );
});

test('set_reply_reference returns provided arguments', async () => {
  const { set_reply_reference } = require('../config/functions.ts');

  const input = { message_id: 123, use_quotes: false, reason: 'duplicate thread' };
  const result = await set_reply_reference(input);
  assert.deepStrictEqual(result, input);

  const skipQuotingInput = { use_quotes: false };
  const skipQuotingResult = await set_reply_reference(skipQuotingInput);
  assert.deepStrictEqual(skipQuotingResult, skipQuotingInput);
});
