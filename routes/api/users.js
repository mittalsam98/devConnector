const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');;
const keys=require('../../config/keys');
const passport=require('passport');

//Load input validation
const validateRegisterInput=require('../../validation/register');
const validateLoginInput=require('../../validation/login');
  
const User =require('../../models/Users');

//@route  GET api/users/test
//@desc   Tests users route
//access  Public 
router.get('/test',(req,res)=>{
    res.json({msg:'In users'});
})

//@route  GET api/users/register
//@desc   Register users route
//access  Public 
router.post('/register',(req,res)=>{

    const {errors,isValid}=validateRegisterInput(req.body);
  
    // console.log(req.body);
    // console.log(req.method);

    if(!isValid){
        return res.status(400).json(errors);
    }


    User.findOne({email:req.body.email})
    .then(user =>{
        if(user){
            res.status(400).json({email:'Email already exits'})
        }
        else{
            

            const avatar=gravatar.url(req.body.email,{
                s:'200',
                r:'pg',
                d:'mm'
            });

            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                avatar
            });

            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password=hash;
                    newUser.save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err))
                })
            })
        }
    });
})

//@route  GET api/users/login
//@desc   Tests users route
//access  Public 

router.post('/login',(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;
    
    const {errors,isValid}=validateLoginInput(req.body)

    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email})
    .then(user=>{

        if(!user){
            return res.status(404).json({email:"Users not found"})
        }

        bcrypt.compare(password,user.password)
        .then(isMatch=>{
            if(isMatch){
                 
                //User Matched
                const payload={id:user.id,uname:user.name,avatar:user.avatar};

                //Sign Token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn:3600},
                    (err,token)=>{
                        res.json({
                            success:true,
                            token:'Bearer ' + token
                        })
                    }
                    )

            }
            else{
                return res.status(404).json({msg:"wrong pass"})
            }
        });
    });
});

//@route  GET api/users/current
//@desc   Tests users route
//access  Private

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    // res.json({msg:'Succsc'})
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    });
})

module.exports=router;