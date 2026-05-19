/* ============================================================================
 * src/data/dominios.ts — REGISTRO DE DOMÍNIOS (FIA, JORNADA DE DADOS, ...)
 * ============================================================================
 *
 * PROBLEMA QUE ESTE ARQUIVO RESOLVE
 * ---------------------------------
 * A arquitetura proposta tem "domínios" no sentido de produto: cada pasta
 * sob /src/pages/ é um produto (FIA, Jornada de Dados, etc.), e cada
 * domínio tem branding próprio — cores, tagline, tom de comunicação.
 *
 * Sem um registro central, o branding vira código duplicado:
 *   - Cada Hero/CTA/Stats teria as cores do domínio hardcoded.
 *   - Adicionar um domínio novo exigiria caçar e replicar essa lógica.
 *   - Mudar a cor primária de um domínio exigiria editar dezenas de lugares.
 *
 * COMO O ASTRO RESOLVE
 * --------------------
 * Centralizamos os "tokens de domínio" aqui. Os componentes recebem
 * apenas o ID do domínio (uma string como "fia"), e eles próprios
 * resolvem as cores/textos consultando este registro.
 *
 *   <Hero dominio="fia" titulo="..." ... />
 *           ↑
 *   o componente faz: const d = dominios[dominio]
 *   e aplica d.corPrimaria, d.corCta, etc.
 *
 * GANHOS PRÁTICOS
 * ---------------
 *   1. Adicionar um novo domínio = adicionar uma entrada neste objeto.
 *   2. Mudar o branding de um domínio = mudar UMA linha aqui.
 *   3. TypeScript impede um typo: `dominio="fai"` (sem o "i") quebra o
 *      build antes mesmo de virar HTML.
 *   4. Toda LP daquele domínio fica visualmente consistente sem esforço.
 *
 * EVOLUÇÃO NATURAL
 * ----------------
 * Quando os domínios passarem de meia dúzia, vale extrair cada um pra um
 * arquivo próprio em src/content/dominios/*.json e usar Content Collections
 * do Astro para validar o schema com Zod.
 * ========================================================================== */

export type DominioId = 'fia' | 'jornada-dados';

interface Dominio {
  nome: string;
  slug: DominioId;
  /** Cor de fundo do hero, normalmente aplicada em gradient para o preto. */
  corPrimaria: string;
  /** Cor de fundo dos botões de call-to-action. */
  corCta: string;
  /** Cor do texto dentro do CTA (precisa contrastar com `corCta`). */
  corCtaTexto: string;
  /** Tagline default usada em seções de prova social (override por LP). */
  tagline: string;
}

export const dominios: Record<DominioId, Dominio> = {
  fia: {
    nome: 'Formação em IA',
    slug: 'fia',
    corPrimaria: '#1a1a40',
    corCta: '#00d97e',
    corCtaTexto: '#0a0a0a',
    tagline: 'A maior comunidade de IA do Brasil',
  },
  'jornada-dados': {
    nome: 'Jornada de Dados',
    slug: 'jornada-dados',
    corPrimaria: '#003d5b',
    corCta: '#ffb703',
    corCtaTexto: '#0a0a0a',
    tagline: 'A maior comunidade de Dados do Brasil',
  },
};
