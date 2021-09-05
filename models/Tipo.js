const mongoose = require('mongoose')
const Schema  = mongoose.Schema

//modelo usuarios
const Tipo = new Schema({
    tipo: {
        type: String,
        require: true
    }
})

mongoose.model('tipos', Tipo)