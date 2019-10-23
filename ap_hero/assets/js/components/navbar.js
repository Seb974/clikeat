import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import OptionNavbar from './optionNavBar';
import { connect } from 'react-redux';


export default class Navbar extends Component {

    state = {
        user: this.props.details || {},
    }

    render() {
        return (
            <header id="header">
                <div className="container">
                    <div className="navbar-backdrop">
                        <div className="navbar">
                            <Link to="/" className="logo"> <img src="uploads/logos/clikEat.png" alt="Clik Eat Logo" height="50px"/></Link>
                            <div className="toright">
                                <nav className="nav">
                                    <OptionNavbar details={this.state.user}/>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-search">
                        <div className="container">
                            <form method="post">
                                <input type="text" className="form-control" placeholder="Rechercher..."/>
                                <i className="fas fa-times close"></i>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

//ReactDOM.render(<Navbar/>, document.getElementById("react-header"));

{/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <Link to="/" className="navbar-brand "><i className="fas fa-poo"> vie de mern</i></Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <Log/>
        </ul>
    </div>
</nav> */}

