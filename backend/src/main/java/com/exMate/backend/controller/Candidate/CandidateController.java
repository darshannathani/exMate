package com.exMate.backend.controller.Candidate;

import com.exMate.backend.model.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.exMate.backend.service.Candidate.CandidateService;

@RestController
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("{c_id}")
    public ResponseEntity<?> getCandidateById(@PathVariable int c_id){
        try{
            return new ResponseEntity<>(candidateService.getCandidateById(c_id), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllCandidates(){
        try{
            return new ResponseEntity<>(candidateService.getAllCandidates(), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("{c_id}")
    public ResponseEntity<?> updateCandidate(@PathVariable int c_id, @RequestBody Candidate candidate){
        try{
            return new ResponseEntity<>(candidateService.updateCandidate(c_id, candidate), HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{c_id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable int c_id){
        try{
            candidateService.deleteCandidate(c_id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> addCandidate(@RequestBody Candidate candidate){
        try{
            candidateService.addCandidate(candidate);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
