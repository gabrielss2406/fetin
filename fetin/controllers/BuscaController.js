const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async buscar(req, res){
        const token = req.cookies.token;
        //Pegando o tipo de trabalhador que deve ser encontrado. Ex: "Eletricista", "Encanador", etc...
        const {tipo} = req.body

        //pegando o ID do usuario
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) id = req.query.id
            else id = decoded.id;
        })
        if(!id)
            return res.json({erro: "Faça seu login!"})
        
        // Busca do usuario pelo ID, depois busca dos trabalhadores com o mesmo endereço e tipo desejado
        usuarios = await User.findOne({_id: id}).then((user)=>{
            User.find({"endereco.cidade": user.endereco.cidade, e_trabalhador: 1, "trabalhador.tipo": tipo, _id: {$nin: [id]} }).then((usuarios)=>{
                res.json(usuarios) 
            }).catch(()=>{
                res.json({erro: "Não há trabalhadores desse tipo perto  de você!"})
            })
        }).catch(()=>{
            res.json({erro: "Seu endereco não foi encontrado"})
        })
    }
}