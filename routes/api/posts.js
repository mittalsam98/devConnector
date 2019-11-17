const express=require('express');
const router=express.Router();
const passport=require('passport');
const Post=require('../../models/Post');

const validatePostInput=require('../../validation/post');

const Profile=require('../../models/Profile'); 
const User=require('../../models/Users'); 


router.get('/test',(req,res)=>{
    res.json({msg:'In posts'});
})

//@route  GET api/posts
//@desc   get posts
//access  Public

router.get('/',(req,res)=>{

    Post.find()
    .sort({date:-1})
    .then(post=>res.json(post))
    .catch(err=>res.json(err));
});

//@route  GET api/post
//@desc   get post
//access  Public

router.get('/:id',(req,res)=>{

    Post.findById(req.params.id)
    .then(post=>res.json(post))
    .catch(err=>res.json(err));
});



//@route  POST api/posts
//@desc   send post
//access  Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    const {errors,isValid}=validatePostInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }
    // console.log("Get this far",req.user);
    const newPost=new Post({
        text:req.body.text ,
        name:req.body.name ,
        avatar:req.user.avatar ,
        user:req.user.id
    });
    
    newPost.save().then(post=>res.json(post));

});


//@route  delete api/posts/:id
//@desc   get post
//access  Private

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            // console.log("got this far 1",typeof(post.user));
            // console.log("got this far 2",typeof(req.user.id));
            if(post.user.toString() !== req.user.id){
                return res.status(400).json({noAuthorized:'User is not authorized'})
            }

            post.remove().then(post=>res.json({succes:'true'}))
        })
        .catch(err=>res.status(400).json({postnotfoud:"NO"}));
    })
})

//@route  post api/posts/like/:id
//@desc   like the post
//access  Private

router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
           
            //Checks if user alredy liked th post
            if(post.likes.filter(like=> like.user.toString()===req.user.id).length>0){
                return res.status(400).json({alreadyLiked:"user already liked"})
            }

            post.likes.unshift({user:req.user.id});

            post.save().then(post=>res.json(post));
            
        })
        .catch(err=>res.status(400).json({postnotfoud:"NO"}));
    })
})

//@route  post api/posts/unlike/:id
//@desc   unlike the post
//access  Private

router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
           
            //Checks if user alredy liked th post
            if(post.likes.filter(like=> like.user.toString()===req.user.id).length===0){
                return res.status(400).json({alreadyunliked:"User already unliked the post"})
            }

            const removeIndex=post.likes
            .map(item=> item.user.toString())
            .indexOf(req.user.id)
            
            post.likes.splice(removeIndex,1);
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(400).json({postnotfoud:"NO"}));
    })
})

//@route  post api/posts/comment/:id
//@desc  comment the post
//access  Private

router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    // console.log("get this far",req);
    const {errors,isValid}=validatePostInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

        Post.findById(req.params.id)
        .then(post=>{
            // console.log("get this far 3",post);
           
            const newComment={
                text:req.body.text,
                name:req.body.name,
                avatar:req.body.avatar,
                user:req.user.id
            }

            post.comments.unshift(newComment)

            // console.log("get this far 4",post);

            post.save().then(post=>res.json(post));


        })
        .catch(err=>res.status(400).json({postnotfoud:"NO"}));
})

//@route  post api/posts/comment/:id/:commentid
//@desc   delet comment the post
//access  Private

router.post('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{

        Post.findById(req.params.id)
        .then(post=>{
            
            console.log(post);
            if(post.comments.filter(comment=> comment._id.toString()===req.params.comment_id).length===0 ){
                return res.status(400).json({commentnotexists:" no comment exists"})
            }

            const removeIndex=post.comments
            .map(item=> item._id.toString())
            .indexOf(req.params.comment_id)
            
            post.comments.splice(removeIndex,1);
            post.save().then(post=>res.json(post));


        })
        .catch(err=>res.status(400).json({postnotfoud:"NO"}));
})



module.exports=router;