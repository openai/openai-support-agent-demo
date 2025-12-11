const assert = require('assert');
const test = require('node:test');

function parseToolCallJson(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith('{')) return null;
  try {
    const obj = JSON.parse(trimmed);
    if (obj && typeof obj.name === 'string') {
      return { name: obj.name, parameters: obj.parameters };
    }
  } catch {
    return null;
  }
  return null;
}

function runParse(content) {
  const chatMessages = [];
  const conversationItems = [];
  const parsed = parseToolCallJson(content);
  if (parsed) {
    const id = 'test';
    const argStr = parsed.parameters ? JSON.stringify(parsed.parameters) : '';
    chatMessages.push({
      type: 'tool_call',
      tool_type: 'function_call',
      status: 'in_progress',
      id,
      name: parsed.name,
      arguments: argStr,
      parsedArguments: parsed.parameters ?? {},
      output: null,
    });
    conversationItems.push({
      type: 'function_call',
      role: 'assistant',
      id,
      name: parsed.name,
      arguments: argStr,
    });
  }
  return { parsed, chatMessages, conversationItems };
}

function processOutputTextDone(content) {
  let suggestedMessage = { text: 'placeholder' };
  const { parsed, chatMessages, conversationItems } = runParse(content);
  if (parsed) {
    suggestedMessage = null;
  }
  return { parsed, chatMessages, conversationItems, suggestedMessage };
}

test('parseToolCallJson detects valid JSON', () => {
  const text = '{"name":"search_knowledge_base","parameters":{"query":"foo"}}';
  const { parsed } = runParse(text);
  assert.ok(parsed);
  assert.strictEqual(parsed.name, 'search_knowledge_base');
});

test('parseToolCallJson ignores non JSON', () => {
  const { parsed } = runParse('Hello world');
  assert.strictEqual(parsed, null);
});

test('suggestedMessage cleared after tool call', () => {
  const text = '{"name":"search_knowledge_base","parameters":{"query":"bar"}}';
  const { parsed, chatMessages, conversationItems, suggestedMessage } =
    processOutputTextDone(text);
  assert.ok(parsed);
  assert.strictEqual(chatMessages.length, 1);
  assert.strictEqual(conversationItems.length, 1);
  assert.strictEqual(suggestedMessage, null);
});

test('emailRefusalRegex detects common refusal phrases', () => {
  const emailRefusalRegex = new RegExp(
    [
      "don['’]?t feel comfortable giving (?:you )?my e[-\\s]?mail(?: address)?",
      "i don['’]?t want to",
      "i can['’]?t provide (?:that info(?:rmation)?|my e[-\\s]?mail(?: address)?)",
      "no[,\\s]*i won['’]?t",
    ].join('|'),
    'i',
  );
  assert.ok(emailRefusalRegex.test("No I won't"));
  assert.ok(emailRefusalRegex.test("I don't want to"));
  assert.ok(emailRefusalRegex.test("I can't provide that info"));
  assert.ok(
    emailRefusalRegex.test(
      "I don't feel comfortable giving you my email address"
    )
  );
  assert.ok(
    emailRefusalRegex.test("I can't provide my e-mail address")
  );
});

test('ticket regex matches ticket ID', () => {
  const ticketRegex = /#\d+\/\d{4}-\d{2}-\d{2}/;
  assert.ok('#12345/2024-01-01'.match(ticketRegex));
});

test('DEVELOPER_PROMPT mentions ticket workflow', () => {
  const { DEVELOPER_PROMPT } = require('../config/constants');
  assert.match(
    DEVELOPER_PROMPT,
    /identify customers by either an email address or a ticket ID/i
  );
  assert.match(DEVELOPER_PROMPT, /inform the customer of the ticket ID/i);
});

