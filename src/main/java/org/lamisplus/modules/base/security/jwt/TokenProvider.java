package org.lamisplus.modules.base.security.jwt;

import io.jsonwebtoken.*;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class TokenProvider {
    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);
    private static final String AUTHORITIES_KEY = "auth";

    private Key key;
    private String secret = "ChangeThisSecretForLamisplusApplication1234567890!@#$%^&*()_+" +
            "ChangeThisSecretForLamisplusApplication1234567890!@#$%^&*()_+";
    private long tokenValidityInMilliseconds;

    private long tokenValidityInMillisecondsForRememberMe;
    public TokenProvider(){

    }

    @PostConstruct
    public void init(){
        byte[] keyBytes;

        /*if (!StringUtils.isEmpty(secret)) {
            log.warn(
                    "Warning: the JWT key used is not Base64-encoded"
            );
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        } else {
            log.debug("Using a Base64-encoded JWT secret key");
            keyBytes = Decoders.BASE64.decode(secret);
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);*/
        this.tokenValidityInMilliseconds = 1000*60*60*10;
        this.tokenValidityInMillisecondsForRememberMe = 1000*60*60*100;
    }

    public String createToken(Authentication authentication, UserService userService, boolean rememberMe) {
        //String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        Date validity;
        if (rememberMe) {
            validity = new Date(now + this.tokenValidityInMillisecondsForRememberMe);
        } else {
            validity = new Date(now + this.tokenValidityInMilliseconds);
        }
        org.lamisplus.modules.base.domain.entity.User user = userService.getUserWithRoles().get();
        //getting & adding user details to token
        String name = user.getPerson().getFirstName() + " " +
                userService.getUserWithRoles().get().getPerson().getLastName();

        String authorities = user.getRole().stream().map(Role::getName).collect(Collectors.joining(","));

        return Jwts
                .builder()
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .claim("name", name)
                //.claim("role", role)
                .signWith(SignatureAlgorithm.HS512, secret)
                .setExpiration(validity)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();

        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        User principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.info("Invalid JWT token.");
            log.trace("Invalid JWT token trace.", e);
        }
        return false;
    }



}
