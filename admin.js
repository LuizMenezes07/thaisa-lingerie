// =============================================================
//  THAISA LINGERIE - LOGICA DO PAINEL ADMIN
// =============================================================

// CREDENCIAIS - altere aqui se quiser mudar usuario/senha
const ADMIN_USUARIO = 'SEU_USUARIO_AQUI';
const ADMIN_SENHA   = 'SUA_SENHA_AQUI';

const STORAGE_PRODUTOS   = 'thaisa_produtos';
const STORAGE_CATEGORIAS = 'thaisa_categorias';

// Estado global
let produtos    = [];
let categorias  = [];
let fotoFrente  = null;
let fotoVerso   = null;
let editandoId  = null;
let excluindoId = null;
let editandoCatId  = null;
let excluindoCatId = null;
let abaAtiva    = 'produtos';

// =============================================================
// INICIALIZACAO
// =============================================================

document.addEventListener('DOMContentLoaded', () => {
  categorias = carregarCategorias();
  produtos   = carregarProdutos();

  configurarLogin();
  configurarAbas();
  configurarFormularioProduto();
  configurarFormularioCategoria();
  configurarBusca();
  configurarExclusaoProduto();
  configurarExclusaoCategoria();
});

// =============================================================
// PERSISTENCIA - PRODUTOS
// =============================================================

function carregarProdutos() {
  try {
    const salvo = localStorage.getItem(STORAGE_PRODUTOS);
    if (salvo) return JSON.parse(salvo);
  } catch (e) {}
  return (typeof PRODUTOS !== 'undefined') ? JSON.parse(JSON.stringify(PRODUTOS)) : [];
}

function salvarProdutos() {
  localStorage.setItem(STORAGE_PRODUTOS, JSON.stringify(produtos));
}

// =============================================================
// PERSISTENCIA - CATEGORIAS
// =============================================================

function carregarCategorias() {
  try {
    const salvo = localStorage.getItem(STORAGE_CATEGORIAS);
    if (salvo) return JSON.parse(salvo);
  } catch (e) {}
  return (typeof CATEGORIAS !== 'undefined') ? JSON.parse(JSON.stringify(CATEGORIAS)) : [];
}

function salvarCategorias() {
  localStorage.setItem(STORAGE_CATEGORIAS, JSON.stringify(categorias));
}

// =============================================================
// LOGIN / LOGOUT
// =============================================================

function configurarLogin() {
  document.getElementById('btn-sair').addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    location.reload();
  });

  if (sessionStorage.getItem('admin_auth') === '1') {
    mostrarPainel();
    return;
  }

  document.getElementById('btn-login').addEventListener('click', fazerLogin);
  document.getElementById('login-usuario').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('login-senha').focus();
  });
  document.getElementById('login-senha').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fazerLogin();
  });
}

function fazerLogin() {
  const usuario = document.getElementById('login-usuario').value.trim();
  const senha   = document.getElementById('login-senha').value;
  const erro    = document.getElementById('login-erro');

  if (usuario === ADMIN_USUARIO && senha === ADMIN_SENHA) {
    sessionStorage.setItem('admin_auth', '1');
    erro.hidden = true;
    mostrarPainel();
  } else {
    erro.hidden = false;
    document.getElementById('login-senha').value = '';
    document.getElementById('login-senha').focus();
  }
}

function mostrarPainel() {
  document.getElementById('tela-login').hidden = true;
  document.getElementById('painel').hidden = false;
  mostrarAba('produtos');
}

// =============================================================
// ABAS (Produtos / Categorias)
// =============================================================

function configurarAbas() {
  document.getElementById('aba-produtos').addEventListener('click', () => mostrarAba('produtos'));
  document.getElementById('aba-categorias').addEventListener('click', () => mostrarAba('categorias'));
}

