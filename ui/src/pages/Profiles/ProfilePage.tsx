import type React from "react"
import {useEffect, useState} from "react"
import {Loader2, Plus, User, Users} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ScrollArea} from "@/components/ui/scroll-area"

const BASE_URL = import.meta.env.VITE_BACKEND_URL

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

const extractNameFromEmail = (email: string): { firstName: string, lastName: string } => {
    const defaultResult = {firstName: "", lastName: ""};

    if (!email || !email.includes('@')) {
        return defaultResult;
    }

    const beforeAt = email.split('@')[0];

    const cleanName = (name: string): string => {
        const withoutNumbers = name.replace(/\d/g, '');
        return withoutNumbers.charAt(0).toUpperCase() + withoutNumbers.slice(1);
    };

    if (beforeAt.includes('.')) {
        const nameParts = beforeAt.split('.');
        if (nameParts.length >= 2) {
            const firstName = cleanName(nameParts[0]);
            const lastName = cleanName(nameParts[1]);
            return {firstName, lastName};
        }
    }

    if (beforeAt.includes('_')) {
        const nameParts = beforeAt.split('_');
        if (nameParts.length >= 2) {
            const firstName = cleanName(nameParts[0]);
            const lastName = cleanName(nameParts[1]);
            return {firstName, lastName};
        }
    }

    const camelCaseMatch = beforeAt.match(/([a-z]+)([A-Z][a-z]+)/);
    if (camelCaseMatch && camelCaseMatch.length >= 3) {
        const firstName = cleanName(camelCaseMatch[1]);
        const lastName = cleanName(camelCaseMatch[2]);
        return {firstName, lastName};
    }

    if (beforeAt) {
        const firstName = cleanName(beforeAt);
        return {firstName, lastName: ""};
    }

    return defaultResult;
};

