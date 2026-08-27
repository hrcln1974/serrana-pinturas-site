# Serrana Pinturas & Reformas em Geral — V1.1

Site institucional estático, otimizado para publicação no GitHub e na Hostinger.

## Principais recursos

- Layout responsivo para celular, tablet e computador
- Identidade visual preta e dourada da Serrana
- Página de serviços e apresentação profissional
- Página **Nossas Obras** com filtros e galeria ampliada
- Navegação por teclado na galeria
- Formulário que abre uma mensagem pronta no WhatsApp do Luciano
- Links para WhatsApp, Facebook e Instagram
- Imagens convertidas para WebP para reduzir o peso do site
- Favicon 32×32
- SEO básico e dados estruturados da empresa
- `robots.txt` e `.gitignore`
- Melhorias de acessibilidade e suporte a redução de movimento

## Contato configurado

- WhatsApp: +55 (21) 97060-2683
- Facebook: Luciano Pinto
- Instagram: @lucianopinto103

## Testar localmente

Abra `index.html` no navegador. Para uma simulação mais próxima de produção, use a extensão **Live Server** do VS Code.

## Publicação na Hostinger

1. Entre no **Gerenciador de Arquivos** da Hostinger.
2. Abra a pasta `public_html` do domínio.
3. Envie **o conteúdo desta pasta**, mantendo a pasta `assets`.
4. Confirme que `index.html` está diretamente dentro de `public_html`.
5. Teste o site, a galeria e o formulário do WhatsApp após a publicação.

Estrutura esperada:

```text
public_html/
├── index.html
├── obras.html
├── style.css
├── script.js
├── robots.txt
└── assets/
```

## Publicação no GitHub

```bash
git init
git add .
git commit -m "Site Serrana Pinturas e Reformas V1.1"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

> Observação: o site funciona como um projeto estático. GitHub Pages pode hospedar esta versão; a Hostinger também pode receber os mesmos arquivos diretamente.

## SEO após definir o domínio

Depois de definir o domínio oficial, recomenda-se uma V1.2 com:

- URL canônica (`canonical`)
- URL da imagem Open Graph
- `sitemap.xml` com o domínio definitivo
- Cadastro no Google Search Console
- SEO local com a cidade e as áreas reais de atendimento

Não foram inventados domínio ou localização geográfica nesta versão para manter as informações do site corretas.
