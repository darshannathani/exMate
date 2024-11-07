package com.exMate.backend.controller.Admin;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Admin;
import com.exMate.backend.service.CandidateService;
import com.exMate.backend.service.Admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;

    @Autowired
    private CandidateService candidateService;

    @GetMapping("{e_id}")
    public ResponseEntity<?> getExaminerById(@PathVariable int e_id){
        try{
            return new ResponseEntity<>(adminService.getExaminerById(e_id), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("{e_id}")
    public ResponseEntity<?> updateUser(@PathVariable int e_id, @RequestBody Admin admin){
        try{
            return new ResponseEntity<>(adminService.updateUser(e_id, admin), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllExaminers(){
        try{
            return new ResponseEntity<>(adminService.getAllExaminers(), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{e_id}")
    public ResponseEntity<?> deleteExaminer(@PathVariable int e_id){
        try{
            adminService.deleteExaminer(e_id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add-candidates")
    public ResponseEntity<List<Candidate>> uploadCandidates(@RequestParam("file") MultipartFile file) {
        try {
            List<Candidate> savedCandidates = candidateService.processExcelFile(file);
            return ResponseEntity.ok(savedCandidates);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error processing file: " + e.getMessage());
        }
    }

    @PostMapping("/register/examiner")
    public ResponseEntity<?> registerExaminer(@RequestBody Admin admin) {
        try{
            adminService.addExaminer(admin);
            return new ResponseEntity<>(admin, HttpStatus.CREATED);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}


