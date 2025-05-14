package com.aimable01.cat;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@NamedStoredProcedureQuery(
        name = "Post.getByTitle",
        procedureName = "get_post_by_title",
        resultClasses = Post.class,
        parameters = {
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "post_title", type = String.class)
        }
)
@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String title;
    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
