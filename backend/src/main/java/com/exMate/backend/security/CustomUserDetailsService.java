package com.exMate.backend.security;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Admin;
import com.exMate.backend.repository.CandidateRepository;
import com.exMate.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null) {
            return UserPrincipal.createAdmin(admin);
        }

        Candidate candidate = candidateRepository.findByEmail(email);
        if (candidate != null) {
            return UserPrincipal.createCandidate(candidate);
        }
        throw new UsernameNotFoundException("User not found with email : " + email);
    }

    public UserDetails loadUserById(Integer id, String role) {
        if (role.equals("ROLE_ADMIN")) {
            Admin admin = adminRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("Admin not found with id : " + id));
            return UserPrincipal.createAdmin(admin);
        } else {
            Candidate candidate = candidateRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("Candidate not found with id : " + id));
            return UserPrincipal.createCandidate(candidate);
        }
    }
}