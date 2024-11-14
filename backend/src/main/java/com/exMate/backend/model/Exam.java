package com.exMate.backend.model;

import com.exMate.backend.enums.ExamDifficulty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
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

    @Enumerated(EnumType.STRING)
    private ExamDifficulty difficulty;

    @NotBlank
    private int Total_marks;

    @NotNull
    private int duration;

    private LocalDateTime start_date;

    private LocalDateTime end_date;
}