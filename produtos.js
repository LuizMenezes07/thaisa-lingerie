// =============================================================
//  THAISA LINGERIE — CONFIGURAÇÃO DE PRODUTOS
//  ✏️  Este é o único arquivo que você precisa editar!
// =============================================================

// ------------------------------------------------------------------
// 1. NÚMERO DO WHATSAPP
//    Coloque o número com código do país + DDD, sem espaços ou traços.
//    Exemplo: '5535998687615'
// ------------------------------------------------------------------
const WHATSAPP_NUMERO = 'SEU_NUMERO_AQUI'; // Ex: 5535999999999

// ------------------------------------------------------------------
// 2. CATEGORIAS
//    Adicione, remova ou renomeie categorias aqui.
//    'id'    → identificador interno (não use espaços ou acentos)
//    'label' → nome exibido no botão de filtro
// ------------------------------------------------------------------
const CATEGORIAS = [
  { id: 'conjunto',  label: 'Conjuntos'  },
  { id: 'sutia',     label: 'Sutiãs'     },
  { id: 'calcinha',  label: 'Calcinhas'  },
  { id: 'camisola',  label: 'Camisolas'  },
];

// ------------------------------------------------------------------
// 3. TAMANHOS DISPONÍVEIS
//    Altere a lista conforme os tamanhos que você trabalha.
// ------------------------------------------------------------------
const TAMANHOS = ['P', 'M', 'G', 'GG'];

// ------------------------------------------------------------------
// 4. LISTA DE PRODUTOS
//    Para ADICIONAR → copie um bloco { ... } e cole entre vírgulas.
//    Para REMOVER   → apague o bloco { ... } inteiro (com a vírgula).
//    Para EDITAR    → altere o campo desejado dentro do bloco.
//
//    Campos:
//      id          → número único (não repita!)
//      nome        → nome do produto
//      descricao   → breve descrição
//      preco       → preço atual (ex: 'R$ 129,90')
//      precoAntigo → preço riscado (opcional; remova a linha se não usar)
//      emoji       → ícone exibido na foto (pode usar qualquer emoji 😊)
//      categoria   → deve ser igual ao 'id' de uma categoria acima
//      badge       → etiqueta no canto ('novo', 'oferta', ou '' para nenhuma)
// ------------------------------------------------------------------
const PRODUTOS = [
  {
    id: 1,
    nome: 'Conjunto Rendado Rosa',
    descricao: 'Sutiã + calcinha em renda delicada',
    preco: 'R$ 129,90',
    emoji: '👙',
    categoria: 'conjunto',
    badge: 'novo',
  },
  {
    id: 2,
    nome: 'Conjunto Cetim Nude',
    descricao: 'Sutiã triangular + calcinha fio dental',
    preco: 'R$ 149,90',
    emoji: '🧸',
    categoria: 'conjunto',
    badge: '',
  },
  {
    id: 3,
    nome: 'Sutiã Floral Encaixe',
    descricao: 'Bojo removível, alças ajustáveis',
    preco: 'R$ 89,90',
    emoji: '🌸',
    categoria: 'sutia',
    badge: 'novo',
  },
  {
    id: 4,
    nome: 'Sutiã Rendado Preto',
    descricao: 'Meia taça com detalhes em laço',
    preco: 'R$ 94,90',
    precoAntigo: 'R$ 119,90',
    emoji: '🖤',
    categoria: 'sutia',
    badge: 'oferta',
  },
  {
    id: 5,
    nome: 'Calcinha Renda Floral',
    descricao: 'Alta, confortável e delicada',
    preco: 'R$ 39,90',
    emoji: '🌺',
    categoria: 'calcinha',
    badge: '',
  },
  {
    id: 6,
    nome: 'Calcinha Fio Rosa',
    descricao: 'Microfibra com acabamento em renda',
    preco: 'R$ 34,90',
    emoji: '🎀',
    categoria: 'calcinha',
    badge: '',
  },
  {
    id: 7,
    nome: 'Camisola Cetim Rosa',
    descricao: 'Alcinhas finas, comprimento médio',
    preco: 'R$ 119,90',
    emoji: '🌷',
    categoria: 'camisola',
    badge: 'novo',
  },
  {
    id: 8,
    nome: 'Camisola Renda Nude',
    descricao: 'Renda na barra, super elegante',
    preco: 'R$ 134,90',
    precoAntigo: 'R$ 159,90',
    emoji: 'https://images.tcdn.com.br/img/img_prod/1223651/look_completo_camisola_com_bojo_e_fio_com_robe_todo_em_renda_1634_1_7adb6680cd8df8bbc7c6b6485c289e4f.jpg',
    categoria: 'camisola',
    badge: 'oferta',
  },
];
