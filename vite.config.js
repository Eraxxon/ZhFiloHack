import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var target = env.VITE_API_URL || 'http://localhost:3000';
    var hasTarget = Boolean(env.VITE_API_URL);
    var devMockPlugin = function (enabled) { return ({
        name: 'dev-mock-api',
        apply: 'serve',
        configureServer: function (server) {
            if (!enabled)
                return;
            server.middlewares.use(function (req, res, next) {
                var _a;
                if (req.method === 'GET' && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api/ping'))) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: true, message: 'pong', ts: Date.now() }));
                    return;
                }
                next();
            });
        }
    }); };
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
