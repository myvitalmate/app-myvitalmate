import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from 'lucide-react';
import {Skeleton} from "@/components/ui/skeleton";
import {useEffect, useState} from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const SPOONACULAR_IMAGE_BASE_URL = "https://spoonacular.com/cdn/ingredients_100x100/";

interface IngredientNameDTO {
    id?: number;
    name: string;
    image: string;
}

interface NutrientValueDTO {
    name: string;
    amount: number;
    unit: string;
}

const NutrientLogPage = () => {
    const [ingredientName, setIngredientName] = useState("");
    const [ingredients, setIngredients] = useState<IngredientNameDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIngredient, setSelectedIngredient] = useState<IngredientNameDTO | null>(null);
    const [nutrients, setNutrients] = useState<NutrientValueDTO[]>([]);
    const [loadingNutrients, setLoadingNutrients] = useState(false);
    const [patientProfileId, setPatientProfileId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPatientProfileId = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("You must be logged in to use this feature");
                    return;
                }


                const response = await fetch(`${BASE_URL}/patients/viewAll`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const myPatients = await response.json();

                if (myPatients && myPatients.length > 0) {
                    setPatientProfileId(myPatients[0].id);
                } else {
                    setError("No patient profile found. Please create a profile first.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch patient profile');
            }
        };

        fetchPatientProfileId();
    }, []);

    const searchIngredients = async () => {
        if (!ingredientName.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/nutrients/ingredients?ingredientName=${ingredientName}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();

            if (data && Array.isArray(data)) {
                setIngredients(data);
            } else if (data && Array.isArray(data.results)) {
                setIngredients(data.results);
            } else {
                setIngredients([]);
                setError("No ingredients found or unexpected response format.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIngredients([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchNutrientValues = async (ingredientId: number) => {
        setLoadingNutrients(true);
        setError(null);

        try {
            const response = await fetch(
                `${BASE_URL}/nutrients/nutrientValues?ingredientId=${ingredientId}&amount=100&unit=grams`
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setNutrients(data);
                await logFoodEntry(selectedIngredient!, data);
            } else if (data && Array.isArray(data.nutrients)) {
                setNutrients(data.nutrients);
            } else {
                setNutrients([]);
                setError("No nutrient data found or unexpected response format.");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setNutrients([]);
        } finally {
            setLoadingNutrients(false);
        }
    };

    const logFoodEntry = async (ingredient: IngredientNameDTO, nutrientValues: NutrientValueDTO[]) => {
        if (!patientProfileId) {
            setError("Patient profile not found. Please create a profile first.");
            return;
        }

        try {
            // Format the date as ISO date string (YYYY-MM-DD)
            const today = new Date().toISOString().split("T")[0];

            // Create the food entry DTO
            const foodEntryDTO = {
                ingredientName: ingredient.name,
                ingredientId: ingredient.id,
                amount: 100,
                unit: "grams",
                timestamp: new Date().toISOString(),
                nutrients: nutrientValues
            };

            // Build URL with query parameters
            const url = `${BASE_URL}/nutrients/log-food?patientId=${patientProfileId}&logDate=${today}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(foodEntryDTO)
            });

            if (!response.ok) {
                throw new Error(`Failed to log food entry: ${response.status}`);
            }

            console.log("Food entry successfully logged.");
        } catch (err) {
            console.error("Logging error:", err);
        }
    };


    const handleIngredientClick = (ingredient: IngredientNameDTO) => {
        if (ingredient.id) {
            setSelectedIngredient(ingredient);
            fetchNutrientValues(ingredient.id);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-green-800 mb-2">NutrientLog</h1>
                    <p className="text-center text-gray-600 mb-8">Your personal nutrition tracking assistant</p>

                    <div className="flex gap-2 mb-8">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search ingredients..."
                                value={ingredientName}
                                onChange={(e) => setIngredientName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && searchIngredients()}
                                className="pl-10 border-green-200 focus-visible:ring-green-500"
                            />
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                        </div>
                        <Button onClick={searchIngredients} className="bg-green-600 hover:bg-green-700">
                            Search
                        </Button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Grid layout for results and nutrient details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Ingredient Results */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-green-800">Ingredients</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {loading ? (
                                    Array(3)
                                        .fill(0)
                                        .map((_, i) => (
                                            <Card key={i} className="overflow-hidden">
                                                <CardContent className="p-4">
                                                    <Skeleton className="h-6 w-3/4"/>
                                                </CardContent>
                                            </Card>
                                        ))
                                ) : ingredients.length > 0 ? (
                                    ingredients.map((ingredient) => (
                                        <Card
                                            key={ingredient.id}
                                            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleIngredientClick(ingredient)}
                                        >
                                            <CardContent className="p-4">
                                                {ingredient.image && (
                                                    <img
                                                        src={`${SPOONACULAR_IMAGE_BASE_URL}${ingredient.image}`}
                                                        alt={ingredient.name}
                                                        className="w-full h-32 object-cover rounded-md mb-2"
                                                    />
                                                )}
                                                <h3 className="text-lg font-medium text-green-800">
                                                    {ingredient.name}
                                                </h3>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : ingredientName && !loading && !error ? (
                                    <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No ingredients found for "{ingredientName}"</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Nutrient Details */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-green-800">Nutrient Values</h2>
                            <Card>
                                <CardContent className="p-4">
                                    {loadingNutrients ? (
                                        <div className="space-y-2">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Skeleton key={i} className="h-6 w-full"/>
                                            ))}
                                        </div>
                                    ) : selectedIngredient ? (
                                        <>
                                            <h3 className="text-lg font-medium text-green-800 mb-4">
                                                {selectedIngredient.name} (per 100g)
                                            </h3>
                                            {nutrients.length > 0 ? (
                                                <div className="space-y-2">
                                                    {nutrients.map((nutrient, index) => (
                                                        <div key={index} className="flex justify-between py-1 border-b">
                                                            <span className="font-medium">{nutrient.name}</span>
                                                            <span>{nutrient.amount} {nutrient.unit}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No nutrient data available</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            Select an ingredient to view its nutrient values
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NutrientLogPage;