package com.myvitalmate.app.userProfile.entity;

import jakarta.persistence.Embedded;
import jakarta.persistence.MappedSuperclass;

import java.time.LocalDate;

@MappedSuperclass
public abstract class Profile {

    @Embedded
    private Adresse adresse;
    @Embedded
    private Contact contact;

    private String firstName;
    private String lastName;
    private LocalDate birthday;
    private String gender;

    public Profile() {
    }

    public Profile(String firstName, String lastName, Adresse adresse, Contact contact, LocalDate birthday, String gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.adresse = adresse;
        this.contact = contact;
        this.birthday = birthday;
        this.gender = gender;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Adresse getAdresse() {
        return adresse;
    }

    public void setAdresse(Adresse adresse) {
        this.adresse = adresse;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

}
