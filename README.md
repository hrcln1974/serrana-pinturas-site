# Serrana Pinturas & Reformas — V4 estática

## O que mudou
- Removido Node.js, Express, npm e servidor.
- Site 100% HTML + CSS + JavaScript, compatível com hospedagem estática da Hostinger.
- Painel administrativo em `admin.html`.
- Login local do painel.
- Cadastro de fotos por arquivo ou URL.
- Cadastro de vídeos por arquivo ou URL/YouTube.
- Exclusão individual e exclusão de todas as mídias.
- Filtros de Fotos / Vídeos / Todos.
- Lightbox para fotos e reprodução de vídeos.
- Exportação e importação do catálogo em JSON.
- Mídias de demonstração incluídas.
- Hero mobile mantém o posicionamento do rapaz à direita com `object-position: 70% center`.

## Acesso V4
- Usuário: `admin`
- Senha: `serrana123`

## Limitação importante
Esta V4 é propositalmente sem backend. Portanto, o painel **não consegue gravar arquivos dentro da pasta do site na Hostinger**. Fotos adicionadas por arquivo ficam no `localStorage` do navegador onde foram cadastradas. Isso permite demonstração e gestão local, mas não transforma o painel em um CMS compartilhado entre todos os visitantes.

Para o cliente realmente adicionar uma foto no painel e ela aparecer para todos os visitantes, será necessário posteriormente um backend/API ou um serviço de armazenamento externo. A V4 já deixa a interface preparada para essa evolução.

## Publicação
1. Substitua os arquivos do projeto pelos arquivos desta versão.
2. Não instale npm e não execute `npm start`.
3. Faça `git add .`, `git commit` e `git push origin main`.
4. No Hostinger, aguarde a implantação automática pelo GitHub ou use Reimplante.
5. Limpe o cache do site no hPanel se necessário.
6. Abra `https://SEU-DOMINIO/admin.html` para o painel.

## Segurança
O login é apenas uma barreira de interface do navegador. Como não existe servidor, ele não é adequado para proteger dados sensíveis. Não use esta autenticação para dados privados ou operações críticas.
