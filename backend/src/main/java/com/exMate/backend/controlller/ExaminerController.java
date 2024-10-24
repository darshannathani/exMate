package com.exMate.backend.controlller;

import com.exMate.backend.model.Examiner;
import com.exMate.backend.service.ExaminerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/examiner")
public class ExaminerController {
    @Autowired
    private ExaminerService ExaminerService;

    @PostMapping
    public ResponseEntity<?> addExaminer(@RequestBody Examiner examiner) {
        try{
            ExaminerService.addExaminer(examiner);
            return new ResponseEntity<>(examiner, HttpStatus.CREATED);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
