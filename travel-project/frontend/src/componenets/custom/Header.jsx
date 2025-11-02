import React from "react";
import "./Header.css"
import {Link, useNavigate} from "react-router-dom";
import AdminUnreadBadge from "../../contactSection/AdminUnreadBadge.jsx";
function Header(){
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem("lastScore")
        localStorage.removeItem("userId")
        navigate('/');
    };




    return (

        <div className="nav-bar">
            <h1 className="logo">TRAVEL</h1>
            <div className= "routs">
                <Link   to="/">Home</Link>
            <Link   to="/about">About</Link>
            <Link   to="/service">Service</Link>
                <Link   to="/contact">Contact Us</Link>
            <Link  to="/create-trip">🤖 Generate Trip</Link>
        </div>
            <div className="navbar-right">
                {name && (
                    <>
                        <span className="navbar-welcome">👋 Welcome, <strong>{name}</strong></span>

                        <div className="admin-links">
                            {role === "ADMIN" && <Link to="/admin/messages" className="navbar-dashboard">
                                Messages 📩 <AdminUnreadBadge pollMs={10000}/>
                            </Link>}

                            {role === "ADMIN" && <Link to="/admin" className="navbar-dashboard">Admin Dashboard</Link>}

                        </div>



                        <button onClick={handleLogout} className="navbar-logout">Logout</button>
                    </>
                )}

                {!name && (
                    <>
                        <Link className="signin-btn" to="/login">Login</Link>
                    </>
                )}
            </div>
        </div>

    )

}

export default Header