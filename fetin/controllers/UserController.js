const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");
const bcrypt = require("bcrypt");
const cpfVerify = require('cpf');

module.exports = {
    async register(req,res) {
        var {nome,cpf,e_trabalhador,email,telefone,idade,senha,senha2} = req.body;
        
        var erros = []

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
            if(!telefone || typeof telefone != "number" || telefone == null)
                erros.push({texto: "Telefone inválido!"})
            if(!idade || typeof idade != "number" || idade == null || idade<12)
                erros.push({texto: "Idade inválido!"})
            
            if(!cpfVerify.isValid(cpf))
                erros.push({texto: "CPF inválido!"})

            await User.findOne({cpf: cpf}).then((user)=>{
                if(user)
                    erros.push({texto: "CPF já cadastrado!"})
                else{
                    User.findOne({email: email}).then((user)=>{
                        if(user)
                            erros.push({texto: "Email já cadastrado!"})
                    })
                }
            })
            
        
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
                idade: idade,
                senha: senha
            })

            bcrypt.genSalt(10, (erro,salt)=>{
                bcrypt.hash(newUser.senha, salt, (erro,hash)=>{
                    if(erro){
                        res.json("erro")
                    }else{
                        newUser.senha = hash
                        newUser.save().then(()=>{
                            return res.json({"acerto:":"certo"})
                        }).catch((err)=>{
                            return res.json({"acerto:":"errado"})
                        })
                    }
                })
            })
        }
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
                            return res.json({ "verificacao": "Aceita" });
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
    }
}