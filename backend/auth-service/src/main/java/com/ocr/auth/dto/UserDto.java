package com.ocr.auth.dto;

import java.util.Set;
import java.util.UUID;

public class UserDto {

    private UUID id;
    private String username;
    private String email;
    private String designation;
    private String status;
    private Set<String> roles;

    public UserDto() {}

    public UserDto(UUID id, String username, String email, String designation, String status, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.designation = designation;
        this.status = status;
        this.roles = roles;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
