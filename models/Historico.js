const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const Historico = new Schema({
    id_usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },
    
    id_trabalhador:{
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },

    contrato:{
        type: String,
        require: true
    },

    tipo:{
        type: String,
        require: true
    },

    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('historicos', Historico)