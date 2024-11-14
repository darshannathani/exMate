package com.exMate.backend.service.Admin;

import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.exMate.backend.repository.MCQOptionRepository;
import com.exMate.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public MCQOption addOption(int q_id, MCQOption option) {
        try {
            Question question = questionRepository.findById(q_id)
                    .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + q_id));
            option.setQuestion(question);
            return mcqOptionRepository.save(option);
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            return null;
        }
    }

    public MCQOption updateOption(int o_id, MCQOption option) {
        MCQOption existingOption = mcqOptionRepository.findById(o_id).orElse(null);
        existingOption.setOption_text(option.getOption_text());
        existingOption.setIs_correct(option.getIs_correct());
        return mcqOptionRepository.save(existingOption);
    }

    public MCQOption getOptionById(int o_id) {
        return mcqOptionRepository.findById(o_id).orElse(null);
    }

    public Iterable<MCQOption> getAllOptions() {
        return mcqOptionRepository.findAll();
    }

    public void deleteOption(int o_id) {
        mcqOptionRepository.deleteById(o_id);
    }

    public MCQOption getOptionsByQuestionId(int q_id) {
        Question question = questionRepository.findById(q_id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + q_id));
        return mcqOptionRepository.findByQuestion(question);
    }

    public void deleteOptionsByQuestionId(int q_id) {
        Question question = questionRepository.findById(q_id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + q_id));
        mcqOptionRepository.deleteByQuestion(question);
    }

    public Iterable<Question> getQuestionsByCategory(String category) {
        return questionRepository.findBySection(category);
    }
}
