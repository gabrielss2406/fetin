const mongoose = require('mongoose')
const Schema  = mongoose.Schema


//modelo usuarios
const Usuarios = new Schema({
    nome: {
        type: String,
        require: true
    },

    cpf: {
        type: String,
        require: true
    },

    e_trabalhador:{ // 0 - user, 1 - trabalhador
        type: Number,
        require: true
    },

    email:{
        type: String,
        require: true
    },

    telefone: {
        type: Number,
        require: true
    },

    idade:{
        type: Number,
        require: true
    }, 

    senha: {
        type: String,
        require: true
    },

    foto: {
        type: String,
        require: false
    },

    endereco:{
        pais:{
            type: String,
            require: true
        },

        estado:{
            type: String,
            require: true
        },

        cidade:{
            type: String,
            require: true
        },

        bairro:{
            type: String
        }
    },
    
    trabalhador: {
        tipo:{
            type: String,
            require: false
        },
    
        avaliacao:{
            type: Number,
            require: false
        },
    
        qnt_servicos: {
            type: Number,
            require: false
        },
    
        descricao: {
            type: String,
            require: false
        }
    },

    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    }

})

mongoose.model('usuarios', Usuarios)