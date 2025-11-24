const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');

router.get('/', receitaController.listarReceitas);
router.get('/:id', receitaController.buscarReceitaPorId);
router.post('/', receitaController.criarReceita);
router.put('/:id', receitaController.atualizarReceita);
router.delete('/:id', receitaController.deletarReceita);

module.exports = router;
