package com.exMate.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "examiner", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Examiner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int e_id;

    @NotBlank
    @Size(max = 15)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(max = 10)
    private String phone;

    @NotBlank
    private String password;
}
