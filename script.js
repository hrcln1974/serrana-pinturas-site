const KEY="serrana_media_v3";
const DEFAULTS=[
 {id:"demo1",type:"image",src:"assets/gallery/g1.webp",title:"Obra Serrana",source:"arquivo"},
 {id:"demo2",type:"image",src:"assets/gallery/g2.webp",title:"Trabalho realizado",source:"arquivo"}
];
function media(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
function allMedia(){const m=media();return m.length?m:DEFAULTS}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderGallery(){
 const box=document.getElementById("gallery"); if(!box)return;
 const items=allMedia(); box.innerHTML="";
 items.forEach((x,i)=>{
  const f=document.createElement("figure"); f.tabIndex=0; f.dataset.index=i;
  f.innerHTML=x.type==="video"?`<video controls preload="metadata" src="${esc(x.src)}"></video><figcaption>${esc(x.title)}</figcaption>`:`<img loading="lazy" src="${esc(x.src)}" alt="${esc(x.title)}"><figcaption>${esc(x.title)}</figcaption>`;
  if(x.type!=="video") f.onclick=()=>openLightbox(i);
  box.appendChild(f);
 });
 const empty=document.getElementById("empty-gallery"); if(empty)empty.hidden=items.length>0;
}
let current=0;
function openLightbox(i){const l=document.getElementById("lightbox");if(!l)return;current=i;drawLightbox();l.classList.add("open")}
function drawLightbox(){const items=allMedia(),x=items[current],c=document.getElementById("lightbox-content");c.innerHTML=x.type==="video"?`<video controls autoplay style="max-width:90vw;max-height:82vh" src="${esc(x.src)}"></video>`:`<img src="${esc(x.src)}" alt="${esc(x.title)}">`;document.getElementById("lightbox-caption").textContent=x.title||""}
document.addEventListener("DOMContentLoaded",()=>{
 const y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear();
 document.querySelectorAll(".menu-btn").forEach(b=>b.onclick=()=>{const h=document.querySelector(".header");h.classList.toggle("nav-open");b.setAttribute("aria-expanded",h.classList.contains("nav-open"))});
 const form=document.getElementById("whatsapp-form");if(form)form.onsubmit=e=>{e.preventDefault();const n=document.getElementById("nome").value,t=document.getElementById("telefone").value,s=document.getElementById("servico").value,m=document.getElementById("mensagem").value;const text=`Olá Luciano!%0A%0ANome: ${encodeURIComponent(n)}%0AWhatsApp: ${encodeURIComponent(t)}%0AServiço: ${encodeURIComponent(s)}%0AProjeto: ${encodeURIComponent(m)}`;window.open("https://wa.me/5521991331145?text="+text,"_blank")};
 renderGallery();
 const l=document.getElementById("lightbox");if(l){l.querySelector(".close").onclick=()=>l.classList.remove("open");l.querySelector(".prev").onclick=()=>{current=(current-1+allMedia().length)%allMedia().length;drawLightbox()};l.querySelector(".next").onclick=()=>{current=(current+1)%allMedia().length;drawLightbox()};l.onclick=e=>{if(e.target===l)l.classList.remove("open")}}
});