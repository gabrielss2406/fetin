if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://localhost/fetin"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/fetin"}
}