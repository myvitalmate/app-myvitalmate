package com.myvitalmate.app.userProfile.entity;

import com.myvitalmate.app.userProfile.dto.ContactDTO;
import jakarta.persistence.Embeddable;

@Embeddable
public class Contact {

    String phoneNumber;
    String email;

    public Contact() {
    }

    public Contact(ContactDTO dto) {
        this.phoneNumber = dto.phoneNumber();
        this.email = dto.email();
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
