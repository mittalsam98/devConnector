const moongoose=require('mongoose');

var Schema=moongoose.Schema;

var UserSchema=new Schema({
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
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now    
    }
});

module.exports=Users=moongoose.model('users',UserSchema)