test('handleTurn prefixes ticket system message', async () => {
  const { handleTurn } = require('../lib/assistant');
  const useDataStore = require('../stores/useDataStore').default;
  const originalFetch = global.fetch;
  let body;
  global.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return new Response('data: [DONE]\n\n', {
      headers: { 'Content-Type': 'text/plain' },
      status: 200,
    });
  };
  try {
    useDataStore.setState({
      contactType: 'ticket',
      contactId: 'TICK123',
      summary: null,
      longSummary: null,
    });
    const messages = [
      { role: 'user', content: [{ type: 'input_text', text: 'hello' }] },
    ];
    await handleTurn(messages, () => {});
    assert.strictEqual(body.messages[0].role, 'system');
    assert.match(body.messages[0].content[0].text, /TICK123/);
  } finally {
    global.fetch = originalFetch;
    useDataStore.setState({
      contactType: null,
      contactId: null,
      summary: null,
      longSummary: null,
    });
  }
});

test('handleTurn prefixes summary before ticket message', async () => {
  const { handleTurn } = require('../lib/assistant');
  const useDataStore = require('../stores/useDataStore').default;
  const originalFetch = global.fetch;
  let body;
  global.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return new Response('data: [DONE]\n\n', {
      headers: { 'Content-Type': 'text/plain' },
      status: 200,
    });
  };
  try {
    useDataStore.setState({
      contactType: 'ticket',
      contactId: 'TICK123',
      summary: 'old summary',
      longSummary: null,
    });
    const messages = [
      { role: 'user', content: [{ type: 'input_text', text: 'hello' }] },
    ];
    await handleTurn(messages, () => {});
    assert.strictEqual(body.messages[0].role, 'system');
    assert.match(
      body.messages[0].content[0].text,
      /Previous conversation summary: old summary/
    );
    assert.strictEqual(body.messages[1].role, 'system');
    assert.match(body.messages[1].content[0].text, /TICK123/);
  } finally {
    global.fetch = originalFetch;
    useDataStore.setState({
      contactType: null,
      contactId: null,
      summary: null,
      longSummary: null,
    });
  }
});

test('handleTurn includes long summary before session summary and ticket message', async () => {
  const { handleTurn } = require('../lib/assistant');
  const useDataStore = require('../stores/useDataStore').default;
  const originalFetch = global.fetch;
  let body;
  global.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return new Response('data: [DONE]\n\n', {
      headers: { 'Content-Type': 'text/plain' },
      status: 200,
    });
  };
  try {
    useDataStore.setState({
      contactType: 'ticket',
      contactId: 'TICK123',
      summary: 'old summary',
      longSummary: 'prefs',
    });
    const messages = [
      { role: 'user', content: [{ type: 'input_text', text: 'hello' }] },
    ];
    await handleTurn(messages, () => {});
    assert.strictEqual(body.messages[0].role, 'system');
    assert.match(body.messages[0].content[0].text, /prefs/);
    assert.match(body.messages[1].content[0].text, /old summary/);
    assert.match(body.messages[2].content[0].text, /TICK123/);
  } finally {
    global.fetch = originalFetch;
    useDataStore.setState({
      contactType: null,
      contactId: null,
      summary: null,
      longSummary: null,
    });
  }
});