const Profile = () => {
    const [userType, setUserType] = useState<UserType>("dietitian")
    const [dietitians, setDietitians] = useState<Profile[]>([])
    const [patients, setPatients] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeView, setActiveView] = useState<"view" | "create">("view")
    const [responseMessage, setResponseMessage] = useState<string>("")
    const [messageType, setMessageType] = useState<"success" | "error">("success")
    const [userRole, setUserRole] = useState<string | null>(null)
    const [hasPatientProfile, setHasPatientProfile] = useState<boolean>(false)
    const [hasDietitianProfile, setHasDietitianProfile] = useState<boolean>(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "+1",
        gender: "Male",
        birthday: new Date().toISOString().split('T')[0],
        street: "123 Main St",
        country: "United States",
        city: "New York",
        postalCode: "10001",
        specialty: "Nutrition",
        dietOrientation: "Balanced",
        currentWeight: "70",
        goals: "Maintain weight",
        sickness: "None",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    //const [error, setError] = useState<string | null>(null)

    const fetchProfiles = async () => {
        setIsLoading(true);
       /* setError (null);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to use this feature");
            return;
        }
        */
        try {
            setDietitians([]);
            setPatients([]);
            setHasDietitianProfile(false);
            setHasPatientProfile(false);

            const dietitiansResponse = await fetch(`${BASE_URL}/dietitians/viewAll`);
            if (dietitiansResponse.ok) {
                const dietitiansData = await dietitiansResponse.json();
                setDietitians(dietitiansData || []);
                if (userRole === 'DIETITIAN' && dietitiansData.length > 0) {
                    setHasDietitianProfile(true);
                }
            }

            const patientsResponse = await fetch(`${BASE_URL}/patients/viewAll`);
            if (patientsResponse.ok) {
                const patientsData = await patientsResponse.json();
                setPatients(patientsData || []);
                if (userRole === 'PATIENT' && patientsData.length > 0) {
                    setHasPatientProfile(true);
                }
            }
        } catch (error) {
            console.error("Error fetching profiles:", error);
            setResponseMessage("Failed to load profiles. Please try again later.");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
        setActiveView("view");
        setEditingProfile(null);

        const token = localStorage.getItem('token');
        let email = "";
        let firstName = "";
        let lastName = "";

        if (token) {
            try {
                const payload = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payload));
                email = decodedPayload.sub || "";
                const nameData = extractNameFromEmail(email);
                firstName = nameData.firstName;
                lastName = nameData.lastName;
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }

        setFormData({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: "+1",
            gender: "Male",
            birthday: new Date().toISOString().split('T')[0],
            street: "123 Main St",
            country: "United States",
            city: "New York",
            postalCode: "10001",
            specialty: "Nutrition",
            dietOrientation: "Balanced",
            currentWeight: "70",
            goals: "Maintain weight",
            sickness: "None",
        });
        setErrors({});
    }, [userRole, refreshKey]);

    useEffect(() => {
        const fetchUserRole = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = token.split('.')[1];
                    const decodedPayload = JSON.parse(atob(payload));
                    setUserRole(decodedPayload.role);

                    const email = decodedPayload.sub || "";
                    const {firstName, lastName} = extractNameFromEmail(email);

                    setFormData(prev => ({
                        ...prev,
                        email: email,
                        firstName: firstName,
                        lastName: lastName
                    }));

                    if (decodedPayload.role === 'PATIENT') {
                        setUserType('patient');
                    }
                } catch (error) {
                    console.error("Error parsing token:", error);
                }
            }
        };

        fetchUserRole();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)

        setFormData((prevData) => ({
            ...prevData,
            [name]: capitalizedValue,
        }))

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)

        setFormData((prevData) => ({
            ...prevData,
            [name]: capitalizedValue,
        }))

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

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

        if (formData.email && !/@/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

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
    const handleDelete = async (id: number, profileType: "dietitian" | "patient") => {
        try {
            const response = await fetch(`${BASE_URL}/${profileType}s/delete?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                setResponseMessage(`${profileType.charAt(0).toUpperCase() + profileType.slice(1)} profile deleted successfully`);
                setMessageType("success");
                setRefreshKey(prevKey => prevKey + 1);
            } else {
                const data = await response.json();
                setResponseMessage(data.message || "Failed to delete profile");
                setMessageType("error");
            }
        } catch (error) {
            setResponseMessage("Network error while deleting profile.");
            setMessageType("error");
        }
    };

    const handleCancel = () => {
        setActiveView("view");
        setEditingProfile(null);

        // Get email from token and extract name
        const token = localStorage.getItem('token');
        let email = "";
        let firstName = "";
        let lastName = "";

        if (token) {
            try {
                const payload = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payload));
                email = decodedPayload.sub || "";
                const nameData = extractNameFromEmail(email);
                firstName = nameData.firstName;
                lastName = nameData.lastName;
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }

        setFormData({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: "+1",
            gender: "Male",
            birthday: new Date().toISOString().split('T')[0],
            street: "123 Main St",
            country: "United States",
            city: "New York",
            postalCode: "10001",
            specialty: "Nutrition",
            dietOrientation: "Balanced",
            currentWeight: "70",
            goals: "Maintain weight",
            sickness: "None",
        });
        setErrors({});
    };

    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

    const handleEdit = (profile: Profile) => {
        if (profile.specialty) {
            setUserType("dietitian");
        } else {
            setUserType("patient");
        }

        setEditingProfile(profile);
        setActiveView("create");

        setFormData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.contact.email,
            phoneNumber: profile.contact.phoneNumber,
            gender: profile.gender,
            birthday: profile.birthday,
            street: profile.adresse.street,
            country: profile.adresse.country,
            city: profile.adresse.city,
            postalCode: profile.adresse.postalCode,
            specialty: profile.specialty || "",
            dietOrientation: profile.dietOrientation || "",
            currentWeight: profile.currentWeight || "",
            goals: profile.goals || "",
            sickness: profile.sickness || "",
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const isEditing = !!editingProfile;

        const userDTO = isEditing
            ? {
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
            : {
                id: null,
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
            };

        const method = isEditing ? "PUT" : "POST";
        const endpoint = isEditing
            ? `${BASE_URL}/${userType}s/update/${editingProfile!.id}`
            : `${BASE_URL}/${userType}s/create`;

        console.log("Request method:", method);
        console.log("Request URL:", endpoint);
        console.log("Request payload:", JSON.stringify(userDTO, null, 2));

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userDTO),
            });

            console.log("Response status:", response.status);

            let responseText = "";
            try {
                responseText = await response.text();
                console.log("Response text:", responseText);
            } catch (e) {
                console.error("Error reading response text:", e);
            }

            if (response.ok) {
                setResponseMessage(
                    `${userType.charAt(0).toUpperCase() + userType.slice(1)} profile ${isEditing ? "updated" : "created"} successfully!`
                );
                setMessageType("success");
                setEditingProfile(null);

                const token = localStorage.getItem('token');
                let email = "";
                let firstName = "";
                let lastName = "";

                if (token) {
                    try {
                        const payload = token.split('.')[1];
                        const decodedPayload = JSON.parse(atob(payload));
                        email = decodedPayload.sub || "";
                        const nameData = extractNameFromEmail(email);
                        firstName = nameData.firstName;
                        lastName = nameData.lastName;
                    } catch (error) {
                        console.error("Error parsing token:", error);
                    }
                }

                setFormData({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: "+1",
                    gender: "Male",
                    birthday: new Date().toISOString().split('T')[0],
                    street: "123 Main St",
                    country: "United States",
                    city: "New York",
                    postalCode: "10001",
                    specialty: "Nutrition",
                    dietOrientation: "Balanced",
                    currentWeight: "70",
                    goals: "Maintain weight",
                    sickness: "None",
                });
                setErrors({});

                await fetchProfiles();

                setActiveView("view");
            } else {
                let errorMessage = "Something went wrong";

                try {
                    if (responseText) {
                        const data = JSON.parse(responseText);
                        errorMessage = data.message || errorMessage;
                    }
                } catch (e) {
                    console.error("Error parsing response JSON:", e);
                    errorMessage = responseText || errorMessage;
                }

                setResponseMessage(`Error (${response.status}): ${errorMessage}`);
                setMessageType("error");
            }
        } catch (error) {
            console.error("Network error:", error);
            setResponseMessage("Network error. Please try again.");
            setMessageType("error");
        }
    };


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
                                                    <div className="flex items-start justify-between gap-3">
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
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(dietitian)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(dietitian.id, "dietitian")}
                                                            >
                                                                Delete
                                                            </Button>
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
                                                    <div className="flex items-start justify-between gap-3">
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
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(patient)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(patient.id, "patient")}
                                                            >
                                                                Delete
                                                            </Button>
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
                                {editingProfile ? "Edit" : "Create"} {userType.charAt(0).toUpperCase() + userType.slice(1)} Profile
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {editingProfile ? "Update the" : "Fill in the"} details {editingProfile ? "to update the" : "to create a new"} profile
                            </div>
                            {/* Only show user type selector when creating a new profile */}
                            {!editingProfile && userRole !== 'PATIENT' && (
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
                            )}
                        </CardHeader>
                        <CardContent>
                            {userRole === 'PATIENT' && hasPatientProfile && !editingProfile ? (
                                <div className="p-4 rounded-md bg-amber-100 text-amber-700">
                                    As a patient, you can only create one profile.
                                </div>
                            ) : userRole === 'DIETITIAN' && userType === 'dietitian' && hasDietitianProfile && !editingProfile ? (
                                <div className="p-4 rounded-md bg-amber-100 text-amber-700">
                                    You already have a dietitian profile. You can only create patient profiles.
                                </div>
                            ) : (
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
                                            {errors.firstName &&
                                                <p className="text-xs text-red-500">{errors.firstName}</p>}
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
                                            {errors.lastName &&
                                                <p className="text-xs text-red-500">{errors.lastName}</p>}
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
                                            {errors.birthday &&
                                                <p className="text-xs text-red-500">{errors.birthday}</p>}
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
                                            {errors.specialty &&
                                                <p className="text-xs text-red-500">{errors.specialty}</p>}
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
                                                    {errors.goals &&
                                                        <p className="text-xs text-red-500">{errors.goals}</p>}
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

                                    <div className="flex justify-between mt-6">
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" onClick={handleSubmit}>
                                            {editingProfile ? "Update" : "Create"} Profile
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Profile
