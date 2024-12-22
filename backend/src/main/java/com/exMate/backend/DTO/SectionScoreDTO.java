package com.exMate.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SectionScoreDTO {
    private int totalQuestions;
    private long correctAnswers;
    private int totalMarks;
    private int obtainedMarks;
    private double percentageScore;
}
