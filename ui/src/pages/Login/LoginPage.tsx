import React, {useEffect, useState} from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const LOGOUT_DELAY_MS = 20 * 60 * 60 * 1000; // 20 hours in milliseconds
let logoutTimer: ReturnType<typeof setTimeout> | null = null;

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkTokenValidity();
    }, []);


    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        const loginTime = localStorage.getItem('loginTime');

        if (!token || !loginTime) {
            handleLogout();
            return;
        }

        const loginTimestamp = parseInt(loginTime, 10);
        const now = Date.now();
        const remainingTime = LOGOUT_DELAY_MS - (now - loginTimestamp);

        if (remainingTime <= 0) {
            handleLogout();
        } else {
            setIsLoggedIn(true);
            setAutoLogout(remainingTime);
        }
    };


    const setAutoLogout = (timeout: number) => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }

        logoutTimer = setTimeout(() => {
            handleLogout();
            alert('Session expired. You have been logged out automatically.');
        }, timeout);
    };


    const createAnonymousPatient = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const authResponse = await fetch(`${BASE_URL}/auth/anonymous`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const authData = await authResponse.json();

            if (authResponse.ok) {
                localStorage.setItem('token', authData.token);
                localStorage.setItem('loginTime', Date.now().toString());


                const patientResponse = await fetch(`${BASE_URL}/patients/create/anonymous`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    },
                    body: JSON.stringify({}),
                });

                if (patientResponse.ok) {
                    setIsLoggedIn(true);
                    setAutoLogout(LOGOUT_DELAY_MS);
                    setMessage('Anonymous session created successfully!');
                }
                else {
                    setMessage('Failed to create anonymous patient');
                }
            } else {
                setMessage(authData.message || 'Anonymous login failed');
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
            console.error('Anonymous login error:', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('loginTime', Date.now().toString());

                setIsLoggedIn(true);
                setAutoLogout(LOGOUT_DELAY_MS);
                setMessage('Login successful!');
            }
            else {
                setMessage(data.message || 'Login failed');
                setPassword('');
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
            console.error('Login error:', error);
        }
    };

    const handleLogout = () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
            logoutTimer = null;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');

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
            <div className="mt-4 text-center">
                <button
                    onClick={createAnonymousPatient}
                    className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
