package com.exMate.backend.service.Admin;

import com.exMate.backend.enums.ExamDifficulty;
import com.exMate.backend.model.Exam;
import com.exMate.backend.model.Question;
import com.exMate.backend.model.ExamQuestionMapping;
import com.exMate.backend.repository.QuestionRepository;
import com.exMate.backend.repository.ExamRepository;
import com.exMate.backend.repository.ExamQuestionMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ExamService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final ExamQuestionMappingRepository examQuestionMappingRepository;

    @Autowired
    public ExamService(
            QuestionRepository questionRepository,
            ExamRepository examRepository,
            ExamQuestionMappingRepository examQuestionMappingRepository
    ) {
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
        this.examQuestionMappingRepository = examQuestionMappingRepository;
    }

    public Exam scheduleExam(int exam_id) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        if(exam.getEnd_date().isBefore(exam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        return examRepository.save(exam);
    }

    public Exam updateExam(int exam_id, Map<String,Object> request) {
        Exam oldExam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));

        oldExam.setDescription((String) request.get("description"));
        oldExam.setPassing_score((Integer) request.get("passing_score"));
        oldExam.setStatus((String) request.get("status"));
        oldExam.setMcq((int) request.get("mcq"));
        oldExam.setProgramming((int) request.get("programming"));
        oldExam.setDb((int) request.get("database"));
        oldExam.setDifficulty(ExamDifficulty.valueOf((String) request.get("difficulty")));
        oldExam.setStart_date(LocalDateTime.parse((CharSequence) request.get("start_date")));
        oldExam.setEnd_date(LocalDateTime.parse((CharSequence) request.get("end_date")));
        if(oldExam.getEnd_date().isBefore(oldExam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        return examRepository.save(oldExam);
    }

    public List<Exam> getAllExam() {
        try{
            return examRepository.findAll();
        } catch(Exception e){
            throw new RuntimeException("Error: No Exams found");
        }
    }

    public void deleteExam(int exam_id) {
        try{
            examRepository.findById(exam_id)
                    .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        } catch(Exception e) {
            throw new RuntimeException("Error: Invalid exam");
        }
    }

    public Exam getExamById(int exam_id) {
        return examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
    }

    public Exam createExam(Exam exam) {
        System.out.println(exam);
        try
        {
            Exam savedExam = examRepository.save(exam);


        System.out.println(savedExam);
        List<Question> mcqQuestions = questionRepository.findRandomQuestionsByDifficultyAndSectionType(
                String.valueOf(exam.getDifficulty()), "MCQ", exam.getMcq()
        );
        System.out.println(mcqQuestions);

        List<Question> programmingQuestions = questionRepository.findRandomQuestionsByDifficultyAndSectionType(
                String.valueOf(exam.getDifficulty()), "PROGRAMMING", exam.getProgramming()
        );
        System.out.println(programmingQuestions);

        List<Question> databaseQuestions = questionRepository.findRandomQuestionsByDifficultyAndSectionType(
                String.valueOf(exam.getDifficulty()), "DATABASE", exam.getDb()
        );
        System.out.println(databaseQuestions);

        List<ExamQuestionMapping> mappings = new ArrayList<>();
            System.out.println(mappings);
        for (int i=0;i<exam.getMcq();i++){
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(savedExam);
            mapping.setQuestion(mcqQuestions.get(i));
            mappings.add(mapping);
        }
            System.out.println(mappings);
        for (Question question : programmingQuestions) {
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(savedExam);
            mapping.setQuestion(question);
            mappings.add(mapping);
        }
            System.out.println(mappings);
        for (Question question : databaseQuestions) {
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(savedExam);
            mapping.setQuestion(question);
            mappings.add(mapping);
        }
            System.out.println(mappings);
        examQuestionMappingRepository.saveAll(mappings);
            System.out.println(mappings);
        } catch (Exception e) {
            System.out.println(e);
        }
        return exam;
    }


}
