// Carregando Módulos
    const express = require("express");
    const router = express.Router();

    const UserController = require('../controllers/UserController');
    const PerfilController = require('../controllers/PerfilController');

    const verifyJWT = require("../helpers/verifyJWT")
// Rotas
    router.get(("/"),(req,res) =>{
        res.json({
            numero: 11,
            texto: "Hello World!"
        });
    });

    router.post("/registrar", UserController.register);
    router.post("/login", UserController.login)
    router.post("/logout", UserController.logout)

    router.get("/perfil", PerfilController.index);
    router.post("/perfil/edit", verifyJWT ,PerfilController.edit);

module.exports = router;