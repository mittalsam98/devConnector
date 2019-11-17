const Validator=require('validator');
const isEmpty=require('./is-empty');

module.exports=function validPostInput(data){

    let errors={};

    data.text= !isEmpty(data.text) ? data.text : '';    


    if(!Validator.isLength(data.text,{min:10,max:400})){
        errors.text='Post must be between 10 to 400 words';
    }

    if(Validator.isEmpty(data.text)){
        errors.text='Text field is required';
    }

    return{
        errors:errors,
        isValid:isEmpty(errors)
    }

};