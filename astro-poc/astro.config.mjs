// @ts-check
import { defineConfig } from 'astro/config';

/* ============================================================================
 * astro.config.mjs — CONFIGURAÇÃO DO BUILD
 * ============================================================================
 *
 * `build.format: 'directory'` faz com que cada página seja gerada como
 * `<rota>/index.html`, e não como `<rota>.html`. Isso é importante
 * porque garante URLs "limpas" (sem extensão) e funciona naturalmente
 * em qualquer CDN estática.
 *
 *   src/pages/fia/fia01.astro   →   dist/fia/fia01/index.html
 *
 * Resultado: a URL final é `lp.asimov.academy/fia/fia01/`, exatamente
 * o modelo que queremos.
 *
 * Por padrão o Astro já roda em modo "static" (build estático), então
 * não precisamos configurar `output`. O resultado em `dist/` é HTML
 * puro pronto para upload em Cloudflare Pages, Vercel, Netlify,
 * S3+CloudFront ou qualquer outra CDN estática — sem servidor Node
 * em produção.
 * ========================================================================== */

export default defineConfig({
  site: 'https://lp.asimov.academy',
  build: {
    format: 'directory',
  },
});
