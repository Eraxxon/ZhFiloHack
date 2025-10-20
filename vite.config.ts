import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_URL || 'http://localhost:3000';
  const hasTarget = Boolean(env.VITE_API_URL);

  const devMockPlugin = (enabled: boolean): Plugin => ({
    name: 'dev-mock-api',
    apply: 'serve',
    configureServer(server) {
      if (!enabled) return;
      server.middlewares.use((req, res, next) => {
        if (req.method === 'GET' && req.url?.startsWith('/api/ping')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, message: 'pong', ts: Date.now() }));
          return;
        }
        next();
      });
    }
  });

  return {
    plugins: [react(), devMockPlugin(!hasTarget)],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://91.186.196.211:3000',
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    }
  };
});


