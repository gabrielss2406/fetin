// Carregando Módulos
    const express = require("express");
    const router = express.Router();

    const UserController = require('../controllers/UserController');
    const PerfilController = require('../controllers/PerfilController');
    const BuscaController = require('../controllers/BuscaController');
    const PasswordController = require('../controllers/PasswordController');
    const ChatController = require('../controllers/ChatController');
    const RelacaoController = require('../controllers/RelacaoController')

    const verifyJWT = require("../helpers/verifyJWT")
    const verifyTBR = require("../helpers/verifyTRB")
// Rotas
    router.get(("/"),(req,res) =>{res.json({numero: 11,texto: "Hello World!"});});

    router.post("/registrar", UserController.register)
    router.get("/registrar", UserController.tipo_trabalhador)
    router.post("/login", UserController.login)
    router.post("/logout", UserController.logout)
    
    router.post("/recuperarSenha", PasswordController.forgotPass)
    router.get("/reset", PasswordController.reset)
    router.post("/reset", PasswordController.nova_senha)
    router.post("/editarSenha", PasswordController.editSenha)

    router.post("/perfil", verifyTBR , PerfilController.index);
    router.get("/perfil/:id", PerfilController.Perfil)
    router.post("/perfil/comentarios/:id_trabalhador", verifyJWT , PerfilController.comentario)
    router.post("/perfil/edit", verifyJWT ,PerfilController.edit)

    router.post("/buscar",verifyJWT,BuscaController.buscar)
    router.get("/buscar",verifyJWT,BuscaController.buscar)

    router.get("/chat",verifyJWT,ChatController.show);
    router.get("/chat/:id",verifyJWT,ChatController.showPv)
    router.post("/chat/:id",verifyJWT,ChatController.add)

    router.post("/enviarelacao",verifyJWT,RelacaoController.send) // cliente -> trabalhador
    router.post("/enviarelacao/aceitar",verifyTBR,RelacaoController.accept) // trabalhador
    router.post("/enviarelacao/recusar",verifyTBR,RelacaoController.refuse) // trabalhador
    router.get("/relacoes",verifyTBR,RelacaoController.sendIndex) // trabalhador vizualiza
    router.get("/historico/:id",verifyJWT,RelacaoController.history) // historico aceitas
    router.get("/avaliacao/:id",RelacaoController.avaliacao) // media avaliacao

module.exports = router;