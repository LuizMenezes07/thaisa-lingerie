# 🎀 Thaisa Lingerie

🌐 **[Ver site ao vivo → thaisalingerie.netlify.app](https://thaisalingerie.netlify.app/)**

Site de vendas de lingerie com catálogo, carrinho de compras e integração com WhatsApp. Inclui painel administrativo completo para gerenciar produtos e categorias diretamente pelo navegador, sem precisar mexer em código.

---

## ⚙️ Configuração antes de usar

### 1. Número do WhatsApp
Abra `produtos.js` e substitua `SEU_NUMERO_AQUI` pelo número real:
```js
const WHATSAPP_NUMERO = '5535999999999';
// Formato: código do país (55) + DDD + número, sem espaços ou traços
```

### 2. Usuário e senha do Admin
Abra `admin.js` e substitua os valores no topo:
```js
const ADMIN_USUARIO = 'seu_usuario';
const ADMIN_SENHA   = 'sua_senha_segura';
```

> ⚠️ **Importante:** Nunca suba o código com seu número real ou senha para o GitHub público. Configure localmente antes de usar.

---

## ✨ Funcionalidades

### Loja (index.html)
- Catálogo de produtos com filtro por categoria
- Foto frente e verso com efeito de flip ao passar o mouse
- Seleção de tamanho por produto
- Carrinho de compras com controle de quantidade
- Finalização do pedido via WhatsApp com resumo completo
- Layout responsivo para celular e desktop

### Painel Admin (admin.html)
- Login com usuário e senha
- Gerenciar produtos: adicionar, editar e remover
- Upload de foto frente e verso por produto
- Gerenciar categorias: adicionar, editar e remover
- Dados salvos automaticamente no navegador (localStorage)

---

## 📁 Estrutura de arquivos

```
thaisa-lingerie/
├── index.html      → loja (página principal)
├── style.css       → estilos da loja
├── app.js          → lógica da loja e carrinho
├── produtos.js     → ⚙️ configurar WhatsApp e produtos iniciais
├── admin.html      → painel administrativo
├── admin.css       → estilos do painel admin
├── admin.js        → ⚙️ configurar usuário e senha do admin
└── README.md       → este arquivo
```

---

## 🚀 Como publicar

### Netlify (recomendado)
1. Configure o WhatsApp em `produtos.js` e as credenciais em `admin.js`
2. Acesse [netlify.com](https://netlify.com) e crie uma conta gratuita
3. Arraste a pasta do projeto para a área de deploy
4. O site estará no ar com um link público ✅

### Atualizar o site no Netlify
1. Acesse seu site no Netlify → aba **Deploys**
2. Arraste a pasta atualizada para a área de deploy

### GitHub Pages
1. Configure os arquivos como indicado acima
2. Suba para um repositório no GitHub
3. Vá em **Settings → Pages**, selecione a branch `main` e clique em **Save**

---

## 🛠 Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks)
- Google Fonts (Cormorant Garamond + Jost)
- localStorage para persistência dos dados do admin
- API do WhatsApp para envio de pedidos

---

## 📱 Acesso ao Admin

Após publicar, acesse o painel em:
```
https://thaisalingerie.netlify.app/admin.html
```
