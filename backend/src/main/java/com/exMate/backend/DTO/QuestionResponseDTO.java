package com.exMate.backend.DTO;

import com.exMate.backend.enums.SectionType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponseDTO {
    private int questionId;
    private String questionText;
    private SectionType sectionType;
    private int marks;
    private boolean correct;
    private String selectedOption;
    private String programmingResponse;
}
