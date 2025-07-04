
/* IMPORT */

import fs from 'node:fs/promises';
import {defineConfig} from 'vite';
import voby from 'voby-vite';
import manifest from './manifest.json';

/* MAIN */

const config = defineConfig ( ({ mode }) => ({
  build: {
    minify: mode === 'production',
    rollupOptions: {
      input: {
        background: './src/background/worker.ts',
        popup: manifest.action.default_popup,
      },
      output: {
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  plugins: [
    voby (),
    {
      name: 'copy:assets',
      writeBundle: async () => {
        await fs.cp ( 'resources/icon/icon-256.png', 'dist/resources/icon/icon-256.png', { recursive: true } );
        await fs.cp ( 'manifest.json', 'dist/manifest.json' );
      }
    }
  ]
}));

/* EXPORT */

export default config;
