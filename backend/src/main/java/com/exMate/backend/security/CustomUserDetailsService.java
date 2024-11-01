package com.exMate.backend.security;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Examiner;
import com.exMate.backend.repository.CandidateRepository;
import com.exMate.backend.repository.ExaminerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ExaminerRepository examinerRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Examiner examiner = examinerRepository.findByEmail(email);
        if (examiner != null) {
            return UserPrincipal.createExaminer(examiner);
        }

        Candidate candidate = candidateRepository.findByEmail(email);
        if (candidate != null) {
            return UserPrincipal.createCandidate(candidate);
        }

        throw new UsernameNotFoundException("User not found with email : " + email);
    }

    public UserDetails loadUserById(Integer id, String role) {
        if (role.equals("ROLE_EXAMINER")) {
            Examiner examiner = examinerRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("Examiner not found with id : " + id));
            return UserPrincipal.createExaminer(examiner);
        } else {
            Candidate candidate = candidateRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("Candidate not found with id : " + id));
            return UserPrincipal.createCandidate(candidate);
        }
    }
}