package com.exMate.backend.service.Admin;

import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.exMate.backend.repository.MCQOptionRepository;
import com.exMate.backend.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private MCQOptionRepository mcqOptionRepository;

    public QuestionService(QuestionRepository questionRepository, MCQOptionRepository mcqOptionRepository) {
        this.questionRepository = questionRepository;
        this.mcqOptionRepository = mcqOptionRepository;
    }

    @Transactional
    public Question addQuestionWithOptions(Question question, List<MCQOption> options) {
        Question savedQuestion = questionRepository.save(question);
        for (MCQOption option : options) {
            System.out.println("Option: " + option);
        }
        if (options != null && !options.isEmpty()) {
            for (MCQOption option : options) {
                option.setQuestion(savedQuestion);
                mcqOptionRepository.save(option);
            }
        }

        return savedQuestion;
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(int q_id, Question question) {
        Question existingQuestion = questionRepository.findById(q_id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + q_id));

        existingQuestion.setSection_type(question.getSection_type());
        existingQuestion.setDifficulty(question.getDifficulty());
        existingQuestion.setText(question.getText());
        existingQuestion.setImage(question.getImage());
        existingQuestion.setMarks(question.getMarks());

        return questionRepository.save(existingQuestion);
    }

    public Question getQuestionById(int q_id) {
        return questionRepository.findById(q_id).orElse(null);
    }

    public Iterable<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public void deleteQuestion(int q_id) {
        questionRepository.deleteById(q_id);
    }

    public MCQOption addOption(int q_id, MCQOption option) {
        Question question = questionRepository.findById(q_id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + q_id));
        option.setQuestion(question);
        return mcqOptionRepository.save(option);
    }

    public MCQOption updateOption(int o_id, MCQOption option) {
        MCQOption existingOption = mcqOptionRepository.findById(o_id)
                .orElseThrow(() -> new RuntimeException("Option not found"));
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

    public List<MCQOption> getOptionsByQuestionId(int q_id) {
        Question question = questionRepository.findById(q_id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + q_id));
        return mcqOptionRepository.findAllByQuestion(question);
    }

    public void deleteOptionsByQuestionId(int q_id) {
        Question question = questionRepository.findById(q_id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + q_id));
        mcqOptionRepository.deleteByQuestion(question);
    }
}