test('create_ticket sends empty body when using placeholder ID', async () => {
  const { processMessages } = require('../lib/assistant');
  const { CUSTOMER_DETAILS } = require('../config/demoData');
  const useDataStore = require('../stores/useDataStore').default;
  const useConversationStore = require('../stores/useConversationStore').default;
  const originalFetch = global.fetch;
  let ticketBody;
  global.fetch = async (url, options = {}) => {
    if (url === '/api/tickets/create') {
      ticketBody = options.body;
      return new Response('{"ticket_id":"T1"}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (url === '/api/sessions/start') {
      return new Response('{}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (url === '/api/turn_response') {
      return new Response('data: [DONE]\n\n', {
        headers: { 'Content-Type': 'text/plain' },
        status: 200,
      });
    }
    return originalFetch(url, options);
  };

  try {
    useDataStore.setState({
      contactType: null,
      contactId: null,
      emailRefused: false,
      customerDetails: { id: CUSTOMER_DETAILS.id },
      longSummary: null,
    });
    useConversationStore.setState({
      conversationItems: [
        { role: 'user', content: 'No, I won\'t provide that info' },
      ],
    });
    await processMessages();
    assert.strictEqual(ticketBody, '{}');
  } finally {
    global.fetch = originalFetch;
  }
});

test('create_ticket still sends empty body when profile updated', async () => {
  const { processMessages } = require('../lib/assistant');
  const useDataStore = require('../stores/useDataStore').default;
  const useConversationStore = require('../stores/useConversationStore').default;
  const originalFetch = global.fetch;
  let ticketBody;
  global.fetch = async (url, options = {}) => {
    if (url === '/api/tickets/create') {
      ticketBody = options.body;
      return new Response('{"ticket_id":"T1"}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (url === '/api/sessions/start') {
      return new Response('{}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (url === '/api/turn_response') {
      return new Response('data: [DONE]\n\n', {
        headers: { 'Content-Type': 'text/plain' },
        status: 200,
      });
    }
    return originalFetch(url, options);
  };

  try {
    useDataStore.setState({
      contactType: null,
      contactId: null,
      emailRefused: false,
      customerDetails: { id: 'cus_real' },
      longSummary: null,
    });
    useConversationStore.setState({
      conversationItems: [
        { role: 'user', content: 'No, I won\'t provide that info' },
      ],
    });
    await processMessages();
    assert.strictEqual(ticketBody, '{}');
  } finally {
    global.fetch = originalFetch;
  }
});

test('start_chat_session triggered by ticket ID', async () => {
  const { processMessages } = require('../lib/assistant');
  const useDataStore = require('../stores/useDataStore').default;
  const useConversationStore = require('../stores/useConversationStore').default;
  const originalFetch = global.fetch;
  let sessionBody;
  global.fetch = async (url, options = {}) => {
    if (url === '/api/sessions/start') {
      sessionBody = options.body;
      return new Response('{"user":{},"session":{"summary":"old summary"}}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    if (url === '/api/turn_response') {
      return new Response('data: [DONE]\n\n', {
        headers: { 'Content-Type': 'text/plain' },
        status: 200,
      });
    }
    return originalFetch(url, options);
  };

  try {
    useDataStore.setState({
      contactType: null,
      contactId: null,
      summary: null,
      longSummary: null,
    });
    useConversationStore.setState({
      conversationItems: [
        { role: 'user', content: '#12345/2024-01-01' },
      ],
    });
    await processMessages();
    assert.strictEqual(
      sessionBody,
      '{"email":"#12345/2024-01-01","ticket_id":"#12345/2024-01-01"}'
    );
    const state = useDataStore.getState();
    assert.strictEqual(state.contactType, 'ticket');
    assert.strictEqual(state.contactId, '#12345/2024-01-01');
    assert.strictEqual(state.summary, 'old summary');
  } finally {
    global.fetch = originalFetch;
    useDataStore.setState({
      contactType: null,
      contactId: null,
      summary: null,
      longSummary: null,
    });
  }
});

test('start_chat_session returns long summary', async () => {
  const { start_chat_session } = require('../config/functions');
  const originalFetch = global.fetch;
  global.fetch = async (url, options = {}) => {
    if (url === '/api/sessions/start') {
      return new Response('{"user":{"longSummary":"prefs"},"session":{}}', {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    return originalFetch(url, options);
  };
  try {
    const res = await start_chat_session({ email: 'foo@example.com' });
    assert.strictEqual(res.longSummary, 'prefs');
  } finally {
    global.fetch = originalFetch;
    const useDataStore = require('../stores/useDataStore').default;
    useDataStore.setState({ longSummary: null });
  }
});
