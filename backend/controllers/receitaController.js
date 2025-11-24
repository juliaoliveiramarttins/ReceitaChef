const db = require('../config/database');

// Listar todas as receitas COM nome do autor
exports.listarReceitas = (req, res) => {
    const query = `
        SELECT 
            r.*,
            u.nome as nome_autor,
            u.email as email_autor
        FROM receitas r
        LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
        ORDER BY r.data_criacao DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
};

// Buscar receita por ID COM autor e ingredientes
exports.buscarReceitaPorId = (req, res) => {
    const { id } = req.params;
    
    // Buscar receita com autor
    const queryReceita = `
        SELECT 
            r.*,
            u.nome as nome_autor,
            u.email as email_autor
        FROM receitas r
        LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
        WHERE r.id_receita = ?
    `;
    
    db.query(queryReceita, [id], (err, receitaResults) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (receitaResults.length === 0) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }
        
        const receita = receitaResults[0];
        
        // Buscar ingredientes
        const queryIngredientes = 'SELECT * FROM ingredientes WHERE id_receita = ?';
        
        db.query(queryIngredientes, [id], (err, ingredientesResults) => {
            if (err) return res.status(500).json({ erro: err.message });
            
            receita.ingredientes = ingredientesResults;
            res.json(receita);
        });
    });
};

exports.criarReceita = (req, res) => {
    const { nome_receita, descricao, modo_preparo, tempo_preparo, porcoes, categoria, id_usuario, ingredientes } = req.body;
    
    const queryReceita = `
        INSERT INTO receitas (nome_receita, descricao, modo_preparo, tempo_preparo, porcoes, categoria, id_usuario) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(queryReceita, [nome_receita, descricao, modo_preparo, tempo_preparo, porcoes, categoria, id_usuario], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        const idReceita = result.insertId;
        
        if (ingredientes && ingredientes.length > 0) {
            const queryIngrediente = 'INSERT INTO ingredientes (id_receita, nome_ingrediente, quantidade, unidade_medida) VALUES ?';
            const valoresIngredientes = ingredientes.map(ing => [
                idReceita,
                ing.nome_ingrediente,
                ing.quantidade,
                ing.unidade_medida
            ]);
            
            db.query(queryIngrediente, [valoresIngredientes], (err) => {
                if (err) return res.status(500).json({ erro: err.message });
                res.status(201).json({ mensagem: 'Receita criada com sucesso', id_receita: idReceita });
            });
        } else {
            res.status(201).json({ mensagem: 'Receita criada com sucesso', id_receita: idReceita });
        }
    });
};

exports.atualizarReceita = (req, res) => {
    const { id } = req.params;
    const { nome_receita, descricao, modo_preparo, tempo_preparo, porcoes, categoria } = req.body;
    
    const query = `
        UPDATE receitas 
        SET nome_receita = ?, descricao = ?, modo_preparo = ?, tempo_preparo = ?, porcoes = ?, categoria = ? 
        WHERE id_receita = ?
    `;
    
    db.query(query, [nome_receita, descricao, modo_preparo, tempo_preparo, porcoes, categoria, id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }
        
        res.json({ mensagem: 'Receita atualizada com sucesso' });
    });
};

exports.deletarReceita = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM receitas WHERE id_receita = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Receita não encontrada' });
        }
        
        res.json({ mensagem: 'Receita deletada com sucesso' });
    });
};
