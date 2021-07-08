require("dotenv-safe").config();
require("../models/Usuario");
const Cookies = require("js-cookie")
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = mongoose.model("usuarios");

async function verifyTBR(req, res, next){
    // Pegando id via token
    const token = req.cookies["werk.auth"];
    var id

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) id = 0
        else id = decoded.id;
    });
    if(id==0){
        res.status(500).json({erro: "Erro!"})
    }

    user = await User.findOne({_id: id}).then((user)=>{
        return user.e_trabalhador
    })

    if (user == 1){
        next()
    }
    else{
        res.status(500).json({auth: "False", message: 'You are not allowed to access this route.'})
    }
}

module.exports = verifyTBR