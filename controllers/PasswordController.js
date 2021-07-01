const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");
const nodemailer = require("nodemailer");
var crypto = require('crypto');
const bcrypt = require("bcryptjs");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    async forgotPass(req,res){
            
        var {email} = req.body
        
        // Criando Token
        crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            
            if(err)
                return res.json(err)
            else{
                User.findOne({email:email}).then((user)=>{
                    // Setando token e prazo
                    user.resetPasswordToken = token
                    user.resetPasswordExpires = Date.now() + 3600000

                    user.save().then(()=>{
                        
                        // Enviando Email
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                            user: 'WerkServicosDomesticos@gmail.com',
                            pass: 'werksd21'
                            }
                        });
                        
                        var mailOptions = {
                            from: 'francisco.pereira@get.inatel.br',
                            to: email,
                            subject: 'Reset Password',
                            text: 'http://localhost:3000/reset/?token='+token
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                return res.status(500).json(error)
                            } else {
                                return res.status(200).json({email: "Enviado"})
                            }
                        });

                    }).catch((err)=>{
                        return res.json(err)
                    })
                }).catch((err)=>{
                    return res.json(err) // Erro de user nao encontrado
                })
            }  
        });
    },

    async reset(req,res){
        // Token na url
        var {token} = req.query

        // Busca User com o Token em prazo
        await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).select('nome email').then((user)=>{
            if(user!=null)
                return res.json({user})
            else
                return res.json("Erro ao validar link!")
        }).catch((err)=>{
            return res.json({err})
        })
    },

    async nova_senha(req, res){
        var erros = []
        const {token} = req.query
        const {nova_senha, nova_senha2} = req.body

        if(!nova_senha || typeof nova_senha == undefined || nova_senha == null || nova_senha.length < 7)
                erros.push({texto: "Nova senha inválida!"})
        if(nova_senha != nova_senha2)
                erros.push({texto: "Senhas diferentes!"})

        // Busca User com o Token em prazo
        usuario = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).then((user)=>{
            if(user!=null)
                return user._id
            else
                return res.json("Erro!")
        }).catch((err)=>{
            return res.json({err})
        })
        
        if(erros.length > 0){
            res.json({erros: erros})
        }
        else{
            bcrypt.genSalt(10, (erro,salt)=>{
                bcrypt.hash(nova_senha, salt, (erro,hash)=>{
                    if(erro){
                        res.json("Erro")
                    }else{
                        // Definindo Filtro e o Update
                        filter = {_id: usuario}
                        update = {
                            senha: hash
                        }

                        // Editando User
                        let userUpdated = User.findOneAndUpdate(filter, update, {
                            new: true
                        }).then(()=>{
                            res.json({acerto: "Nova senha cadastrada com sucesso!"})
                        }).catch(()=>{
                            erros.push({texto: "Usuario não encontrado!"})
                            res.json({erros: erros})
                        })
                    }
                })
            })
        }
    },

    async editSenha(req,res){
        var erros = []
        const {antiga_senha, nova_senha, nova_senha2} = req.body

        if(!antiga_senha || typeof antiga_senha == undefined || antiga_senha == null || antiga_senha.length < 7)
                erros.push({texto: "Antiga senha inválida!"})
        if(!nova_senha || typeof nova_senha == undefined || nova_senha == null || nova_senha.length < 7)
                erros.push({texto: "Nova senha inválida!"})
        if(nova_senha != nova_senha2)
                erros.push({texto: "As senhas são diferentes, tente novamente!"})

        // Pegando id via token
        const token = req.cookies["werk.auth"];
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

        senha = await User.findOne({_id: id}).then((user)=>{
            return user.senha
        }).catch(()=>{
            res.json({erros: "Erro ao encontrar usuario!"})
        })

        if(erros.length > 0){
            res.json({erros: erros})
        }
        else{
            await bcrypt.compare(antiga_senha, senha, (erro, result)=>{
                if (result == true) {
                    bcrypt.genSalt(10, (erro,salt)=>{
                        bcrypt.hash(nova_senha, salt, (erro,hash)=>{
                            if(erro){
                                res.json("Erro")
                            }else{
                                // Definindo Filtro e o Update
                                filter = {_id: id}
                                update = {
                                    senha: hash
                                }

                                // Editando User
                                let userUpdated = User.findOneAndUpdate(filter, update, {
                                    new: true
                                }).then(()=>{
                                    res.json({acerto: "Nova senha cadastrada com sucesso!"})
                                })
                            }
                        })
                    })

                }
                else {
                    erros.push({ texto: "Senha inválida!" })
                    return res.status(500).json({"verificacao": "Negada", erros: erros})
                }
            })
        }
    }

   
}