const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota de LOGIN
router.post('/login', usuarioController.login);

// Rotas CRUD
router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.buscarUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;
