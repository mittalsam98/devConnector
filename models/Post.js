const moongoose=require('mongoose');

var Schema=moongoose.Schema;

var PostSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
      },
      text:{
          type:String,
          required:true
      },
      name:{
        type:String,
      },
      avatar:{
        type:String
      },
      likes:[
          {
            user:{
                type:Schema.Types.ObjectId,
                ref:'users'
              }
          }
      ],
      comments:[
        {
          user:{
              type:Schema.Types.ObjectId,
              ref:'users'
            },     
             text:{
                type:String,
                required:true
            },
            name:{
              type:String,
            },
            avatar:{
              type:String
            },
            date:{
                type:String,
                default:Date.now
            }
        }
    ],
    date:{
        type:String,
        default:Date.now
    }
    
   
});

module.exports=Post=moongoose.model('post',PostSchema)
