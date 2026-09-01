const KEY="serrana_media_v3",AUTH="serrana_admin_v3";
const $=id=>document.getElementById(id);
function get(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v));render()}
function logged(){return sessionStorage.getItem(AUTH)==="1"}
function show(){ $("login").hidden=logged(); $("app").hidden=!logged(); if(logged())render() }
function render(){const list=$("list"),items=get();list.innerHTML=items.length?"":"<p>Nenhuma mídia cadastrada.</p>";items.forEach((x,i)=>{const d=document.createElement("article");d.className="item";d.innerHTML=(x.type==="video"?`<video controls src="${x.src}"></video>`:`<img src="${x.src}" alt="">`)+`<div><b>${esc(x.title||"Sem título")}</b><small>${x.source||"arquivo"}</small><button class="delete" data-i="${i}">Excluir</button></div>`;list.appendChild(d)});list.querySelectorAll(".delete").forEach(b=>b.onclick=()=>{if(confirm("Excluir esta mídia?")){const a=get();a.splice(+b.dataset.i,1);save(a)}})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("loginForm").onsubmit=e=>{e.preventDefault();if($("user").value==="admin"&&$("pass").value==="serrana123"){sessionStorage.setItem(AUTH,"1");$("loginMsg").textContent="";show()}else $("loginMsg").textContent="Usuário ou senha inválidos."};
$("logout").onclick=()=>{sessionStorage.removeItem(AUTH);show()};
$("add").onclick=async()=>{const type=$("type").value,title=$("title").value.trim()||"Mídia Serrana",url=$("url").value.trim(),file=$("file").files[0];if(!file&&!url){$("msg").textContent="Escolha um arquivo ou informe uma URL.";return}
let src=url,source=url?"rede social / URL":"arquivo";if(file)src=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
const a=get();a.push({id:Date.now().toString(),type,src,title,source});try{save(a);$("msg").textContent="Mídia adicionada.";$("file").value="";$("url").value="";$("title").value=""}catch(e){$("msg").textContent="Arquivo grande demais para o armazenamento do navegador. Prefira uma URL ou foto menor."}};
$("export").onclick=()=>{const blob=new Blob([JSON.stringify(get(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="serrana-catalogo.json";a.click();URL.revokeObjectURL(a.href)};
$("import").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const a=JSON.parse(r.result);if(!Array.isArray(a))throw 0;save(a);alert("Catálogo importado.")}catch{alert("Arquivo JSON inválido.")}};r.readAsText(f)};
$("clear").onclick=()=>{if(confirm("Excluir TODAS as mídias?"))save([])};
show();