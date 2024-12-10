package com.exMate.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

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
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate birthdate;

        @NotBlank
        @JsonIgnore
        private String password;

        @JsonBackReference
        @ToString.Exclude
        @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<ExamLog> examLog;
}
