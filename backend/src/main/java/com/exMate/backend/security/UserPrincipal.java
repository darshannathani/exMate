package com.exMate.backend.security;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Examiner;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private Integer id;
    private String email;
    private String password;
    private String role;

    public static UserPrincipal createExaminer(Examiner examiner) {
        return new UserPrincipal(
                examiner.getE_id(),
                examiner.getEmail(),
                examiner.getPassword(),
                "ROLE_EXAMINER"
        );
    }

    public static UserPrincipal createCandidate(Candidate candidate) {
        return new UserPrincipal(
                candidate.getC_id(),
                candidate.getEmail(),
                candidate.getPassword(),
                "ROLE_CANDIDATE"
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}