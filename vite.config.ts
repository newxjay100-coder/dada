import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

import fs from 'node:fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    cors: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
    cors: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'supabase-env-handler',
      configureServer(server) {
        server.middlewares.use('/api/save-supabase-env', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              try {
                const { url, anonKey } = JSON.parse(body);
                const envPath = fileURLToPath(new URL('./.env', import.meta.url));
                const envContent = `VITE_SUPABASE_URL=${url || 'https://gseueojxksbhbgvisshq.supabase.co'}\nVITE_SUPABASE_ANON_KEY=${anonKey || ''}\nVITE_KAKAO_CHANNEL_URL=\nVITE_APP_URL=http://localhost:5173\nVITE_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq\n`;
                fs.writeFileSync(envPath, envContent, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
