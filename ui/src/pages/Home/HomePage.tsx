import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchResponse = async (searchQuery: string) => {
    const response = await fetch(`${BASE_URL}/health/check/?query=${searchQuery}`);
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
        <div className="flex flex-col w-full max-w-sm items-center space-y-10 mx-auto p-4">
            <h1 className="text-xl font-bold">Welcome to My Vital Mate</h1>
            <h2 className="text-sm font-bold text-red-800"> Note: The backend may take up to 60 seconds to respond on first request due to cold starts.</h2>
            <div className="flex w-full items-center space-x-5">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Test backend"
                    className = "border-3 rounded-lg"
                />
                <Button
                    onClick={handleBackendCall}
                    className="border-2 rounded-lg"
                >
                    Search</Button>
            </div>
            <p>{result}</p>
        </div>
    );
};

export default Home;
