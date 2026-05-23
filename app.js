// =============================================================
//  THAISA LINGERIE — LÓGICA DO SITE
//  Não é necessário editar este arquivo.
//  Para alterar produtos use: produtos.js
// =============================================================

// ── Estado ────────────────────────────────────────────────────
const state = {
  tamanhoSelecionado: {},  // { [produtoId]: tamanho }
  categoriaAtiva: 'todos',
  carrinho: [],            // [{ produto, tamanho, qty }]
};

// ── Inicialização ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderizarFiltros();
  renderizarProdutos(carregarProdutos());
  configurarHamburger();
  configurarCarrinho();
});

// ── Persistência ──────────────────────────────────────────────
function carregarProdutos() {
  try {
    const s = localStorage.getItem('thaisa_produtos');
    if (s) return JSON.parse(s);
  } catch (e) {}
  return PRODUTOS;
}

function carregarCategorias() {
  try {
    const s = localStorage.getItem('thaisa_categorias');
    if (s) return JSON.parse(s);
  } catch (e) {}
  return CATEGORIAS;
}

// ── Filtros ───────────────────────────────────────────────────
function renderizarFiltros() {
  const container = document.getElementById('filter-bar');
  container.appendChild(criarBotaoFiltro({ id: 'todos', label: 'Todos' }, true));
  carregarCategorias().forEach(cat => container.appendChild(criarBotaoFiltro(cat, false)));
}

function criarBotaoFiltro(cat, ativo) {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (ativo ? ' filter-btn--active' : '');
  btn.textContent = cat.label;
  btn.addEventListener('click', () => aplicarFiltro(cat.id, btn));
  return btn;
}

function aplicarFiltro(categoriaId, btnClicado) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
  btnClicado.classList.add('filter-btn--active');
  state.categoriaAtiva = categoriaId;
  const todos = carregarProdutos();
  renderizarProdutos(categoriaId === 'todos' ? todos : todos.filter(p => p.categoria === categoriaId));
}

// ── Catálogo ──────────────────────────────────────────────────
function renderizarProdutos(lista) {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '';
  lista.forEach(p => grid.appendChild(criarCardProduto(p)));
}

function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.className = 'product-card';

  function isMidia(v) { return v && (v.startsWith('http') || v.startsWith('data:')); }
  const srcFrente = isMidia(produto.fotoFrente) ? produto.fotoFrente : (isMidia(produto.emoji) ? produto.emoji : null);
  const srcVerso  = isMidia(produto.fotoVerso)  ? produto.fotoVerso  : null;

  let imgHtml;
  if (srcFrente && srcVerso) {
    imgHtml = `
      <div class="product-card__flip">
        <img class="product-card__flip-frente" src="${srcFrente}" alt="${produto.nome}" />
        <img class="product-card__flip-verso"  src="${srcVerso}"  alt="${produto.nome} — costas" />
        <span class="product-card__flip-hint">Passe o mouse</span>
      </div>`;
  } else if (srcFrente) {
    imgHtml = `<img class="product-card__image" src="${srcFrente}" alt="${produto.nome}">`;
  } else {
    imgHtml = `<span class="product-card__emoji" aria-hidden="true">${produto.emoji || '🎀'}</span>`;
  }

  card.innerHTML = `
    <div class="product-card__img">
      ${imgHtml}
      ${produto.badge ? `<span class="badge badge--${produto.badge}">${traduzirBadge(produto.badge)}</span>` : ''}
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name">${produto.nome}</h3>
      <p class="product-card__desc">${produto.descricao || ''}</p>
      <div class="product-card__price">
        ${produto.precoAntigo ? `<span class="product-card__price-old">${produto.precoAntigo}</span>` : ''}
        <span>${produto.preco}</span>
      </div>
      <p class="product-card__size-label">Tamanho</p>
      <div class="sizes" data-product-id="${produto.id}">
        ${TAMANHOS.map(t => `<button class="size-btn" data-tamanho="${t}" aria-label="Tamanho ${t}">${t}</button>`).join('')}
      </div>
    </div>
    <button class="btn btn--cart product-card__buy" data-product-id="${produto.id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      Adicionar ao Carrinho
    </button>
  `;

  // Flip no mobile (toque)
  const imgArea = card.querySelector('.product-card__img');
  if (imgArea && card.querySelector('.product-card__flip')) {
    imgArea.addEventListener('click', e => {
      if (e.target.closest('.size-btn') || e.target.closest('.product-card__buy')) return;
      imgArea.classList.toggle('verso-ativo');
    });
  }

  // Seleção de tamanho
  card.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('size-btn--active'));
      btn.classList.add('size-btn--active');
      state.tamanhoSelecionado[produto.id] = btn.dataset.tamanho;
    });
  });

  // Adicionar ao carrinho
  card.querySelector('.product-card__buy').addEventListener('click', () => adicionarAoCarrinho(produto));

  return card;
}

function traduzirBadge(badge) {
  return { novo: 'Novo', oferta: 'Oferta' }[badge] || badge;
}

// ── Carrinho ──────────────────────────────────────────────────
function configurarCarrinho() {
  document.getElementById('btn-abrir-carrinho').addEventListener('click', abrirCarrinho);
  document.getElementById('btn-fechar-carrinho').addEventListener('click', fecharCarrinho);
  document.getElementById('cart-overlay').addEventListener('click', fecharCarrinho);
  document.getElementById('btn-finalizar-pedido').addEventListener('click', finalizarPedido);
  document.getElementById('btn-limpar-carrinho').addEventListener('click', limparCarrinho);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharCarrinho(); });

  atualizarBadge();
}

