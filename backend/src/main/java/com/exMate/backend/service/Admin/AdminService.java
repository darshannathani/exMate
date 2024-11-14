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

    public void addAdmin(Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()) != null) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepository.save(admin);
    }

    public Admin getAdminById(int a_id) {
        return adminRepository.findById(a_id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    public Admin updateUser(int a_id, Admin admin) {
        Admin existingAdmin = adminRepository.findById(a_id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        existingAdmin.setName(admin.getName());
        existingAdmin.setEmail(admin.getEmail());
        existingAdmin.setPhone(admin.getPhone());
        existingAdmin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(existingAdmin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void deleteAdmin(int a_id) {
        if(!adminRepository.existsById(a_id)) {
            throw new RuntimeException("Admin not found");
        }
        adminRepository.deleteById(a_id);
    }
}
