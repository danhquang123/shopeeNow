package com.ecommerce.project.util;

import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    @Autowired
    private UserRepository userRepository;

    // 1. Lấy Email của người dùng đang đăng nhập từ JWT/Cookie




    public String loggedInEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Lấy username từ Token (ví dụ: "danhquang")
        String username = authentication.getName();

        // Tìm User để lấy Email thật
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return user.getEmail();
    }

    public User loggedInUser() {
        // Lấy thẳng username từ SecurityContext, đừng gọi vòng qua loggedInEmail nữa
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    // 3. Lấy UserId (Tiện ích bổ sung)
    public Long loggedInUserId() {
        User user = loggedInUser();
        return user.getUserId();
    }
}