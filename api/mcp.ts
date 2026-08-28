import type { IncomingMessage, ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { makeGetClient } from '../src/get-client.js';
import { registerFrameTools } from '../src/tools/frames.js';
import { registerSettingsTools } from '../src/tools/settings.js';
import { registerCalendarTools } from '../src/tools/calendars.js';
import { registerMemberTools } from '../src/tools/members.js';
import { registerEventTools } from '../src/tools/events.js';
import { registerListTools } from '../src/tools/lists.js';
import { registerChoreTools } from '../src/tools/chores.js';
import { registerMealTools } from '../src/tools/meals.js';
import { registerMessageTools } from '../src/tools/messages.js';
import { registerTaskTools } from '../src/tools/tasks.js';
import { registerRewardTools } from '../src/tools/rewards.js';
import { registerAiTools } from '../src/tools/ai.js';
import { registerPhotoTools } from '../src/tools/photos.js';

function createServer() {
  const server = new McpServer({ name: 'skylight-mcp', version: '0.7.1' });
  const getClient = makeGetClient();

  registerFrameTools(server, getClient);
  registerSettingsTools(server, getClient);
  registerCalendarTools(server, getClient);
  registerMemberTools(server, getClient);
  registerEventTools(server, getClient);
  registerListTools(server, getClient);
  registerChoreTools(server, getClient);
  registerMealTools(server, getClient);
  registerMessageTools(server, getClient);
  registerTaskTools(server, getClient);
  registerRewardTools(server, getClient);
  registerAiTools(server, getClient);
  registerPhotoTools(server, getClient);

  return server;
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ ok: true, service: 'skylight-mcp', endpoint: '/api/mcp' }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('allow', 'GET, POST');
    res.end('Method Not Allowed');
    return;
  }

  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } finally {
    await transport.close();
    await server.close();
  }
}
