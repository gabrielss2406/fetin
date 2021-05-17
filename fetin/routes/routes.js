// Carregando Módulos
    const express = require("express");
    const router = express.Router();

    const UserController = require('../controllers/UserController');

// Rotas
    router.get(("/"),(req,res) =>{
        res.json({
            numero: 11,
            texto: "Hello World!"
        });
    });

    router.post("/registrar", UserController.register);
    router.post("/login", UserController.login)

module.exports = router;