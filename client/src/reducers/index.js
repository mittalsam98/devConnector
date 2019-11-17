import {combineReducers} from 'redux';
import authReducer from './authReducers';
import errorsReducers from './errorsReducers';
import profileReducers from './profileReducer';

export default combineReducers({
    auth:authReducer,
    errors:errorsReducers,
    profile:profileReducers
})