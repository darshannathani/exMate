package com.exMate.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Exam")
@Data
@NoArgsConstructor
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int exam_id;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private int total_question;

    private Integer passing_score;

    @NotBlank
    private String status;

    @NotBlank
    private String category;

    private String difficulty;
}
