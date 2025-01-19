import {useState} from "react";

const BASE_URL = 'http://127.0.0.1:8000';

export const fetchRecipes = async (searchQuery: string) => {
    const response = await fetch(`${BASE_URL}/recipe/search/?query=${encodeURIComponent(searchQuery)}`);
    const data = await response.json();
    return data.recipes;
};

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState('');

    const handleSearch = async () => {
        const recipes = await fetchRecipes(searchQuery);
        setResult(recipes);
    };

    return (
        <div>
            <h1>Recipe Search</h1>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a recipe name..."
            />
            <button onClick={handleSearch}>Search</button>
            <p>{result}</p>
        </div>
    );
};

export default Home;
