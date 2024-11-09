package com.exMate.backend.controller.Admin;

import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import com.exMate.backend.service.Admin.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> addQuestion(@RequestBody Question question){
        try{
            return ResponseEntity.ok(questionService.addQuestion(question));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @PutMapping("{q_id}")
    public ResponseEntity<?> updateQuestion(@PathVariable int q_id, @RequestBody Question question){
        try{
            return ResponseEntity.ok(questionService.updateQuestion(q_id, question));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @GetMapping("{q_id}")
    public ResponseEntity<?> getQuestionById(@PathVariable int q_id){
        try{
            return ResponseEntity.ok(questionService.getQuestionById(q_id));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuestions(){
        try{
            return ResponseEntity.ok(questionService.getAllQuestions());
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @DeleteMapping("{q_id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int q_id){
        try{
            questionService.deleteQuestion(q_id);
            return ResponseEntity.ok("Question deleted");
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid question");
        }
    }

    @PostMapping("{q_id}/option")
    public ResponseEntity<?> addOption(@PathVariable int q_id, @RequestBody MCQOption option){
        try{
            System.out.println("Adding option");
            questionService.addOption(q_id, option);
            System.out.println("Option added");
            return ResponseEntity.ok("Option added");
        } catch(Exception e){
            return ResponseEntity.badRequest().body(e);
        }
    }

}
