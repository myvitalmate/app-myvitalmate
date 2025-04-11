package com.myvitalmate.app.userProfile.entity;

import com.myvitalmate.app.userProfile.dto.AdresseDTO;
import jakarta.persistence.Embeddable;

@Embeddable
public class Adresse {

    private String street;
    private String city;
    private String postalCode;
    private String country;

    public Adresse() {
    }

    public Adresse(AdresseDTO dto) {
        this.street = dto.street();
        this.city = dto.city();
        this.postalCode = dto.postalCode();
        this.country = dto.country();
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
