package com.exMate.backend.controller;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Examiner;
import com.exMate.backend.security.JwtTokenProvider;
import com.exMate.backend.service.ExaminerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/examiner")
public class ExaminerController {
    
    @Autowired
    private ExaminerService examinerService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @GetMapping("{e_id}")
    public ResponseEntity<?> getExaminerById(@PathVariable int e_id){
        try{
            return new ResponseEntity<>(examinerService.getExaminerById(e_id), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("{e_id}")
    public ResponseEntity<?> updateUser(@PathVariable int e_id, @RequestBody Examiner examiner){
        try{
            return new ResponseEntity<>(examinerService.updateUser(e_id, examiner), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllExaminers(){
        try{
            return new ResponseEntity<>(examinerService.getAllExaminers(), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{e_id}")
    public ResponseEntity<?> deleteExaminer(@PathVariable int e_id){
        try{
            examinerService.deleteExaminer(e_id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<List<Candidate>> uploadCandidates(@RequestParam("file") MultipartFile file) {
        try {
            List<Candidate> savedCandidates = examinerService.processExcelFile(file);
            return ResponseEntity.ok(savedCandidates);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error processing file: " + e.getMessage());
        }
    }

    @PostMapping("/register/examiner")
    public ResponseEntity<?> registerExaminer(@RequestBody Examiner examiner) {
        try{
            examinerService.addExaminer(examiner);
            return new ResponseEntity<>(examiner, HttpStatus.CREATED);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}


