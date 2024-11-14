package com.exMate.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "MCQ_Option")
@Data
@NoArgsConstructor
public class MCQOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int option_id;

    @NotBlank
    private String option_text;

    @NotNull
    private String is_correct;

    @NotNull
    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private Question question;

}