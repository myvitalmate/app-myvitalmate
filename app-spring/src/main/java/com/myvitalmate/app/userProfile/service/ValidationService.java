package com.myvitalmate.app.userProfile.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ValidationService {

    public void validateIsNotEmpty(Object value, String fieldName) {
        if (value == null || (value instanceof String && ((String) value).trim().isEmpty())) {
            throw new ValidationException(fieldName + " is required and cannot be empty.");
        }
    }

    public void validateFirstName(String firstName, String first_name) {
        validateIsNotEmpty(firstName, "First Name");

        if (!firstName.matches("^[A-Z][a-zA-Z\\-']*$")) {
            throw new ValidationException("Invalid or missing First Name.");
        }
    }

    public void validateLastName(String lastName, String last_name) {
        validateIsNotEmpty(lastName, "Last Name");

        if (!lastName.matches("^[A-Z][a-zA-Z\\-']*$")) {
            throw new ValidationException("Invalid or missing Last Name.");
        }
    }


    public void validateEmail(String email) {
        validateIsNotEmpty(email, "Email");

        if (!email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            throw new ValidationException("Invalid or missing Email.");
        }
    }

    public void validatePhoneNumber(String phone) {
        validateIsNotEmpty(phone, "Phone Number");

        if (!phone.matches("^\\+?[0-9]{1,15}$")) {
            throw new ValidationException("Invalid or missing Phone Number.");
        }
    }


    public void validateStreet(String street) {
        validateIsNotEmpty(street, "Street");
    }

    public void validateCity(String city) {
        validateIsNotEmpty(city, "City");

    }

    public void validatePostalcode(String postalcode) {
        validateIsNotEmpty(postalcode, "Postal Code");
    }

    public void validateCountry(String country) {
        validateIsNotEmpty(country, "Country");
    }


    public void validateGender(String gender) {
        validateIsNotEmpty(gender, "Gender");

        if (!gender.matches("^(Male|Female|Other)$")) {
            throw new ValidationException("Gender must be Male, Female, or Other.");
        }
    }

    public void validateBirthday(LocalDate birthday) {
        if (birthday == null || birthday.isAfter(LocalDate.now())) {
            throw new ValidationException("Birthday must be in the past.");
        }
    }

    public void validateDietOrientation(String dietOrientation) {
        validateIsNotEmpty(dietOrientation, "Diet Orientation");
    }

    public void validateCurrentWeight(String currentWeight) {
        validateIsNotEmpty(currentWeight, "Current Weight");

        if (!currentWeight.matches("^\\d{1,3}(\\.\\d{1,3})?$")) {
            throw new ValidationException("Invalid Current Weight. It should be a number with up to three decimal places.");
        }
    }

    public void validateRole(String role) {
        if (!role.equals("PATIENT") && !role.equals("DIETITIAN")) {
            throw new ValidationException("Invalid Role. It should be PATIENT or DIETITIAN.");
        }
    }

    public void validatePassword(String password) {
        validateIsNotEmpty(password, "Password");

        if (!password.matches(".*[A-Z].*")) {
            throw new ValidationException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new ValidationException("Password must contain at least one number");
        }
        if (password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new ValidationException("Password must contain at least one lowercase letter");
        }
    }

    public void validateGoals(String goals) {
        validateIsNotEmpty(goals, "Goals");
    }

    public void validateSickness(String sickness) {
        validateIsNotEmpty(sickness, "Sickness");
    }

    public void validateSpecialty(String specialty) {
        validateIsNotEmpty(specialty, "Specialty");
    }

}