function mostrarAba(aba) {
  abaAtiva = aba;

  document.getElementById('aba-produtos').classList.toggle('aba--ativa', aba === 'produtos');
  document.getElementById('aba-categorias').classList.toggle('aba--ativa', aba === 'categorias');
  document.getElementById('secao-produtos').hidden   = aba !== 'produtos';
  document.getElementById('secao-categorias').hidden = aba !== 'categorias';

  if (aba === 'produtos') {
    atualizarSelectsCategorias();
    renderizarTabelaProdutos();
  } else {
    renderizarTabelaCategorias();
  }
}

// =============================================================
// TABELA DE PRODUTOS
// =============================================================

function renderizarTabelaProdutos(lista) {
  lista = lista ?? produtos;
  const corpo    = document.getElementById('tabela-corpo');
  const vazio    = document.getElementById('tabela-vazia');
  const contagem = document.getElementById('contagem-produtos');

  corpo.innerHTML = '';
  contagem.textContent = produtos.length + ' produto' + (produtos.length !== 1 ? 's' : '') + ' cadastrado' + (produtos.length !== 1 ? 's' : '');

  if (lista.length === 0) { vazio.hidden = false; return; }
  vazio.hidden = true;

  lista.forEach(function(p) {
    const tr = document.createElement('tr');
    const isUrl = typeof p.emoji === 'string' && (p.emoji.startsWith('http') || p.emoji.startsWith('data:'));
    const thumbHtml = isUrl
      ? '<img class="tabela-thumb" src="' + p.emoji + '" alt="' + p.nome + '" />'
      : '<span class="tabela-emoji">' + (p.emoji || '🎀') + '</span>';
    const badgeHtml = p.badge
      ? '<span class="tabela-badge tabela-badge--' + p.badge + '">' + traduzirBadge(p.badge) + '</span>'
      : '&mdash;';

    tr.innerHTML =
      '<td>' + thumbHtml + '</td>' +
      '<td><strong>' + p.nome + '</strong><br><small style="color:var(--texto-leve)">' + (p.descricao || '') + '</small></td>' +
      '<td>' + labelCategoria(p.categoria) + '</td>' +
      '<td>' + (p.precoAntigo ? '<span style="text-decoration:line-through;color:var(--texto-leve);font-size:0.78rem">' + p.precoAntigo + '</span><br>' : '') + p.preco + '</td>' +
      '<td>' + badgeHtml + '</td>' +
      '<td><div class="tabela-acoes">' +
        '<button class="btn btn--outline btn--pequeno" data-acao="editar" data-id="' + p.id + '">Editar</button>' +
        '<button class="btn btn--perigo btn--pequeno" data-acao="excluir" data-id="' + p.id + '">Excluir</button>' +
      '</div></td>';
    corpo.appendChild(tr);
  });

  corpo.querySelectorAll('[data-acao]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = Number(btn.dataset.id);
      if (btn.dataset.acao === 'editar')  abrirFormularioProdutoEdicao(id);
      if (btn.dataset.acao === 'excluir') abrirConfirmacaoExclusaoProduto(id);
    });
  });
}

// =============================================================
// TABELA DE CATEGORIAS
// =============================================================

function renderizarTabelaCategorias() {
  const corpo  = document.getElementById('tabela-cat-corpo');
  const vazio  = document.getElementById('tabela-cat-vazia');
  const contagem = document.getElementById('contagem-categorias');

  corpo.innerHTML = '';
  contagem.textContent = categorias.length + ' categoria' + (categorias.length !== 1 ? 's' : '') + ' cadastrada' + (categorias.length !== 1 ? 's' : '');

  if (categorias.length === 0) { vazio.hidden = false; return; }
  vazio.hidden = true;

  categorias.forEach(function(cat) {
    const qtd = produtos.filter(function(p) { return p.categoria === cat.id; }).length;
    const tr  = document.createElement('tr');

    tr.innerHTML =
      '<td><strong>' + cat.label + '</strong></td>' +
      '<td><code class="cat-id">' + cat.id + '</code></td>' +
      '<td>' + qtd + ' produto' + (qtd !== 1 ? 's' : '') + '</td>' +
      '<td><div class="tabela-acoes">' +
        '<button class="btn btn--outline btn--pequeno" data-acao="editar" data-id="' + cat.id + '">Editar</button>' +
        '<button class="btn btn--perigo btn--pequeno" data-acao="excluir" data-id="' + cat.id + '"' + (qtd > 0 ? ' title="Remova os produtos desta categoria primeiro"' : '') + '>Excluir</button>' +
      '</div></td>';
    corpo.appendChild(tr);
  });

  corpo.querySelectorAll('[data-acao]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      if (btn.dataset.acao === 'editar')  abrirFormularioCategoriaEdicao(id);
      if (btn.dataset.acao === 'excluir') abrirConfirmacaoExclusaoCategoria(id);
    });
  });
}

