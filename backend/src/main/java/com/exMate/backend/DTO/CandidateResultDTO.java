package com.exMate.backend.DTO;

import com.exMate.backend.enums.SectionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class CandidateResultDTO {
    private int resultId;
    private int examId;
    private String examTitle;
    private int score;
    private int totalMarks;
    private String status;
    private LocalDateTime dateCompleted;
    private double percentageScore;
    private List<QuestionResponseDTO> questionResponses;
    private Map<SectionType, SectionScoreDTO> sectionScores;
}
