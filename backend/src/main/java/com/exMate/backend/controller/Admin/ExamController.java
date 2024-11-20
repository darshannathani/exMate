package com.exMate.backend.controller.Admin;

import com.exMate.backend.enums.ExamDifficulty;
import com.exMate.backend.model.Exam;
import com.exMate.backend.service.Admin.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/admin/exam")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    public ResponseEntity<?> scheduleExam(@RequestBody int exam_id) {
        try{
            return ResponseEntity.ok(examService.scheduleExam(exam_id));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid exam");
        }
    }

    @PutMapping("/update/{exam_id}")
    public ResponseEntity<?> updateExam(@PathVariable int exam_id, @RequestBody Map<String,Object> request) {
        try{
            return ResponseEntity.ok(examService.updateExam(exam_id,request));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid exam");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllExam() {
        try{
            return ResponseEntity.ok(examService.getAllExam());
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid exam");
        }
    }

    @DeleteMapping("/delete/{exam_id}")
    public ResponseEntity<?> deleteExam(@PathVariable int exam_id) {
        try{
            examService.deleteExam(exam_id);
            return ResponseEntity.ok("Exam deleted successfully");
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid exam");
        }
    }

    @GetMapping("/{exam_id}")
    public ResponseEntity<?> getExamById(@PathVariable int exam_id) {
        try{
            return ResponseEntity.ok(examService.getExamById(exam_id));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: Invalid exam");
        }
    }

    @PostMapping("/create-exam")
    public ResponseEntity<?> createExam(@RequestBody Exam exam) {
        try{
            return ResponseEntity.ok(examService.createExam(exam));
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Error: "+ e);
        }
    }

//    @GetMapping("/{exam_id}/questions")
//    public ResponseEntity<?> getQuestionsByExam(@PathVariable int exam_id) {
//        try{
//            return ResponseEntity.ok(examService.getQuestionsByExam(exam_id));
//        } catch(Exception e){
//            return ResponseEntity.badRequest().body("Error: Invalid exam");
//        }
//    }
//
//    @PutMapping("/{exam_id}/questions")
//    public ResponseEntity<?> regernateQuestions(@PathVariable int exam_id, @RequestBody String difficulty) {
//        try{
//            return ResponseEntity.ok(examService.regenerateQuestions(exam_id,difficulty));
//        } catch(Exception e){
//            return ResponseEntity.badRequest().body("Error: Invalid exam");
//        }
//    }
//
//    @PutMapping("/{exam_id}/update-difficulty")
//    public ResponseEntity<?> updateDifficulty(@PathVariable int exam_id, @RequestBody String difficulty) {
//        try{
//            return ResponseEntity.ok(examService.updateDifficulty(exam_id,difficulty));
//        } catch(Exception e){
//            return ResponseEntity.badRequest().body("Error: Invalid exam");
//        }
//    }

}
