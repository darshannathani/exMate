package com.exMate.backend.service.Admin;

import com.exMate.backend.model.Exam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.exMate.backend.repository.ExamRepository;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public Exam scheduleExam(int exam_id) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        if(exam.getEnd_date().isBefore(exam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        return examRepository.save(exam);
    }

    public Exam updateExam(int exam_id) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        if(exam.getEnd_date().isBefore(exam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        return examRepository.save(exam);
    }

    public List<Exam> getAllExam() {
        return examRepository.findAll();
    }

    public void deleteExam(int exam_id) {
        examRepository.deleteById(exam_id);
    }

    public Exam getExamById(int exam_id) {
        return examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
    }

    public Exam createExam(Exam exam,int MCQ,int programming,int database) {
        if(exam.getEnd_date().isBefore(exam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        if(exam.getDifficulty().equals("EASY")){
            exam.setTotal_marks(MCQ*2+programming+database);
        }
        else if(exam.getDifficulty().equals("MEDIUM")){
            exam.setTotal_marks(MCQ*3+programming+database);
        }
        else if(exam.getDifficulty().equals("HARD")){
            exam.setTotal_marks(MCQ*4+programming+database);
        }

        return examRepository.save(exam);
    }


}
