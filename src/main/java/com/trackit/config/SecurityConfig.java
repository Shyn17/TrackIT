package com.trackit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.trackit.security.JwtAuthFilter;
import com.trackit.security.JwtUtil;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtUtil);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .authorizeHttpRequests(auth -> auth

                /* =====================
                   PUBLIC
                   ===================== */
                .requestMatchers("/auth/**").permitAll()
                // File downloads are public — filenames are UUIDs (unguessable)
                .requestMatchers(HttpMethod.GET, "/api/files/download/**").permitAll()

                /* =====================
                   ADMIN ONLY
                   ===================== */
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/tasks/assign").hasRole("ADMIN")
                // ADMIN can delete any task; REPORTER can delete their own (enforced in service)
                .requestMatchers(HttpMethod.DELETE, "/tasks/**").hasAnyRole("ADMIN", "REPORTER")

                /* =====================
                   DEVELOPER
                   ===================== */
                .requestMatchers(HttpMethod.GET, "/tasks/assigned")
                    .hasAnyRole("DEVELOPER", "ADMIN")

                .requestMatchers(HttpMethod.PUT, "/tasks/status")
                    .hasAnyRole("DEVELOPER", "ADMIN")

                /* =====================
                   REPORTER
                   ===================== */
                .requestMatchers(HttpMethod.GET, "/tasks/my")
                    .hasAnyRole("REPORTER", "ADMIN")

                /* =====================
                   TASK CREATION / VIEW
                   ===================== */
                .requestMatchers(HttpMethod.POST, "/tasks")
                    .hasAnyRole("REPORTER", "ADMIN")

                // All authenticated users can GET any task (list or by id)
                .requestMatchers(HttpMethod.GET, "/tasks", "/tasks/**")
                    .hasAnyRole("ADMIN", "REPORTER", "DEVELOPER")

                /* =====================
                   SEARCH & COMMENTS
                   ===================== */
                .requestMatchers("/tasks/search")
                    .hasAnyRole("ADMIN", "DEVELOPER")

                .requestMatchers("/tasks/*/comments/**")
                    .hasAnyRole("ADMIN", "DEVELOPER", "REPORTER")

                .requestMatchers("/tasks/*/attachments/**")
                    .hasAnyRole("ADMIN", "DEVELOPER", "REPORTER")

                /* =====================
                   FALLBACK
                   ===================== */
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}