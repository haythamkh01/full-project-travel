
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            const { token, message ,role ,email ,name ,id } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role); // ✅ now it's real
            localStorage.setItem('userName', name); // or extract from token if needed
            localStorage.setItem('userEmail', email); // optional
            localStorage.setItem("userId", id);

            setMessage(message);

            // ✅ Short delay to ensure storage is written
            setTimeout(() => {
                navigate('/');
            }, 200);
        } catch (error) {
            console.error("Login error:", error);
            setMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                       required/>
                <input type="password" name="password" placeholder="Password" value={formData.password}
                       onChange={handleChange} required/>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <p><Link to="/forgot-password">Forgot your password?</Link></p>

            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;