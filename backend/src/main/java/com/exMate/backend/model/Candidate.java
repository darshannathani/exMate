package com.exMate.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Candidate")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate birthdate;

        @NotBlank
        @JsonIgnore
        private String password;

        @JsonIgnore
        @ToString.Exclude
        @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<ExamLog> examLog;
}