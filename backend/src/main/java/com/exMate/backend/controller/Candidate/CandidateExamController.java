package com.exMate.backend.controller.Candidate;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.service.Admin.ExamService;
import com.exMate.backend.service.Candidate.CandidateExamService;
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
    public ResponseEntity<?> getExam(){
        try {
            System.out.println("Getting candidate exam");
            return new ResponseEntity<>(candidateExamService.getCandidateExam(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("{exam_id}")
    public ResponseEntity<?> getExamById(@PathVariable int exam_id){
        try {
            System.out.println("Getting candidate exam by id");
            return new ResponseEntity<>(candidateExamService.getCandidateExamById(exam_id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("{exam_id}/start")
    public ResponseEntity<?> startExam(@PathVariable int exam_id){
        try {
            System.out.println("Starting candidate exam");
            return new ResponseEntity<>(candidateExamService.startExam(exam_id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("{exam_id}/submit/mcq")
    public ResponseEntity<?> submitMcqResponses(@PathVariable int exam_id,
                                                @RequestBody List<Response> responses) {
        try {
            candidateExamService.saveMcqResponses(exam_id, responses);
            return new ResponseEntity<>("MCQ responses submitted successfully.", HttpStatus.OK);
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
