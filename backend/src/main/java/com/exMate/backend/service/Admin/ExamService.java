package com.exMate.backend.service.Admin;

import com.exMate.backend.enums.ExamDifficulty;
import com.exMate.backend.enums.SectionType;
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
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Transactional
    public Exam updateExam(int exam_id, Exam exam) {
        Exam oldExam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));

        boolean needRegenerate = false;

        if (oldExam.getDifficulty() != exam.getDifficulty() ||
                oldExam.getMcq() != exam.getMcq() ||
                oldExam.getProgramming() != exam.getProgramming() ||
                oldExam.getDb() != exam.getDb()) {
            needRegenerate = true;
        }
        oldExam.setDescription(exam.getDescription());
        oldExam.setPassing_score(exam.getPassing_score());
        oldExam.setStatus(exam.getStatus());
        if (exam.getStart_date() != null) {
            oldExam.setStart_date(exam.getStart_date());
        }
        if (exam.getEnd_date() != null) {
            oldExam.setEnd_date(exam.getEnd_date());
        }
        if (oldExam.getStart_date() != null && oldExam.getEnd_date() != null) {
            if (oldExam.getEnd_date().isBefore(oldExam.getStart_date())) {
                throw new RuntimeException("End date cannot be before start date");
            }
        }
        oldExam.setTotal_marks(exam.getTotal_marks());
        oldExam.setDuration(exam.getDuration());
        oldExam.setTitle(exam.getTitle());
        if (exam.getDifficulty() != null) {
            oldExam.setDifficulty(exam.getDifficulty());
        }
        oldExam.setMcq(exam.getMcq());
        oldExam.setProgramming(exam.getProgramming());
        oldExam.setDb(exam.getDb());
        Exam updatedExam = examRepository.save(oldExam);
        if (needRegenerate) {
            regenerateQuestions(exam_id);
        }
        return updatedExam;
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
            examRepository.deleteById(exam_id);
        } catch(Exception e) {
            throw new RuntimeException("Error: Invalid exam");
        }
    }

    public Exam getExamById(int exam_id) {
        return examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
    }

    @Transactional
    public Exam createExam(Exam exam) {
        try {
            Exam savedExam = examRepository.save(exam);
            List<Question> allQuestions = questionRepository.findAll();
            List<ExamQuestionMapping> mappings = generateQuestion(savedExam, allQuestions);
            examQuestionMappingRepository.deleteAllByExam(savedExam);
            examQuestionMappingRepository.saveAll(mappings);
            return savedExam;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create exam", e);
        }
    }

    public List<Question> getQuestionsByExam(int exam_id) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        return examQuestionMappingRepository.findByExam(exam).stream()
                .map(ExamQuestionMapping::getQuestion)
                .collect(Collectors.toList());
    }

    public List<Question> updateDifficulty(int exam_id, String difficulty) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        exam.setDifficulty(ExamDifficulty.valueOf(difficulty));
        examRepository.save(exam);
        return getQuestionsByExam(exam_id);
    }

    private List<ExamQuestionMapping> generateQuestion(Exam exam, List<Question> allQuestions) {

        ExamDifficulty examDifficulty = ExamDifficulty.valueOf(exam.getDifficulty().toString());

        List<Question> technicalMcqQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null &&
                        q.getDifficulty().equals(examDifficulty) &&
                        q.getSection_type() == SectionType.TECHNICAL)
                .collect(Collectors.toList());

        List<Question> programmingQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null &&
                        q.getDifficulty().equals(examDifficulty) &&
                        q.getSection_type() == SectionType.PROGRAMMING)
                .collect(Collectors.toList());

        List<Question> logicalMcqQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null &&
                        q.getDifficulty().equals(examDifficulty) &&
                        q.getSection_type() == SectionType.LOGICAL)
                .collect(Collectors.toList());

        Collections.shuffle(technicalMcqQuestions);
        Collections.shuffle(programmingQuestions);
        Collections.shuffle(logicalMcqQuestions);

        technicalMcqQuestions = technicalMcqQuestions.subList(0, Math.min(exam.getMcq(), technicalMcqQuestions.size()));
        programmingQuestions = programmingQuestions.subList(0, Math.min(exam.getProgramming(), programmingQuestions.size()));
        logicalMcqQuestions = logicalMcqQuestions.subList(0, Math.min(exam.getDb(), logicalMcqQuestions.size()));

        List<ExamQuestionMapping> mappings = new ArrayList<>();

        for (Question question : technicalMcqQuestions) {
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(exam);
            mapping.setQuestion(question);
            mappings.add(mapping);
        }

        for (Question question : programmingQuestions) {
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(exam);
            mapping.setQuestion(question);
            mappings.add(mapping);
        }

        for (Question question : logicalMcqQuestions) {
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(exam);
            mapping.setQuestion(question);
            mappings.add(mapping);
        }
        return mappings;
    }

    @Transactional
    public Exam regenerateQuestions(int exam_id) {
        try {
            Exam exam = examRepository.findById(exam_id)
                    .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
            List<Question> allQuestions = questionRepository.findAll();
            List<ExamQuestionMapping> existingMappings =
                    examQuestionMappingRepository.findAllByExam(exam);
            if (!existingMappings.isEmpty()) {
                examQuestionMappingRepository.deleteAll(existingMappings);
            }
            List<ExamQuestionMapping> newMappings = generateQuestion(exam, allQuestions);
            examQuestionMappingRepository.saveAll(newMappings);
            return exam;
        } catch (Exception e) {
            throw new RuntimeException("Failed to regenerate questions", e);
        }
    }
}
