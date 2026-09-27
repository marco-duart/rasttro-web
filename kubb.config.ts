import { defineConfig } from 'kubb';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  input: './openapi.json',
  output: { path: './src/api/generated', clean: true },
  plugins: [
    pluginOas(),
    pluginTs({ output: { path: 'models' }, enumType: 'literal' }),
    pluginZod({ output: { path: 'zod' }, typed: true }),
  ],
});
