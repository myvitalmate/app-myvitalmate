import {ChangeEvent, FormEvent, useState} from "react";

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
    city: string;
    postalCode: string;
    specialty?: string; // Only for dietitians
    dietOrientation?: string; // Only for patients
    currentWeight?: string; // Only for patients
    goals?: string; // Only for patients
    sickness?: string; // Only for patients
};

const Registration = () => {
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

    // Handle date selection
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            birthday: e.target.value
        }));
    };

    // Handle user type change
    const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newUserType = e.target.value as UserType;
        setUserType(newUserType);

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: "",
            birthday: "",
            photoUrl: "",
            street: "",
            city: "",
            postalCode: "",
            specialty: newUserType === "dietitian" ? "" : undefined,
            dietOrientation: newUserType === "patient" ? "" : undefined,
            currentWeight: newUserType === "patient" ? "" : undefined,
            goals: newUserType === "patient" ? "" : undefined,
            sickness: newUserType === "patient" ? "" : undefined
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const userDTO = {
            name: {
                firstName: formData.firstName,
                lastName: formData.lastName
            },
            contact: {
                phoneNumber: formData.phoneNumber,
                email: formData.email
            },
            adresse: {
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode
            },
            gender: formData.gender,
            photoUrl: formData.photoUrl,
            birthday: formData.birthday,
            ...(userType === "dietitian" && {specialty: formData.specialty}),
            ...(userType === "patient" && {
                dietOrientation: formData.dietOrientation,
                currentWeight: formData.currentWeight,
                goals: formData.goals,
                sickness: formData.sickness
            })
        };

        try {
            const response = await fetch(`${BASE_URL}/${userType}s/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDTO)
            });

            const data = await response.json();
            if (response.ok) {
                setResponseMessage("Registration successful!");
            } else {
                setResponseMessage(`Error: ${data.message || "Something went wrong"}`);
            }
        } catch (error) {
            setResponseMessage("Network error. Please try again.");
        }
    };

    return (
        <div>
            <h1>Registration</h1>
            <select onChange={handleUserTypeChange} value={userType}>
                <option value="dietitian">Dietitian</option>
                <option value="patient">Patient</option>
            </select>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName}
                       onChange={handleChange} required/>
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName}
                       onChange={handleChange} required/>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                       required/>
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber}
                       onChange={handleChange} required/>

                <input type="date" name="birthday" value={formData.birthday} onChange={handleDateChange} required/>

                {userType === "dietitian" && (
                    <input type="text" name="specialty" placeholder="Specialty" value={formData.specialty || ""}
                           onChange={handleChange} required/>
                )}

                {userType === "patient" && (
                    <>
                        <input type="text" name="dietOrientation" placeholder="Diet Orientation"
                               value={formData.dietOrientation || ""} onChange={handleChange} required/>
                        <input type="number" name="currentWeight" placeholder="Current Weight (kg)"
                               value={formData.currentWeight || ""} onChange={handleChange} required/>
                        <input type="text" name="goals" placeholder="Goals" value={formData.goals || ""}
                               onChange={handleChange} required/>
                        <input type="text" name="sickness" placeholder="Sickness" value={formData.sickness || ""}
                               onChange={handleChange} required/>
                    </>
                )}

                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange}
                       required/>
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange}
                       required/>
                <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode}
                       onChange={handleChange} required/>
                <input type="text" name="photoUrl" placeholder="Photo URL" value={formData.photoUrl}
                       onChange={handleChange}/>

                <button type="submit">Register</button>
            </form>
            <p>{responseMessage}</p>
        </div>
    );
};

export default Registration;
