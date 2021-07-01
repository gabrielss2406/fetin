const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async index(req,res) {
        var id

        // Pegando id via token ou query
        const token = req.cookies["werk.auth"];
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
        await User.findOne({_id: id}).select('nome e_trabalhador email telefone data_nasc foto endereco.pais endereco.estado endereco.cidade endereco.bairro trabalhador.tipos trabalhador.avaliacao trabalhador.qnt_servicos trabalhador.descricao -_id').then((user)=>{
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
            const token = req.cookies["werk.auth"];
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

        var {nome,email,telefone,data_nasc,foto} = req.body
        var {pais,estado,cidade,bairro} = req.body
        var {tipos ,descricao} = req.body

        //verificando quais dados vão ser editados

        usuario = await User.findOne({_id:id}).then((user)=>{
            return user
        })

        if(telefone)          
            telefone = telefone.replace(/-| |[(]|[)]|[+]+[0-9][0-9]/gi, "")

        if(!nome || typeof nome == undefined || nome == null)
            nome = usuario.nome
        if(!email || typeof email == undefined || email == null)
            email = usuario.email
        if(!telefone || telefone.search(/[a-z]/) != -1 || telefone == null)
            telefone = usuario.telefone
        if(!data_nasc || data_nasc.search(/[a-z]/ != -1)|| data_nasc == null || data_nasc<12)
            data_nasc = usuario.data_nasc
        if(!foto || foto == null || typeof foto == undefined)
            foto = usuario.foto
        // Endereços
        if(!pais || typeof pais == undefined || pais == null)
            pais = usuario.endereco.pais
        if(!estado || typeof estado == undefined || estado == null)
            estado = usuario.endereco.estado
        if(!cidade || typeof cidade == undefined || cidade == null)
            cidade = usuario.endereco.cidade
        if(!bairro || typeof bairro == undefined || bairro == null)
            bairro = usuario.endereco.bairro
        //trabalhador
        // Trabalhador
        if(!tipos || typeof tipos == undefined || tipos == null)
            tipos = usuario.trabalhador.tipos

        await User.findOne({email: email}).then((user)=>{
            if(user)
                email = usuario.email
        })
        
        Tipos = ["Limpeza", "Encanador", "Eletricista", "Pedreiro", "Mestre de obras"]

        await tipos.forEach((tipo) => {
            var tipo_valido = 0
            Tipos.forEach((Tipo)=>{
                if(tipo == Tipo){
                    tipo_valido = 1
                }
            })
            if(tipo_valido == 0){
                tipos = usuario.trabalhador.tipos
            }
        })


        // Definindo Filtro e o Update
        filter = {_id: id}
        update = {
            nome:nome,
            email:email,
            telefone:telefone,
            data_nasc: data_nasc,
            foto:foto,
            endereco:{
                pais: pais,
                estado: estado,
                cidade: cidade,
                bairro: bairro
            },
            trabalhador:{
                tipo: tipos,
                descricao: descricao
            }
        }

        // Editando User
        let userUpdated = await User.findOneAndUpdate(filter, update, {
            new: true
        });

        return res.json(`Usuario ${userUpdated.nome} editado com sucesso!`)
    }
}