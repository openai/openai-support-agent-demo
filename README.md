# Customer Support Agent with Human in the Loop Demo

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![NextJS](https://img.shields.io/badge/Built_with-NextJS-blue)
![OpenAI API](https://img.shields.io/badge/Powered_by-OpenAI_API-orange)

This repository contains a NextJS demo app of a Customer Service with a Human in the loop (HITL) use case built on top of the [Responses API](https://platform.openai.com/docs/api-reference/responses).
It leverages the [file search](https://platform.openai.com/docs/guides/tools-file-search) built-in tool and implements 2 views of a chat interface: one for the customer, and one for the human agent.

This demo is an example flow where a human agent would be assisted by an AI agent to answer customer questions, while staying in control of sensitive actions.

![screenshot](./public/screenshot.jpg)

Features:

- Multi-turn conversation handling
- File search tool
- Vector store creation & file upload for use with the file search
- Knowledge base display
- Function calling
- Streaming suggested responses
- Suggested actions to execute tool calls
- Auto-execution of tool calls for non-sensitive actions
- Optional auto reply mode to automatically send suggested messages
- Filters out irrelevant questions and jailbreaking attempts
- Idle sessions auto-close after 4 minutes, sending unsaved messages and marking the session as ended
- Works with either `openai` or `ollama` providers. The built-in tools operate
  the same with both.

Feel free to customize this demo to suit your specific use case.

## Project structure

- `app/` for Next.js routes & API handlers
- `components/` for UI components
- `stores/` for state management (e.g., `useConversationStore`)
- `scripts/` for maintenance tasks like `cleanupSessions.ts`
- `prisma/` for schema & migrations, etc.

## Docker Quickstart

Copy [`.env.ai`](./.env.ai), adjust credentials or port mappings, and add your `AGENT_TOKENS` mapping. This file is used when running the container.

The easiest way to run the entire stack with the baked-in port mappings is:

```bash
docker compose -f docker-compose.agent.yml up --build
```

The `ai-agent` image provisions the crawler Python environments during the
build and activates them at container startup so scrape jobs can run without
extra shell setup.

The steps below show how to build and run each container manually.

1. **Build the image**

   ```bash
   docker build -t ai-agent .
   ```

2. **Create a network and start PostgreSQL and Redis on free ports**

   ```bash
   docker network create support-net
   docker run --rm -d --name demo-db --network support-net -e POSTGRES_PASSWORD=postgres -p 5433:5432 postgres
   docker run --rm -d --name demo-redis --network support-net -p 6380:6379 redis
   ```

3. **Run the AI agent**

   ```bash
   docker run --rm -p 3001:3001 --network support-net --env-file .env.ai \
     -e DATABASE_URL=postgresql://postgres:postgres@demo-db:5432/support_agent_demo \
     -e REDIS_URL=redis://demo-redis:6379 ai-agent
   ```

## Troubleshooting

- **`P1001: Can't reach database server`** – verify container names/ports and ensure the `support-net` network exists.
- **`P1000: Authentication failed`** – check the database credentials in [`.env.ai`](./.env.ai).
- **`network support-net not found`** – create the network first: `docker network create support-net`.
- **`port already allocated`** – choose unused host ports or stop conflicting services.
- **`P3015: Could not find the migration file at migration.sql` during `ai-agent` startup** – rebuild the image without cache so the Prisma migrations are baked into the container, then verify the SQL files exist and rerun the deploy:

  ```bash
  docker compose build --no-cache ai-agent
  docker compose run --rm ai-agent sh -c "ls /app/prisma/migrations/*/migration.sql"
  docker compose run --rm ai-agent sh -c "npx prisma migrate deploy"
  ```

  If you are bind-mounting `/app/prisma/migrations`, remove or repopulate that mount so Prisma can read every `migration.sql`.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   Create a `.env` file with your database connection string, Redis URL, session retention setting, and (optionally) Chatwoot credentials:

   ```bash
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>"
   REDIS_URL=redis://localhost:6379
   SESSION_RETENTION_DAYS=30 # How many days to retain ended sessions
   CHATWOOT_URL=https://e245e7cb03bc.ngrok-free.app
   CHATWOOT_APP_TOKEN=<chatwoot-app-token>
   CHATWOOT_BOT_TOKEN=<bot access token>
   AGENT_TOKENS='{"1":"agent-1-secret","2":"agent-2-secret"}'
  ```

When running this service inside Docker, copy the same `AGENT_TOKENS` mapping into `.env.ai`.

When running this service inside Docker, `CHATWOOT_URL` must be a fully
qualified address reachable from the container (for example, a public
ngrok or Cloudflare Tunnel URL) so that the agent can resolve the
Chatwoot instance.

If Redis runs on a dynamically mapped port (e.g. `docker port` or `docker compose port`), first determine the host port and then point `REDIS_URL` to it:

   ```bash
   docker compose port redis 6379
   # or: docker port <container_name> 6379
   # Suppose it prints 0.0.0.0:49153
   REDIS_URL=redis://localhost:49153
   ```

   `SESSION_RETENTION_DAYS` controls how long ended sessions are kept before cleanup (defaults to 30 days).
   Session messages cached in Redis are retained indefinitely until the session is cleaned up.
    The Chatwoot variables configure the webhook endpoints to send automated replies and handle status changes in your Chatwoot instance.
    Create two webhooks in Chatwoot:
    - `http://ai-agent:3001/api/chatwoot-webhook` subscribed only to `message_created`.
    - `http://ai-agent:3001/api/chatwoot-status-webhook` subscribed to `conversation_status_changed`, `conversation_updated`, and `message_created` (system events).

    Release retries for these endpoints are controlled by `RELEASE_MAX_ATTEMPTS`, `RELEASE_RETRY_BASE_MS`, and `CHATWOOT_TIMEOUT_MS`.

    **Attachment handling.** Incoming Chatwoot messages may include attachments on `message.attachments` or inside `content_attributes`.
    The webhook normalizes these entries before building the provider request:

    - If the configured model supports vision (e.g. `gpt-4o`, `gpt-4.1`, or any model listed via `CHATWOOT_WEBHOOK_MODEL` that includes the substrings `4o`, `4.1`, `o1`, `o3`, or `omni`), image attachments are forwarded to the provider as `input_image` parts. URLs or embedded data URIs are passed through so the model can inspect the image content directly.
    - For other models, the webhook appends a textual note that lists each attachment, its MIME type when available, and its download URL or indicates when only base64 data is present. This ensures agents are aware of additional context even when the model cannot open the file itself.
    - When an inbound message only includes image attachments (no textual content), the webhook skips the relevance guardrail so customers do not receive unnecessary clarification prompts. After deploying, monitor your logs for the `Skipping relevance guardrail for image-only attachment message` entry to confirm the behavior is active.
    - Whenever an image is present, the webhook now routes the attachment through a lightweight image-understanding pass (default model `CHATWOOT_IMAGE_MODEL` or `gpt-4.1-mini`). The analysis produces catalog-ready descriptors, suggested queries, and top matches from the knowledge base so the assistant can contrast alternatives without asking the customer for more detail. The generated summary is appended to the user turn and a developer message shares the ranked matches with the model.
    - Tune the helper with:
      - `CHATWOOT_IMAGE_MODEL` to select the OpenAI vision model used for analysis.
      - `CHATWOOT_IMAGE_SEARCH_PROVIDER` to override the provider used when searching the knowledge base (defaults to the webhook provider).
      - `CHATWOOT_IMAGE_KB_LIMIT` to cap the number of knowledge base snippets injected into the prompt (defaults to 3).
    - Image-related logs now include an `Image insight queries` entry showing the normalized search terms used to interrogate the knowledge base. Track this log to validate catalog coverage and iterate on tagging when matches are sparse.

    You can override the attachment detection model by setting `CHATWOOT_WEBHOOK_MODEL`; otherwise the default falls back to the global `MODEL` configured for the provider.

    The `AGENT_TOKENS` environment variable supplies per-agent access tokens in JSON form, e.g. `{ "1": "secret" }`. Store these secrets outside of source control (such as a `.env` file or your hosting platform's secret manager). To rotate a token, update the JSON with the new value and redeploy or restart the service so it reads the updated mapping.

    #### Release retry settings

   - `RELEASE_MAX_ATTEMPTS` (default `5`) – number of retry attempts when releasing an agent fails.
   - `RELEASE_RETRY_BASE_MS` (default `1000`) – base delay for exponential backoff.
   - `CHATWOOT_TIMEOUT_MS` (default `15000`) – API request timeout before retries.

   #### Queue processing

   - `CHATWOOT_QUEUE_CONCURRENCY` (default `1`) – maximum number of Chatwoot webhook jobs the worker executes in parallel. Increase this value (for example, to match available CPU cores) to handle multiple conversations simultaneously. Jobs from the same conversation always run sequentially so replies stay in order, even when concurrency is greater than `1`.
   - `CHATWOOT_QUEUE_MAX_ATTEMPTS` (default `3`) – maximum number of times the worker retries a webhook job when a retryable error occurs before surfacing a failure.
   - `CHATWOOT_QUEUE_RETRY_BASE_DELAY_MS` (default `1000`) – base delay in milliseconds before retrying a failed job; exponential backoff is applied using the factor below and is capped by the max delay.
   - `CHATWOOT_QUEUE_RETRY_BACKOFF_FACTOR` (default `2`) – multiplier used to increase the retry delay after each attempt (e.g. `base * factor^(attempt-1)`).
   - `CHATWOOT_QUEUE_RETRY_MAX_DELAY_MS` (default `30000`) – upper bound on the delay between retries to prevent excessive waiting when exponential backoff grows.
   - `CHATWOOT_QUEUE_JOB_TIMEOUT_MS` (default `120000`) – maximum time a single job is allowed to run before the worker aborts the attempt and retries (if retries remain).

   A standalone Docker setup is available to test the service in isolation:

   ```bash
   docker compose -f docker-compose.agent.yml up --build
   ```

   This starts the AI agent on `http://localhost:3001` along with PostgreSQL, Redis, and Ollama.
   The `ai-agent` container mounts the host directories `./logs/scrape_jobs` (job logs) and
   `./public/knowledge_base` (scraped artifacts) so logs and outputs persist across rebuilds.

3. **Run database migrations:**

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Start Redis and the app:**

   Start a Redis server (e.g. `redis-server` or `docker run -p 6379:6379 redis`) and then run:

   ```bash
   npm run dev
   ```

5. **Ticket IDs in chats:**

   When a customer does not share an email, the `create_ticket` tool generates a ticket ID in the format `#<index>/<date>` (for example `#1/2024-05-01`). The ID is stored with the chat session so the conversation can be resumed later using that ticket number.

## Provider limiter observability

The shared provider limiter (used by OpenAI, Ollama, and the Ollama-compatible OpenAI interface) exposes real-time metrics so you can monitor queue health and tune concurrency or token budgets. Attach an observer early during application startup:

```ts
import { setLimiterObserver } from "@/lib/providers/limiter";

setLimiterObserver((event) => {
  // event.type is one of: "enqueued", "started", "completed", "throttled"
  // Persist to logs, send to Prometheus/StatsD, etc.
  console.log("provider limiter", event);
});
```

Each callback receives a `LimiterMetricsEvent` with the provider name, current queue length, running job count, wait time, and any throttle delays. When integrating with an observability platform:

- **Structured logging:** Forward the event to your logger (e.g., `pino`, `winston`) and index by `provider` and `type` so operators can investigate spikes in queue length or throttling.
- **Metrics collectors:** Translate events into counters/histograms (e.g., increment a `limiter_jobs_started_total` counter or record `waitMs` in a latency histogram) before shipping them to Prometheus, Datadog, or another APM.
- **Alerting:** Define alerts on sustained queue lengths or throttle delays exceeding your SLO to catch quota regressions early.

Set the observer to `undefined` (via `setLimiterObserver(undefined)`) when you need to disable reporting, such as in unit tests.

## Agent release workflow

Releases are triggered only when a conversation moves from `open` to either `pending` or `resolved` **and** still carries the `agent-assigned` label. The `chatwoot-status-webhook` checks for this combination before calling `releaseAgent`. Inside `releaseAgent`, the label is removed, which generates additional webhook events to handle follow-up processing.

Retry behavior for this release process is governed by the `RELEASE_MAX_ATTEMPTS`, `RELEASE_RETRY_BASE_MS`, and `CHATWOOT_TIMEOUT_MS` environment variables.

## How to use

1. **Set up the OpenAI API:**

   - If you're new to the OpenAI API, [sign up for an account](https://platform.openai.com/signup).
   - Follow the [Quickstart](https://platform.openai.com/docs/quickstart) to retrieve your API key.

2. **Clone the Repository:**

   ```bash
   git clone https://github.com/openai/openai-support-agent-demo.git
   ```

3. **Set the OpenAI API key:**

   2 options:

   - Set the `OPENAI_API_KEY` environment variable [globally in your system](https://platform.openai.com/docs/libraries#create-and-export-an-api-key)
   - Set the `OPENAI_API_KEY` environment variable in the project: Create a `.env` file at the root of the project and add the following line (see `.env.example` for reference):

   ```bash
   OPENAI_API_KEY=<your_api_key>
   ```

   **Note:** File search uses the OpenAI vector store when the provider is set
   to `openai`. When using the `ollama` provider, search falls back to a local
   vector store built from the knowledge base using Ollama's `embeddings`
   endpoint. You can keep both stores initialized and switch providers at any
   time.

4. **Choose your provider (optional):**

   The assistant can run using the `openai` API, the `ollama` package, or
   Ollama's OpenAI compatible endpoint. You can switch providers from the
   dropdown next to **Auto reply** in the agent view. When selecting either
   `ollama` or `ollama-openai`, make sure you have an Ollama server running
   locally (e.g. by executing `ollama serve`). The built-in tools work the same
   with all providers.

## Running Ollama

When using the `ollama` provider you need a local server running.

1. Start the server:

   ```bash
   ollama serve
   ```

2. Begin with a lightweight model such as `llama3`:

   ```bash
   ollama run llama3
   ```

   The command downloads the model if needed. Use `ollama run <model>` or `ollama pull <model>` to get other models.

3. After installing multiple models, switch between them using the **Model** dropdown in the agent view. Ensure the provider dropdown is set to `ollama`.

4. (Optional) Configure the default model and context size by adding the following variables to your `.env` file (see `.env.example`):

   ```bash
   OLLAMA_MODEL=llama3.2
   OLLAMA_NUM_CTX=32768
   OLLAMA_HOST=http://localhost:11434
   ```

   To enable the OpenAI compatible endpoint, also set:

   ```bash
   OLLAMA_OPENAI_BASE_URL=http://localhost:11434/v1
   OLLAMA_OPENAI_API_KEY=ollama
   ```

5. **Install dependencies:**

   Run in the project root:

   ```bash
   npm install
   ```

   You must run this command before executing `npm run lint` or `npm run dev`.

6. **Run the app:**

   Use a single terminal to run the Next.js dev server plus both workers (scheduler
   and scraper):

   ```bash
   npm run dev:all
   ```

   You can still run the web server alone with `npm run dev`. After building,
   start the production server and both workers together via `npm run
   start:all`.

   The app will be available at [`http://localhost:3000`](http://localhost:3000).

### Developing through a Cloudflare Tunnel

When exposing the dev server via a Cloudflare Tunnel, configure HMR to point at the
tunnel hostname so Webpack dev chunks load reliably:

```bash
# .env.local
NEXT_WEBPACK_HMR_SOCKET_HOSTNAME=<your-tunnel-hostname>
# Optionally align protocol/port if you terminate TLS elsewhere:
# NEXT_WEBPACK_HMR_SOCKET_PORT=443
# NEXT_WEBPACK_HMR_SOCKET_PROTOCOL=https
```

If the tunnel still drops HMR/chunk requests, fall back to running a production
build served through the tunnel instead of `npm run dev`:

```bash
npm run build
npm run start
```

7. **Initialize the vector store:**

   Visit [`/init_vs`](http://localhost:3000/init_vs) where you can create both
   OpenAI and Ollama vector stores.

   - **Initialize OpenAI vector store**: click the <kbd>OpenAI</kbd> button. Copy
     the returned vector store ID and paste it into
     `config/constants.ts` as `VECTOR_STORE_ID`.
  - **Initialize Ollama vector store**: click the <kbd>Ollama</kbd> button to
    generate embeddings locally. This stores the embeddings in the
    `data/local_vector_store.json` file.
  - **Rebuild Ollama vector store**: click the <kbd>Rebuild Ollama</kbd> button
    on the same page to regenerate embeddings after updating the knowledge base
    (this calls `/api/local_vector_store/init?force=true`).

   The OpenAI vector store will be used when the provider is set to `openai`
   while the local store powers file search when using the `ollama` provider.
   Both stores can exist side by side.

  By default, searches return up to 10 results. Local search applies a cosine
  similarity threshold of 0.3. Provide a `limit` option to control the number of results,
  a `threshold` option to adjust the cutoff, or set `topKOnly: true` to ignore
  the threshold and rely solely on the highest scoring `limit` matches.

   Before running the crawling scripts, bootstrap their Python environments and
   shared configuration:

  ```bash
  # Optional: edit .env.scrapers to point at your sitemap roots/categories
  ./scripts/setup_crawler_envs.sh
  ```

  The setup command provisions `.venv-c4ai-v1` for
  `crawl4AI-agent/requirements.txt` and `.venv-c4ai-v2` for
  `crawl4AI-agent-v2/requirements.txt`, then injects a hook into every
  activation script (`bin/activate`, `Scripts/activate`,
  `Scripts/activate.bat`, and `Scripts/Activate.ps1`) so `.env.scrapers` is
  sourced each time you activate either environment. Editing `.env.scrapers`
  therefore changes values like `AUTOMATION_BASE_URL` or `WOOCOMMERCE_API_BASE`
  for the next shell session without re-running the helper. During creation
  the script also installs Playwright’s Chromium build inside each environment,
  using `--with-deps` automatically on Linux and the regular `install chromium`
  command on Windows/macOS so headless `AsyncWebCrawler` launches succeed on
  every OS.

  - **Windows PowerShell activation:** after running the setup helper from WSL
    or Git Bash, you can activate either crawler environment in PowerShell
    using `./.venv-c4ai-v1/Scripts/Activate.ps1` or
    `./.venv-c4ai-v2/Scripts/Activate.ps1`. The hook injected by the helper
    ensures `.env.scrapers` loads automatically. On WSL/Docker, use
    `source .venv-c4ai-v2/bin/activate` (or the v1 path) and the Docker
    entrypoint activates the venv before launching the app so `python` already
    points at the crawler toolchain inside containers.

  **Choosing the python interpreter for scrape jobs.** The runner spawns the
  crawler via `SCRAPE_WORKER_PYTHON` (falls back to `PYTHON` and then the
  system `python`). Point this variable at the interpreter inside the venv that
  contains the crawler dependencies—not an activation script. Examples:

  - Windows v1: `SCRAPE_WORKER_PYTHON=C:\\Users\\you\\openai-support-agent-demo\\.venv-c4ai-v1\\Scripts\\python.exe`
  - Windows v2: `SCRAPE_WORKER_PYTHON=C:\\Users\\you\\openai-support-agent-demo\\.venv-c4ai-v2\\Scripts\\python.exe`
  - Linux/macOS v1: `SCRAPE_WORKER_PYTHON=/workspace/openai-support-agent-demo/.venv-c4ai-v1/bin/python`
  - Linux/macOS v2: `SCRAPE_WORKER_PYTHON=/workspace/openai-support-agent-demo/.venv-c4ai-v2/bin/python`

  If the variable points to `activate`/`Activate.ps1` or a missing path, the
  runner logs a clear warning and will fall back to other candidates.

  - You can cap long-running crawls with `SCRAPE_TIMEOUT_MS` (default **2 hours**).
    When exceeded, the child process is killed, the job is marked `failed`, and
    the timeout is logged. The timer resets whenever output is produced, and
    periodic activity probes keep long-but-active runs alive.
  - The runner forces unbuffered Python output (`-u` + `PYTHONUNBUFFERED=1`)
    so job logs stream live into the UI while the scraper runs.
  - If `crawl4ai` is missing, the runner will now attempt a one-time
    `pip install -r crawl4AI-agent-v2/requirements.txt` with the selected
    interpreter. Set `SCRAPE_AUTO_INSTALL_DEPS=false` to disable this and keep
    the previous fail-fast behavior.
  - The dependency preflight logs the interpreter it is using (including
    `sys.executable`, Python version, and `sys.path`) before attempting the
    `crawl4ai` import. This makes it clear whether the runner is invoking a
    Windows `Scripts/python.exe` path or a POSIX `bin/python` path.
  - Set `SCRAPE_SKIP_DEP_CHECK=true` to bypass the preflight `import crawl4ai`
    probe if you trust the interpreter; the runner will still log the
    interpreter context and then continue without failing early. If the
    preflight runs, it will log both the import failure output and `pip show`
    details before attempting (optional) auto-install, so you can see which
    environment to fix.

  Every crawler example (both `crawl4AI-agent` and `crawl4AI-agent-v2`) now
  writes Markdown into `public/knowledge_base`, so once you activate a venv and
  run something like `python crawl4AI-agent/crawl4AI-examples/2-crawl_docs_sequential.py`
  the resulting `.md` files land next to the rest of the RAG assets without any
  manual copying. The directory is created automatically if it doesn’t already
  exist.

## Scrape job scheduling

Scrape jobs can now be scheduled to run on a cadence. Each job stores its
`cadence` (`daily`, `weekly`, `monthly`, or `manual`), a `paused` flag, and the
`nextRunAt` timestamp used to prevent overlap. The scheduler only enqueues jobs
when `nextRunAt` is due, and rescheduling a job sets the next timestamp based on
its cadence once a run finishes.

- **Using OS cron**: deploy a cron entry that calls the API directly. Examples:

  ```cron
  0 0 * * * curl -X POST https://your-host/api/scrape_jobs/run-now?schedule=daily
  0 0 * * 0 curl -X POST https://your-host/api/scrape_jobs/run-now?schedule=weekly
  0 0 1 * * curl -X POST https://your-host/api/scrape_jobs/run-now?schedule=monthly
  ```

- **Using the built-in scheduler worker**: if OS cron is unavailable, run the
  Node-based worker:

  ```bash
  npm run scheduler:worker
  ```

  It uses `node-cron` to trigger the same `run-now` endpoint on the expected
  cadence. Set `SCHEDULER_TIMEZONE` if the default server timezone is
  unsuitable. When the variable is missing, the worker defaults to
  `Africa/Accra` and logs the effective timezone at startup so you can verify
  scheduling behaviour.

  Common `SCHEDULER_TIMEZONE` examples (IANA names):

  - `Africa/Accra` (default)
  - `UTC`
  - `America/New_York`
  - `Europe/London`
  - `Asia/Tokyo`
  - `America/Los_Angeles`

- **Pause or resume a schedule**: update a job via
  `PATCH /api/scrape_jobs/{id}` with `{ "paused": true }` (or `false`) to stop
  or resume automatic enqueueing without deleting the job.

### Clearing scrape job history

If you need a clean slate for testing, you can purge all past scrape jobs with a
one-off script. The command is gated by an environment flag to avoid accidental
deletes:

```bash
# Danger: deletes every ScrapeJob row. Requires ALLOW_SCRAPE_PURGE=true
ALLOW_SCRAPE_PURGE=true TS_NODE_COMPILER_OPTIONS='{"module":"CommonJS","moduleResolution":"node"}' \
  node -r ts-node/register/transpile-only -r ./scripts/register-tsconfig-paths.js scripts/clearScrapeJobs.ts
```

If `ALLOW_SCRAPE_PURGE` is not set to `true`, the script exits without touching
the database.

### Ingestion and scheduling environment flags

- `SCHEDULER_TIMEZONE`: IANA timezone for cron-based scrape scheduling. Defaults
  to `Africa/Accra` when unset; adjust if your host runs in a different locale.
- `SCRAPE_ARTIFACT_DEBUG`: set to `true` to emit verbose logs from scrape
  artifact discovery (which files were included or skipped, with timestamps) to
  help debug ingestion reruns.

## Demo Flow

To try out the demo, you can ask questions that will trigger a file search.

Example questions:

- What is the return policy?
- How do I return a product?
- How can I cancel an order?
- What does your company do?
- Do you sell sensors?

When an answer is generated, it will be displayed as a suggested response for the customer support representative.
In the agent view, you can edit the message or send it as is.
You can toggle **Auto reply** in the agent view to automatically send the suggested response.

You can also click on the "Relevant articles" to see the corresponding articles in the knowledge base or FAQ.

You can then continue the conversation as the user.

You can ask for help to trigger actions.

Example questions:

- Help me cancel order ORD1001 => Should suggest the `cancel_order` action
- Help me reset my password => Should suggest the `reset_password` action
- Give me a list of my past orders => Should trigger the execution of `get_order_history`

### End-to-end demo flow

1. Ask as the user "How can I cancel my order?"
2. Confirm the suggested response
3. Ask as the user "Help me cancel order ORD1001"
4. Confirm the suggested response
5. Confirm the suggested action to cancel the order
6. Confirm the suggested response

### Limitations

Note that the functions that are executed are just placeholders and are not actually modifying any data, so the actions will not have any effect. For example, calling `cancel_order` won't change the status of the order.

## Customization

To customize this demo you can:

- Edit prompts, initial message and model in `config/constants.ts`
- Edit available functions in `config/tools-list.ts`
- Edit functions logic in `config/functions.ts`
- (optional) Edit the demo data in `config/demoData.ts`

You can also customize the endpoints in the `/api` folder to call your own backend or external services.

If you want to use this code repository as a starting point for your own project in production, please note that this demo is not production-ready and that you would need to implement safety measures such as input guardrails, user authentication, etc.

## Local database

This demo can store customer profiles and chat sessions in a local PostgreSQL database using Prisma.

1. Add your connection string to `.env`:

   ```bash
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>"
   ```

2. Run the migrations to create the tables (including the latest schema updates):

   ```bash
   npx prisma migrate deploy
   ```

3. Start a Redis instance (for example, run `redis-server` locally or use Docker `docker run -p 6379:6379 redis`).

4. Configure Redis by setting `REDIS_URL` in your `.env` file:

   ```bash
   REDIS_URL=redis://localhost:6379
   ```

The new API endpoints under `/api/users` and `/api/sessions/start` allow the agent to create or retrieve customer records, manage chat sessions, and store conversation history using this database and Redis. During each turn, `/api/turn_response` persists messages via `saveSessionMessages`, so a separate `/api/sessions/[session_id]/save` call is no longer required.

## Session lifecycle & cleanup

- Sessions automatically end after 4 minutes of inactivity.
- Run `npm run cleanup:sessions` to remove ended sessions older than the number of days specified in `SESSION_RETENTION_DAYS`.
- By default, sessions are retained for 30 days. Change the value of `SESSION_RETENTION_DAYS` in your `.env` file to adjust the retention period.

### Session summarization & pruning

Sessions automatically summarize and prune older messages once the number of unsummarized messages exceeds the `MAX_UNSUMMARIZED_MESSAGES` limit (default 50). This keeps active sessions lightweight while preserving a running summary of prior context.

Set the `MAX_UNSUMMARIZED_MESSAGES` environment variable to control how many recent messages are kept verbatim.

To prune existing sessions to the current limit, run:

```bash
npm run prune:sessions
```

The pruning script also updates each user's `longSummary` retroactively. After a session's message log is reduced and its summary
is refreshed, that summary is itself summarized and appended to the user's existing long-term summary so historical context
is preserved.

## Contributing

You are welcome to open issues or submit PRs to improve this app, however, please note that we may not review all suggestions.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
