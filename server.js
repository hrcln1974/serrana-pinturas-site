require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const STORAGE_DIR = path.join(ROOT, 'storage');
const IMAGE_DIR = path.join(STORAGE_DIR, 'uploads', 'imagens');
const VIDEO_DIR = path.join(STORAGE_DIR, 'uploads', 'videos');
const MEDIA_FILE = path.join(STORAGE_DIR, 'media.json');
const SETTINGS_FILE = path.join(STORAGE_DIR, 'settings.json');
const MEDIA_SEED = path.join(DATA_DIR, 'media.seed.json');
const SETTINGS_SEED = path.join(DATA_DIR, 'settings.seed.json');
const SESSION_DAYS = Math.max(1, Number(process.env.SESSION_DAYS || 7));
const MAX_UPLOAD_MB = Math.max(1, Number(process.env.MAX_UPLOAD_MB || 200));
const ADMIN_USER = String(process.env.ADMIN_USER || 'admin').trim();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || 'troque-esta-senha');

for (const dir of [DATA_DIR, IMAGE_DIR, VIDEO_DIR]) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(MEDIA_FILE)) fs.copyFileSync(MEDIA_SEED, MEDIA_FILE);
if (!fs.existsSync(SETTINGS_FILE)) fs.copyFileSync(SETTINGS_SEED, SETTINGS_FILE);

app.disable('x-powered-by');
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({extended:true,limit:'2mb'}));
app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','SAMEORIGIN');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  next();
});

function readJson(file, fallback){ try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch { return fallback; } }
function writeJson(file, value){ fs.writeFileSync(file, JSON.stringify(value,null,2)+'\n'); }
function id(){ return crypto.randomBytes(12).toString('hex'); }
function clean(v, max=500){ return String(v ?? '').trim().slice(0,max); }
function normalizeUrl(v){ return clean(v,2000); }
function validHttpUrl(v){ try { const u=new URL(v); return ['http:','https:'].includes(u.protocol); } catch { return false; } }
function publicMedia(item){ return {...item}; }
function loadMedia(){ return readJson(MEDIA_FILE, []); }
function saveMedia(items){ writeJson(MEDIA_FILE, items); }
function safeFileName(name){ return path.basename(name).replace(/[^a-zA-Z0-9._-]/g,'_'); }

// Sessões em memória: o cookie é HttpOnly e SameSite=Lax. Reinício do app invalida sessões.
const sessions = new Map();
function issueSession(username){ const token=crypto.randomBytes(32).toString('hex'); sessions.set(token,{username,expires:Date.now()+SESSION_DAYS*86400000}); return token; }
function getSession(req){ const raw=req.headers.cookie||''; const m=raw.match(/(?:^|;\s*)serrana_session=([^;]+)/); if(!m)return null; const s=sessions.get(m[1]); if(!s)return null; if(s.expires<Date.now()){sessions.delete(m[1]);return null;} return {token:m[1],...s}; }
function auth(req,res,next){ const s=getSession(req); if(!s) return res.status(401).json({erro:'Não autorizado.'}); req.admin=s.username; next(); }
function rateKey(req){ return String(req.ip||'unknown'); }
const attempts=new Map();
function loginAllowed(req){ const now=Date.now(), key=rateKey(req), a=attempts.get(key)||[]; const recent=a.filter(t=>now-t<15*60*1000); attempts.set(key,recent); return recent.length<10; }
function noteLoginFailure(req){ const key=rateKey(req),a=attempts.get(key)||[];a.push(Date.now());attempts.set(key,a); }

const allowedImages=new Set(['image/jpeg','image/png','image/webp','image/gif']);
const allowedVideos=new Set(['video/mp4','video/webm','video/quicktime']);
const storage=multer.diskStorage({
  destination:(req,file,cb)=>cb(null,file.mimetype.startsWith('video/')?VIDEO_DIR:IMAGE_DIR),
  filename:(req,file,cb)=>cb(null,`${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeFileName(file.originalname)}`)
});
const upload=multer({storage,limits:{fileSize:MAX_UPLOAD_MB*1024*1024},fileFilter:(req,file,cb)=>{
  const ok=file.mimetype.startsWith('video/')?allowedVideos.has(file.mimetype):allowedImages.has(file.mimetype);
  cb(ok?null:new Error('Tipo de arquivo não permitido.'),ok);
}});

app.get('/api/health',(req,res)=>res.json({ok:true,version:'2.0.0'}));
app.get('/api/settings',(req,res)=>res.json(readJson(SETTINGS_FILE,{})));
app.get('/api/media',(req,res)=>{
  const type=clean(req.query.type,20); const category=clean(req.query.category,40);
  let media=loadMedia().filter(m=>(!type||m.type===type)&&(!category||category==='todas'||m.category===category));
  media.sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)) || String(b.dateAdded).localeCompare(String(a.dateAdded)));
  res.json({media:media.map(publicMedia)});
});

