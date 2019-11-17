import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TestFieldInput from '../common/TestFieldGroup';
import {connect} from 'react-redux';
import {loginUser} from '../../actions/authAction';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:'',
            errors:[]
         };   
      }
    
    change=(e)=>{
        // console.log('handle change called');
        this.setState({[e.target.name]:e.target.value});
      }
    
    submit=(e)=>{
        e.preventDefault();

        const newUser={
            email:this.state.email,
            password:this.state.password
        }
    
        this.props.loginUser(newUser);
      
      }

      componentDidMount(){
        // console.log("s",this.props);
          if(this.props.auth.isAuthenticated){
              this.props.history.push('/dashboard')
          }
      }

      componentWillReceiveProps(nextProps){
        // console.log(nextProps);
        // console.log(this.props);
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
          }
        if(nextProps.errors){
        this.setState({errors:nextProps.errors});
        }
    }
    
    render() {

        // console.log(this.props.auth )
        const{errors}=this.state;
        
        return (
         <div className="login">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Log In</h1>
                        <p className="lead text-center">Sign in to your DevConnector account</p>
                        <form onSubmit={this.submit}>
                            <TestFieldInput
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            onChange={this.change}
                            value={this.state.email}
                            error={errors.email}
                            />
                            <TestFieldInput
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={this.change}
                            value={this.state.password}
                            error={errors.password}
                            />
                            <input type="submit" className="btn btn-info btn-block mt-4" />
                        </form>
                    </div>
                </div>
             </div>
        </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,  
    errors: PropTypes.object.isRequired,  
}

const mapStatesToProps=(state)=>({
    auth:state.auth,
    errors:state.errors
})

export default connect(mapStatesToProps,{loginUser})(Login);