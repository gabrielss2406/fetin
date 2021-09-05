const mongoose = require('mongoose')
const Schema  = mongoose.Schema


//modelo usuarios
const Usuarios = new Schema({
    nome: {
        type: String,
        require: true
    },

    cpf: {
        type: String,
        require: true
    },

    e_trabalhador:{ // 0 - user, 1 - trabalhador
        type: Number,
        require: true
    },

    email:{
        type: String,
        require: true
    },

    telefone: {
        type: Number,
        require: true
    },

    data_nasc:{
        type: String,
        require: true
    }, 

    senha: {
        type: String,
        require: true
    },

    foto: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAAAYFBMVEVmZmb///9VVVVeXl5iYmJaWlpcXFzR0dFWVlZwcHD8/PysrKzf39/GxsZsbGzt7e2Ojo719fXn5+d+fn6VlZWlpaWEhITAwMDU1NS4uLjc3NyLi4udnZ1vb293d3fLy8uj0/C3AAAEW0lEQVR4nO2b2XriMAyFwUvIAgFCWAItff+3HJjIIWUoYwcXLHP+yzbhkyL7yLbk0QgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv4aSidbihNaJVK+2xjdSy3q7q5bjE8tqt61Pf3i1Tf5Qumyq8RVVU+o44qhEPb32rmVaiwhcTBfz2+6dmS/SV9v3ILL8IXpdFEvWc1Gs77t3Zi1ebeVw9KTnSD4pFpkUQmaLYpL3/jHRr7ZzIEr1Zt9sI7rsd8qIYjPrzUTFUmuUWnbBK3Ry5YNKdNGFccnSw4t/W3lTSKTcXjx8tnWPo834XK5+nGN6ZYI4ZzcPhdGX6fXg7KO0ySITZloq15aGdx9izSsfltaB6Twsn2GXL1IaeVOLgSfMs4xWbWpB+pLYPJ2Q3C74SKkgBV1ZmaxWpKRsdEbVlP8stV9TPqy5hJC0P7fWRdmmwz2XZEgSWtg7WLASUtm05jrEQ7dvNDxyoW7PX2ZWEtqStHuLiscYlW04Ng6SoTbtOywiSBqaO4m+yPnoKG2CJg4j9DRGJ7Sx+i2rPJLsHDX0DOnozumrvAjSGLeFFy3uWKiMbpeWmdtbWbt45eCgGCSIJL0clqNikKnD3noJ7+JgvEM0epGJPk1En+ijX6pFv9iOfrv0Bhve2I8soj90GnxsOOUxQt/g4Df6o/uu+JJbhVBTmZdR8SX68ln8BdD4S9i9JoR7TZN8mxB6bSR5nG0k8TcCxd/KFX0z3ij6dspR/A2xFi3Ne94tzSOVJvt7/k0z1o33SizuundmvmZ7RUSJ+s6Nggt5kbKMol79c9vlRxc/+AmNSr6+O1HNisWxPF/OKo+HYnalPVXGbJzqQz/TLbcbreXlyplSUqer7/eZClZBFNue6bOVuHWd7uRk2fQ+w5TPnTuVXAZgXsg7Tdsy7elQnjHxUJXdKnvcpP+ZWyepvTy9YTERVdYZvFcWFqu06V6oGZTPev7VlsdIyWc3TuvgY6jMcdN4PrKeUirtcsohdA+lmVFfTrKfdtuOY9hKYw45x41jWktqo6VBh9BUGcaF8ymu3Jh8GHDGV4cuO7i/LE0M3doXnkqSD5l/3dtmHjq22DwPTVpYDRxk6YPv/zamk2A8WAdN2e0jTCU15j1QBvskJQ2y0GTqupMHrEuagHXGBPAh29J2nWBXOX0upqr72Mc3w2Ad3izUey/Th8ZBgPV65+aY25gQ2vUvPBFTCnt48qTtYmEWmsyQOrg0qN2GGsHcmhWfwNHfZqf9JZdmxSdA333p4btT2T6wxjwqsfiwir5VYI1rdJfg4GFcmc6uoBz0alQaYKJQHx6HFS0ZglrMUBb0k7zkLLxMSLcC/GwCVIB3KEja/TRE0slOUB3qdF/p6OfX2kVDUPeYaAHpqSOS1u0hbev93v4L8C5h9A6OxF/C/DUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg7fgDyhYmCCEbhAQAAAAASUVORK5CYII="
    },

    endereco:{
        pais:{
            type: String,
            require: true
        },

        estado:{
            type: String,
            require: true
        },

        cidade:{
            type: String,
            require: true
        },

        bairro:{
            type: String
        }
    },
    
    trabalhador: {
        tipos:{
            type: Array,
            require: false
        },
    
        avaliacao:{
            type: Number,
            require: false
        },
    
        qnt_servicos: {
            type: Number,
            require: false
        },
    
        descricao: {
            type: String,
            require: false
        }
    },

    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    }

})

mongoose.model('usuarios', Usuarios)