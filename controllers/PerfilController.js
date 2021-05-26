const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");

module.exports = {
    async index(req,res) {
        let id = req.query.id;

        await User.findOne({_id: id}).select('nome e_trabalhador email telefone idade -_id').then((user)=>{
                return res.json(user)
            }
        ).catch((err)=>{
            return res.json({texto: "Usuário não entrado!",err,id})
        })
    },

    async edit(req,res){
        //let id = cookie(ainda nao fiz);
        let id = "60ab9ec51458950d6029c9df";

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