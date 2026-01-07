package com.myvitalmate.app.login.security;

import com.myvitalmate.app.login.entity.Role;
import com.myvitalmate.app.login.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:defaultSecretKeyThatShouldBeChangedInProduction}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private long validityInMilliseconds;

    @Autowired
    private ApplicationContext applicationContext; //need for lazy load of userDetailsService only load when needed

    private UserDetailsService userDetailsService;

    private Key key;

    @PostConstruct
    protected void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String createToken(User userData) {
        Claims claims = Jwts.claims().setSubject(userData.getEmail());
        claims.put("role", userData.getRole().name());
        claims.put("id", userData.getId());

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createToken(UUID anonymousPatientId) {
        Claims claims = Jwts.claims();
        claims.put("role", Role.ANONYMOUS_PATIENT.name());
        claims.put("id", anonymousPatientId.toString());

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        String subject = claims.getSubject();

        // Handle anonymous users (no subject/email)
        if (subject == null || subject.isEmpty()) {
            String anonymousId = (String) claims.get("id");
            String role = (String) claims.get("role");

            UserDetails anonymousUser = org.springframework.security.core.userdetails.User.builder()
                    .username("anonymous_" + anonymousId)
                    .password("")
                    .authorities("ROLE_" + role)
                    .build();

            return new UsernamePasswordAuthenticationToken(
                    anonymousUser,
                    "",
                    anonymousUser.getAuthorities()
            );

        }

        // Handle regular users
        if (userDetailsService == null) {
            userDetailsService = applicationContext.getBean(UserDetailsService.class);
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(subject);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return claims.getBody().getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isAnonymousToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return claims.getSubject() == null || claims.getSubject().isEmpty();
    }

    public UUID getAnonymousId(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        String id = (String) claims.get("id");
        return UUID.fromString(id);
    }
}