// =============================================================
// HELPERS
// =============================================================

function labelCategoria(id) {
  const cat = categorias.find(function(c) { return c.id === id; });
  return cat ? cat.label : id;
}

function traduzirBadge(badge) {
  return { novo: 'Novo', oferta: 'Oferta' }[badge] || badge;
}

function atualizarSelectsCategorias() {
  ['filtro-categoria', 'campo-categoria'].forEach(function(selectId) {
    const comTodos = selectId === 'filtro-categoria';
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const valorAtual = sel.value;
    sel.innerHTML = '';
    if (comTodos) {
      const opt = document.createElement('option');
      opt.value = ''; opt.textContent = 'Todas as categorias';
      sel.appendChild(opt);
    }
    categorias.forEach(function(cat) {
      const opt = document.createElement('option');
      opt.value = cat.id; opt.textContent = cat.label;
      sel.appendChild(opt);
    });
    sel.value = valorAtual;
  });
}

// =============================================================
// BUSCA E FILTRO
// =============================================================

function configurarBusca() {
  const busca  = document.getElementById('busca');
  const filtro = document.getElementById('filtro-categoria');

  function aplicar() {
    const termo = busca.value.toLowerCase().trim();
    const cat   = filtro.value;
    const lista = produtos.filter(function(p) {
      const matchTermo = !termo || p.nome.toLowerCase().includes(termo) || (p.descricao || '').toLowerCase().includes(termo);
      const matchCat   = !cat   || p.categoria === cat;
      return matchTermo && matchCat;
    });
    renderizarTabelaProdutos(lista);
  }

  busca.addEventListener('input', aplicar);
  filtro.addEventListener('change', aplicar);
}

// =============================================================
// FORMULARIO DE PRODUTO
// =============================================================

function configurarFormularioProduto() {
  document.getElementById('btn-novo-produto').addEventListener('click', abrirFormularioProdutoNovo);
  document.getElementById('btn-fechar-modal').addEventListener('click', fecharFormularioProduto);
  document.getElementById('btn-cancelar').addEventListener('click', fecharFormularioProduto);
  document.getElementById('btn-salvar').addEventListener('click', salvarProduto);
  document.getElementById('modal-produto').addEventListener('click', function(e) {
    if (e.target.id === 'modal-produto') fecharFormularioProduto();
  });
  configurarUploadFoto();
}

function abrirFormularioProdutoNovo() {
  editandoId = null;
  limparFormularioProduto();
  document.getElementById('modal-form-titulo').textContent = 'Novo Produto';
  document.getElementById('modal-produto').hidden = false;
  document.getElementById('campo-nome').focus();
}

function abrirFormularioProdutoEdicao(id) {
  const p = produtos.find(function(x) { return x.id === id; });
  if (!p) return;
  editandoId = id;
  limparFormularioProduto();
  document.getElementById('modal-form-titulo').textContent = 'Editar Produto';
  document.getElementById('campo-nome').value         = p.nome        || '';
  document.getElementById('campo-descricao').value    = p.descricao   || '';
  document.getElementById('campo-preco').value        = p.preco       || '';
  document.getElementById('campo-preco-antigo').value = p.precoAntigo || '';
  document.getElementById('campo-categoria').value    = p.categoria   || '';
  document.getElementById('campo-badge').value        = p.badge       || '';
  // Preenche emoji (fallback) e fotos frente/verso
  if (p.emoji && !p.emoji.startsWith('data:') && !p.emoji.startsWith('http')) {
    document.getElementById('campo-emoji').value = p.emoji || '';
  }
  preencherUploadsEdicao(p);
  document.getElementById('modal-produto').hidden = false;
  document.getElementById('campo-nome').focus();
}

