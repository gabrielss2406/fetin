const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Endereco = new Schema({
    id_usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },

    cep:{
        type: Number,
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
        type: String,
        require: true
    },

    rua:{
        type: String,
        require: true
    },

    numero:{
        type: Number,
        require: true
    }

})

mongoose.model('enderecos', Endereco)