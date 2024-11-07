package com.exMate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.exMate.backend.model.Admin;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    Admin findByEmail(String email);

}