function fecharFormularioProduto() {
  document.getElementById('modal-produto').hidden = true;
  document.getElementById('form-erro').hidden = true;
  editandoId = null;
}

function limparFormularioProduto() {
  ['campo-nome','campo-descricao','campo-preco','campo-preco-antigo','campo-emoji'].forEach(function(id) {
    document.getElementById(id).value = '';
  });
  atualizarSelectsCategorias();
  if (categorias.length > 0) document.getElementById('campo-categoria').value = categorias[0].id;
  document.getElementById('campo-badge').value = '';
  document.getElementById('form-erro').hidden = true;
  limparTodosUploads();
}

function salvarProduto() {
  const nome        = document.getElementById('campo-nome').value.trim();
  const descricao   = document.getElementById('campo-descricao').value.trim();
  const preco       = document.getElementById('campo-preco').value.trim();
  const precoAntigo = document.getElementById('campo-preco-antigo').value.trim();
  const categoria   = document.getElementById('campo-categoria').value;
  const badge       = document.getElementById('campo-badge').value;
  const emoji       = document.getElementById('campo-emoji').value.trim() || '🎀';
  const erro        = document.getElementById('form-erro');

  if (!nome || !preco || !categoria) {
    erro.textContent = 'Preencha os campos obrigatorios: Nome, Preco e Categoria.';
    erro.hidden = false; return;
  }
  erro.hidden = true;

  // fotoFrente tem prioridade; emoji e' o fallback
  const frente = fotoFrente || emoji;
  const verso  = fotoVerso  || null;

  if (editandoId !== null) {
    const idx = produtos.findIndex(function(p) { return p.id === editandoId; });
    if (idx !== -1) produtos[idx] = { id: editandoId, nome, descricao, preco, precoAntigo, emoji: frente, fotoFrente: frente, fotoVerso: verso, categoria, badge };
  } else {
    const novoId = produtos.length > 0 ? Math.max.apply(null, produtos.map(function(p) { return p.id; })) + 1 : 1;
    produtos.push({ id: novoId, nome, descricao, preco, precoAntigo, emoji: frente, fotoFrente: frente, fotoVerso: verso, categoria, badge });
  }

  salvarProdutos();
  fecharFormularioProduto();
  renderizarTabelaProdutos();
}

// =============================================================
// FORMULARIO DE CATEGORIA
// =============================================================

function configurarFormularioCategoria() {
  document.getElementById('btn-nova-categoria').addEventListener('click', abrirFormularioCategoriaNova);
  document.getElementById('btn-fechar-modal-cat').addEventListener('click', fecharFormularioCategoria);
  document.getElementById('btn-cancelar-cat').addEventListener('click', fecharFormularioCategoria);
  document.getElementById('btn-salvar-cat').addEventListener('click', salvarCategoria);
  document.getElementById('modal-categoria').addEventListener('click', function(e) {
    if (e.target.id === 'modal-categoria') fecharFormularioCategoria();
  });

  // Gera o ID automaticamente a partir do nome
  document.getElementById('cat-campo-label').addEventListener('input', function() {
    if (editandoCatId !== null) return; // nao sobrescreve ao editar
    const label = this.value.trim();
    const id = label
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    document.getElementById('cat-campo-id').value = id;
  });
}

function abrirFormularioCategoriaNova() {
  editandoCatId = null;
  document.getElementById('cat-campo-label').value = '';
  document.getElementById('cat-campo-id').value    = '';
  document.getElementById('cat-campo-id').disabled = false;
  document.getElementById('cat-form-erro').hidden  = true;
  document.getElementById('modal-cat-titulo').textContent = 'Nova Categoria';
  document.getElementById('modal-categoria').hidden = false;
  document.getElementById('cat-campo-label').focus();
}

