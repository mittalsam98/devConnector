const express=require('express');
const router=express.Router();
const moongoose=require('mongoose');                
const passport=require('passport');

const Profile=require('../../models/Profile');
const Users=require('../../models/Users');
const validateProfileInput=require('../../validation/profile');
const validateExperienceInput=require('../../validation/experience');
const validateEducationInput=require('../../validation/education');

//@route  GET api/profile/register
//@desc   Test profile route
//access  Public 

router.get('/test',(req,res)=>{
    res.json({msg:'In profile'});
})


//@route  GET api/profile/register
//@desc   Test profile route
//access  Private

router.get('/',passport.authenticate('jwt', { session: false }),
(req,res)=>{
    const errors={};

    Profile.findOne({user:req.user.id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile='Profile does not exits for this user';
            return res.status(400).json(errors);
        }

        res.json(profile);
    })
    .catch(err=>res.status(400).json(err));
})


//@route  GET all
//@desc   Test profile route
//access  Public

router.get('/all',(req,res)=>{

    const errors={};

    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles=>{
        if(!profiles){
            errors.profile='Ther are no profiles';
            return res.status(400).json(errors);
        }

        res.json(profiles);
    })
    .catch(err=>res.status(400).json({profile: 'There are no profiles'}));
});


//@route  GET handle/:handle
//@desc   Test profile route
//access  Public

router.get('/handle/:handle',(req,res)=>{

    const errors={};
    Profile.findOne({ handle : req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile='There is no profile for this user';
            return res.status(400).json(errors);
        }

        res.json(profile);
    })
    .catch(err=>res.status(400).json(err));
})

//@route  GET users/:id
//@desc    get profile by user id
//access  Public

router.get('/user/:user_id',(req,res)=>{

    Profile.findOne({ user : req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile='There is no profile for this user';
            return res.status(400).json(errors);
        }

        res.json(profile);
    })
    .catch(err=>res.status(400).json({profile:'No profile exits for this user'}));
})



//@route  POST api/profile/
//@desc   send data
//access  Private
router.post('/',passport.authenticate('jwt', { session: false }),
(req,res)=>{
    const profileFields={};


    const {errors,isValid}=validateProfileInput(req.body)

    if(!isValid){
        return res.status(400).json(errors);
    }
 
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle=req.body.handle;
    if(req.body.company) profileFields.company=req.body.company;
    if(req.body.website) profileFields.website=req.body.website;
    if(req.body.location) profileFields.location  =req.body.location  ;
    if(req.body.bio) profileFields.bio=req.body.bio;
    if(req.body.status) profileFields.status=req.body.status;
    if(req.body.githubusername) profileFields.githubusername=req.body.githubusername;
    
    if(typeof req.body.skills !=='undefined'){
        profileFields.skills=req.body.skills.split(',');
    }
    profileFields.social={}
    if(req.body.youtube) profileFields.youtube=req.body.youtube;
    if(req.body.twitter) profileFields.twitter=req.body.twitter;
    if(req.body.linkedin) profileFields.linkedin=req.body.linkedin;
    if(req.body.facebook) profileFields.facebook=req.body.facebook;
    if(req.body.instagram) profileFields.instagram=req.body.instagram;


    Profile.findOne({user:req.user.id})
    .then( profile=>{
        //Update
        // console.log("cda ",user);
        if(profile){
            Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            ).then(profile=>res.json(profile));
        }
        else{
            //Create

            //Handle Checks
            Profile.findOne({handle:profileFields.handle}).then(profile=>{
                if(profile){
                    errors.handle='That handle already exits';
                    res.status(400).json(errors)
                }
             
                new Profile(profileFields).save().then(profile=>res.json(profile));
            });
        }
    });

});

//@route  Post experience
//@desc   Test profile route
//access  Public

router.post('/experience',passport.authenticate('jwt', { session: false }),(req,res)=>{
    
    const {errors,isValid}=validateExperienceInput(req.body)

    if(!isValid){
        return res.status(400).json(errors);
    }
    
    Profile.findOne({user:req.user.id})
    .then(profile=>{

    const newExp={
        title:req.body.title,
        company:req.body.company,
        location:req.body.location,
        from:req.body.from,
        to:req.body.to,
        current:req.body.current,
        description:req.body.description,
    }

    profile.experience.unshift(newExp);

    profile.save().then(profile=>res.json(profile));

    })
});

//@route  Post education
//@desc   Test profile route
//access  Public

router.post('/education',passport.authenticate('jwt', { session: false }),(req,res)=>{

    // console.log(req._id);
    const {errors,isValid}=validateEducationInput(req.body);

    if(!isValid){
        // console.log("got this far 1",errors);
        return res.status(400).json(errors);
    }

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        // console.log("got this far 2",profile);

    const newEdu={
        school:req.body.school,
        degree:req.body.degree,
        fieldofstudy:req.body.fieldofstudy,
        from:req.body.from,
        to:req.body.to,
        current:req.body.current,
        description:req.body.description
    }

    // console.log("got this far 3",newEdu.from);


    profile.education.unshift(newEdu);
    // console.log("got this far 3",profile);


    profile.save().then(profile=>res.json(profile));

    })
});


//@route delete experience
//@desc   delete experience
//access  private

router.delete('/experience/:exp_id',passport.authenticate('jwt', { session: false }),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then((profile)=>{

        const removeIndex=profile.experience
        .map(user=>user.id)
        .indexOf(req.params.exp_id);

        console.log(removeIndex);

        profile.experience.splice(removeIndex,1);
        console.log(profile);

        profile.save().then(profile=>res.json(profile))

    })
    .catch(err=>res.status(400).json(err));
});


//@route delete education
//@desc   delete education
//access  private

router.delete('/education/:edu_id',passport.authenticate('jwt', { session: false }),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then((profile)=>{

        const removeIndex=profile.education
        .map(user=>user.id)
        .indexOf(req.params.edu_id);

        console.log(removeIndex);

        profile.education.splice(removeIndex,1);
        console.log(profile);

        profile.save().then(profile=>res.json(profile))

    })
    .catch(err=>res.status(400).json(err));
});

//@route delete user
//@desc   delete user
//access  private


router.delete('/',passport.authenticate('jwt', { session: false }),(req,res)=>{

    Profile.findOneAndRemove({user:req.user.body})
    .then(()=>{
        Users.findOneAndRemove({_id:req.user.id})
        .then(()=>json({success:true}));
    })
});



module.exports=router;