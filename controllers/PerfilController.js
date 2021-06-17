const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async index(req,res) {
        var id

        // Pegando id via token ou query
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

        // Pesquisando perfil do User
        await User.findOne({_id: id}).select('nome e_trabalhador email telefone idade endereco.pais endereco.estado endereco.cidade endereco.bairro trabalhador.tipo trabalhador.avaliacao trabalhador.qnt_servicos trabalhador.descricao -_id').then((user)=>{
                return res.json(user)
            }
        ).catch((err)=>{
            return res.json({texto: "Usuário não encontrado!",err,id})
        })
    },

    async edit(req,res){
        // Pegando valores
            var id
            // Pegando id via token
            const token = req.cookies.token;
            if(token){
                jwt.verify(token, process.env.SECRET, function(err, decoded) {
                    if (err) id = 0
                    else id = decoded.id;
                });
                if(id==0){
                    res.status(500).json({erro: "Erro ao editar o usuário"})
                }
            }else{
                res.status(500).json({erro: "Sem user logado."})
            }

        var {nome,email,telefone,idade, foto} = req.body
        var {pais,estado,cidade,bairro} = req.body
        var {tipo,descricao} = req.body

        // Definindo Filtro e o Update
        filter = {_id: id}
        update = {
            nome:nome,
            email:email,
            telefone:telefone,
            idade:idade,
            foto: foto,
            endereco:{
                pais: pais,
                estado: estado,
                cidade: cidade,
                bairro: bairro
            },
            trabalhador:{
                tipo: tipo,
                descricao: descricao
            }
        }

        // Editando User
        let userUpdated = await User.findOneAndUpdate(filter, update, {
            new: true
        })

        return res.json(userUpdated)
    }
}