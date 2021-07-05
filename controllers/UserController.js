const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const cpfVerify = require('cpf');
const nodemailer = require("nodemailer");
var crypto = require('crypto');

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req,res) {
        var {nome,cpf,e_trabalhador,email,telefone,data_nasc,senha,senha2,foto} = req.body;
        var {pais,estado,cidade,bairro} = req.body
        var {tipos,descricao} = req.body

        telefone = telefone.replace(/-| |[(]|[)]|[+]+[0-9][0-9]/gi, "")

        // Verificações
        var erros = []

            // CPF
            if(!cpfVerify.isValid(cpf))
                erros.push({texto: "CPF inválido!"})
            // Campos User Default
            if(!nome || typeof nome == undefined || nome == null)
                erros.push({texto: "Nome inválido!"})
            if(!email || typeof email == undefined || email == null)
                erros.push({texto: "Email inválido!"})
            if(!senha || typeof senha == undefined || senha == null || senha.length < 7)
                erros.push({texto: "Senha inválida!"})
            if(senha != senha2)
                erros.push({texto: "As senhas são diferentes, tente novamente!"})
            if(e_trabalhador!=0 && e_trabalhador!=1)
                erros.push({texto: "Campo inválido!"})
            if(!telefone || telefone.search(/[a-z]/) != -1 || telefone == null)
                erros.push({texto: "Telefone inválido!"})
            if(!data_nasc ||data_nasc == null)
                erros.push({texto: "Data de nascimento inválida!"})
            // Endereços
            if(!pais || typeof pais == undefined || pais == null)
                erros.push({texto: "País inválido!"})
            if(!estado || typeof estado == undefined || estado == null)
                erros.push({texto: "Estado inválido!"})
            if(!cidade || typeof cidade == undefined || cidade == null)
                erros.push({texto: "Cidade inválido!"})
            if(!bairro || typeof bairro == undefined || bairro == null)
                erros.push({texto: "Cidade inválido!"})
            // Trabalhador
            if(e_trabalhador==1 && (!tipos || typeof tipos == undefined || tipos == null))
                erros.push({texto: "Tipo de trabalhador inválido!"})

            await User.findOne({cpf: cpf}).then((user)=>{
                if(user)
                    erros.push({texto: "CPF já cadastrado!"})
            })
            await User.findOne({email: email}).then((user)=>{
                if(user)
                    erros.push({texto: "Email já cadastrado!"})
            })
            
            if(e_trabalhador==1){
                Tipos = ["Limpeza", "Encanador", "Eletricista", "Pedreiro", "Mestre de obras"]

                await tipos.forEach((tipo) => {
                    var tipo_valido = 0
                    Tipos.forEach((Tipo)=>{
                        if(tipo == Tipo){
                            tipo_valido = 1
                        }
                    })
                    if(tipo_valido == 0){
                        erros.push({texto: "Esse tipo de trabalho ainda não está disponivel"})
                    }
                })
            }
            

        if(erros.length > 0){
            res.json({erros: erros})
        }
        else{
            const newUser = new User({
                nome: nome,
                cpf: cpf,
                e_trabalhador: e_trabalhador,
                email: email,
                telefone: telefone,
                data_nasc: data_nasc,
                senha: senha,
                foto: foto,
                endereco:{
                    pais: pais,
                    estado: estado,
                    cidade: cidade,
                    bairro: bairro
                },
                trabalhador:{
                    tipos: tipos,
                    descricao: descricao
                }
            })

            bcrypt.genSalt(10, (erro,salt)=>{
                bcrypt.hash(newUser.senha, salt, (erro,hash)=>{
                    if(erro){
                        res.json("erro")
                    }else{
                        newUser.senha = hash
                        newUser.save().then(()=>{
                            return res.status(200).json({acerto:"Usuario cadastrado com sucesso!"})
                        }).catch((err)=>{
                            return res.status(500).json(err)
                        })
                    }
                })
            })
        }
    },

    async tipo_trabalhador(req, res){
        Tipos = ["Limpeza", "Encanador", "Eletricista", "Pedreiro", "Mestre de obras"]
        res.json({tipos: Tipos})
    },

    async login(req,res) {
        var {email, senha} = req.body

        var erros = []

        if(!email || typeof email == undefined || email == null){
            erros.push({texto: "É necessario o email!"})}
        if(!senha || typeof senha == undefined || senha == null || senha.length < 7){ 
            erros.push({texto: "A senha é necessaria!"})}

        if(erros.length > 0){
            res.json({erros: erros})
        }
        else{
            User.findOne({email: email}).then((user)=>{
                if (user){
                    var senha_certa = user.senha

                    bcrypt.compare(senha, senha_certa, (erro, result)=>{
                        if (result == true) {
                            const id = user._id;
                            const token = jwt.sign({ id }, process.env.SECRET, {
                                expiresIn: 600 // expires in 10min
                            });
                            res.cookie("werk.auth", token, { maxAge: 900000, httpOnly: true })
                            return res.json({ auth: true, token: token });
                        }
                        else {
                            erros.push({ texto: "Senha inválida!" })
                            return res.json({"verificacao": "Negada", erros: erros})
                        }
                    })
                }
                else{
                    erros.push({ texto: "Email inválido!" })
                    return res.json({"verificacao": "Negada", erros: erros})
                }
            })
        }
    },
    
    async logout(req,res){
        res.clearCookie('werk.auth');
        res.json({ auth: false, token: null });
    }
}