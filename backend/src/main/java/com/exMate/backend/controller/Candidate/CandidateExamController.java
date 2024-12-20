package com.exMate.backend.controller.Candidate;

import com.exMate.backend.service.Candidate.CandidateExamService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.exMate.backend.model.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate/exam")
public class CandidateExamController {

    @Autowired
    private CandidateExamService candidateExamService;

    @GetMapping
    public ResponseEntity<?> getAllExam(){
        try {
            return new ResponseEntity<>(candidateExamService.getCandidateExam(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("{exam_id}")
    public ResponseEntity<?> getExamById(@PathVariable int exam_id){
        try {
            return new ResponseEntity<>(candidateExamService.getCandidateExamById(exam_id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("{exam_id}/start")
    public ResponseEntity<?> startExam(@PathVariable int exam_id, HttpServletRequest request){
        try {
            return new ResponseEntity<>(candidateExamService.startExam(exam_id, request), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("{exam_id}/submit")
    public ResponseEntity<?> saveResponses(@PathVariable int exam_id,
                                           @RequestBody List<Response> responses) {
        try {
            candidateExamService.saveResponses(exam_id, responses);
            return new ResponseEntity<>("Responses submitted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("{exam_id}/end")
    public ResponseEntity<?> endExam(@PathVariable int exam_id, HttpServletRequest request) {
        try {
            return new ResponseEntity<>(candidateExamService.endExam(exam_id, request), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("{exam_id}/status")
    public ResponseEntity<?> getExamStatus(@PathVariable int exam_id){
        try {
            return new ResponseEntity<>(candidateExamService.getCandidateExamById(exam_id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
