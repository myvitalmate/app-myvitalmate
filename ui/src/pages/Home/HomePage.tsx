import {useState} from "react";

const BASE_URL = 'http://127.0.0.1:8000';

export const fetchResponse = async (searchQuery: string) => {
    const response = await fetch(`${BASE_URL}/health/check/?query=${encodeURIComponent(searchQuery)}`);
    const data = await response.json();
    return data.healthResponse;
};

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState('');

    const handleBackendCall = async () => {
        const response = await fetchResponse(searchQuery);
        setResult(response);
    };

    return (
        <div>
            <h1>Welcome to My Vital Mate</h1>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Test backend"
            />
            <button onClick={handleBackendCall}>Search</button>
            <p>{result}</p>
        </div>
    );
};

export default Home;
