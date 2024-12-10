package com.exMate.backend.service.Candidate;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.repository.CandidateRepository;
import com.exMate.backend.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    final private PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public CandidateService(CandidateRepository candidateRepository, JwtTokenProvider jwtTokenProvider) {
        this.candidateRepository = candidateRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public List<Candidate> processExcelFile(MultipartFile file) throws IOException {
        List<Candidate> candidates=new ArrayList<>();
        try (Workbook workbook= WorkbookFactory.create(file.getInputStream())) {
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
                LocalDate localDate = date.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                candidate.setBirthdate(localDate);
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

    public void addCandidate(Candidate candidate) {
        if (candidateRepository.findByEmail(candidate.getEmail()) != null) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        if (candidate.getBirthdate() != null) {
            candidate.setBirthdate(candidate.getBirthdate());
        }
        candidate.setPassword(passwordEncoder.encode(candidate.getPhone()));
        candidateRepository.save(candidate);
    }

    public Candidate updateCandidate(int c_id, Candidate candidate) {
        Candidate existingCandidate = candidateRepository.findById(c_id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        existingCandidate.setName(candidate.getName());
        existingCandidate.setEmail(candidate.getEmail());
        existingCandidate.setPhone(candidate.getPhone());
        if (candidate.getBirthdate() != null) {
            existingCandidate.setBirthdate(candidate.getBirthdate());
        }
        existingCandidate.setPassword(passwordEncoder.encode(candidate.getPhone()));
        return candidateRepository.save(existingCandidate);
    }

    public Candidate getCandidateById(int c_id) {
        return candidateRepository.findById(c_id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public void deleteCandidate(int c_id) {
        if(!candidateRepository.existsById(c_id)) {
            throw new RuntimeException("Candidate not found");
        }
        candidateRepository.deleteById(c_id);
    }

    public Optional<Candidate> getCurrentCandidate(HttpServletRequest request) {
        return candidateRepository.findById(Integer.parseInt(jwtTokenProvider.getUserIdFromJWT(jwtTokenProvider.getJwtFromCookies(request))));
    }
}
