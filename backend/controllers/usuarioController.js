const db = require('../config/database');

// Listar todos os usuários (sem mostrar senha)
exports.listarUsuarios = (req, res) => {
    db.query('SELECT id_usuario, nome, email, data_cadastro FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
};

// Buscar usuário por ID (sem mostrar senha)
exports.buscarUsuarioPorId = (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT id_usuario, nome, email, data_cadastro FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        
        res.json(results[0]);
    });
};

// LOGIN - Novo endpoint
exports.login = (req, res) => {
    const { email, senha } = req.body;
    
    // Validações
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }
    
    // Buscar usuário por email e senha
    db.query('SELECT id_usuario, nome, email, data_cadastro FROM usuarios WHERE email = ? AND senha = ?', 
        [email, senha], 
        (err, results) => {
            if (err) return res.status(500).json({ erro: err.message });
            
            if (results.length === 0) {
                return res.status(401).json({ erro: 'Email ou senha incorretos' });
            }
            
            // Retornar dados do usuário (sem senha)
            res.json({
                mensagem: 'Login realizado com sucesso',
                usuario: results[0]
            });
        }
    );
};

// CADASTRO - Criar novo usuário com validações
exports.criarUsuario = (req, res) => {
    const { nome, email, senha } = req.body;
    
    // Validações
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }
    
    if (senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' });
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ erro: 'Email inválido' });
    }
    
    // Verificar se o email já existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (results.length > 0) {
            return res.status(400).json({ erro: 'Este email já está cadastrado' });
        }
        
        // Inserir novo usuário
        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        
        db.query(query, [nome, email, senha], (err, result) => {
            if (err) return res.status(500).json({ erro: err.message });
            
            res.status(201).json({ 
                mensagem: 'Usuário cadastrado com sucesso', 
                usuario: {
                    id_usuario: result.insertId,
                    nome,
                    email
                }
            });
        });
    });
};

// Atualizar usuário
exports.atualizarUsuario = (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    
    // Validações
    if (!nome || !email) {
        return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    }
    
    // Se forneceu senha nova, validar
    if (senha && senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' });
    }
    
    // Verificar se email já existe em outro usuário
    db.query('SELECT * FROM usuarios WHERE email = ? AND id_usuario != ?', [email, id], (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (results.length > 0) {
            return res.status(400).json({ erro: 'Este email já está em uso' });
        }
        
        // Atualizar usuário
        let query, params;
        
        if (senha) {
            query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id_usuario = ?';
            params = [nome, email, senha, id];
        } else {
            query = 'UPDATE usuarios SET nome = ?, email = ? WHERE id_usuario = ?';
            params = [nome, email, id];
        }
        
        db.query(query, params, (err, result) => {
            if (err) return res.status(500).json({ erro: err.message });
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
            
            res.json({ mensagem: 'Usuário atualizado com sucesso' });
        });
    });
};

// Deletar usuário
exports.deletarUsuario = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        
        res.json({ mensagem: 'Usuário deletado com sucesso' });
    });
};
