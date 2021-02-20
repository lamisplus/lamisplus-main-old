package org.lamisplus.modules.base.domain.dto;

import java.net.URI;

public class ErrorConstants {
    public static final String ERR_CONCURRENCY_FAILURE = "error.concurrencyFailure";
    public static final String ERR_VALIDATION = "error.validation";
    public static final String PROBLEM_BASE_URL = "https://www.jhipster.tech/problem";
    public static final URI DEFAULT_TYPE = URI.create("https://www.jhipster.tech/problem/problem-with-message");
    public static final URI CONSTRAINT_VIOLATION_TYPE = URI.create("https://www.jhipster.tech/problem/constraint-violation");
    public static final URI PARAMETERIZED_TYPE = URI.create("https://www.jhipster.tech/problem/parameterized");
    public static final URI ENTITY_NOT_FOUND_TYPE = URI.create("https://www.jhipster.tech/problem/entity-not-found");
    public static final URI INVALID_PASSWORD_TYPE = URI.create("https://www.jhipster.tech/problem/invalid-password");
    public static final URI EMAIL_ALREADY_USED_TYPE = URI.create("https://www.jhipster.tech/problem/email-already-used");
    public static final URI LOGIN_ALREADY_USED_TYPE = URI.create("https://www.jhipster.tech/problem/login-already-used");
    public static final URI EMAIL_NOT_FOUND_TYPE = URI.create("https://www.jhipster.tech/problem/email-not-found");

    private ErrorConstants() {
    }
}
