const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");
const verifyJWT = require("../helpers/verifyJWT")

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async index(req,res) {
        var id = "bal"

        const token = req.cookies.token;
        if(!req.query.id){
            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                if (err) id = req.query.id
                else id = decoded.id;
            });
            if(!id)
                return res.json({erro: "Entre em um perfil de outra pessoa ou faça login para ver o seu."})
        }
        else{
            id = req.query.id
        }

        await User.findOne({_id: id}).select('nome e_trabalhador email telefone idade -_id').then((user)=>{
                return res.json(user)
            }
        ).catch((err)=>{
            return res.json({texto: "Usuário não entrado!",err,id})
        })
    },

    async edit(req,res){
        var id = req.userId;

        var {nome,email,telefone,idade} = req.body;

        filter = {_id: id}
        update = {
            nome:nome,
            email:email,
            telefone:telefone,
            idade:idade
        }

        let userUpdated = await User.findOneAndUpdate(filter, update, {
            new: true
        });

        return res.json(userUpdated);
    },

    async editSenha(req,res){
        return 0;
    }
}