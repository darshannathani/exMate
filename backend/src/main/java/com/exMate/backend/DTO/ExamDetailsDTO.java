package com.exMate.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamDetailsDTO {
    private int duration;
    private String name;
    private String description;
}