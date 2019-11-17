    import React, { Component } from 'react';
    import PropTypes from 'prop-types';
    import {withRouter} from 'react-router-dom';
    
    import TestFieldInput from '../common/TestFieldGroup';
    import {connect} from 'react-redux'
    import {registerUser} from '../../actions/authAction';

    class Register extends Component {
        
        constructor(props) {
            super(props);
            this.state = {
                name:'',
                email:'',
                password:'',
                password2:'',
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
                name:this.state.name,
                email:this.state.email,
                password:this.state.password,
                password2:this.state.password2
            }

    
            this.props.registerUser(newUser,this.props.history);
        }

        componentDidMount(){
            if(this.props.auth.isAuthenticated){
                this.props.history.push('/dashboard')
            }
        }

        componentWillReceiveProps(nextProps){
          
            if(nextProps.errors){
            this.setState({errors:nextProps.errors});
            }
        }

        render() {
            const { errors}  = this.state;               
            // console.log(this.state.errors);

            return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form onSubmit={this.submit}>
                            <TestFieldInput
                            placeholder="Name"
                            name="name"
                            onChange={this.change}
                            value={this.state.name}
                            error={errors.name}             
                            />
                            <TestFieldInput
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            onChange={this.change}
                            value={this.state.email}
                            error={errors.email}   
                            info="This site uses Gravatar so if you want a profile image, use a Gravatar email"          
                            />
                            <TestFieldInput
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={this.change}
                            value={this.state.password}
                            error={errors.password}             
                            />
                            <TestFieldInput
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            onChange={this.change}
                            value={this.state.password2}
                            error={errors.password2}             
                            />
                            <input 
                            type="submit" 
                            className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }


    Register.propTypes = {
        registerUser: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,  
        errors: PropTypes.object.isRequired,  
    }

    const mapStateToProps=(state)=>({
        auth:state.auth,
        errors:state.errors
     })

    export default connect(mapStateToProps,{registerUser})(withRouter(Register));