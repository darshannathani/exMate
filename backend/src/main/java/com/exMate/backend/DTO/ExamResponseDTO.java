package com.exMate.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponseDTO {
    private List<ExamQuestionResponseDTO> questions;
    private ExamDetailsDTO examDetails;
}