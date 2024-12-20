package com.exMate.backend.controller.Admin;

import com.exMate.backend.enums.ExamDifficulty;
import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.exMate.backend.enums.SectionType;
import com.exMate.backend.service.Admin.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> addQuestion(@RequestBody Map<String, Object> request) {
        try {
            Question question = new Question();
            question.setText((String) request.get("text"));
            question.setDifficulty(ExamDifficulty.valueOf((String) request.get("difficulty")));
            question.setSection_type(SectionType.valueOf((String) request.get("section")));
            question.setImage((String) request.get("image"));
            question.setMarks((int) request.get("marks"));

            return ResponseEntity.ok(questionService.addQuestion(question));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: "+e);
        }
    }

    @PutMapping("{q_id}")
    public ResponseEntity<?> updateQuestion(@PathVariable int q_id, @RequestBody Map<String, Object> request) {
        try {
            Question question = new Question();
            question.setText((String) request.get("text"));
            question.setDifficulty(ExamDifficulty.valueOf((String) request.get("difficulty")));
            question.setSection_type(SectionType.valueOf((String) request.get("section")));
            question.setImage((String) request.get("image"));
            question.setMarks((int) request.get("marks"));

            return ResponseEntity.ok(questionService.updateQuestion(q_id, question));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @GetMapping("{q_id}")
    public ResponseEntity<?> getQuestionById(@PathVariable int q_id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionById(q_id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        try {
            return ResponseEntity.ok(questionService.getAllQuestions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error:" + e);
        }
    }

    @DeleteMapping("{q_id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int q_id) {
        try {
            questionService.deleteQuestion(q_id);
            return ResponseEntity.ok("Question deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @PostMapping("{q_id}/option")
    public ResponseEntity<?> addOption(@PathVariable int q_id, @RequestBody MCQOption option) {
        try {
            System.out.println(option);
            return ResponseEntity.ok(questionService.addOption(q_id, option));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid option");
        }
    }

    @PutMapping("/option/{o_id}")
    public ResponseEntity<?> updateOption(@PathVariable int o_id, @RequestBody MCQOption option) {
        try {
            return ResponseEntity.ok(questionService.updateOption(o_id, option));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid option");
        }
    }

    @GetMapping("/option/{o_id}")
    public ResponseEntity<?> getOptionById(@PathVariable int o_id) {
        try {
            return ResponseEntity.ok(questionService.getOptionById(o_id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid option");
        }
    }

    @GetMapping("/option")
    public ResponseEntity<?> getAllOptions() {
        try {
            return ResponseEntity.ok(questionService.getAllOptions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid option");
        }
    }

    @DeleteMapping("/option/{o_id}")
    public ResponseEntity<?> deleteOption(@PathVariable int o_id) {
        try {
            questionService.deleteOption(o_id);
            return ResponseEntity.ok("Option deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid option");
        }
    }

    @GetMapping("/option/question/{q_id}")
    public ResponseEntity<?> getOptionsByQuestionId(@PathVariable int q_id) {
        try {
            return ResponseEntity.ok(questionService.getOptionsByQuestionId(q_id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @DeleteMapping("/option/question/{q_id}")
    public ResponseEntity<?> deleteOptionsByQuestionId(@PathVariable int q_id) {
        try {
            questionService.deleteOptionsByQuestionId(q_id);
            return ResponseEntity.ok("Options deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }
}
