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

    public Exam updateExam(int exam_id, Map<String,Object> request) {
        Exam oldExam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));

        oldExam.setDescription((String) request.get("description"));
        oldExam.setPassing_score((Integer) request.get("passing_score"));
        oldExam.setStatus((String) request.get("status"));
        oldExam.setStart_date(LocalDateTime.parse((CharSequence) request.get("start_date")));
        oldExam.setEnd_date(LocalDateTime.parse((CharSequence) request.get("end_date")));
        if(oldExam.getEnd_date().isBefore(oldExam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        if(oldExam.getDifficulty()!=ExamDifficulty.valueOf((String) request.get("difficulty")) || oldExam.getMcq() != (int) request.get("mcq") || oldExam.getProgramming() != (int) request.get("programming") || oldExam.getDb() != (int) request.get("db")) {
            regenerateQuestions(exam_id);
            oldExam.setDifficulty(ExamDifficulty.valueOf((String) request.get("difficulty")));
            oldExam.setMcq((int) request.get("mcq"));
            oldExam.setProgramming((int) request.get("programming"));
            oldExam.setDb((int) request.get(("db")));
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
        try {
            Exam savedExam = examRepository.save(exam);

            List<Question> allQuestions = questionRepository.findAll();

            List<ExamQuestionMapping> mappings = generateQuestion(savedExam, allQuestions);
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

        List<Question> mcqQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null &&
                        q.getDifficulty().equals(examDifficulty) &&
                        q.getSection_type() == SectionType.MCQ)
                .collect(Collectors.toList());

        List<Question> programmingQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null &&
                        q.getDifficulty().equals(examDifficulty) &&
                        q.getSection_type() == SectionType.PROGRAMMING)
                .collect(Collectors.toList());

        List<Question> databaseQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null &&
                        q.getDifficulty().equals(examDifficulty) &&
                        q.getSection_type() == SectionType.DATABASE)
                .collect(Collectors.toList());

        Collections.shuffle(mcqQuestions);
        Collections.shuffle(programmingQuestions);
        Collections.shuffle(databaseQuestions);

        mcqQuestions = mcqQuestions.subList(0, Math.min(exam.getMcq(), mcqQuestions.size()));
        programmingQuestions = programmingQuestions.subList(0, Math.min(exam.getProgramming(), programmingQuestions.size()));
        databaseQuestions = databaseQuestions.subList(0, Math.min(exam.getDb(), databaseQuestions.size()));

        List<ExamQuestionMapping> mappings = new ArrayList<>();

        for (Question question : mcqQuestions) {
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

        for (Question question : databaseQuestions) {
            ExamQuestionMapping mapping = new ExamQuestionMapping();
            mapping.setExam(exam);
            mapping.setQuestion(question);
            mappings.add(mapping);
        }
        return mappings;
    }

    public Exam regenerateQuestions(int exam_id) {
        try {
            System.out.println("Regenerating questions for exam: " + exam_id);
            Exam exam = examRepository.findById(exam_id)
                    .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
            System.out.println("Exam found: " + exam);
            List<ExamQuestionMapping> questions = examQuestionMappingRepository.findAll();
            if(questions.isEmpty()) {
                throw new RuntimeException("No questions found for exam");
            }
            System.out.println("Questions found: " + questions.size());
            List<Question> allQuestions = questionRepository.findAll();
            System.out.println(allQuestions);
            List<ExamQuestionMapping> mappings = generateQuestion(exam, allQuestions);
            System.out.println(mappings);

            examQuestionMappingRepository.deleteAllByExam(exam);
            System.out.println("Deleted old questions");
            examQuestionMappingRepository.saveAll(mappings);

            return exam;
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to regenerate questions", e);
        }
    }
}
