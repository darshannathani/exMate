package com.exMate.backend.model;

import com.exMate.backend.enums.ExamDifficulty;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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

    private int passing_score;

    @NotBlank
    private String status;

    @Enumerated(EnumType.STRING)
    private ExamDifficulty difficulty;

    private int mcq;
    private int programming;
    private int db;

    private int Total_marks;

    @NotNull
    private int duration;

    private LocalDateTime start_date;
    private LocalDateTime end_date;

    @JsonBackReference
    @ToString.Exclude
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ExamQuestionMapping> exam;

    @JsonBackReference
    @ToString.Exclude
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ExamLog> examLog;
}