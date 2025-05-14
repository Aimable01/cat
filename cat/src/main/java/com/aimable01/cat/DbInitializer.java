package com.aimable01.cat;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DbInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        createStoredProcedure();
        createTriggerFunction();
        createTrigger();
    }

    private void createStoredProcedure() {
        String sql = """
            CREATE OR REPLACE FUNCTION get_post_by_title(post_title TEXT)
            RETURNS SETOF post AS $$
            BEGIN
                RETURN QUERY SELECT * FROM post WHERE title = post_title;
            END;
            $$ LANGUAGE plpgsql;
        """;

        jdbcTemplate.execute(sql);
    }

    private void createTriggerFunction() {
        String sql = """
            CREATE OR REPLACE FUNCTION before_insert_post()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.title := UPPER(NEW.title);
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """;

        jdbcTemplate.execute(sql);
    }

    private void createTrigger() {
        jdbcTemplate.execute("DROP TRIGGER IF EXISTS trg_before_insert_post ON post;");
        String createTrigger = """
            CREATE TRIGGER trg_before_insert_post
            BEFORE INSERT ON post
            FOR EACH ROW
            EXECUTE FUNCTION before_insert_post();
        """;

        jdbcTemplate.execute(createTrigger);
    }
}
