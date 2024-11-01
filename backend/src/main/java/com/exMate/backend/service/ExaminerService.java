package com.exMate.backend.service;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Examiner;
import com.exMate.backend.repository.CandidateRepository;
import com.exMate.backend.repository.ExaminerRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.ZoneId;
import java.util.*;

@Service
public class ExaminerService {

    @Autowired
    private ExaminerRepository examinerRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    final private PasswordEncoder passwordEncoder;

    @Autowired
    public ExaminerService(ExaminerRepository examinerRepository) {
        this.examinerRepository = examinerRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void addExaminer(Examiner examiner) {
        if (examinerRepository.findByEmail(examiner.getEmail()) != null) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        examiner.setPassword(passwordEncoder.encode(examiner.getPassword()));
        examinerRepository.save(examiner);
    }

    public Examiner getExaminerById(int e_id) {
        return examinerRepository.findById(e_id)
                .orElseThrow(() -> new RuntimeException("Examiner not found"));
    }

    public Examiner updateUser(int e_id, Examiner examiner) {
        Examiner existingExaminer = examinerRepository.findById(e_id)
                .orElseThrow(() -> new RuntimeException("Examiner not found"));
        existingExaminer.setName(examiner.getName());
        existingExaminer.setEmail(examiner.getEmail());
        existingExaminer.setPhone(examiner.getPhone());
        existingExaminer.setPassword(passwordEncoder.encode(examiner.getPassword()));
        return examinerRepository.save(existingExaminer);
    }

    public List<Examiner> getAllExaminers() {
        return examinerRepository.findAll();
    }

    public void deleteExaminer(int e_id) {
        if(!examinerRepository.existsById(e_id)) {
            throw new RuntimeException("Examiner not found");
        }
        examinerRepository.deleteById(e_id);
    }

    public List<Candidate> processExcelFile(MultipartFile file) throws IOException {
        List<Candidate> candidates=new ArrayList<>();
        try (Workbook workbook=WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet=workbook.getSheetAt(0);
            Row headerRow=sheet.getRow(0);
            Map<String,Integer> columnMap=new HashMap<>();
            for (int i=0; i<headerRow.getLastCellNum(); i++) {
                String columnName=headerRow.getCell(i).getStringCellValue().toLowerCase().trim();
                columnMap.put(columnName,i);
            }
            for (int i=1; i<=sheet.getLastRowNum(); i++) {
                Row row=sheet.getRow(i);
                if (row==null) continue;
                try {
                    Candidate candidate=extractCandidateFromRow(row,columnMap);
                    candidates.add(candidate);
                } catch (Exception e) {
                    throw new RuntimeException("Error processing row "+(i+1)+": "+e.getMessage());
                }
            }
        }
        return candidateRepository.saveAll(candidates);
    }

    private Candidate extractCandidateFromRow(Row row, Map<String,Integer> columnMap) {
        Candidate candidate = new Candidate();
        candidate.setName(getCellValueAsString(row,columnMap.get("name")));
        candidate.setCollege(getCellValueAsString(row,columnMap.get("college")));
        candidate.setEmail(getCellValueAsString(row,columnMap.get("email")));
        candidate.setPhone(getCellValueAsString(row,columnMap.get("phone")));
        Cell birthDateCell = row.getCell(columnMap.get("birthdate"));
        if (birthDateCell != null) {
            if (birthDateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(birthDateCell)) {
                Date date = birthDateCell.getDateCellValue();
                candidate.setBirthDate(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
            } else {
                throw new RuntimeException("Invalid birth date format");
            }
        }
        candidate.setPassword(passwordEncoder.encode(getCellValueAsString(row, columnMap.get("phone"))));
        return candidate;
    }

    private String getCellValueAsString(Row row, Integer columnIndex) {
        Cell cell=row.getCell(columnIndex);
        if (cell==null) {
            return null;
        }
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> null;
        };
    }
}
