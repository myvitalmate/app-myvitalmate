"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Check, Plus, Search} from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton"
import {useEffect, useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {format, subDays} from "date-fns"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

const BASE_URL = import.meta.env.VITE_BACKEND_URL
const SPOONACULAR_IMAGE_BASE_URL = "https://spoonacular.com/cdn/ingredients_100x100/"

interface IngredientNameDTO {
    id?: number
    name: string
    image: string
}

interface NutrientValueDTO {
    name: string
    amount: number
    unit: string
}

interface NutrientTotalDTO {
    nutrients: Record<string, NutrientValueDTO>
}

interface FoodEntryDTO {
    ingredientName: string
    ingredientId?: number
    amount: number
    unit: string
    timestamp: string
    nutrients: NutrientValueDTO[]
}

interface NutrientLogDTO {
    logDate: string
    patientId: number
    foodEntries: FoodEntryDTO[]
}

const MACRO_NUTRIENTS = ["Calories", "Protein", "Fat", "Carbohydrates", "Fiber", "Sugar"];

const NutrientLogPage = () => {
    const [ingredientName, setIngredientName] = useState("")
    const [ingredients, setIngredients] = useState<IngredientNameDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedIngredient, setSelectedIngredient] = useState<IngredientNameDTO | null>(null)
    const [nutrients, setNutrients] = useState<NutrientValueDTO[]>([])
    const [loadingNutrients, setLoadingNutrients] = useState(false)
    const [patientProfileId, setPatientProfileId] = useState<number | null>(null)
    const [nutrientLog, setNutrientLog] = useState<NutrientLogDTO | null>(null)
    const [activeTab, setActiveTab] = useState("add-food")
    const [amount, setAmount] = useState(100)
    const [unit, setUnit] = useState("grams")
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [addingToLog, setAddingToLog] = useState(false)
    const [macronutrients, setMacronutrients] = useState<NutrientTotalDTO | null>(null)
    const [micronutrients, setMicronutrients] = useState<NutrientTotalDTO | null>(null)
    const [dateRange, setDateRange] = useState({
        startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    })
    const [loadingNutrientTotals, setLoadingNutrientTotals] = useState(false)
    const [latestEntries, setLatestEntries] = useState<FoodEntryDTO[]>([]);
    const [loadingLatestEntries, setLoadingLatestEntries] = useState(false);

    useEffect(() => {
        const fetchPatientProfileId = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("You must be logged in to use this feature")
                    return
                }

                const response = await fetch(`${BASE_URL}/patients/viewAll`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }

                const myPatients = await response.json()
                console.log("Patients:", myPatients)

                if (myPatients && myPatients.length > 0) {
                    const patientId = myPatients[0].id
                    console.log("Selected patient ID:", patientId)
                    setPatientProfileId(patientId)
                    fetchNutrientLog(patientId)
                } else {
                    setError("No patient profile found. Please create a profile first.")
                }
            } catch (err) {
                console.error("Error fetching patient profile:", err)
                setError(err instanceof Error ? err.message : "Failed to fetch patient profile")
            }
        }

        fetchPatientProfileId()
    }, [])

    const searchIngredients = async () => {
        if (!ingredientName.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${BASE_URL}/nutrients/ingredients?ingredientName=${ingredientName}`)
            if (!response.ok) throw new Error(`Error: ${response.status}`)

            const data = await response.json()
            setIngredients(Array.isArray(data) ? data : data.results || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            setIngredients([])
        } finally {
            setLoading(false)
        }
    }

    const fetchNutrientValues = async (ingredientId: number) => {
        setLoadingNutrients(true)
        setError(null)

        try {
            const response = await fetch(
                `${BASE_URL}/nutrients/nutrientValues?ingredientId=${ingredientId}&amount=${amount}&unit=${unit}`,
            )

            if (!response.ok) throw new Error(`Error: ${response.status}`)

            const data = await response.json()
            setNutrients(data)
            setShowAddDialog(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            setNutrients([])
        } finally {
            setLoadingNutrients(false)
        }
    }

    const logFoodEntry = async () => {
        if (!patientProfileId || !selectedIngredient) {
            return setError("Patient profile or ingredient not found.")
        }

        setAddingToLog(true)

        try {
            const today = new Date().toISOString().split("T")[0]
            const foodEntryDTO = {
                ingredientName: selectedIngredient.name,
                ingredientId: selectedIngredient.id,
                amount: amount,
                unit: unit,
                timestamp: new Date().toISOString(),
                nutrients: nutrients,
            }

            const url = `${BASE_URL}/nutrients/log-food?patientId=${patientProfileId}&logDate=${today}`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(foodEntryDTO),
            })

            if (!response.ok) throw new Error(`Failed to log food entry: ${response.status}`)

            if (patientProfileId) fetchNutrientLog(patientProfileId)

            setShowAddDialog(false)
            setSelectedIngredient(null)
            setNutrients([])
        } catch (err) {
            console.error("Logging error:", err)
            setError(err instanceof Error ? err.message : "Failed to log food entry")
        } finally {
            setAddingToLog(false)
        }
    }

    const fetchNutrientLog = async (patientId: number) => {
        try {
            const today = new Date().toLocaleDateString("en-CA")
            console.log(`Fetching nutrient log for patientId=${patientId} and logDate=${today}`)

            const response = await fetch(`${BASE_URL}/nutrients/log?patientId=${patientId}&logDate=${today}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            })

            if (response.status === 404) {
                console.log("No nutrient log found for today")
                setNutrientLog(null)
                return
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const data = await response.json()
            console.log("Nutrient log data:", data)
            setNutrientLog(data)
        } catch (err) {
            console.error("Error fetching nutrient log:", err)
            setError(err instanceof Error ? err.message : "Failed to fetch nutrient log")
        }
    }

    const handleIngredientClick = (ingredient: IngredientNameDTO) => {
        if (ingredient.id) {
            setSelectedIngredient(ingredient)
            fetchNutrientValues(ingredient.id)
        }
    }

    const fetchNutrientTotals = async () => {
        if (!patientProfileId) return;

        setLoadingNutrientTotals(true);
        try {
            const macroResponse = await fetch(
                `${BASE_URL}/nutrients/macronutrients/total?patientId=${patientProfileId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                }
            );

            const microResponse = await fetch(
                `${BASE_URL}/nutrients/micronutrients/total?patientId=${patientProfileId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                }
            );

            if (macroResponse.ok) {
                const macroData = await macroResponse.json();
                setMacronutrients(macroData);
            }

            if (microResponse.ok) {
                const microData = await microResponse.json();
                setMicronutrients(microData);
            }
        } catch (err) {
            console.error("Error fetching nutrient totals:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch nutrient totals");
        } finally {
            setLoadingNutrientTotals(false);
        }
    };

    const fetchLatestEntries = async () => {
        if (!patientProfileId) return;
        
        setLoadingLatestEntries(true);
        try {
            const response = await fetch(
                `${BASE_URL}/nutrients/latest-entries?patientId=${patientProfileId}&limit=10`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                setLatestEntries(data);
            }
        } catch (err) {
            console.error("Error fetching latest entries:", err);
        } finally {
            setLoadingLatestEntries(false);
        }
    };

    useEffect(() => {
        if (patientProfileId) {
            fetchNutrientLog(patientProfileId);
            fetchNutrientTotals();
            fetchLatestEntries();
        }
    }, [patientProfileId]);

    const handleDateRangeChange = (type: 'startDate' | 'endDate', value: string) => {
        setDateRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    return (
        <main className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Nutrient Log</h1>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="add-food">Add Food</TabsTrigger>
                        <TabsTrigger value="nutrient-log">Nutrient Log</TabsTrigger>
                        <TabsTrigger value="nutrient-totals">Nutrient Totals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="add-food">
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
                                    <div className="space-y-2">
                                        <Skeleton className="h-24 w-full"/>
                                        <Skeleton className="h-24 w-full"/>
                                        <Skeleton className="h-24 w-full"/>
                                    </div>
                                ) : ingredients.length > 0 ? (
                                    <div className="space-y-3">
                                        {ingredients.map((ingredient) => (
                                            <Card key={ingredient.id}
                                                  className="overflow-hidden transition-all hover:shadow-md">
                                                <CardContent className="flex items-center gap-4 p-4">
                                                    <img
                                                        src={`${SPOONACULAR_IMAGE_BASE_URL}${ingredient.image}`}
                                                        alt={ingredient.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <span className="text-lg flex-1">{ingredient.name}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleIngredientClick(ingredient)}
                                                        className="rounded-full hover:bg-green-50"
                                                    >
                                                        <Plus className="h-5 w-5 text-green-600"/>
                                                        <span className="sr-only">Add {ingredient.name}</span>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Search for ingredients to add to your log.</p>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-2">Selected Ingredient</h2>
                                {loadingNutrients ? (
                                    <Skeleton className="h-24 w-full"/>
                                ) : selectedIngredient ? (
                                    <Card className="border-green-200">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={`${SPOONACULAR_IMAGE_BASE_URL}${selectedIngredient.image}`}
                                                    alt={selectedIngredient.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <h3 className="text-lg font-medium">{selectedIngredient.name}</h3>
                                            </div>

                                            <div className="space-y-1 mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Nutrient values per {amount} {unit}:
                                                </p>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {nutrients.map((n, i) => (
                                                        <div key={i}
                                                             className="flex justify-between py-1 border-b border-gray-100">
                                                            <span className="text-sm">{n.name}</span>
                                                            <Badge variant="outline" className="ml-2">
                                                                {n.amount} {n.unit}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <p className="text-gray-500">Click the + button on an ingredient to view nutrient
                                        info.</p>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="nutrient-log">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Today's Nutrient Log</h2>
                                {nutrientLog && nutrientLog.foodEntries.length > 0 ? (
                                    <div className="space-y-4">
                                        {nutrientLog.foodEntries.map((entry, idx) => (
                                            <Card key={idx} className="overflow-hidden">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-medium text-lg">{entry.ingredientName}</h3>
                                                        <Badge variant="outline">
                                                            {entry.amount} {entry.unit}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                                        {entry.nutrients
                                                            .filter(n => MACRO_NUTRIENTS.includes(n.name))
                                                            .map((n, i) => (
                                                                <div key={i} className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">{n.name}:</span>
                                                                    <span>
                                                                        {n.amount} {n.unit}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">No food entries found for today.</p>
                                        <Button variant="outline" onClick={() => setActiveTab("add-food")}>
                                            <Plus className="mr-2 h-4 w-4"/>
                                            Add Food Items
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Recent Food Entries</h2>
                                {loadingLatestEntries ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-24 w-full"/>
                                        <Skeleton className="h-24 w-full"/>
                                    </div>
                                ) : latestEntries.length > 0 ? (
                                    <div className="space-y-4">
                                        {latestEntries.map((entry, idx) => (
                                            <Card key={idx} className="overflow-hidden">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-medium text-lg">{entry.ingredientName}</h3>
                                                        <div className="flex flex-col items-end">
                                                            <Badge variant="outline" className="mb-1">
                                                                {entry.amount} {entry.unit}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(entry.timestamp).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                                        {entry.nutrients
                                                            .filter(n => MACRO_NUTRIENTS.includes(n.name))
                                                            .map((n, i) => (
                                                                <div key={i} className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">{n.name}:</span>
                                                                    <span>
                                                                        {n.amount} {n.unit}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No recent food entries found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="nutrient-totals">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Nutrient Totals</h2>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col">
                                    <label htmlFor="startDate" className="text-sm font-medium mb-1">Start Date</label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="endDate" className="text-sm font-medium mb-1">End Date</label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            {loadingNutrientTotals ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-24 w-full"/>
                                    <Skeleton className="h-24 w-full"/>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Macronutrients</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {macronutrients && Object.entries(macronutrients.nutrients).length > 0 ? (
                                                <div className="space-y-2">
                                                    {Object.entries(macronutrients.nutrients).map(([name, value]) => (
                                                        <div key={name}
                                                             className="flex justify-between items-center py-2 border-b">
                                                            <span className="font-medium">{name}</span>
                                                            <Badge variant="outline">
                                                                {value.amount.toFixed(1)} {value.unit}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No macronutrient data
                                                    available for the selected period.</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Micronutrients</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {micronutrients && Object.entries(micronutrients.nutrients).length > 0 ? (
                                                <div className="space-y-2">
                                                    {Object.entries(micronutrients.nutrients).map(([name, value]) => (
                                                        <div key={name}
                                                             className="flex justify-between items-center py-2 border-b">
                                                            <span className="font-medium">{name}</span>
                                                            <Badge variant="outline">
                                                                {value.amount.toFixed(1)} {value.unit}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No micronutrient data
                                                    available for the selected period.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add to Log Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add to Nutrient Log</DialogTitle>
                        <DialogDescription>Add {selectedIngredient?.name} to your daily nutrient log</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unit" className="text-right">
                                Unit
                            </Label>
                            <div className="col-span-3">
                                <Select value={unit} onValueChange={setUnit}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="grams">Grams</SelectItem>
                                        <SelectItem value="milliliters">Milliliters</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={logFoodEntry} disabled={addingToLog}
                                className="bg-green-600 hover:bg-green-700">
                            {addingToLog ? (
                                <span className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full"/>
                  Adding...
                </span>
                            ) : (
                                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4"/>
                  Add to Log
                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}

export default NutrientLogPage
