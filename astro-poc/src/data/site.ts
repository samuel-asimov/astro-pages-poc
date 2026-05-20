/* ============================================================================
 * src/data/site.ts — FONTE ÚNICA DE VERDADE
 * ============================================================================
 *
 * PROBLEMA QUE ESTE ARQUIVO RESOLVE
 * ---------------------------------
 * No modelo "tudo em index.html por pasta", dados institucionais como
 * "+15.000 alunos formados" e "42 cursos disponíveis" são repetidos:
 *
 *   - No <header> de cada uma das N páginas
 *   - Numa seção de stats no meio da página
 *   - No <footer>
 *   - Em meta tags de SEO
 *   - Em textos do hero, em CTAs, etc.
 *
 * Quando esse número muda (e ele muda toda hora), é praticamente garantido
 * que alguém vai esquecer de atualizar uma das ocorrências, e o site vai
 * ficar mostrando "+15.000" em uma página e "+12.000" em outra — risco
 * real que existe hoje no nosso modelo de HTML puro replicado.
 *
 * COMO O ASTRO RESOLVE
 * --------------------
 * Como o Astro tem TypeScript/JavaScript de primeira classe no frontmatter
 * dos componentes (`---` no topo dos arquivos .astro), qualquer componente
 * pode simplesmente importar este arquivo e usar `site.alunosFormados`.
 *
 *   - Existe UMA fonte de verdade.
 *   - O TypeScript garante que ninguém digite o nome do campo errado.
 *   - Mudar o número aqui = todas as LPs do repositório atualizam no
 *     próximo `npm run build`.
 *   - Como o build é estático, o número fica "queimado" no HTML final —
 *     ou seja, performance idêntica a um <span> escrito à mão.
 *
 * COMO USAR EM UM COMPONENTE
 * --------------------------
 *   ---
 *   import { site } from '../../data/site.ts';
 *   ---
 *   <p>+{site.alunosFormados.toLocaleString('pt-BR')} alunos formados</p>
 *
 * EVOLUÇÃO NATURAL
 * ----------------
 * Quando este arquivo crescer demais, ele pode ser substituído por uma
 * "Content Collection" do Astro (Markdown/JSON validado por schema Zod)
 * ou por uma chamada a um CMS headless em build time. O ponto importante
 * é: o lugar de consulta dos componentes não muda.
 * ========================================================================== */

export const site = {
  marca: 'Asimov Academy',
  alunosFormados: 15000,
  cursosDisponiveis: 42,
  avaliacaoMedia: '4.9/5',
  anoAtual: 2026,
  contato: {
    email: 'contato@asimov.academy',
    whatsapp: '+55 51 99999-9999',
  },
} as const;

/* Menu de navegação global. Centralizado pelos mesmos motivos acima:
 * adicionar/remover um item de menu não pode exigir editar N arquivos. */
export const nav = [
  { label: 'Cursos', href: '#cursos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
];
