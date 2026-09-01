# Serrana Pinturas & Reformas — V2.0

Site institucional responsivo com painel administrativo para gerenciamento de fotos e vídeos.

## Funcionalidades
- Painel protegido em `/admin.html` ou `/admin`.
- Upload de fotos e vídeos para armazenamento persistente em `storage/uploads/`.
- Cadastro por URL para imagens e vídeos; YouTube e Vimeo recebem incorporação quando possível.
- Edição de título, categoria, descrição e destaque.
- Exclusão de mídias com remoção do arquivo local enviado ao servidor.
- Galeria pública carregada pela API.
- Seção pública de vídeos.
- WhatsApp e conteúdo institucional mantidos.
- Cookie de sessão HttpOnly + SameSite e limite básico de tentativas de login.

## Rodar localmente
1. `copy .env.example .env` (Windows) ou `cp .env.example .env`.
2. Edite `ADMIN_USER` e `ADMIN_PASSWORD`.
3. `npm install`
4. `npm start`
5. Abra `http://localhost:3000`.

## Hostinger
Configure uma aplicação Node.js apontando o diretório do projeto para este repositório, com `server.js` como arquivo de inicialização. Cadastre `ADMIN_USER`, `ADMIN_PASSWORD` e `MAX_UPLOAD_MB` nas variáveis de ambiente da aplicação. O diretório `storage/` precisa ficar em armazenamento persistente e gravável. O arquivo de catálogo `storage/media.json` é criado automaticamente a partir de `data/media.seed.json` na primeira execução e fica fora do Git, para que novas mídias não sejam perdidas ou sobrescritas por uma implantação.

Não versione `.env`, senhas ou sessões.