function adicionarAoCarrinho(produto) {
  const tamanho = state.tamanhoSelecionado[produto.id];
  if (!tamanho) {
    mostrarToast('Selecione um tamanho antes de adicionar! 😊');
    return;
  }

  // Verifica se já existe o mesmo produto + tamanho
  const idx = state.carrinho.findIndex(i => i.produto.id === produto.id && i.tamanho === tamanho);
  if (idx !== -1) {
    state.carrinho[idx].qty += 1;
  } else {
    state.carrinho.push({ produto, tamanho, qty: 1 });
  }

  atualizarBadge();
  renderizarCarrinho();
  mostrarToast(`${produto.nome} (${tamanho}) adicionado! 🛍`);
}

function removerDoCarrinho(idx) {
  state.carrinho.splice(idx, 1);
  atualizarBadge();
  renderizarCarrinho();
}

function alterarQtd(idx, delta) {
  state.carrinho[idx].qty += delta;
  if (state.carrinho[idx].qty <= 0) {
    removerDoCarrinho(idx);
    return;
  }
  atualizarBadge();
  renderizarCarrinho();
}

function limparCarrinho() {
  state.carrinho = [];
  atualizarBadge();
  renderizarCarrinho();
}

function atualizarBadge() {
  const total = state.carrinho.reduce((acc, i) => acc + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  badge.textContent = total;
  badge.hidden = total === 0;
}

function renderizarCarrinho() {
  const corpo  = document.getElementById('cart-corpo');
  const vazio  = document.getElementById('cart-vazio');
  const footer = document.getElementById('cart-footer');

  corpo.innerHTML = '';

  const vazio_carrinho = state.carrinho.length === 0;

  // Mostra/esconde cada seção corretamente
  corpo.hidden  = vazio_carrinho;
  vazio.hidden  = !vazio_carrinho;
  footer.hidden = vazio_carrinho;

  if (vazio_carrinho) return;

  let totalNum = 0;

  state.carrinho.forEach((item, idx) => {
    const { produto, tamanho, qty } = item;

    // Calcula valor numérico do preço
    const precoNum = parseFloat(
      produto.preco.replace('R$', '').replace('.', '').replace(',', '.').trim()
    ) || 0;
    const subtotal = precoNum * qty;
    totalNum += subtotal;

    function isMidia(v) { return v && (v.startsWith('http') || v.startsWith('data:')); }
    const thumb = isMidia(produto.fotoFrente) ? produto.fotoFrente
                : isMidia(produto.emoji)      ? produto.emoji
                : null;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item__thumb">
        ${thumb
          ? `<img src="${thumb}" alt="${produto.nome}" />`
          : `<span class="cart-item__emoji">${produto.emoji || '🎀'}</span>`}
      </div>
      <div class="cart-item__info">
        <p class="cart-item__nome">${produto.nome}</p>
        <p class="cart-item__tam">Tamanho: <strong>${tamanho}</strong></p>
        <p class="cart-item__preco">${produto.preco}</p>
        <div class="cart-item__qty">
          <button class="qty-btn" data-idx="${idx}" data-delta="-1">−</button>
          <span>${qty}</span>
          <button class="qty-btn" data-idx="${idx}" data-delta="1">+</button>
        </div>
      </div>
      <button class="cart-item__remover" data-idx="${idx}" aria-label="Remover">✕</button>
    `;
    corpo.appendChild(div);
  });

  // Total
  document.getElementById('cart-total-valor').textContent =
    'R$ ' + totalNum.toFixed(2).replace('.', ',');

  // Eventos dos botões de qty e remover
  corpo.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => alterarQtd(Number(btn.dataset.idx), Number(btn.dataset.delta)));
  });
  corpo.querySelectorAll('.cart-item__remover').forEach(btn => {
    btn.addEventListener('click', () => removerDoCarrinho(Number(btn.dataset.idx)));
  });
}

function abrirCarrinho() {
  renderizarCarrinho();
  document.getElementById('cart-drawer').classList.add('cart-drawer--open');
  document.getElementById('cart-overlay').classList.add('cart-overlay--open');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  document.getElementById('cart-drawer').classList.remove('cart-drawer--open');
  document.getElementById('cart-overlay').classList.remove('cart-overlay--open');
  document.body.style.overflow = '';
}

// ── Finalizar pedido via WhatsApp ─────────────────────────────
function finalizarPedido() {
  if (state.carrinho.length === 0) return;

  let linhas = 'Olá! Gostaria de fazer um pedido:\n\n';
  let totalNum = 0;

  state.carrinho.forEach((item, i) => {
    const { produto, tamanho, qty } = item;
    const precoNum = parseFloat(
      produto.preco.replace('R$', '').replace('.', '').replace(',', '.').trim()
    ) || 0;
    totalNum += precoNum * qty;

    linhas += `${i + 1}. *${produto.nome}*\n`;
    linhas += `   📏 Tamanho: ${tamanho}\n`;
    linhas += `   🔢 Quantidade: ${qty}\n`;
    linhas += `   💰 ${produto.preco}${qty > 1 ? ' (cada)' : ''}\n\n`;
  });

  linhas += `*Total: R$ ${totalNum.toFixed(2).replace('.', ',')}*\n\n`;
  linhas += 'Poderia me ajudar a finalizar o pedido?';

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(linhas)}`;
  window.open(url, '_blank');
  fecharCarrinho();
}

// ── Toast de feedback ─────────────────────────────────────────
let toastTimer = null;
function mostrarToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.hidden = false;
  toast.classList.add('toast--visivel');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visivel');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2500);
}

// ── Menu mobile (hamburger) ───────────────────────────────────
function configurarHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  btn.addEventListener('click', () => {
    const aberto = links.classList.toggle('nav__links--open');
    btn.setAttribute('aria-expanded', aberto);
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
      btn.setAttribute('aria-expanded', false);
    });
  });
}
