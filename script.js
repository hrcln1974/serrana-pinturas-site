const KEY='serrana_media_v4';
const DEMO=[
{id:'demo-1',type:'image',src:'assets/gallery/demo-banner.png',title:'Apresentação Serrana',source:'Demonstração'},
{id:'demo-2',type:'image',src:'assets/gallery/demo-luciano.png',title:'Luciano Pinto — apresentação',source:'Demonstração'},
{id:'demo-3',type:'image',src:'assets/gallery/demo-ls.png',title:'Referência visual de acabamento',source:'Demonstração'},
{id:'demo-4',type:'image',src:'assets/gallery/demo-logo.png',title:'Identidade Serrana',source:'Demonstração'}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function read(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):DEMO}catch{return DEMO}}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function youtubeId(url){try{const u=new URL(url);if(u.hostname.includes('youtu.be'))return u.pathname.slice(1);if(u.hostname.includes('youtube.com'))return u.searchParams.get('v')||((u.pathname.match(/\/shorts\/([^/]+)/)||u.pathname.match(/\/embed\/([^/]+)/)||[])[1]);}catch{}return null}
function normalize(x){const yid=x.youtubeId||youtubeId(x.src||'');if(yid)return {...x,type:'video',embed:`https://www.youtube.com/embed/${encodeURIComponent(yid)}`};return x}
function allMedia(){return read().map(normalize)}
let current=0,visible=[];
function renderGallery(filter='all'){
 const box=$('#gallery');if(!box)return;const items=allMedia().filter(x=>filter==='all'||x.type===filter);visible=items;box.innerHTML='';
 items.forEach((x,i)=>{const f=document.createElement('figure');f.tabIndex=0;f.dataset.index=i;f.dataset.type=x.type;
 if(x.type==='video'&&x.embed) f.innerHTML=`<div class="video-thumb"><iframe src="${esc(x.embed)}" title="${esc(x.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><figcaption>${esc(x.title)}</figcaption>`;
 else if(x.type==='video') f.innerHTML=`<video controls preload="metadata" src="${esc(x.src)}"></video><figcaption>${esc(x.title)}</figcaption>`;
 else f.innerHTML=`<img loading="lazy" src="${esc(x.src)}" alt="${esc(x.title)}"><figcaption>${esc(x.title)}${x.source?`<small>${esc(x.source)}</small>`:''}</figcaption>`;
 f.onclick=()=>openLightbox(i);f.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(i)}};box.appendChild(f)});
 const empty=$('#empty-gallery');if(empty)empty.hidden=items.length>0;
}
function openLightbox(i){if(!visible.length)return;current=i;drawLightbox();$('#lightbox').classList.add('open');}
function drawLightbox(){const x=visible[current],c=$('#lightbox-content');if(x.type==='video'&&x.embed)c.innerHTML=`<iframe src="${esc(x.embed)}?autoplay=1" title="${esc(x.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;else if(x.type==='video')c.innerHTML=`<video controls autoplay src="${esc(x.src)}"></video>`;else c.innerHTML=`<img src="${esc(x.src)}" alt="${esc(x.title)}">`;$('#lightbox-caption').textContent=x.title||''}
function init(){const y=$('#year');if(y)y.textContent=new Date().getFullYear();$$('.menu-btn').forEach(b=>b.onclick=()=>{const h=document.querySelector('.header');h.classList.toggle('nav-open');b.setAttribute('aria-expanded',h.classList.contains('nav-open'))});
 const form=$('#whatsapp-form');if(form)form.onsubmit=e=>{e.preventDefault();const n=$('#nome').value,t=$('#telefone').value,s=$('#servico').value,m=$('#mensagem').value;window.open('https://wa.me/5521991331145?text='+encodeURIComponent(`Olá Luciano!\n\nNome: ${n}\nWhatsApp: ${t}\nServiço: ${s}\nProjeto: ${m}`),'_blank')};
 if($('#gallery')){renderGallery();$$('.filters button').forEach(b=>b.onclick=()=>{$$('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderGallery(b.dataset.filter)})}
 const l=$('#lightbox');if(l){$('.close').onclick=()=>l.classList.remove('open');$('.prev').onclick=()=>{current=(current-1+visible.length)%visible.length;drawLightbox()};$('.next').onclick=()=>{current=(current+1)%visible.length;drawLightbox()};l.onclick=e=>{if(e.target===l)l.classList.remove('open')};document.addEventListener('keydown',e=>{if(!l.classList.contains('open'))return;if(e.key==='Escape')l.classList.remove('open');if(e.key==='ArrowLeft')$('.prev').click();if(e.key==='ArrowRight')$('.next').click()})}}
document.addEventListener('DOMContentLoaded',init);
