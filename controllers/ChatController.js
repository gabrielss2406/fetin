const mongoose = require("mongoose");
require("../models/Mensagem");
const Message = mongoose.model("mensagens");
require("../models/Usuario");
const User = mongoose.model("usuarios");

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
  async show(req,res){
    var userLogged

    // Pegando id via token
    const token = req.headers['werk.auth'] || req.cookies["werk.auth"];
    if(token){
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) userLogged = 0
            else userLogged = decoded.id;
        });
        if(userLogged==0){
            res.status(500).json({erro: "Erro ao editar o usuário"})
        }
    }else{
        return res.status(500).json({erro: "Sem usuário logado"})
    }

    // Buscando usuários com conversa
      var oldChat = await Message.find({ vizualidado:true ,$or : [ { to : userLogged } , { from : userLogged } ] }).sort("-date").
                distinct('to').then(console.log("foi")).catch(err=>{console.log(err)})
      oldChat.splice(oldChat.indexOf(userLogged), 1)

      var newChat = await Message.find({ $or : [ { to : userLogged } ] , vizualidado: false }).sort("-date").
      select('from date -_id').distinct("from").then(console.log("foi")).catch(err=>{console.log(err)})
    
      var userOld = await User.find({_id: oldChat}).select("nome email telefone")
      var userNew = await User.find({_id: newChat}).select("nome email telefone")

    return res.json({"oldChat": oldChat, "usersOld": userOld , "newChat": newChat, "usersNew": userNew})
  },

    // --             //             --//
   // -- // -- // -- // -- // -- // --//
  //--              //             --//

  async add(req,res){
    //var {user} = req.params
    var userLogged

    // Pegando id via token
    const token = req.headers['werk.auth'] || req.cookies["werk.auth"];
    if(token){
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) userLogged = 0
            else userLogged = decoded.id;
        });
        if(userLogged==0){
            res.status(500).json({erro: "Erro ao autenticar o usuário"})
        }
    }else{
        return res.status(500).json({erro: "Sem usuário logado"})
    }

    var idTo = req.params.id
    if(!idTo || typeof idTo == undefined || idTo == null)
        return res.status(500).json({texto: "Erro"})

    var message = new Message({
      to: idTo,
      from: userLogged,
      message: req.body.message
    })
  
      var savedMessage = await message.save()
        console.log('saved');
  

      return res.json()
      /*var censored = await Message.findOne({message:'badword'});
        if(censored)
          await Message.remove({_id: censored.id})
        else
          io.emit('message', req.body);
        res.sendStatus(200);*/
  },

  async showPv(req,res){
    var userLogged

    // Pegando id via token
    const token = req.headers['werk.auth'] || req.cookies["werk.auth"];
    if(token){
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) userLogged = 0
            else userLogged = decoded.id;
        });
        if(userLogged==0){
            res.status(500).json({erro: "Erro ao autenticar o usuário"})
        }
    }else{
        return res.status(500).json({erro: "Sem usuário logado"})
    }

    var idTo = req.params.id
    if(!idTo || typeof idTo == undefined || idTo == null)
        return res.status(500).json({texto: "Erro"})

    var allMessages = await Message.find({$or : [ { to : userLogged } , { from : userLogged } ], $or : [ { to : idTo } , { from : idTo } ]  })
                      .sort("-date").select("-_id")

    return res.json(allMessages)
  }
}
