package com.exMate.backend.controller.Candidate;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.service.Admin.ExamService;
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

    @PostMapping("{exam_id}/submit/logical")
    public ResponseEntity<?> submitLogicalResponses(@PathVariable int exam_id,
                                                @RequestBody List<Response> responses) {
        try {
            candidateExamService.saveMcqResponses(exam_id, responses);
            return new ResponseEntity<>("Logical MCQ responses submitted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("{exam_id}/submit/technical")
    public ResponseEntity<?> submitTechnicalResponses(@PathVariable int exam_id,
                                                @RequestBody List<Response> responses) {
        try {
            candidateExamService.saveMcqResponses(exam_id, responses);
            return new ResponseEntity<>("Technical MCQ responses submitted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("{exam_id}/submit/programming")
    public ResponseEntity<?> submitProgrammingResponses(@PathVariable int exam_id,
                                                        @RequestBody List<Response> responses) {
        try {
            candidateExamService.saveProgrammingResponses(exam_id, responses);
            return new ResponseEntity<>("Programming responses submitted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("{exam_id}/submit/database")
    public ResponseEntity<?> submitDatabaseResponses(@PathVariable int exam_id,
                                                        @RequestBody List<Response> responses) {
        try {
            candidateExamService.saveDatabaseResponses(exam_id, responses);
            return new ResponseEntity<>("Database responses submitted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
