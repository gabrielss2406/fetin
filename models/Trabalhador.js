const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const Trabalhador = new Schema({
    id_usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },

    tipo:{
        type: String,
        require: true
    },

    avaliacao:{
        type: Number,
        require: true
    },

    qnt_servicos: {
        type: Number,
        require: true
    },

    descricao: {
        type: String,
        require: true
    }
})

mongoose.model('trabalhadores', Trabalhador)