"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Loader2, Plus, User, Users} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ScrollArea} from "@/components/ui/scroll-area"

const BASE_URL = "http://localhost:8080"

type UserType = "dietitian" | "patient"

interface Profile {
    id: number
    firstName: string
    lastName: string
    contact: {
        email: string
        phoneNumber: string
    }
    adresse: {
        street: string
        city: string
        postalCode: string
        country: string
    }
    gender: string
    birthday: string
    dietOrientation?: string
    currentWeight?: string
    goals?: string
    sickness?: string
    specialty?: string
}

type FormData = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    gender: string
    birthday: string
    street: string
    country: string
    city: string
    postalCode: string
    specialty?: string
    dietOrientation?: string
    currentWeight?: string
    goals?: string
    sickness?: string
}

const Profile = () => {
    const [userType, setUserType] = useState<UserType>("dietitian")
    const [dietitians, setDietitians] = useState<Profile[]>([])
    const [patients, setPatients] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeView, setActiveView] = useState<"view" | "create">("view")
    const [responseMessage, setResponseMessage] = useState<string>("")
    const [messageType, setMessageType] = useState<"success" | "error">("success")

    // Form state
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        birthday: "",
        street: "",
        country: "",
        city: "",
        postalCode: "",
        specialty: "",
        dietOrientation: "",
        currentWeight: "",
        goals: "",
        sickness: "",
    })

    // Form validation errors
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true)
            try {
                // Fetch dietitians
                const dietitiansResponse = await fetch(`${BASE_URL}/dietitians/viewAll`)
                if (dietitiansResponse.ok) {
                    const dietitiansData = await dietitiansResponse.json()
                    setDietitians(dietitiansData || [])
                }

                // Fetch patients
                const patientsResponse = await fetch(`${BASE_URL}/patients/viewAll`)
                if (patientsResponse.ok) {
                    const patientsData: Profile[] = await patientsResponse.json()
                    setPatients(patientsData)
                }
            } catch (error) {
                console.error("Error fetching profiles:", error)
                setResponseMessage("Failed to load profiles. Please try again later.")
                setMessageType("error")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfiles()
    }, [])

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
    }

    // Handle select changes
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
    }

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        // Required fields for all profiles
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "gender",
            "birthday",
            "street",
            "city",
            "postalCode",
            "country",
        ]

        requiredFields.forEach((field) => {
            if (!formData[field as keyof FormData]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`
            }
        })

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Additional required fields based on user type
        if (userType === "dietitian" && !formData.specialty) {
            newErrors.specialty = "Specialty is required"
        }

        if (userType === "patient") {
            if (!formData.dietOrientation) newErrors.dietOrientation = "Diet orientation is required"
            if (!formData.currentWeight) newErrors.currentWeight = "Current weight is required"
            if (!formData.goals) newErrors.goals = "Goals are required"
            if (!formData.sickness) newErrors.sickness = "Sickness information is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const userDTO = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            birthday: formData.birthday,
            contact: {
                phoneNumber: formData.phoneNumber,
                email: formData.email,
            },
            adresse: {
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
            },
            ...(userType === "dietitian" && {
                specialty: formData.specialty,
            }),
            ...(userType === "patient" && {
                dietOrientation: formData.dietOrientation,
                currentWeight: formData.currentWeight,
                goals: formData.goals,
                sickness: formData.sickness,
            }),
        }

        try {
            const response = await fetch(`${BASE_URL}/${userType}s/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDTO),
            })

            if (response.ok) {
                setResponseMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} profile created successfully!`)
                setMessageType("success")

                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    gender: "",
                    birthday: "",
                    street: "",
                    country: "",
                    city: "",
                    postalCode: "",
                    specialty: "",
                    dietOrientation: "",
                    currentWeight: "",
                    goals: "",
                    sickness: "",
                })

                // Refresh the profiles list
                const refreshResponse = await fetch(`${BASE_URL}/${userType}s/viewAll`)
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json()
                    if (userType === "dietitian") {
                        setDietitians(refreshData || [])
                    } else {
                        setPatients(refreshData || [])
                    }
                }

                setActiveView("view")
            } else {
                const contentType = response.headers.get("content-type")
                let errorMessage = "Something went wrong"

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json()
                    errorMessage = data.message || errorMessage
                }

                setResponseMessage(errorMessage)
                setMessageType("error")
            }
        } catch (error) {
            setResponseMessage("Network error. Please try again.")
            setMessageType("error")
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                        <Button
                            variant={activeView === "view" ? "default" : "outline"}
                            onClick={() => setActiveView("view")}
                            className="px-4"
                        >
                            View Profiles
                        </Button>
                        <Button
                            variant={activeView === "create" ? "default" : "outline"}
                            onClick={() => setActiveView("create")}
                            className="px-4"
                        >
                            Create Profile
                        </Button>
                    </div>
                </div>

                {activeView === "view" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5"/>
                                            Dietitians
                                        </div>
                                    </CardTitle>
                                    <span className="text-sm px-2 py-1 rounded-full border text-muted-foreground">
                    {dietitians.length}
                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">All registered dietitian profiles</div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                                    </div>
                                ) : dietitians.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No dietitians found</div>
                                ) : (
                                    <ScrollArea className="h-[400px]">
                                        <div className="px-4">
                                            {dietitians.map((dietitian, index) => (
                                                <div key={dietitian.id || index} className="py-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="space-y-1">
                                                            <h4 className="font-medium leading-none">
                                                                {dietitian.firstName} {dietitian.lastName}
                                                            </h4>
                                                            <div
                                                                className="text-sm text-muted-foreground">{dietitian.contact.email}</div>
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {dietitian.specialty && (
                                                                    <span
                                                                        className="text-xs px-2 py-1 rounded-md bg-slate-100">
                                    {dietitian.specialty}
                                  </span>
                                                                )}
                                                                <span
                                                                    className="text-xs px-2 py-1 rounded-md border">{dietitian.gender}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {index < dietitians.length - 1 &&
                                                        <div className="h-px bg-border mt-3"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5"/>
                                            Patients
                                        </div>
                                    </CardTitle>
                                    <span
                                        className="text-sm px-2 py-1 rounded-full border text-muted-foreground">{patients.length}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">All registered patient profiles</div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                                    </div>
                                ) : patients.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No patients found</div>
                                ) : (
                                    <ScrollArea className="h-[400px]">
                                        <div className="px-4">
                                            {patients.map((patient, index) => (
                                                <div key={patient.id || index} className="py-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="space-y-1">
                                                            <h4 className="font-medium leading-none">
                                                                {patient.firstName} {patient.lastName}
                                                            </h4>
                                                            <div
                                                                className="text-sm text-muted-foreground">{patient.contact.email}</div>
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {patient.dietOrientation && (
                                                                    <span
                                                                        className="text-xs px-2 py-1 rounded-md bg-slate-100">
                                    {patient.dietOrientation}
                                  </span>
                                                                )}
                                                                {patient.currentWeight && (
                                                                    <span
                                                                        className="text-xs px-2 py-1 rounded-md border">
                                    {patient.currentWeight} kg
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {index < patients.length - 1 &&
                                                        <div className="h-px bg-border mt-3"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeView === "create" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5"/>
                                Create {userType.charAt(0).toUpperCase() + userType.slice(1)} Profile
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">Fill in the details to create a new profile
                            </div>
                            <div className="pt-2">
                                <Select value={userType} onValueChange={(value: UserType) => setUserType(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select user type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dietitian">Dietitian</SelectItem>
                                        <SelectItem value="patient">Patient</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium">
                                            First Name
                                        </label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={errors.firstName ? "border-red-500" : ""}
                                        />
                                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium">
                                            Last Name
                                        </label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={errors.lastName ? "border-red-500" : ""}
                                        />
                                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phoneNumber" className="text-sm font-medium">
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder="Phone Number"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className={errors.phoneNumber ? "border-red-500" : ""}
                                        />
                                        {errors.phoneNumber &&
                                            <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="gender" className="text-sm font-medium">
                                            Gender
                                        </label>
                                        <Select value={formData.gender}
                                                onValueChange={(value) => handleSelectChange("gender", value)}>
                                            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select Gender"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="birthday" className="text-sm font-medium">
                                            Birthday
                                        </label>
                                        <Input
                                            id="birthday"
                                            name="birthday"
                                            type="date"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            className={errors.birthday ? "border-red-500" : ""}
                                        />
                                        {errors.birthday && <p className="text-xs text-red-500">{errors.birthday}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="street" className="text-sm font-medium">
                                            Street
                                        </label>
                                        <Input
                                            id="street"
                                            name="street"
                                            placeholder="Street Address"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className={errors.street ? "border-red-500" : ""}
                                        />
                                        {errors.street && <p className="text-xs text-red-500">{errors.street}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="city" className="text-sm font-medium">
                                            City
                                        </label>
                                        <Input
                                            id="city"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={errors.city ? "border-red-500" : ""}
                                        />
                                        {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="postalCode" className="text-sm font-medium">
                                            Postal Code
                                        </label>
                                        <Input
                                            id="postalCode"
                                            name="postalCode"
                                            placeholder="Postal Code"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className={errors.postalCode ? "border-red-500" : ""}
                                        />
                                        {errors.postalCode &&
                                            <p className="text-xs text-red-500">{errors.postalCode}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="country" className="text-sm font-medium">
                                            Country
                                        </label>
                                        <Input
                                            id="country"
                                            name="country"
                                            placeholder="Country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={errors.country ? "border-red-500" : ""}
                                        />
                                        {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
                                    </div>
                                </div>

                                {userType === "dietitian" && (
                                    <div className="space-y-2">
                                        <label htmlFor="specialty" className="text-sm font-medium">
                                            Specialty
                                        </label>
                                        <Input
                                            id="specialty"
                                            name="specialty"
                                            placeholder="Specialty"
                                            value={formData.specialty || ""}
                                            onChange={handleChange}
                                            className={errors.specialty ? "border-red-500" : ""}
                                        />
                                        {errors.specialty && <p className="text-xs text-red-500">{errors.specialty}</p>}
                                    </div>
                                )}

                                {userType === "patient" && (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="dietOrientation" className="text-sm font-medium">
                                                Diet Orientation
                                            </label>
                                            <Input
                                                id="dietOrientation"
                                                name="dietOrientation"
                                                placeholder="Diet Orientation"
                                                value={formData.dietOrientation || ""}
                                                onChange={handleChange}
                                                className={errors.dietOrientation ? "border-red-500" : ""}
                                            />
                                            {errors.dietOrientation &&
                                                <p className="text-xs text-red-500">{errors.dietOrientation}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="currentWeight" className="text-sm font-medium">
                                                    Current Weight (kg)
                                                </label>
                                                <Input
                                                    id="currentWeight"
                                                    name="currentWeight"
                                                    type="number"
                                                    placeholder="Current Weight"
                                                    value={formData.currentWeight || ""}
                                                    onChange={handleChange}
                                                    className={errors.currentWeight ? "border-red-500" : ""}
                                                />
                                                {errors.currentWeight &&
                                                    <p className="text-xs text-red-500">{errors.currentWeight}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="goals" className="text-sm font-medium">
                                                    Goals
                                                </label>
                                                <Input
                                                    id="goals"
                                                    name="goals"
                                                    placeholder="Goals"
                                                    value={formData.goals || ""}
                                                    onChange={handleChange}
                                                    className={errors.goals ? "border-red-500" : ""}
                                                />
                                                {errors.goals && <p className="text-xs text-red-500">{errors.goals}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="sickness" className="text-sm font-medium">
                                                Sickness
                                            </label>
                                            <Input
                                                id="sickness"
                                                name="sickness"
                                                placeholder="Sickness"
                                                value={formData.sickness || ""}
                                                onChange={handleChange}
                                                className={errors.sickness ? "border-red-500" : ""}
                                            />
                                            {errors.sickness &&
                                                <p className="text-xs text-red-500">{errors.sickness}</p>}
                                        </div>
                                    </>
                                )}

                                {responseMessage && (
                                    <div
                                        className={`p-4 rounded-md ${
                                            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {responseMessage}
                                    </div>
                                )}

                                <CardFooter className="px-0 pb-0">
                                    <Button type="submit" className="w-full">
                                        Create Profile
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Profile
