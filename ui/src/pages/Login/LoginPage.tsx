import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setMessage('Login successful!');
            } else {
                setMessage(data.message);
                setPassword('');
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
            console.error('Login error:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setMessage('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}

            {!isLoggedIn ? (
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-2">Email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                    
                    <div className="mt-4 text-center">
                        <p>
                            Don't have an account?{' '}
                            <a href="/register" className="text-blue-500 hover:underline">
                                Register
                            </a>
                        </p>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <p className="mb-4">You are logged in!</p>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