function abrirFormularioCategoriaEdicao(id) {
  const cat = categorias.find(function(c) { return c.id === id; });
  if (!cat) return;
  editandoCatId = id;
  document.getElementById('cat-campo-label').value = cat.label;
  document.getElementById('cat-campo-id').value    = cat.id;
  document.getElementById('cat-campo-id').disabled = true; // ID nao pode mudar (produtos ja usam)
  document.getElementById('cat-form-erro').hidden  = true;
  document.getElementById('modal-cat-titulo').textContent = 'Editar Categoria';
  document.getElementById('modal-categoria').hidden = false;
  document.getElementById('cat-campo-label').focus();
}

function fecharFormularioCategoria() {
  document.getElementById('modal-categoria').hidden = true;
  document.getElementById('cat-form-erro').hidden   = true;
  editandoCatId = null;
}

function salvarCategoria() {
  const label = document.getElementById('cat-campo-label').value.trim();
  const id    = document.getElementById('cat-campo-id').value.trim();
  const erro  = document.getElementById('cat-form-erro');

  if (!label || !id) {
    erro.textContent = 'Preencha o nome da categoria.';
    erro.hidden = false; return;
  }

  // Verifica ID duplicado (apenas ao criar nova)
  if (editandoCatId === null) {
    const jaExiste = categorias.some(function(c) { return c.id === id; });
    if (jaExiste) {
      erro.textContent = 'Ja existe uma categoria com este ID. Altere o nome.';
      erro.hidden = false; return;
    }
  }

  if (editandoCatId !== null) {
    const idx = categorias.findIndex(function(c) { return c.id === editandoCatId; });
    if (idx !== -1) categorias[idx].label = label;
  } else {
    categorias.push({ id: id, label: label });
  }

  salvarCategorias();
  fecharFormularioCategoria();
  renderizarTabelaCategorias();
}

// =============================================================
// UPLOAD DE FOTOS (FRENTE E VERSO)
// =============================================================

function configurarUploadFoto() {
  configurarSlotUpload(
    'upload-area-frente', 'input-foto-frente',
    'preview-frente', 'upload-placeholder-frente', 'btn-remover-frente',
    function(base64) { fotoFrente = base64; },
    function() { fotoFrente = null; }
  );
  configurarSlotUpload(
    'upload-area-verso', 'input-foto-verso',
    'preview-verso', 'upload-placeholder-verso', 'btn-remover-verso',
    function(base64) { fotoVerso = base64; },
    function() { fotoVerso = null; }
  );
}

