import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { POST as handleRegisterPost } from './api/register.ts';

interface NodeStreamRequest {
  method?: string;
  setEncoding?: (encoding: string) => void;
  on: (event: string, listener: (arg: unknown) => void) => void;
}

function readNodeRequestBody(req: NodeStreamRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding?.('utf8');
    req.on('data', (chunk) => {
      body += typeof chunk === 'string' ? chunk : String(chunk ?? '');
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
  });
}

function localRegisterApiPlugin(): Plugin {
  const attachMiddleware = (
    middlewares: Connect.Server,
    env: Record<string, string>
  ) => {
    middlewares.use('/api/register', async (rawReq, res, next) => {
      const req = rawReq as unknown as NodeStreamRequest;
      if (req.method !== 'POST') {
        next();
        return;
      }
      try {
        const rawBody = await readNodeRequestBody(req);
        const webReq = new Request('http://localhost/api/register', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: rawBody,
        });
        const webRes = await handleRegisterPost(webReq, env);
        const text = await webRes.text();
        res.statusCode = webRes.status;
        res.setHeader(
          'Content-Type',
          webRes.headers.get('Content-Type') ?? 'application/json; charset=utf-8'
        );
        res.end(text);
      } catch {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ status: 'error', error: 'Local API middleware error.' }));
      }
    });
  };

  return {
    name: 'origin-local-register-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, '.', '');
      attachMiddleware(server.middlewares, env);
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, '.', '');
      attachMiddleware(server.middlewares, env);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localRegisterApiPlugin()],
});
