<div align="center">
  <h1>🍳 ReceitaChef</h1>
  <p><strong>Sistema completo de gerenciamento de receitas culinárias</strong></p>
  <p>Aplicativo mobile com React Native + API backend em Node.js</p>
</div>

---

## 📋 Sobre o Projeto

O **ReceitaChef** é um sistema full-stack de gerenciamento de receitas culinárias desenvolvido como projeto acadêmico. A aplicação permite que usuários cadastrem, organizem, pesquisem e compartilhem suas receitas favoritas através de um aplicativo mobile intuitivo e moderno, integrado a uma API RESTful robusta.

### 🎯 Objetivo

Facilitar a vida de quem gosta de cozinhar, oferecendo uma plataforma digital onde é possível:
- Cadastrar receitas completas com ingredientes e modo de preparo
- Organizar por categorias (Sobremesa, Prato Principal, Entrada, etc.)
- Pesquisar e filtrar receitas rapidamente
- Gerenciar receitas próprias (editar e deletar)
- Visualizar receitas de outros usuários

---

## 🚀 Tecnologias

### Frontend Mobile
- **React Native** - Framework multiplataforma
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação file-based
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP

### Backend API
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **mysql2** - Driver MySQL

---
```
## 📁 Estrutura do Repositório
ReceitaChef/
├── front-end/                 # Frontend Mobile (React Native)
│   ├── app/                   # Telas da aplicação
│   ├── components/            # Componentes reutilizáveis
│   ├── services/              # Configuração da API
│   └── README.md              # Documentação do frontend
│
├── back-end/                  # Backend API (Node.js)
│   ├── config/                # Configuração do banco
│   ├── controllers/           # Lógica de negócio
│   ├── routes/                # Rotas da API
│   └── README.md              # Documentação do backend
│
└── README.md                  # Este arquivo
```

> 📖 Para instruções detalhadas, consulte os READMEs específicos em cada pasta.

---

## ⚙️ Funcionalidades

### ✅ Autenticação
- Cadastro de usuários
- Login com validação
- Persistência de sessão

### ✅ Gerenciamento de Receitas
- Criar receitas com ingredientes
- Listar todas as receitas
- Visualizar detalhes completos
- Editar receitas próprias
- Deletar receitas próprias

### ✅ Sistema de Busca e Filtros
- Busca em tempo real
- Filtros por categoria
- Identificação de autoria

### ✅ Perfil do Usuário
- Visualizar estatísticas
- Editar informações pessoais
- Logout

---

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js 16+
- MySQL 8+
- NPM ou Yarn
- Expo CLI (para o mobile)
- Dispositivo Android/iOS ou emulador

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/juliaoliveiramarttins/ReceitaChef.git
cd ReceitaChef
```

### 2️⃣ Configure o Backend
```bash
cd back-end
npm install
```

Configure o banco de dados em config/database.js (host, usuário, senha, porta).  
Crie manualmente o banco receitas_db no MySQL e execute os scripts SQL (você encontra esse scrit no readme do backend) para criar as tabelas.  

```bash
npm run dev
```

O backend estará rodando em http://localhost:3000

### 3️⃣ Configure o Frontend
```bash
cd front-end
npm install
```


Configure o IP da API em services/api.ts:
baseURL: 'http://SEU_IP:3000/api'
```bash
npx expo start
```

Escaneie o QR Code com o Expo Go ou pressione a/i para Android/iOS.

---

## 🗄️ Banco de Dados

O sistema utiliza MySQL com a seguinte estrutura:

### Entidades
- usuarios: Armazena dados dos usuários
- receitas: Contém as receitas cadastradas
- ingredientes: Lista de ingredientes por receita

### Relacionamentos
- Um usuário pode criar várias receitas (1:N)
- Uma receita possui vários ingredientes (1:N)

### API Endpoints
- GET /api/receitas        - Listar receitas
- POST /api/receitas       - Criar receita
- PUT /api/receitas/:id    - Atualizar receita
- DELETE /api/receitas/:id - Deletar receita

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como trabalho da disciplina de Desenvolvimento Mobile, cumprindo os requisitos de:

✅ Modelagem de banco de dados (DER/MER)  
✅ API backend em Node.js com CRUD completo  
✅ Aplicativo mobile em React Native  
✅ Integração frontend-backend  
✅ Documentação completa

---

## 🐛 Resolução de Problemas

### Erro de conexão no app
- Verifique se o backend está rodando
- Confirme o IP correto em services/api.ts
- Certifique-se que celular e PC estão na mesma rede Wi-Fi

### Erro no banco de dados
- Verifique se o MySQL está rodando na porta correta
- Confirme as credenciais em config/database.js
- Crie manualmente o banco receitas_db e execute os scripts SQL

---

## 👥 Autor

Júlia Martins

---

<div align="center">
  <p>⭐ Se este projeto te ajudou, deixe uma estrela!</p>
</div>
