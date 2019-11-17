import {GET_ERRORS} from './types';
import {SET_CURRENT_USER} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode';

export const registerUser=(userdata,history)=>(dispatch)=>{

        axios.post('/api/users/register',userdata)
        .then(res=>history.push('/login'))
        .catch(err=>
            dispatch({
                type:GET_ERRORS,
                payload:err.response.data
            }));
    
};
   

export const loginUser=(userdata)=>(dispatch)=>{

    // console.log(userdata);
    axios.post('/api/users/login',userdata)
    .then(res=>{
        //Save to local storage        
        const {token}=res.data
        //Set to ls
        localStorage.setItem('jwtToken',token)

        setAuthToken(token)

        var decoded = jwt_decode(token);
        // console.log(decoded);

        dispatch(setCurrentUser(decoded)) ;

    })
    .catch(err=>
        dispatch({
            type:GET_ERRORS,
            payload:err.response.data
        }));
};

export const setCurrentUser=(decoded)=>{
    return{
        type:SET_CURRENT_USER,
        payload:decoded
    };
}



export const logoutUser=()=> dispatch=>{

    localStorage.removeItem('jwtToken');
    
    setAuthToken(false);

    dispatch(setCurrentUser({}));

}