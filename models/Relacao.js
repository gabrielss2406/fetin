const mongoose = require('mongoose')
const Schema  = mongoose.Schema


//modelo usuarios
const Relacoes = new Schema({
    id_cliente: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        require: true
    },
    id_trabalhador: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        require: true
    },
    accept: {
        type: Number, // 0 -> indefinido, 1 -> aceito, 2 -> recusado
        default: 0,
        require: true
    },
    data: {
        type: String,
        require: true
    },
    avaliacao: {
        type: Number, // 1 a 5 (estrelas)
        require: true
    }
})

mongoose.model('relacoes', Relacoes)