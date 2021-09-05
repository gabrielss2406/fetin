const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comentario = new Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        require: true
    },

    id_trabalhador:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        require: true
    },

    titulo: {
        type: String,
        require: true
    },

    conteudo: {
        type: String,
        require: true
    }
})

mongoose.model('comentarios', Comentario)