package com.exMate.backend.service.Admin;

import com.exMate.backend.model.Admin;
import com.exMate.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    final private PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void addExaminer(Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()) != null) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepository.save(admin);
    }

    public Admin getExaminerById(int e_id) {
        return adminRepository.findById(e_id)
                .orElseThrow(() -> new RuntimeException("Examiner not found"));
    }

    public Admin updateUser(int e_id, Admin admin) {
        Admin existingAdmin = adminRepository.findById(e_id)
                .orElseThrow(() -> new RuntimeException("Examiner not found"));
        existingAdmin.setName(admin.getName());
        existingAdmin.setEmail(admin.getEmail());
        existingAdmin.setPhone(admin.getPhone());
        existingAdmin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(existingAdmin);
    }

    public List<Admin> getAllExaminers() {
        return adminRepository.findAll();
    }

    public void deleteExaminer(int e_id) {
        if(!adminRepository.existsById(e_id)) {
            throw new RuntimeException("Examiner not found");
        }
        adminRepository.deleteById(e_id);
    }
}
