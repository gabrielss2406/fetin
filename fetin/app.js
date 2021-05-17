// Carregando Módulos
    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();

    const db = require("./config/db");
    const router = require('./routes/routes');

// Configurações
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log("Conectado ao mongo com sucesso")
        }).catch((err)=>{
            console.log("Erro ao conectar ao mongo: "+err)
        })
    // BodyParser
        app.use(express.json());
        app.use(express.urlencoded({
        extended: true
        }));
// Rotas
    app.use("/", router)

// Outros
    const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
        console.log(`Our app is running on port ${ PORT }`);
    });