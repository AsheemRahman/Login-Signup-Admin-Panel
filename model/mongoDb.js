const mongoose =require("mongoose")

mongoose.connect('mongodb://localhost:27017/DbUser').then(()=>{
    console.log("Mongodb Connected")
}).catch((err)=>{
    console.log(`Mongodb connection error ${err}`)
})

const schema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collectionModel = mongoose.model("UserDetails",schema);

module.exports =collectionModel;