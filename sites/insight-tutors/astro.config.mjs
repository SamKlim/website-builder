import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://insighttutors.com.au',
  server: {
    port: 4321,
    strictPort: true,
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
