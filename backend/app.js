const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Importar rotas
const receitaRoutes = require('./routes/receitaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Usar rotas
app.use('/api/receitas', receitaRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
