import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./AdminDashboard.css"
import Header from "../componenets/custom/Header.jsx";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: "",
        password: '',
        confirmPassword: "",
        role: 'USER'
    });

    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    const navigate = useNavigate();

    useEffect(() => {
        if (!name || role !== 'ADMIN') {
            navigate('/');
        } else {
            fetchUsers();
        }
    }, [name, role, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!emailRegex.test(formData.email)) {
            setMessage("❌ Invalid email format.");
            return false;
        }

        if (!strongPassword.test(formData.password)) {
            setMessage("❌ Password must be 8+ chars with uppercase, number & symbol.");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Passwords do not match.");
            return false;
        }

        return true;
    };


    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await axios.post('http://localhost:8080/api/auth/users', formData);
            setFormData({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '', role: 'USER' });
            setMessage("✅ User created successfully!");

            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error creating user:', error);
            setMessage("❌ Failed to create user (maybe duplicate email)");
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:8080/api/auth/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <>
            <Header/>
            <div className="form-container1">
                <h2>Admin Dashboard</h2>

                {/* Create User Form */}
                <form onSubmit={handleCreateUser} className="create-user-form">
                    <h3>Create New User</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <select name="role" value={formData.role} onChange={handleInputChange}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <button type="submit" className="create-button">Create User</button>
                </form>
                {message && <p className="message">{message}</p>}

                {/* Users Table */}
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber || '-'}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminDashboard;
