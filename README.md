# Smeargle Studio

Aplicação web para selecionar cores, extrair cores dominantes de imagens e montar paletas.

## Requisitos

- Node.js 20 ou superior
- npm

## Desenvolvimento

Na raiz do repositório:

```bash
cd WEB
npm install
npm run dev
```

O Vite exibirá a URL local no terminal.

## Build de produção

```bash
cd WEB
npm run build
```

Os arquivos gerados ficam em `WEB/dist`.

## Pré-visualização do build

```bash
cd WEB
npm run preview
```

## Funcionalidades

- Upload de imagens.
- Extração de cores dominantes.
- Seleção de cores com conta-gotas.
- Criação e edição de paletas.
- Persistência da paleta atual e do histórico no armazenamento local do navegador.
- Layout responsivo para desktop e dispositivos móveis.

## Deploy na Vercel

O projeto possui configurações em `vercel.json` e `WEB/vercel.json` para os dois cenários de configuração do Root Directory.

Se a Vercel usar a raiz do repositório, o build executa automaticamente:

```bash
cd WEB
npm install --include=dev
npm run build
```

Se `WEB` estiver configurado como Root Directory na Vercel, use:

- **Install Command:** `npm install --include=dev`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Estrutura principal

```text
WEB/
  public/       # Imagens e arquivos públicos
  src/          # Componentes e lógica da aplicação
  package.json  # Scripts e dependências
  vite.config.ts
```
