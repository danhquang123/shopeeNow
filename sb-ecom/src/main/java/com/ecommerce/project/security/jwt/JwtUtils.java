package com.ecommerce.project.security.jwt;
import com.ecommerce.project.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtUtils.class);

    // 🔐 Secret key (ít nhất 32 ký tự)
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    // ⏰ Expiration time (ms)
    @Value("${app.jwt.expirationMs}")
    private long jwtExpirationMs;

    @Value("${app.jwt.cookie-name}")
    private String jwtCookie;



    // cookie
    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookie);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }

    // =========================
// 2️⃣ Tạo Cookie chứa JWT
// =========================
    public ResponseCookie generateCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateTokenFromUsername(userPrincipal.getUsername());
        return ResponseCookie.from(jwtCookie, jwt)
                .path("/api")
                .maxAge(24 * 60 * 60) // 24 giờ
                .httpOnly(true)      // Quan trọng: Ngăn chặn XSS
                .secure(false)       // Đổi thành true nếu dùng HTTPS
                .build();
    }
    // Hàm bổ trợ tạo token từ username (đã có sẵn logic của bạn)
    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(jwtCookie, null)
                .path("/api")
                .build();
    }


    // JWT
    // =========================
    // 1️⃣ Lấy token từ Header
    // =========================
    public String getJwtFromHeader(HttpServletRequest request) {

        String bearerToken =
                request.getHeader("Authorization");

        logger.debug("Authorization Header: {}",
                bearerToken);

        if (bearerToken != null &&
                bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7);
        }

        return null;
    }


    // =========================
    // 2️⃣ Tạo JWT từ User
    // =========================
    public String generateTokenFromUser(
            UserDetails userDetails) {

        return Jwts.builder()

                .setSubject(userDetails.getUsername())

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpirationMs))

                .signWith(getSigningKey(),
                        SignatureAlgorithm.HS256)

                .compact();
    }

    // =========================
    // 3️⃣ Lấy username từ token
    // =========================
    public String getUserNameFromJwtToken(
            String token) {

        return Jwts.parserBuilder()

                .setSigningKey(getSigningKey())

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();
    }

    // =========================
    // 4️⃣ Validate token
    // =========================
    public boolean validateJwtToken(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (SecurityException e) {
            logger.error("Invalid JWT signature: {}",
                    e.getMessage());

        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}",
                    e.getMessage());

        } catch (ExpiredJwtException e) {
            logger.error("JWT expired: {}",
                    e.getMessage());

        } catch (UnsupportedJwtException e) {
            logger.error("JWT unsupported: {}",
                    e.getMessage());

        } catch (IllegalArgumentException e) {
            logger.error("JWT claims empty: {}",
                    e.getMessage());
        }

        return false;
    }

    // =========================
    // 5️⃣ Key ký token
    // =========================
    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes());
    }
}