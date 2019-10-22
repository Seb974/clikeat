console.log("From login...");

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Product from './product';

export default class Login extends React.Component 
{
    state = {
        user: [],
        email: "",
        password: "",
        token: ""
    };

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleLogin = (event) => {
        event.preventDefault();
         axios.post('http://localhost:8000/api/login_check', {
                username: this.state.email, 
                password: this.state.password
             }, { headers: { "Content-Type": "application/json" } })
              .then(response => {
                    console.log(response.data);
                    this.setState({token: response.data.token});
                    axios.post('http://localhost:8000/user/current', {
                        email: this.state.email
                    },
                    { headers: { "Content-Type": "application/json"} })
                     .then(response => {
                        this.setState({user: response.data.user, email: '', password: ''});
                        console.log(this.state.user);
                     })
                     window.location = '/';
             })
             .catch((err) => console.log(err));
        //     //this.setState({email: '', password: ''});
    }

    render() {
        const user = this.props;
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
                                <form method="post" onSubmit={this.handleLogin}>
                                    {(user === [] || typeof(user.email) === 'undefined') ? "" : 
                                        <div className="mb-3">
                                            You are logged in as
                                            { user.email },
                                            <a href="{{ path('logout') }}">Logout</a>
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

}

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