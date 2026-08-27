const phone = '5521970602683';
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuBtn = document.querySelector('.menu-btn');
const header = document.querySelector('.header');
menuBtn?.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => {
  header?.classList.remove('nav-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Abrir menu');
}));

const form = document.getElementById('whatsapp-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    'Olá, Luciano! Gostaria de solicitar um orçamento pela Serrana Pinturas & Reformas.',
    '',
    `*Nome:* ${data.get('nome')}`,
    `*WhatsApp:* ${data.get('telefone')}`,
    `*Serviço:* ${data.get('servico')}`,
    `*Projeto:* ${data.get('mensagem')}`
  ].join('\n');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

const gallery = document.getElementById('gallery');
if (gallery) {
  const items = [['g1.webp','pintura'],['g2.webp','reforma'],['g3.webp','pintura'],['g4.webp','reforma'],['g5.webp','pintura'],['g6.webp','reforma'],['g7.webp','pintura'],['g8.webp','reforma']];
  gallery.innerHTML = items.map((item, index) => `<figure data-category="${item[1]}" data-index="${index}" tabindex="0" role="button" aria-label="Ampliar obra ${index + 1}"><img loading="lazy" src="assets/gallery/${item[0]}" alt="Obra ${index + 1} da Serrana - ${item[1] === 'pintura' ? 'pintura e renovação' : 'reforma e transformação'}"><figcaption>${item[1] === 'pintura' ? 'Pintura e renovação' : 'Reforma e transformação'} • Projeto ${index + 1}</figcaption></figure>`).join('');
  let current = 0;
  let previousFocus = null;
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbP = lb.querySelector('p');
  const closeButton = lb.querySelector('.close');
  const show = index => { current = index; lbImg.src = `assets/gallery/${items[index][0]}`; lbImg.alt = `Obra ${index + 1} da Serrana ampliada`; lbP.textContent = `Projeto ${index + 1} de ${items.length}`; };
  const open = index => { previousFocus = document.activeElement; show(index); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; closeButton.focus(); };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; previousFocus?.focus(); };
  gallery.addEventListener('click', event => { const figure = event.target.closest('figure'); if (figure) open(Number(figure.dataset.index)); });
  gallery.addEventListener('keydown', event => { const figure = event.target.closest('figure'); if (figure && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); open(Number(figure.dataset.index)); } });
  closeButton.addEventListener('click', close);
  lb.addEventListener('click', event => { if (event.target === lb) close(); });
  lb.querySelector('.prev').addEventListener('click', () => show((current - 1 + items.length) % items.length));
  lb.querySelector('.next').addEventListener('click', () => show((current + 1) % items.length));
  document.addEventListener('keydown', event => { if (!lb.classList.contains('open')) return; if (event.key === 'Escape') close(); if (event.key === 'ArrowLeft') show((current - 1 + items.length) % items.length); if (event.key === 'ArrowRight') show((current + 1) % items.length); });
  document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => { document.querySelector('.filters .active')?.classList.remove('active'); button.classList.add('active'); document.querySelectorAll('.gallery figure').forEach(figure => { figure.hidden = button.dataset.filter !== 'all' && figure.dataset.category !== button.dataset.filter; }); }));
}
