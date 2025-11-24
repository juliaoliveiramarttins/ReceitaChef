# 🍳 ReceitaChef - App de Receitas

Aplicativo mobile de gerenciamento de receitas culinárias desenvolvido com React Native e Expo.

## 📱 Funcionalidades

- ✅ Sistema de autenticação (Login e Cadastro)
- ✅ Gerenciamento de receitas (CRUD completo)
- ✅ Cadastro de ingredientes
- ✅ Busca e filtros por categoria
- ✅ Perfil do usuário editável
- ✅ Badge "Minha Receita" para receitas próprias
- ✅ Visualização de autor das receitas
- ✅ Interface moderna e responsiva
- ✅ Logo customizado com SVG

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação file-based
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **AsyncStorage** - Persistência local
- **Expo Linear Gradient** - Efeitos visuais
- **React Native SVG** - Ícones vetoriais
- **Ionicons** - Biblioteca de ícones

## 📋 Pré-requisitos

- Node.js 16+ instalado
- NPM ou Yarn
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Expo Go instalado no celular (para testar) ou Android Studio/Xcode (para emulador)

## 🔧 Instalação

1. Clone o repositório:

2. Instale as dependências:

```
npm install
```
3. Configure a URL da API:

Abra o arquivo `services/api.ts` e ajuste o `baseURL`:

- Para emulador Android
baseURL: 'http://10.0.2.2:3000/api'

- Para Expo Go no celular (substitua pelo IP do seu computador)
baseURL: 'http://SEU_IP:3000/api'

4. Iniciar o projeto
```
npx expo start
```

### Opções de execução

- Pressione `a` - Abrir no emulador Android
- Pressione `i` - Abrir no simulador iOS
- Escaneie o QR Code - Abrir no Expo Go (celular)


## 🎨 Principais Telas

### Login e Cadastro
- Logo customizado com panela SVG
- Validações de formulário
- Feedback visual de erros

### Tela Principal
- Header com logo, notificações e perfil
- Estatísticas personalizadas (minhas receitas e categorias)
- Barra de busca com filtros por categoria
- Cards de receitas com informações resumidas
- Badge "Minha Receita" para receitas próprias
- FAB (Floating Action Button) para adicionar receitas

### Cadastro de Receita
- Formulário completo com validações
- Seleção de categoria com chips
- Campos para ingredientes dinâmicos
- Atalhos de unidades de medida
- Preview da lista de ingredientes

### Detalhes da Receita
- Informações completas
- Lista de ingredientes
- Modo de preparo
- Identificação do autor
- Botão para deletar (apenas receitas próprias)

### Perfil
- Avatar e badge de status
- Estatísticas do usuário
- Edição de nome e email
- Opções de configuração
- Logout

## 🔑 Fluxo de Autenticação

1. Usuário faz login ou cadastro
2. Token/ID é salvo no AsyncStorage
3. Todas as requisições usam o ID do usuário
4. Logout limpa o AsyncStorage

## 🌐 Integração com API

O app consome uma API REST com os seguintes endpoints:

- `POST /api/usuarios` - Cadastro
- `POST /api/usuarios/login` - Login
- `GET /api/usuarios/:id` - Buscar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `GET /api/receitas` - Listar receitas
- `GET /api/receitas/:id` - Detalhes da receita
- `POST /api/receitas` - Criar receita
- `PUT /api/receitas/:id` - Atualizar receita
- `DELETE /api/receitas/:id` - Deletar receita

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se o backend está rodando
- Confirme o IP no arquivo `services/api.ts`
- Certifique-se de que celular e computador estão na mesma rede Wi-Fi

### Expo Go não conecta
- Desative VPN se estiver usando
- Verifique o firewall do Windows
- Use `npx expo start --tunnel` se necessário

### Erro de build

## 📱 Build para Produção

### Android (APK)
eas build --platform android

### iOS (IPA)
eas build --platform ios


## 👥 Autores

- Júlia Martina - Desenvolvimento


