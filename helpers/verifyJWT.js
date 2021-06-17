require("dotenv-safe").config();
const Cookies = require("js-cookie")
const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next){
    const token = req.headers['werk.auth'] || req.cookies["werk.auth"];

    // Teste token existente
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    // Verificação e analise do token
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      next();
    });
}

module.exports = verifyJWT