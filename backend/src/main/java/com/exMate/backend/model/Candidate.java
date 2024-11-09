package com.exMate.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Candidate")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int c_id;

        @NotBlank
        @Size(max = 15)
        private String name;

        @NotBlank
        @Size(max = 50)
        private String college;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(max = 10)
        private String phone;

        @Column(name = "birthdate")
        private LocalDateTime birthDate;

        @NotBlank
        private String password;
}
