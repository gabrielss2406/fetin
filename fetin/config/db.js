if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://gabriel:123@cluster0-uzubq.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/fetin"}
}