package com.exMate.backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Exam_question_mapping")
public class ExamQuestionMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer map_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ex_id")
    @ToString.Exclude
    private Exam exam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ques_id")
    private Question question;
}

