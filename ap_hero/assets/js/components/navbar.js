import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import OptionNavbar from './optionNavBar';


export default class Navbar extends Component {

    render() {
        return (
            <header id="header">
                <div className="container">
                    <div className="navbar-backdrop">
                        <div className="navbar">
                            <Link to="/" className="logo"> <img src="uploads/logos/clikEat.png" alt="Clik Eat Logo" height="50px"/></Link>
                            <div className="toright">
                                <nav className="nav">
                                    <OptionNavbar />
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

