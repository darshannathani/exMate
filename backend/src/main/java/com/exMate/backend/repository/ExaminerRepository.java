package com.exMate.backend.repository;

import org.springframework.data.repository.CrudRepository;
import com.exMate.backend.model.Examiner;
import org.springframework.stereotype.Repository;

@Repository
public interface ExaminerRepository extends CrudRepository<Examiner, Integer> {

}
