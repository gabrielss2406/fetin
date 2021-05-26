const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const Schema  = mongoose.Schema


//modelo usuarios
const Usuarios = new Schema({
    /*id:{
        type: ObjectID,
        required: true
    },*/
    nome: {
        type: String,
        require: true
    },

    cpf: {
        type: String,
        require: true
    },

    e_trabalhador:{
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
    }

})

mongoose.model('usuarios', Usuarios)