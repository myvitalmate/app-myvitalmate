import React, {useEffect, useState} from 'react';

const BASE_URL = 'http://localhost:8080';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Please enter both username and password.');
            return;
        }

        const credentials = btoa(`${username}:${password}`);

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.setItem('auth', credentials);
                setIsLoggedIn(true);
                setMessage('Login successful!');
            } else {
                setMessage('Invalid username or password');
                setPassword('');
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Unknown error";
            setMessage(`Something went wrong. Please try again. ${errorMsg}`);
        }

    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setIsLoggedIn(false);
        setMessage('Logged out successfully!');
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <h2>Login</h2>
            {message && <p>{message}</p>}

            {!isLoggedIn ? (
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br/>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br/>
                    <button type="submit">Login</button>
                </form>
            ) : (
                <div>
                    <p>You are logged in!</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;