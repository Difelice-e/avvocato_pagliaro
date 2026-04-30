import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://difelice-e.github.io',
  base: '/avvocato_pagliaro',
  integrations: [tailwind()],
});
