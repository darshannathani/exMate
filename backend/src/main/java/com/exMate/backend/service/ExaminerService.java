package com.exMate.backend.service;

import com.exMate.backend.model.Examiner;
import com.exMate.backend.repository.ExaminerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExaminerService {
    @Autowired
    private ExaminerRepository examinerRepository;

    public void addExaminer(Examiner examiner) {
        examinerRepository.save(examiner);
    }

}
