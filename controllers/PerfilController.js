const mongoose = require("mongoose");
require("../models/Usuario");
require("../models/Comentario");
require("../models/Relacao");
const User = mongoose.model("usuarios");
const Comentario = mongoose.model("comentarios");
const Relacao = mongoose.model("relacoes")

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async index(req,res) {
        var id

        //pegando id
        const token = req.cookies["werk.auth"] || req.body.token
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) id = null
            else id = decoded.id
        })
        if(id==null)
            return res.json({erro: "Entre em um perfil de outra pessoa ou faça login para ver o seu."})

        // Pesquisando perfil do User
        console.log(id)
        await User.findOne({_id: id}).select('nome e_trabalhador email telefone data_nasc foto endereco.pais endereco.estado endereco.cidade endereco.bairro trabalhador.tipos trabalhador.avaliacao trabalhador.qnt_servicos trabalhador.descricao').then((user)=>{
                return res.json(user)
            }
        ).catch((err)=>{
            return res.json({texto: "Usuário não encontrado!",err,id})
        })
    },

    async Perfil(req,res) {
        var id

        if(!req.params.id){
            return res.json({erro: "Este usuario não existe!"})
        }
        else{
            id = req.params.id
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
    },

    async comentario(req, res){
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


        const {titulo, conteudo} = req.body
        const {id_trabalhador} = req.params

        relacao = await Relacao.findOne({id_cliente: id, id_trabalhador: id_trabalhador}).then((relacao)=>{
            console.log("entrei " + relacao)
            console.log(id + " " + id_trabalhador)
            return relacao


        }).catch((err)=>{
            res.json({erro: err})
        })

        const comentario = {
            id_cliente: id,
            id_trabalhador: id_trabalhador,
            titulo: titulo,
            conteudo: conteudo
        }

        const erros = []

        if(!titulo || typeof titulo == undefined || titulo == null){
            erros.push({erro: "É necessario um titulo!"})
        }
        if(!conteudo || typeof conteudo == undefined || conteudo == null){
            erros.push({erro: "É necessario um conteudo!"})
        }
        
        if(relacao != null && erros.length == 0){  
            await new Comentario(comentario).save().then(()=>{
                res.json({acerto: "Comentario enviado!"})
            })
        }
        else{
            erros.push({erro: "Você não pode comentar!"})
            res.json({erros: erros})
        }
    }
}