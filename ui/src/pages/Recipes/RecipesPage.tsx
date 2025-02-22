import React, {useState} from 'react';

//const BASE_URL = 'http://127.0.0.1:8000';
const BASE_URL = 'http://localhost:8080';

const RecipesPage = () => {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRecipeInstructions, setSelectedRecipeInstructions] = useState([]);
    const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState([]);

    const handleSearchRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/recipe/search/?search_recipe_by_name=${query}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch recipes.');
            }

            const data = await response.json();
            setRecipes(data.recipes);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSearchRecipeInstructions = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/recipe/search/instructions/?search_recipe_by_id=${id}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch recipes.');
            }

            const data = await response.json();
            console.log(data)
            setSelectedRecipeInstructions(data.instructions);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSearchRecipeIngredients = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/recipe/search/ingredients/?search_recipe_by_id=${id}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch recipes.');
            }

            const data = await response.json();
            console.log(data)
            setSelectedRecipeIngredients(data.ingredients);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSelectedRecipe = (event, recipeId) => {
        handleSearchRecipeIngredients(event, recipeId);
        handleSearchRecipeInstructions(event, recipeId);
    };

    return (
        <div className="container">
            <div className="searchbar">
                <h2>Recipe Search!</h2>
                <form onSubmit={handleSearchRecipe}>
                    <input
                        name="search_recipe_by_name"
                        placeholder="Search for a recipe"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}

            <div className="results">
                <h3>Results:</h3>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <a
                                href="#"
                                onClick={(e) => handleSelectedRecipe(e, recipe.id)}>
                                <h3>{recipe.title}</h3>
                                <img
                                    src={recipe.image}
                                    alt={`Image of ${recipe.name}`} // Improved accessibility
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="instructions">
                <h3>Recipe Details</h3>
                {selectedRecipeInstructions.length > 0 ? (
                    <>
                        <h4>Instructions:</h4>
                        <ol>
                            {selectedRecipeInstructions.map((instruction, index) => (
                                <li key={index}>
                                    <strong>{index + 1}:</strong> {instruction.step}
                                </li>
                            ))}
                        </ol>
                    </>
                ) : (
                    <p>Select a recipe to view instructions.</p>
                )}

                {selectedRecipeIngredients.length > 0 && (
                    <>
                        <h4>Ingredients:</h4>
                        <ul>
                            {selectedRecipeIngredients.map((ingredient, index) => (
                                <li key={index}>
                                    <strong>{ingredient.name}:</strong> {ingredient.amount} {ingredient.amount_unit}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecipesPage;