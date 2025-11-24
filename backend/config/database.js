const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'receitas_db',
    port: 3307  // ← ADICIONE ESTA LINHA
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL na porta 3307');
});

module.exports = connection;
