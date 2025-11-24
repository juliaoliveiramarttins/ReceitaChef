# 🍳 CookNote API - Backend

API RESTful para gerenciamento de receitas culinárias desenvolvida com Node.js, Express e MySQL.

## 🚀 Tecnologias

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **mysql2** - Driver MySQL para Node.js
- **CORS** - Middleware para requisições cross-origin
- **Nodemon** - Hot reload em desenvolvimento

## 📋 Funcionalidades

- ✅ CRUD completo de usuários
- ✅ CRUD completo de receitas
- ✅ Sistema de autenticação (login)
- ✅ Cadastro de ingredientes por receita
- ✅ Relacionamento entre usuários e receitas
- ✅ Validações de dados
- ✅ Prevenção de email duplicado
- ✅ Retorno de nome do autor nas receitas

## 📋 Pré-requisitos

- Node.js 16+ instalado
- MySQL 8+ instalado e rodando
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:

2. Instale as dependências:

<!-- - npm install -->

3. Configure o banco de dados:

Crie um banco de dados MySQL chamado `receitas_db`:

CREATE DATABASE receitas_db;
USE receitas_db;

4. Execute o script de criação das tabelas:

-- Tabela de Usuários
CREATE TABLE usuarios (
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR(255) NOT NULL,
data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Receitas
CREATE TABLE receitas (
id_receita INT AUTO_INCREMENT PRIMARY KEY,
nome_receita VARCHAR(150) NOT NULL,
descricao TEXT,
modo_preparo TEXT NOT NULL,
tempo_preparo INT NOT NULL,
porcoes INT NOT NULL,
categoria VARCHAR(50),
id_usuario INT,
data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de Ingredientes
CREATE TABLE ingredientes (
id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
id_receita INT,
nome_ingrediente VARCHAR(100) NOT NULL,
quantidade VARCHAR(50),
unidade_medida VARCHAR(50),
FOREIGN KEY (id_receita) REFERENCES receitas(id_receita) ON DELETE CASCADE
);  


5. Configure as credenciais do MySQL:

Edite o arquivo `config/database.js`:

const connection = mysql.createConnection({
host: 'localhost',
user: 'seu_usuario', // Altere aqui
password: 'sua_senha', // Altere aqui
database: 'receitas_db'
});


## ▶️ Executando o Projeto

### Desenvolvimento (com hot reload)

npm run dev

### Produção

npm start


O servidor estará rodando em: `http://localhost:3000`


## 🔌 Endpoints da API

### Usuários

#### Cadastro


## 🔐 Validações Implementadas

### Usuários
- ✅ Email único (não permite duplicados)
- ✅ Senha mínima de 6 caracteres
- ✅ Validação de formato de email
- ✅ Campos obrigatórios: nome, email, senha

### Receitas
- ✅ Campos obrigatórios validados
- ✅ Tempo e porções devem ser números
- ✅ Categoria e descrição opcionais
- ✅ Ingredientes podem ser vazios

## 🗄️ Modelo de Dados

### Usuários
id_usuario (PK, AUTO_INCREMENT)
nome (VARCHAR 100, NOT NULL)
email (VARCHAR 100, UNIQUE, NOT NULL)
senha (VARCHAR 255, NOT NULL)
data_cadastro (TIMESTAMP, DEFAULT NOW)

### Receitas

id_receita (PK, AUTO_INCREMENT)
nome_receita (VARCHAR 150, NOT NULL)
descricao (TEXT)
modo_preparo (TEXT, NOT NULL)
tempo_preparo (INT, NOT NULL)
porcoes (INT, NOT NULL)
categoria (VARCHAR 50)
id_usuario (FK -> usuarios)
data_criacao (TIMESTAMP, DEFAULT NOW)


### Ingredientes

id_ingrediente (PK, AUTO_INCREMENT)
id_receita (FK -> receitas)
nome_ingrediente (VARCHAR 100, NOT NULL)
quantidade (VARCHAR 50)
unidade_medida (VARCHAR 50)

## 🐛 Troubleshooting

### Erro de conexão com MySQL

- Verifique se o MySQL está rodando

mysql -u root -p

- Teste a conexão

USE receitas_db;
SHOW TABLES;

## 📊 Scripts Disponíveis

npm start # Inicia o servidor

npm run dev # Inicia com nodemon (hot reload)



## 👥 Autores

- Julia Martins - Desenvolvimento


