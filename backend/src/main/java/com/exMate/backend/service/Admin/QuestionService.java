package com.exMate.backend.service.Admin;

import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.exMate.backend.repository.MCQOptionRepository;
import com.exMate.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private MCQOptionRepository mcqOptionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository){
        this.questionRepository = questionRepository;
        this.mcqOptionRepository = mcqOptionRepository;
    }

    public Question addQuestion(Question question){
        return questionRepository.save(question);
    }

    public Question updateQuestion(int q_id, Question question){
        Question existingQuestion = questionRepository.findById(q_id).orElse(null);
        existingQuestion.setCategory(question.getCategory());
        existingQuestion.setSection(question.getSection());
        existingQuestion.setDifficulty(question.getDifficulty());
        existingQuestion.setText(question.getText());
        existingQuestion.setImage(question.getImage());
        existingQuestion.setMarks(question.getMarks());
        return questionRepository.save(existingQuestion);
    }

    public Question getQuestionById(int q_id){
        return questionRepository.findById(q_id).orElse(null);
    }

    public Iterable<Question> getAllQuestions(){
        return questionRepository.findAll();
    }

    public void deleteQuestion(int q_id){
        questionRepository.deleteById(q_id);
    }

    public MCQOption addOption(int q_id, MCQOption option){
        Question question = questionRepository.findById(q_id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        option.setQuestion(question);
        return mcqOptionRepository.save(option);
    }
}
