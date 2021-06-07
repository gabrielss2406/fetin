const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");
const nodemailer = require("nodemailer");
var crypto = require('crypto');

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
                            user: 'myEmail',
                            pass: 'myPass'
                            }
                        });
                        
                        var mailOptions = {
                            from: 'gabrielss2406@gmail.com',
                            to: email,
                            subject: 'Reset Password',
                            text: 'http://localhost:3000/reset/?token='+token
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                return res.status(500).json(error)
                            } else {
                                return res.status(200).json()
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
        await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).then((user)=>{
            if(user!=null)
                return res.json({user})
            else
                return res.json("erro")
        }).catch((err)=>{
            return res.json({err})
        })
        
    }
}