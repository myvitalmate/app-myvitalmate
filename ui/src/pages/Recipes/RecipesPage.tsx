import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Define interfaces for our data structures
interface Recipe {
    id: number;
    title: string;
    image: string;
}

interface Instruction {
    number: number;
    step: string;
}

interface Ingredient {
    name: string;
    amount: number;
    amount_unit: string;
}

const RecipesPage = () => {
    const [query, setQuery] = useState<string>('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecipeInstructions, setSelectedRecipeInstructions] = useState<Instruction[]>([]);
    const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState<Ingredient[]>([]);

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
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleSearchRecipeInstructions = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/recipe/search/instructions/?search_recipe_by_id=${id}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch recipe instructions.');
            }

            const data = await response.json();
            setSelectedRecipeInstructions(data.instructions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleSearchRecipeIngredients = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/recipe/search/ingredients/?search_recipe_by_id=${id}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch recipe ingredients.');
            }

            const data = await response.json();
            setSelectedRecipeIngredients(data.ingredients);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleSelectedRecipe = (event: React.MouseEvent, recipeId: number) => {
        handleSearchRecipeIngredients(event, recipeId);
        handleSearchRecipeInstructions(event, recipeId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search and Results Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recipe Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearchRecipe} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    name="search_recipe_by_name"
                                    placeholder="Search for a recipe"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Button type="submit">Search</Button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <ScrollArea className="h-[500px] mt-4 pr-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {recipes.map((recipe) => (
                                    <Card
                                        key={recipe.id}
                                        className="cursor-pointer hover:bg-accent transition-colors"
                                        onClick={(e) => handleSelectedRecipe(e, recipe.id)}
                                    >
                                        <CardContent className="p-4">
                                            <img
                                                src={recipe.image}
                                                alt={`Image of ${recipe.title}`}
                                                className="w-full h-40 object-cover rounded-md mb-2"
                                            />
                                            <h3 className="font-medium text-sm">{recipe.title}</h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Recipe Details Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recipe Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="pr-2">
                                {selectedRecipeInstructions.length > 0 ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-lg font-semibold mb-2">Instructions</h4>
                                            <ol className="space-y-2">
                                                {selectedRecipeInstructions.map((instruction) => (
                                                    <li key={instruction.number} className="flex gap-2">
                                                        <span className="font-medium">{instruction.number}.</span>
                                                        <span>{instruction.step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>

                                        {selectedRecipeIngredients.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2">Ingredients</h4>
                                                <ul className="space-y-2">
                                                    {selectedRecipeIngredients.map((ingredient, index) => (
                                                        <li key={index} className="flex justify-between items-center">
                                                            <span className="font-medium">{ingredient.name}</span>
                                                            <span className="text-muted-foreground">
                                                                {ingredient.amount} {ingredient.amount_unit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        Select a recipe to view instructions and ingredients
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RecipesPage;