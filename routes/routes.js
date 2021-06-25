// Carregando Módulos
    const express = require("express");
    const router = express.Router();

    const UserController = require('../controllers/UserController');
    const PerfilController = require('../controllers/PerfilController');
    const BuscaController = require('../controllers/BuscaController');
    const PasswordController = require('../controllers/PasswordController');
    const ChatController = require('../controllers/ChatController');

    const verifyJWT = require("../helpers/verifyJWT")
// Rotas
    router.get(("/"),(req,res) =>{res.json({numero: 11,texto: "Hello World!"});});

    router.post("/registrar", UserController.register)
    router.get("/registrar", UserController.tipo_trabalhador)
    router.post("/login", UserController.login)
    router.post("/logout", UserController.logout)
    
    router.post("/recuperarSenha", PasswordController.forgotPass)
    router.get("/reset", PasswordController.reset)
    router.post("/editarSenha", PasswordController.editSenha)

    router.get("/perfil", PerfilController.index);
    router.post("/perfil/edit", verifyJWT ,PerfilController.edit)

    router.post("/buscar",verifyJWT,BuscaController.buscar)
    router.get("/buscar",verifyJWT,BuscaController.buscar)

    router.get("/chat",verifyJWT,ChatController.show);
    router.get("/chat/:id",verifyJWT,ChatController.showPv)
    router.post("/chat/:id",verifyJWT,ChatController.add)

module.exports = router;