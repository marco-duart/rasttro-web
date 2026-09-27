import { defineConfig } from 'kubb';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

/**
 * Gera, a partir do contrato OpenAPI do server (`npm run openapi:export`
 * no rasttro-server, depois copiado para `openapi.json` aqui):
 * - tipos TypeScript de cada schema (`src/api/generated/models`);
 * - schemas Zod correspondentes (`src/api/generated/zod`), reaproveitados
 *   como resolver do React Hook Form (seção 14 "Forms" do documento de
 *   produto: API/OpenAPI -> tipos gerados -> schema -> RHF -> Zod resolver).
 *
 * O client HTTP e os hooks de React Query são escritos à mão em
 * `src/api/` (não gerados): o ecossistema Kubb de geração de client/hooks
 * está em transição de arquitetura entre versões e não dá pra confiar nele
 * ainda sem travar a build a uma versão instável. Tipos + Zod continuam
 * gerados; o resto é um wrapper fino e estável sobre o axios.
 *
 * NUNCA editar nada em `src/api/generated` — sempre rodar `npm run api:generate`.
 */
export default defineConfig({
  input: './openapi.json',
  output: { path: './src/api/generated', clean: true },
  plugins: [
    pluginOas(),
    pluginTs({ output: { path: 'models' }, enumType: 'literal' }),
    pluginZod({ output: { path: 'zod' }, typed: true }),
  ],
});
