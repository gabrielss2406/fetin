const mongoose = require('mongoose')
const Schema  = mongoose.Schema
var moment = require("moment")

//modelo usuarios
const Usuarios = new Schema({
    to: {
        type: String,
        require: true
    },

    from: {
        type: String,
        require: true
    },

    message: {
        type: String,
        require: true
    },

    date: {
        type: String,
        default: moment().format("MM/DD/yyyy, HH:mm")
    },

    vizualidado: {
        type: Boolean,
        default: false
    }
})

mongoose.model('mensagens', Usuarios)