import React from 'react'
import { Link } from 'react-router'
import './header.scss'

class Header extends React.Component {
    render() {
        return (
            <div>
                <a href='#/'>
                    <div className="row header">
                        <span alt="Excellence Technologies"></span>
                    </div>
                </a>
                <div>
                    <Link to="/admin">Admin Area</Link>
                </div>
            </div>
        );
    }
}

export default Header;