app.post('/api/admin/login',(req,res)=>{
  if(!loginAllowed(req)) return res.status(429).json({erro:'Muitas tentativas. Aguarde 15 minutos.'});
  const user=clean(req.body.user,100); const pass=String(req.body.password||'');
  if(user.toLowerCase()!==ADMIN_USER.toLowerCase() || pass!==ADMIN_PASSWORD){ noteLoginFailure(req); return res.status(401).json({erro:'Usuário ou senha incorretos.'}); }
  const token=issueSession(ADMIN_USER);
  res.setHeader('Set-Cookie',`serrana_session=${token}; Max-Age=${SESSION_DAYS*86400}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV==='production'?'; Secure':''}`);
  res.json({ok:true,user:ADMIN_USER});
});
app.post('/api/admin/logout',(req,res)=>{ const s=getSession(req); if(s)sessions.delete(s.token); res.setHeader('Set-Cookie','serrana_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'); res.json({ok:true}); });
app.get('/api/admin/me',auth,(req,res)=>res.json({authenticated:true,user:req.admin}));

app.post('/api/admin/media/upload',auth,upload.single('arquivo'),(req,res)=>{
  try{
    if(!req.file) return res.status(400).json({erro:'Selecione um arquivo.'});
    const type=req.file.mimetype.startsWith('video/')?'video':'image';
    const category=clean(req.body.category,40)||'geral';
    const item={id:id(),type,title:clean(req.body.title,150)||req.file.originalname,category,source:'local',url:`/uploads/${type==='video'?'videos':'imagens'}/${req.file.filename}`,description:clean(req.body.description,500),featured:req.body.featured==='true',dateAdded:new Date().toISOString().slice(0,10),tags:[]};
    let media=loadMedia(); if(item.featured) media=media.map(m=>({...m,featured:false})); media.unshift(item); saveMedia(media);
    res.status(201).json({ok:true,media:item});
  }catch(e){ if(req.file) try{fs.unlinkSync(req.file.path)}catch{}; res.status(500).json({erro:e.message||'Falha ao salvar mídia.'}); }
});

app.post('/api/admin/media/url',auth,(req,res)=>{
  const type=clean(req.body.type,20); const url=normalizeUrl(req.body.url);
  if(!['image','video'].includes(type)||!validHttpUrl(url)) return res.status(400).json({erro:'Informe um tipo e uma URL HTTP/HTTPS válida.'});
  const item={id:id(),type,title:clean(req.body.title,150)||'Mídia externa',category:clean(req.body.category,40)||'geral',source:'url',url,thumbnailUrl:normalizeUrl(req.body.thumbnailUrl),description:clean(req.body.description,500),featured:req.body.featured==='true',dateAdded:new Date().toISOString().slice(0,10),tags:[]};
  let media=loadMedia(); if(item.featured) media=media.map(m=>({...m,featured:false})); media.unshift(item); saveMedia(media); res.status(201).json({ok:true,media:item});
});

app.put('/api/admin/media/:id',auth,(req,res)=>{
  const items=loadMedia(); const i=items.findIndex(m=>m.id===req.params.id); if(i<0)return res.status(404).json({erro:'Mídia não encontrada.'});
  const old=items[i], patch={};
  if(req.body.title!==undefined) patch.title=clean(req.body.title,150)||old.title;
  if(req.body.category!==undefined) patch.category=clean(req.body.category,40)||'geral';
  if(req.body.description!==undefined) patch.description=clean(req.body.description,500);
  if(req.body.featured!==undefined) patch.featured=Boolean(req.body.featured);
  if(patch.featured) for(const m of items)m.featured=false;
  items[i]={...old,...patch}; saveMedia(items); res.json({ok:true,media:items[i]});
});

app.delete('/api/admin/media/:id',auth,(req,res)=>{
  const items=loadMedia(); const item=items.find(m=>m.id===req.params.id); if(!item)return res.status(404).json({erro:'Mídia não encontrada.'});
  if(item.source==='local' && item.url.startsWith('/uploads/')){ const rel=item.url.replace(/^\//,''); const file=path.join(ROOT,rel); if(file.startsWith(STORAGE_DIR) && fs.existsSync(file)) try{fs.unlinkSync(file)}catch{} }
  saveMedia(items.filter(m=>m.id!==item.id)); res.json({ok:true,mensagem:'Mídia excluída com sucesso.'});
});

app.post('/api/admin/media/:id/featured',auth,(req,res)=>{ const items=loadMedia(); const exists=items.some(m=>m.id===req.params.id); if(!exists)return res.status(404).json({erro:'Mídia não encontrada.'}); for(const m of items)m.featured=m.id===req.params.id; saveMedia(items); res.json({ok:true}); });

// Arquivos públicos e páginas
app.use('/uploads',express.static(path.join(STORAGE_DIR,'uploads'),{maxAge:'7d'}));
app.use(express.static(ROOT,{extensions:['html']}));
app.get('/admin',(req,res)=>res.sendFile(path.join(ROOT,'admin.html')));
app.use((err,req,res,next)=>{ if(err instanceof multer.MulterError) return res.status(400).json({erro:err.code==='LIMIT_FILE_SIZE'?`Arquivo maior que ${MAX_UPLOAD_MB} MB.`:err.message}); if(err) return res.status(400).json({erro:err.message||'Erro na requisição.'}); next(); });
app.listen(PORT,()=>console.log(`Serrana rodando na porta ${PORT}`));
