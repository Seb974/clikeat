import React from 'react';
import {Alert} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import {Redirect} from "react-router-dom"; 
import Products from './products';

class Login extends React.Component 
{
    state = {
        email: '',
        password: '',
        msg: null
      };
    
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };
    
    handleLogin = e => {
        e.preventDefault();
        const { email, password } = this.state;
        const user = { email, password};
        this.setState({email: '', password: ''});
        this.props.login(user);
      };

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        if (!this.props.isAuthenticated) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-sm-8 col-md-4 mx-auto">
                            <div className="card m-b-0">
                                <div className="card-header">
                                    <h4 className="card-title">
                                        <i className="fa fa-sign-in"></i>Se connecter
                                    </h4>
                                </div>
                                <div className="card-block">
                                    {this.state.msg ? (
                                        <Alert color='danger'>{this.state.msg}</Alert>
                                    ) : null}
                                    <form onSubmit={this.handleLogin}>
                                        {(!this.props.isAuthenticated) ? "" : 
                                            <div className="mb-3">
                                                You are logged in as 
                                                { " " + this.props.user.email },
                                                <a href="{{ path('logout') }}"> Logout</a>
                                            </div>
                                        }
    
                                        <div className="form-group input-icon-left m-b-10">
                                            <i className="fa fa-user"></i>
                                            <label className="sr-only">Email</label>
                                            <input type="email" name="email" id="inputEmail" className="form-control" placeholder="Email" required autoFocus value={this.state.email} onChange={this.onChange}/>
                                        </div>
    
                                        <div className="form-group input-icon-left m-b-15">
                                            <i className="fa fa-lock"></i>
                                            <label className="sr-only">Password</label>
                                            <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Mot de passe" required value={this.state.password} onChange={this.onChange}/>
                                        </div>
    
    
                                        <button className="btn btn-primary btn-block m-t-10" >SE CONNECTER
                                            <i className="fa fa-sign-in"></i>
                                        </button>
    
                                        <div className="divider">
                                            <span>Pas encore client ?</span>
                                        </div>
                                        <a className="btn btn-secondary btn-block" href="/register" role="button">CREER UN COMPTE</a>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                );
            } 
            else {
                //return <Products/>;
                return <Redirect to='/'/>
            }
        } 
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    error: state.error
  });
  
  export default connect( mapStateToProps, { login, clearErrors })(Login);



// style="margin-top:50px"

// {% if error %}
//     <div className="alert alert-danger">{{ error.messageKey|trans(error.messageData, 'security') }}</div>
// {% endif %}

{/* <div id="fb-root"></div>
    <script async defer crossorigin="anonymous" src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v4.0&appId=502084787008815&autoLogAppEvents=1"></script>
<div className="fb-login-button" data-width="" data-size="medium" data-button-type="login_with" data-auto-logout-link="true" data-use-continue-as="true"></div>

<div className="divider">
    <span>ou</span>
</div> */}