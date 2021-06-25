const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async buscar(req, res){
            const token = req.cookies["werk.auth"]
            //Pegando o tipo de trabalhador que deve ser encontrado. Ex: "Eletricista", "Encanador", etc...
            const {Tipo} = req.body

            //pegando o ID do usuario
            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                if (err) id = req.query.id
                else id = decoded.id;
            })
            if(!id)
                return res.json({erro: "Faça seu login!"})

            // Busca do usuario pelo ID, depois busca dos trabalhadores com o mesmo endereço e tipo desejado
            const trabalhadores = []
            // Busca do usuario pelo ID, depois busca dos trabalhadores com o mesmo endereço e tipo desejado
            const usuarios = await User.findOne({_id: id}).then((user)=>{
                Users = User.find({"endereco.cidade": user.endereco.cidade, e_trabalhador: 1, _id: {$nin: [id]} }).then((Users)=>{
                    return Users
                }).catch(()=>{
                    res.json({erro: "Não há trabalhadores desse tipo perto  de você!"})
                })
                return Users

            }).catch(()=>{
                res.json({erro: "Seu endereco não foi encontrado"})
            })

            await usuarios.forEach((usuario)=>{
                tipos = usuario.trabalhador.tipos
                tipos.forEach((tipo) => {
                    if(tipo == Tipo){
                        trabalhadores.push(usuario)
                    }
                })
            })
            res.json({trabalhadores: trabalhadores})
    }
}