const mongoose = require("mongoose");
require("../models/Usuario");
const User = mongoose.model("usuarios");

module.exports = {
    async register(req,res) {
        var {id} = req.header;

        var User = await User.findById(id);
    }
}