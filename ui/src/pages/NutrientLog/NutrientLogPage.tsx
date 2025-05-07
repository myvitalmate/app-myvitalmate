// NutrientLogPage.tsx

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

interface FoodEntryDTO {
    ingredientName: string;
    ingredientId?: number;
    amount: number;
    unit: string;
    timestamp: string;
    nutrients: NutrientValueDTO[];
}

interface NutrientLogDTO {
    logDate: string;
    patientId: number;
    foodEntries: FoodEntryDTO[];
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
    const [nutrientLog, setNutrientLog] = useState<NutrientLogDTO | null>(null);

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
                console.log("Patients:", myPatients);

                if (myPatients && myPatients.length > 0) {
                    const patientId = myPatients[0].id;
                    console.log("Selected patient ID:", patientId);
                    setPatientProfileId(patientId);
                    fetchNutrientLog(patientId);
                } else {
                    setError("No patient profile found. Please create a profile first.");
                }
            } catch (err) {
                console.error("Error fetching patient profile:", err);
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
            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setIngredients(Array.isArray(data) ? data : data.results || []);
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

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setNutrients(data);
            await logFoodEntry(selectedIngredient!, data);
            if (patientProfileId) fetchNutrientLog(patientProfileId);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setNutrients([]);
        } finally {
            setLoadingNutrients(false);
        }
    };

    const logFoodEntry = async (ingredient: IngredientNameDTO, nutrientValues: NutrientValueDTO[]) => {
        if (!patientProfileId) return setError("Patient profile not found.");

        try {
            const today = new Date().toISOString().split("T")[0];
            const foodEntryDTO = {
                ingredientName: ingredient.name,
                ingredientId: ingredient.id,
                amount: 100,
                unit: "grams",
                timestamp: new Date().toISOString(),
                nutrients: nutrientValues
            };

            const url = `${BASE_URL}/nutrients/log-food?patientId=${patientProfileId}&logDate=${today}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(foodEntryDTO)
            });

            if (!response.ok) throw new Error(`Failed to log food entry: ${response.status}`);
        } catch (err) {
            console.error("Logging error:", err);
        }
    };

    const fetchNutrientLog = async (patientId: number) => {
        try {
            const today = new Date().toLocaleDateString('en-CA');
            console.log(`Fetching nutrient log for patientId=${patientId} and logDate=${today}`);

            const response = await fetch(`${BASE_URL}/nutrients/log?patientId=${patientId}&logDate=${today}`, {
                headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
            });

            if (response.status === 404) {
                console.log("No nutrient log found for today");
                setNutrientLog(null);
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Nutrient log data:", data);
            setNutrientLog(data);
        } catch (err) {
            console.error("Error fetching nutrient log:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch nutrient log');
        }
    };

    const handleIngredientClick = (ingredient: IngredientNameDTO) => {
        if (ingredient.id) {
            setSelectedIngredient(ingredient);
            fetchNutrientValues(ingredient.id);
        }
    };

    return (
        <main className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Nutrient Log</h1>

                <div className="flex gap-4 mb-6">
                    <Input
                        placeholder="Search for ingredients..."
                        value={ingredientName}
                        onChange={(e) => setIngredientName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchIngredients()}
                    />
                    <Button onClick={searchIngredients}>
                        <Search className="mr-2 h-4 w-4"/> Search
                    </Button>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                        {loading ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : (
                            ingredients.map((ingredient) => (
                                <Card key={ingredient.id} onClick={() => handleIngredientClick(ingredient)}
                                      className="cursor-pointer mb-2">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <img
                                            src={`${SPOONACULAR_IMAGE_BASE_URL}${ingredient.image}`}
                                            alt={ingredient.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <span className="text-lg">{ingredient.name}</span>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">Nutrient Values</h2>
                        {loadingNutrients ? (
                            <Skeleton className="h-24 w-full"/>
                        ) : nutrients.length > 0 ? (
                            <ul className="space-y-2">
                                {nutrients.map((n, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span>{n.name}</span>
                                        <span>{n.amount} {n.unit}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Select an ingredient to view nutrient info.</p>
                        )}
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Today's Nutrient Log</h2>
                    {nutrientLog ? (
                        <div className="space-y-4">
                            {nutrientLog.foodEntries.map((entry, idx) => (
                                <Card key={idx} className="p-4">
                                    <h3 className="font-medium text-lg">{entry.ingredientName}</h3>
                                    <p className="text-sm text-gray-600">Amount: {entry.amount} {entry.unit}</p>
                                    <ul className="mt-2">
                                        {entry.nutrients.map((n, i) => (
                                            <li key={i}>{n.name}: {n.amount} {n.unit}</li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    ) : <p>No log found for today.</p>}
                </div>
            </div>
        </main>
    );
};

export default NutrientLogPage;