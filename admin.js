const KEY='serrana_media_v4';
const AUTH='serrana_admin_session_v4';
const USER='admin';
const PASS='serrana123';
const DEMO=[
{id:'demo-1',type:'image',src:'assets/gallery/demo-banner.png',title:'Apresentação Serrana',source:'Demonstração'},
{id:'demo-2',type:'image',src:'assets/gallery/demo-luciano.png',title:'Luciano Pinto — apresentação',source:'Demonstração'},
{id:'demo-3',type:'image',src:'assets/gallery/demo-ls.png',title:'Referência visual de acabamento',source:'Demonstração'},
{id:'demo-4',type:'image',src:'assets/gallery/demo-logo.png',title:'Identidade Serrana',source:'Demonstração'}
];
const $=id=>document.getElementById(id);
function read(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):DEMO}catch{return DEMO}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v));render()}
function logged(){return sessionStorage.getItem(AUTH)==='1'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function youtubeId(url){try{const u=new URL(url);if(u.hostname.includes('youtu.be'))return u.pathname.slice(1);if(u.hostname.includes('youtube.com'))return u.searchParams.get('v')||((u.pathname.match(/\/shorts\/([^/]+)/)||u.pathname.match(/\/embed\/([^/]+)/)||[])[1]);}catch{}return null}
function render(){const items=read(),list=$('list');$('countAll').textContent=items.length;$('countImages').textContent=items.filter(x=>x.type==='image').length;$('countVideos').textContent=items.filter(x=>x.type==='video').length;if(!items.length){list.innerHTML='<p class="empty">Nenhuma mídia cadastrada.</p>';return}list.innerHTML='';items.forEach((x,i)=>{const d=document.createElement('article');d.className='item';const yid=x.youtubeId||youtubeId(x.src||'');let media=x.type==='video'&&yid?`<div class="preview-video"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(yid)}" title="${esc(x.title)}" loading="lazy" allowfullscreen></iframe></div>`:x.type==='video'?`<video controls src="${esc(x.src)}"></video>`:`<img src="${esc(x.src)}" alt="${esc(x.title)}">`;d.innerHTML=`${media}<div class="meta"><b>${esc(x.title||'Sem título')}</b><small class="source">${esc(x.source||'arquivo local')}</small>${x.src?.startsWith('data:')?'<small>Arquivo armazenado neste navegador</small>':''}</div><button class="delete" type="button" data-i="${i}">Excluir</button>`;list.appendChild(d)});list.querySelectorAll('.delete').forEach(b=>b.onclick=()=>{if(confirm('Excluir esta mídia?')){const a=read();a.splice(Number(b.dataset.i),1);write(a)}})}
function show(){ $('login').hidden=logged();$('app').hidden=!logged();if(logged())render() }
$('loginForm').onsubmit=e=>{e.preventDefault();const u=$('user').value.trim(),p=$('pass').value;if(u===USER&&p===PASS){sessionStorage.setItem(AUTH,'1');$('loginMsg').textContent='';show()}else $('loginMsg').textContent='Usuário ou senha inválidos.'};
$('showPass').onclick=()=>{$('pass').type=$('pass').type==='password'?'text':'password'};
$('logout').onclick=()=>{sessionStorage.removeItem(AUTH);show()};
$('add').onclick=async()=>{const type=$('type').value,title=$('title').value.trim()||'Mídia Serrana',url=$('url').value.trim(),file=$('file').files[0];if(!file&&!url){$('msg').textContent='Escolha um arquivo ou informe uma URL.';return}let src=url,source=url?'URL pública':'Arquivo local';if(file){if(type==='image'&&!file.type.startsWith('image/')){$('msg').textContent='Selecione uma imagem para o tipo Foto.';return}if(type==='video'&&!file.type.startsWith('video/')){$('msg').textContent='Selecione um vídeo para o tipo Vídeo.';return}if(file.size>12*1024*1024){$('msg').textContent='Arquivo acima de 12 MB. Prefira uma URL pública ou arquivo menor.';return}src=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}const item={id:Date.now().toString(),type,src,title,source};const a=read();a.push(item);try{write(a);$('msg').textContent='Mídia adicionada com sucesso.';$('file').value='';$('url').value='';$('title').value=''}catch{$('msg').textContent='Não foi possível salvar. O armazenamento deste navegador pode estar cheio.'}};
$('clear').onclick=()=>{if(confirm('Excluir TODAS as mídias do catálogo?'))write([])};
$('resetDemo').onclick=()=>{if(confirm('Restaurar as mídias de demonstração? Isso substituirá o catálogo atual.'))write(DEMO)};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(read(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='serrana-catalogo-v4.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('import').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const a=JSON.parse(r.result);if(!Array.isArray(a))throw new Error();write(a);alert('Catálogo importado com sucesso.')}catch{alert('Arquivo JSON inválido.')}};r.readAsText(f);e.target.value=''};
show();
