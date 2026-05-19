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

## Pré-requisitos

Só uma coisa: **Node.js 18.17.1 ou superior** (recomendamos a LTS
atual, 22.x). O `npm` já vem junto na instalação do Node.

```bash
node --version    # precisa retornar v18.17.1 ou mais novo
npm --version
```

Como instalar Node:

- **macOS:** `brew install node` (ou baixar de [nodejs.org](https://nodejs.org))
- **Linux:** via [nvm](https://github.com/nvm-sh/nvm) (recomendado):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  nvm install --lts
  ```
- **Windows:** instalador em [nodejs.org](https://nodejs.org) ou
  [nvm-windows](https://github.com/coreybutler/nvm-windows)

> **Não instale o Astro globalmente.** Ele já está listado como
> dependência do projeto no `package.json` e é instalado localmente
> dentro de `node_modules/` pelo `npm install`. Isso garante que cada
> projeto fique amarrado à sua própria versão do Astro.

### Recomendado: extensão Astro no editor

Se usar **VS Code** ou **Cursor**, instale a extensão oficial
[`astro-build.astro-vscode`](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
Ela traz syntax highlight, autocomplete e validação de TypeScript
dentro dos arquivos `.astro`. Sem ela funciona, mas o editor não
colore os `.astro`, o que atrapalha bastante.

## Desenvolvimento local

Depois de clonar o repositório:

```bash
cd astro-poc
npm install       # uma vez por repo (demora ~20-30s na primeira vez)
npm run dev       # sobe servidor com hot reload
```

O terminal vai mostrar:

```
🚀  astro  v6.3.5 started in 102ms

┃ Local    http://localhost:4321/
```

Abra `http://localhost:4321/` no navegador. A página inicial lista
as 3 LPs da POC. Editar qualquer arquivo `.astro`, `.ts` ou `.css`
recarrega o navegador automaticamente.

## Build de produção (geração dos sites estáticos)

```bash
cd astro-poc
npm run build
```

Saída típica:

```
[build] output: "static"
[build] mode: "static"
[build] directory: /workspace/astro-poc/dist/

 generating static routes 
  ├─ /fia/fia01/index.html (+9ms) 
  ├─ /fia/fia02/index.html (+3ms) 
  ├─ /jornada-dados/jd01/index.html (+5ms) 
  ├─ /index.html (+2ms) 
✓ Completed in 30ms.

[build] 4 page(s) built in 848ms
```

O que o `npm run build` faz por baixo do capô:

1. Lê todos os arquivos em `src/pages/` e descobre as rotas
   (file-based routing).
2. Renderiza cada página para HTML rodando o frontmatter (`---`)
   em Node, no momento do build.
3. Bundla o CSS dos componentes, minifica e injeta nas páginas.
4. Bundla os `<script>` das ilhas e injeta APENAS nas páginas que
   usam aquela ilha.
5. Joga tudo na pasta `dist/`.

A pasta `dist/` final contém **HTML estático puro**, exatamente a
estrutura de URLs que queremos:

```
astro-poc/dist/
├── index.html
├── fia/
│   ├── fia01/index.html       ← ~8 KB, zero JavaScript
│   └── fia02/index.html       ← ~10 KB (com countdown inline)
└── jornada-dados/
    └── jd01/index.html        ← ~8 KB, zero JavaScript
```

Você pode abrir um desses arquivos diretamente no navegador para
inspecionar:

```bash
# macOS
open dist/fia/fia01/index.html
# Linux
xdg-open dist/fia/fia01/index.html
# Windows
start dist\fia\fia01\index.html
```

## Preview da versão de produção

```bash
cd astro-poc
npm run preview
```

Serve a pasta `dist/` num servidor HTTP local em
`http://localhost:4321/`, simulando como o site se comporta em
produção. **Diferença para `npm run dev`:** o `preview` serve a
versão buildada e minificada, sem hot reload. Use para validar que
o build saiu certo antes de publicar.

## Deploy em produção

A pasta `dist/` é HTML estático puro — não precisa de Node em
produção. Pode ser servida por qualquer CDN estática. Três caminhos,
do mais simples para o mais técnico:

### Opção A — Drag and drop manual (só para testes)

1. Rode `npm run build` localmente.
2. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
   ou [app.netlify.com/drop](https://app.netlify.com/drop).
3. Arraste a pasta `dist/` para a área indicada.
4. Em ~30 segundos o site está no ar numa URL temporária.

Bom para demo, ruim para produção (precisa repetir a cada
atualização).

### Opção B — Integração com GitHub (recomendado)

Este é o fluxo para produção. Setup uma vez, e cada `git push`
publica sozinho.

1. Conecte o repositório no [Cloudflare Pages](https://pages.cloudflare.com),
   [Vercel](https://vercel.com) ou [Netlify](https://netlify.com).
2. Configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `astro-poc` (porque o projeto Astro vive
     numa subpasta deste repo)
3. Pronto. A partir daí o fluxo é:
   ```bash
   # edita arquivos .astro
   git add . && git commit -m "nova LP" && git push
   # ~30s depois, está no ar
   ```

### Opção C — GitHub Actions + S3/CloudFront

Se já tiverem infra AWS, crie um workflow que rode `npm run build`
e use `aws s3 sync dist/ s3://lp-asimov/ --delete` para publicar,
seguido de invalidação do CloudFront. Só vale a pena se já existe
um motivo para usar AWS em vez de Cloudflare/Vercel/Netlify.

### Recomendação para a Asimov

**Cloudflare Pages**, pelos seguintes motivos:

- Gratuito até 500 builds por mês (mais que suficiente).
- Build em ~30 segundos.
- CDN global da Cloudflare (latência baixa em qualquer lugar).
- Integração nativa com GitHub.
- Suporte nativo a Astro (aparece como template no setup).
- Se o DNS do `asimov.academy` já estiver na Cloudflare, configurar
  o subdomínio `lp.asimov.academy` é um clique.

## Configurando o domínio `lp.asimov.academy`

Independente da plataforma escolhida:

1. No painel da plataforma (Cloudflare Pages, Vercel, Netlify), vá
   em **Custom domains** e adicione `lp.asimov.academy`.
2. A plataforma vai te dar um valor de **CNAME** (ou IP).
3. No provedor de DNS de `asimov.academy`, crie um registro CNAME
   apontando `lp` para esse valor.
4. Em alguns minutos o domínio propaga e a plataforma gera o
   certificado SSL automaticamente.

Depois disso, `lp.asimov.academy/fia/fia01/` vai renderizar
exatamente o arquivo `dist/fia/fia01/index.html` que o Astro gerou.

## Resumo dos comandos

Todos rodados de dentro da pasta `astro-poc/`:

```bash
npm install        # uma vez por repo
npm run dev        # desenvolvimento (localhost:4321, hot reload)
npm run build      # gera dist/ com HTML estático puro
npm run preview    # serve dist/ localmente para validar produção
```

Em produção (Cloudflare Pages, Vercel, Netlify): você não roda
esses comandos manualmente — a plataforma roda no `git push`.

## Resultado mensurável da POC

- **3 LPs** de 2 domínios diferentes.
- **Página mais leve:** ~8 KB de HTML+CSS, **zero JavaScript**.
- **Página com countdown:** ~10 KB, e o JS do countdown só vai pra
  essa página específica.
- **Build completo:** < 1 segundo.
- **Mudar "número de alunos" em todas as LPs:** editar 1 linha em
  `src/data/site.ts`.
