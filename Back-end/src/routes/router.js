import { Router } from "express";
import {
    cadastrarUsuario,
    editarUsuario,
    listarUsuarios,
    listarUsuarioPorId,
    excluirUsuario,
    loginUsuario
  } from '../controllers/usuario.controller.js';
  import {
    cadastrarAvaliacao,
    editarAvaliacao,
    excluirAvaliacao,
    listarAvaliacoesPorMetodo,
    listarAvaliacoesPorUsuario,
    mediaEstrelasMetodo
  } from '../controllers/avaliacoes.controller.js';
import {
    cadastrarMetodo,
    editarMetodo,
    excluirMetodo,
    listarMetodos,
    metodoPorId
} from '../controllers/metodos.controller.js';

const router = Router();

// ROTAS DOS USUARIOS

//rotas de cadastro
router.post('/usuario/cadastrar', cadastrarUsuario);

// Rota para editar usuário
router.put('/usuario/editar/:id', editarUsuario);

// Rota para listar todos os usuários
router.get('/usuarios', listarUsuarios);

// Rota para listar um usuário específico pelo ID
router.get('/usuarios/:id', listarUsuarioPorId);

// Rota para excluir um usuário pelo ID
router.delete('/usuario/excluir/:id', excluirUsuario);

// Rota de login
router.post('/login', loginUsuario);



//ROTAS DOS MÉTODOS
// Rota para cadastrar método contraceptivo
router.post('/metodos', cadastrarMetodo);

// Rota para editar método contraceptivo
router.put('/metodos/:id', editarMetodo);

// Rota para excluir método contraceptivo
router.delete('/metodos/:id', excluirMetodo);

// Rota para listar todos os métodos contraceptivos
router.get('/metodos', listarMetodos);

// Rota para listar um método contraceptivo específico pelo ID
router.get('/metodo/:id', metodoPorId);


//ROTAS DAS AVALIAÇÕES
// Rota para cadastrar uma nova avaliação
router.post('/avaliacoes', cadastrarAvaliacao);

// Rota para editar uma avaliação
router.put('/avaliacoes/:id', editarAvaliacao);

// Rota para excluir uma avaliação
router.delete('/avaliacoes/:id', excluirAvaliacao);

// Rota para listar todas as avaliações de um método contraceptivo específico
router.get('/avaliacoes/:id_metodo', listarAvaliacoesPorMetodo);

// Rota para listar todas as avaliações feitas por um usuário específico
router.get('/avaliacoes/usuario/:id_usuario', listarAvaliacoesPorUsuario);

// Rota para calcular a média de estrelas para um método contraceptivo específico
router.get('/avaliacoes/media/:id_metodo', mediaEstrelasMetodo);


export default router;