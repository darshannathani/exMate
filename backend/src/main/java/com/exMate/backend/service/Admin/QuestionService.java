package com.exMate.backend.service.Admin;

import com.exMate.backend.model.Category;
import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.exMate.backend.repository.CategoryRepository;
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
    private CategoryRepository categoryRepository;

    public QuestionService(QuestionRepository questionRepository, MCQOptionRepository mcqOptionRepository, CategoryRepository categoryRepository) {
        this.questionRepository = questionRepository;
        this.mcqOptionRepository = mcqOptionRepository;
        this.categoryRepository = categoryRepository;
    }

    public Question addQuestion(Question question, String categoryName) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.save(new Category(null, categoryName, null)));

        question.setCategory(category);
        return questionRepository.save(question);
    }

    public Question updateQuestion(int q_id, Question question, String categoryName) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.save(new Category(null, categoryName, null)));

        Question existingQuestion = questionRepository.findById(q_id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + q_id));

        existingQuestion.setCategory(category);
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
        MCQOption existingOption = mcqOptionRepository.findById(o_id).orElseThrow(() -> new RuntimeException("Option not found"));
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
        return questionRepository.findByCategory_Name(category);
    }
}
