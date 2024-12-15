package com.exMate.backend.DTO;

import java.util.List;

import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    @JsonProperty("question")
    private Question question;

    @JsonProperty("options")
    private List<MCQOption> options;

}

