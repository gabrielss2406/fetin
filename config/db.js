if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://localhost/fetin"} //BD Produção
}else{
    module.exports = {mongoURI: "mongodb://localhost/fetin"} //BD Teste Local
}