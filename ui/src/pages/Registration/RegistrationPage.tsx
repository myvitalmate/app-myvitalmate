import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const BASE_URL = 'http://localhost:8080';

interface RegistrationFormData {
    email: string;
    password: string;
    confirmPassword: string;
    role: 'PATIENT' | 'DIETITIAN';
}

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const [formData, setFormData] = useState<RegistrationFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'PATIENT'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const registrationData = {
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setMessage('Registration successful!');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="PATIENT">Patient</option>
                        <option value="DIETITIAN">Dietitian</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Register
                </button>

                <div className="mt-4 text-center">
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-500 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegistrationPage;
