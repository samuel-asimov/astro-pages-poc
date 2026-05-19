# POC — Landing Pages da Asimov Academy com Astro

> **Tese:** o framework [Astro](https://astro.build) resolve o problema de
> escalar landing pages estáticas sem reintroduzir os problemas de
> manutenção do nosso modelo atual (Elementor / HTML puro duplicado).

## O problema que queremos resolver

Hoje as nossas LPs são feitas no Elementor. Queremos migrar para um
repositório versionado, escrito em código, onde a IA possa gerar e
editar páginas com facilidade. O modelo ingênuo seria:

```
lp-asimov/
├── fia/
│   ├── fia01/index.html
│   └── fia02/index.html
└── jornada-dados/
    └── jd01/index.html
```

Pasta = domínio, arquivo = página, URL gerada automaticamente. Esse
modelo mental está **correto**, mas com HTML puro ele recria o mesmo
problema do Elementor por outro caminho:

1. **CSS duplicado** em todas as páginas (qualquer mudança de design
   precisa ser refeita N vezes).
2. **Header e footer duplicados** em todas as páginas.
3. **Dados institucionais hardcoded** (ex.: "+15.000 alunos formados",
   "42 cursos") aparecem espalhados em vários arquivos — quando esse
   número muda, é praticamente garantido que ele vai ficar
   desincronizado entre as páginas.
4. **Sem reuso de blocos:** Hero, CTA, Pricing, FAQ — tudo precisa ser
   reescrito a cada LP nova.

## Por que Astro resolve esse problema sem custo de performance

O argumento "HTML puro é mais rápido" foi verdade na era do Create
React App e do Next 10, quando "framework" significava mandar React +
hidratação + bundle gigante pro cliente. **Astro é diferente**:

- O output do `astro build` é **HTML/CSS estático puro**, servido por
  CDN como qualquer site estático.
- **Zero JavaScript** é enviado ao cliente por padrão.
- JS só é incluído quando uma página específica usa um componente
  interativo (Islands Architecture).
- O "framework" só existe em **build time**, na nossa máquina ou no
  CI. Para o visitante final, é um site estático.

Ou seja: ganhamos componentização e fonte única de verdade **sem
sacrificar a performance** que motivou a escolha original por HTML
puro.

## Como esta POC está organizada

```
astro-poc/
├── src/
│   ├── data/                     ← FONTE ÚNICA DE VERDADE
│   │   ├── site.ts               ← Nº de alunos, cursos, etc.
│   │   └── dominios.ts           ← Branding por domínio
│   ├── layouts/
│   │   └── LPLayout.astro        ← <head>, Header, Footer, slot
│   ├── components/
│   │   ├── blocks/               ← Seções (Hero, Stats, Pricing...)
│   │   ├── ui/                   ← Átomos (CTAButton...)
│   │   └── islands/              ← Componentes com JS sob demanda
│   ├── pages/                    ← FILE-BASED ROUTING
│   │   ├── fia/
│   │   │   ├── fia01.astro       → /fia/fia01/
│   │   │   └── fia02.astro       → /fia/fia02/
│   │   └── jornada-dados/
│   │       └── jd01.astro        → /jornada-dados/jd01/
│   └── styles/
│       └── global.css            ← Reset e design tokens
└── astro.config.mjs
```

Cada arquivo do projeto tem comentários explicando **qual parte do
problema ele resolve** e **por que ele existe**. Leia-os na ordem
abaixo para entender a arquitetura completa.

## Roteiro de leitura (a tese, em ordem)

1. [`astro-poc/src/data/site.ts`](./astro-poc/src/data/site.ts) — a
   fonte única de verdade que elimina a duplicação de dados.
2. [`astro-poc/src/data/dominios.ts`](./astro-poc/src/data/dominios.ts)
   — como modelar múltiplos "domínios" (FIA, Jornada de Dados) com
   branding próprio sem duplicar código.
3. [`astro-poc/src/styles/global.css`](./astro-poc/src/styles/global.css)
   — reset e design tokens em **um único lugar**.
4. [`astro-poc/src/layouts/LPLayout.astro`](./astro-poc/src/layouts/LPLayout.astro)
   — o esqueleto HTML compartilhado por todas as LPs.
5. [`astro-poc/src/components/blocks/Header.astro`](./astro-poc/src/components/blocks/Header.astro)
   e [`Footer.astro`](./astro-poc/src/components/blocks/Footer.astro)
   — componentes globais que leem da fonte única.
6. [`astro-poc/src/components/ui/CTAButton.astro`](./astro-poc/src/components/ui/CTAButton.astro)
   — átomo reutilizável com parametrização via props.
7. [`astro-poc/src/components/blocks/Hero.astro`](./astro-poc/src/components/blocks/Hero.astro),
   [`Stats.astro`](./astro-poc/src/components/blocks/Stats.astro) e
   [`Pricing.astro`](./astro-poc/src/components/blocks/Pricing.astro)
   — blocos compostos que cada LP encaixa.
8. [`astro-poc/src/components/islands/FAQAccordion.astro`](./astro-poc/src/components/islands/FAQAccordion.astro)
   — interatividade com HTML nativo (zero JS).
9. [`astro-poc/src/components/islands/Countdown.astro`](./astro-poc/src/components/islands/Countdown.astro)
   — Islands Architecture: JavaScript sob demanda.
10. [`astro-poc/src/pages/fia/fia01.astro`](./astro-poc/src/pages/fia/fia01.astro),
    [`fia02.astro`](./astro-poc/src/pages/fia/fia02.astro) e
    [`jornada-dados/jd01.astro`](./astro-poc/src/pages/jornada-dados/jd01.astro)
    — três LPs reais, cada uma com 30-40 linhas, mostrando que o
    arquivo da página vira praticamente uma "lista de compras" de
    blocos.

## Como rodar

```bash
cd astro-poc
npm install
npm run dev       # http://localhost:4321
npm run build     # gera dist/ com HTML estático puro
npm run preview   # serve o dist/ localmente
```

O `npm run build` gera exatamente a estrutura de URLs que queremos:

```
dist/
├── fia/
│   ├── fia01/index.html
│   └── fia02/index.html
└── jornada-dados/
    └── jd01/index.html
```

Esse `dist/` é jogado em qualquer CDN estática (Cloudflare Pages,
Vercel, Netlify, S3 + CloudFront) e pronto — zero servidor, zero
Node em produção.

## Resultado mensurável da POC

- **3 LPs** de 2 domínios diferentes.
- **Página mais leve:** ~8 KB de HTML+CSS, **zero JavaScript**.
- **Página com countdown:** ~10 KB, e o JS do countdown só vai pra
  essa página específica.
- **Build completo:** < 1 segundo.
- **Mudar "número de alunos" em todas as LPs:** editar 1 linha em
  `src/data/site.ts`.
