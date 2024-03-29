const mongoose = require("mongoose");
require("../models/Relacao");
const Relacao = mongoose.model("relacoes");
require("../models/Usuario");
const User = mongoose.model("usuarios");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    // Usuario envia
    async send(req,res){
        
        var id_cliente
        var {id_trabalhador} = req.query
        var {data,avaliacao} = req.body

        // id_cliente (logado)
        var token = req.cookies["werk.auth"]
            if(token){
                jwt.verify(token, process.env.SECRET, function(err, decoded) {
                    if (err) id_cliente = 0
                    else id_cliente = decoded.id;
                });
                if(id_cliente==0){
                    res.status(500).json({erro: "Erro!"})
                }
            }else{
                res.status(500).json({erro: "Sem user logado."})
            }

        const newRelacao = new Relacao({
            id_cliente: id_cliente,
            id_trabalhador: id_trabalhador,
            data: data,
            avaliacao: avaliacao
        })

        newRelacao.save().then(()=>{
            return res.status(200).json({acerto:"Relação cadastrada com sucesso!"})
        }).catch((err)=>{
            return res.status(500).json(err)
        })
    },

    // Mostra para o trabalhador aceitar
    async sendIndex(req,res){
        var id

        // id_trabalhador (logado)
        var token = req.cookies["werk.auth"]
            if(token){
                jwt.verify(token, process.env.SECRET, function(err, decoded) {
                    if (err) id = 0
                    else id = decoded.id;
                });
                if(id==0){
                    res.status(500).json({erro: "Erro!"})
                }
            }else{
                res.status(500).json({erro: "Sem user logado."})
            }

        var populat = {
            path: 'id_cliente',
            select: 'nome email'
        }

        await Relacao.find({id_trabalhador: id,accept: 0}).select('id_cliente data -_id').populate(populat).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            res.json(err)
        })
    },

    // Trabalhador aceita/recusa
    async accept(req,res){
        var {id_cliente,id_trabalhador,data} = req.body

        var filter = {
            id_cliente: id_cliente,
            id_trabalhador: id_trabalhador,
            data: data,
            accept: 0
        }
        var update = {
            accept: 1
        }
        
        await Relacao.findOneAndUpdate(filter, update, {new: true}).populate().then((data)=>{
            if(data!=null)
                res.json(data)
            else
                res.json("Erro, relacao não encontrada!")
        }).catch((err)=>{
            res.json(err)
        })
    },
    async refuse(req,res){
        var {id_cliente,id_trabalhador,data} = req.body

        var filter = {
            id_cliente: id_cliente,
            id_trabalhador: id_trabalhador,
            data: data,
            accept: 0
        }
        var update = {
            accept: 2
        }
        
        await Relacao.findOneAndUpdate(filter, update, {new: true}).then((data)=>{
            if(data!=null)
                res.json(data)
            else
                res.json("Erro, relacao não encontrada!")
        }).catch((err)=>{
            res.json(err)
        })
    },

    // Historico Relações
    async history(req,res){
        var {id} = req.params

        var populat = {
            path: 'id_cliente id_trabalhador',
            select: 'nome -_id',
            match: {
                _id: {
                    $ne: id
                }
            }
        }
        var historico = await Relacao.find({$or : [ { id_cliente : id}, {id_trabalhador: id} ], accept: 1 }).
                        select('data avaliacao -_id').populate(populat)

        res.json(historico)
        // id == null, o proprio usuario
    },

    // Média Avaliação
    async avaliacao(req,res){
        var {id} = req.params
        const array1 = await Relacao.find({id_trabalhador: id}).select('avaliacao -_id');

        var soma=0
        var contador=0
        var media

        array1.forEach(element => {
            soma += element.avaliacao
            contador++
        });
        media = soma/contador

        res.json(media)
    }
}