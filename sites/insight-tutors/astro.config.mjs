import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://insighttutors.com.au',
  output: 'hybrid',
  adapter: vercel(),
  server: {
    port: 4321,
    strictPort: true,
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
