// Carregando Módulos
    const cors = require('cors');
    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const cookieParser = require('cookie-parser');

    const db = require("./config/db");
    const router = require('./routes/routes');
    const helmet = require('helmet'); // segurança

// Configurações
    app.use(helmet());
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-XSRF-TOKEN, x-access-token, Authorization, Content-Type, Accept");
        next();
    });
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
        app.use(express.json({limit: '50mb'}));
        app.use(express.urlencoded({
            extended: true,
            limit: '50mb',
            parameterLimit: 50000
        }));

        app.use(cookieParser());
// Rotas
    app.use("/", router)

// Outros
    const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
        console.log(`Our app is running on port ${ PORT }`);
    });