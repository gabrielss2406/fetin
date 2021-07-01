if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://Werk:werksd21@werksd.rualo.mongodb.net/Werk"} //BD Produção
}else{
    module.exports = {mongoURI: "mongodb+srv://Werk:werksd21@werksd.rualo.mongodb.net/Werk"} //BD Teste Local
}