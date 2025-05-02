import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
        <div className="flex flex-col w-full max-w-sm items-center space-y-4 mx-auto pt-4 pl-4 pr-4">
            <h1>Welcome to My Vital Mate</h1>
            <div className="flex w-full items-center space-x-2">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Test backend"
                />
                <Button variant={"default"} onClick={handleBackendCall}>Search</Button>
            </div>
            <p>{result}</p>
        </div>
    );
};

export default Home;
