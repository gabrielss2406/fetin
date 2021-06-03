// Carregando Módulos
    const cors = require('cors');
    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const cookieParser = require('cookie-parser');

    const db = require("./config/db");
    const router = require('./routes/routes');

// Configurações
    app.use(cors());
    // Mongoose
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log("Conectado ao mongo com sucesso")
        }).catch((err)=>{
            console.log("Erro ao conectar ao mongo: "+err)
        })
    // Parser
        app.use(express.json());
        app.use(express.urlencoded({
        extended: true
        }));

        app.use(cookieParser());
// Rotas
    app.use("/", router)

// Outros
    const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
        console.log(`Our app is running on port ${ PORT }`);
    });