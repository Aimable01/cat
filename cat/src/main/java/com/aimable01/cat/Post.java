package com.aimable01.cat;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(
                name = "get_posts_by_title",
                procedureName = "get_posts_byt_title",
                parameters = {
                        @StoredProcedureParameter(name = "post_title", mode = ParameterMode.IN, type = String.class),
                },
                resultClasses = Post.class
        )
})
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String title;
    private String content;

}
