package com.myvitalmate.app.userProfile.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Contact {

    String phoneNumber;
    String email;

    public Contact() {
    }

    public Contact(String phoneNumber, String email) {
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }


}
