import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Register.css"

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!emailRegex.test(formData.email)) {
            setMessage("❌ Invalid email format");
            return false;
        }

        if (!strongPassword.test(formData.password)) {
            setMessage("❌ Password must include uppercase, number, symbol, and be 8+ characters");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);

            // ✅ Use backend message, not hardcoded
            setMessage('✅ ' + response.data);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error(error);
            // ✅ Show backend validation error if available
            setMessage(error.response?.data?.message || '❌ Registration failed');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Register;
