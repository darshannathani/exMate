package com.exMate.backend.model;

import com.exMate.backend.enums.ExamDifficulty;
import com.exMate.backend.enums.SectionType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "Question_Bank")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int question_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cat_id")
    private Category category;

    @Enumerated(EnumType.STRING)
    private SectionType section_type;

    @Enumerated(EnumType.STRING)
    private ExamDifficulty difficulty;

    @NotBlank
    private String text;

    @NotNull
    private String image;

    @NotNull
    private int marks;

    @JsonBackReference(value = "question-mapping")
    @ToString.Exclude
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ExamQuestionMapping> question;

    @JsonManagedReference(value = "question-options")
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MCQOption> options;


}
