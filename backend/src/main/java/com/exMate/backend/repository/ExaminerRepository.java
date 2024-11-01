package com.exMate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.exMate.backend.model.Examiner;
import org.springframework.stereotype.Repository;

@Repository
public interface ExaminerRepository extends JpaRepository<Examiner, Integer> {

    Examiner findByEmail(String email);

}
