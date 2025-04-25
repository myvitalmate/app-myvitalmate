package com.myvitalmate.app.userProfile.entity;

import jakarta.persistence.Embedded;
import jakarta.persistence.MappedSuperclass;

import java.time.LocalDate;

@MappedSuperclass
public abstract class Profile {

    @Embedded
    private Name name;
    @Embedded
    private Adresse adresse;
    @Embedded
    private Contact contact;

    private LocalDate birthday;
    private String gender;

    public Profile() {
    }

    public Profile(Name name, Adresse adresse, Contact contact, LocalDate birthday, String gender) {
        this.name = name;
        this.adresse = adresse;
        this.contact = contact;
        this.birthday = birthday;
        this.gender = gender;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
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
