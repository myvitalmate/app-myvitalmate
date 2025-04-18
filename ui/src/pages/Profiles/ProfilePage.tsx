import {ChangeEvent, FormEvent, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const BASE_URL = "http://localhost:8080";

type UserType = "dietitian" | "patient";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    birthday: string;
    photoUrl: string;
    street: string;
    country: string;
    city: string;
    postalCode: string;
    specialty?: string; // Only for dietitians
    dietOrientation?: string; // Only for patients
    currentWeight?: string; // Only for patients
    goals?: string; // Only for patients
    sickness?: string; // Only for patients
};

const Profile = () => {
    const [userType, setUserType] = useState<UserType>("dietitian");

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        birthday: "",
        photoUrl: "",
        street: "",
        country: "",
        city: "",
        postalCode: "",
        specialty: "",
        dietOrientation: "",
        currentWeight: "",
        goals: "",
        sickness: ""
    });

    const [responseMessage, setResponseMessage] = useState<string>("");

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle select changes (for dropdown components)
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle date selection
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            birthday: e.target.value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const userDTO = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            birthday: formData.birthday,
            photoUrl: formData.photoUrl,

            phoneNumber: formData.phoneNumber,
            email: formData.email,


            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,

            contact: {
                phoneNumber: formData.phoneNumber,
                email: formData.email
            },
            adresse: {
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country
            },

            ...(userType === "dietitian" && {
                specialty: formData.specialty
            }),
            ...(userType === "patient" && {
                dietOrientation: formData.dietOrientation,
                currentWeight: formData.currentWeight,
                goals: formData.goals,
                sickness: formData.sickness
            })
        };

        try {
            const response = await fetch(`${BASE_URL}/${userType}s/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDTO)
            });

            if (response.ok) {
                setResponseMessage("Profiles successful!");
            } else {
                const contentType = response.headers.get("content-type");
                let errorMessage = "Something went wrong";

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    errorMessage = `Error: ${data.message || errorMessage}`;
                }

                setResponseMessage(errorMessage);
            }
        } catch (error) {
            setResponseMessage("Network error. Please try again.");
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Select value={userType} onValueChange={(value: UserType) => setUserType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dietitian">Dietitian</SelectItem>
                                <SelectItem value="patient">Patient</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                name="gender"
                                value={formData.gender}
                                onValueChange={(value) => handleSelectChange("gender", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleDateChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={formData.street}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                name="postalCode"
                                placeholder="Postal Code"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {userType === "dietitian" && (
                            <Input
                                type="text"
                                name="specialty"
                                placeholder="Specialty"
                                value={formData.specialty || ""}
                                onChange={handleChange}
                                required
                            />
                        )}

                        {userType === "patient" && (
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    name="dietOrientation"
                                    placeholder="Diet Orientation"
                                    value={formData.dietOrientation || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    type="number"
                                    name="currentWeight"
                                    placeholder="Current Weight (kg)"
                                    value={formData.currentWeight || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    type="text"
                                    name="goals"
                                    placeholder="Goals"
                                    value={formData.goals || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    type="text"
                                    name="sickness"
                                    placeholder="Sickness"
                                    value={formData.sickness || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {responseMessage && (
                            <div className={`p-4 rounded-md ${
                                responseMessage.includes("successful")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {responseMessage}
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            create Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