function configurarSlotUpload(areaId, inputId, previewId, placeholderId, btnRemId, onSet, onRemove) {
  const area   = document.getElementById(areaId);
  const input  = document.getElementById(inputId);
  const btnRem = document.getElementById(btnRemId);

  area.addEventListener('click', function() { input.click(); });
  input.addEventListener('change', function() {
    if (input.files[0]) processarArquivo(input.files[0], previewId, placeholderId, btnRemId, onSet);
  });
  area.addEventListener('dragover', function(e) { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', function() { area.classList.remove('drag-over'); });
  area.addEventListener('drop', function(e) {
    e.preventDefault(); area.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) processarArquivo(e.dataTransfer.files[0], previewId, placeholderId, btnRemId, onSet);
  });
  btnRem.addEventListener('click', function(e) {
    e.stopPropagation();
    removerSlotFoto(previewId, placeholderId, btnRemId, inputId);
    onRemove();
  });
}

function processarArquivo(arquivo, previewId, placeholderId, btnRemId, onSet) {
  if (!arquivo.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById(previewId).src    = base64;
    document.getElementById(previewId).hidden = false;
    document.getElementById(placeholderId).hidden = true;
    document.getElementById(btnRemId).hidden  = false;
    onSet(base64);
  };
  reader.readAsDataURL(arquivo);
}

function removerSlotFoto(previewId, placeholderId, btnRemId, inputId) {
  document.getElementById(previewId).src    = '';
  document.getElementById(previewId).hidden = true;
  document.getElementById(placeholderId).hidden = false;
  document.getElementById(btnRemId).hidden  = true;
  document.getElementById(inputId).value    = '';
}

function limparTodosUploads() {
  removerSlotFoto('preview-frente', 'upload-placeholder-frente', 'btn-remover-frente', 'input-foto-frente');
  removerSlotFoto('preview-verso',  'upload-placeholder-verso',  'btn-remover-verso',  'input-foto-verso');
  fotoFrente = null;
  fotoVerso  = null;
}

function preencherUploadsEdicao(produto) {
  function isBase64OrUrl(v) { return v && (v.startsWith('data:') || v.startsWith('http')); }

  // Frente
  const srcFrente = isBase64OrUrl(produto.fotoFrente)
    ? produto.fotoFrente
    : (isBase64OrUrl(produto.emoji) ? produto.emoji : null);
  if (srcFrente) {
    fotoFrente = srcFrente;
    document.getElementById('preview-frente').src    = srcFrente;
    document.getElementById('preview-frente').hidden = false;
    document.getElementById('upload-placeholder-frente').hidden = true;
    document.getElementById('btn-remover-frente').hidden = false;
  }

  // Verso
  if (isBase64OrUrl(produto.fotoVerso)) {
    fotoVerso = produto.fotoVerso;
    document.getElementById('preview-verso').src    = produto.fotoVerso;
    document.getElementById('preview-verso').hidden = false;
    document.getElementById('upload-placeholder-verso').hidden = true;
    document.getElementById('btn-remover-verso').hidden = false;
  }
}

// =============================================================
// EXCLUSAO DE PRODUTO
// =============================================================

function configurarExclusaoProduto() {
  document.getElementById('btn-cancelar-excluir').addEventListener('click', fecharExclusaoProduto);
  document.getElementById('btn-confirmar-excluir').addEventListener('click', confirmarExclusaoProduto);
  document.getElementById('modal-excluir').addEventListener('click', function(e) {
    if (e.target.id === 'modal-excluir') fecharExclusaoProduto();
  });
}

function abrirConfirmacaoExclusaoProduto(id) {
  excluindoId = id;
  document.getElementById('msg-excluir').textContent = 'Tem certeza que deseja excluir este produto?';
  document.getElementById('modal-excluir').hidden = false;
}

function fecharExclusaoProduto() {
  excluindoId = null;
  document.getElementById('modal-excluir').hidden = true;
}

function confirmarExclusaoProduto() {
  if (excluindoId === null) return;
  produtos = produtos.filter(function(p) { return p.id !== excluindoId; });
  salvarProdutos();
  fecharExclusaoProduto();
  renderizarTabelaProdutos();
}

// =============================================================
// EXCLUSAO DE CATEGORIA
// =============================================================

function configurarExclusaoCategoria() {
  document.getElementById('btn-cancelar-excluir-cat').addEventListener('click', fecharExclusaoCategoria);
  document.getElementById('btn-confirmar-excluir-cat').addEventListener('click', confirmarExclusaoCategoria);
  document.getElementById('modal-excluir-cat').addEventListener('click', function(e) {
    if (e.target.id === 'modal-excluir-cat') fecharExclusaoCategoria();
  });
}

function abrirConfirmacaoExclusaoCategoria(id) {
  const qtd = produtos.filter(function(p) { return p.categoria === id; }).length;
  if (qtd > 0) {
    alert('Esta categoria tem ' + qtd + ' produto(s) vinculado(s).\nRemova ou mude a categoria dos produtos antes de excluir.');
    return;
  }
  excluindoCatId = id;
  document.getElementById('modal-excluir-cat').hidden = false;
}

function fecharExclusaoCategoria() {
  excluindoCatId = null;
  document.getElementById('modal-excluir-cat').hidden = true;
}

function confirmarExclusaoCategoria() {
  if (excluindoCatId === null) return;
  categorias = categorias.filter(function(c) { return c.id !== excluindoCatId; });
  salvarCategorias();
  fecharExclusaoCategoria();
  renderizarTabelaCategorias();
}
