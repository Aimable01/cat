package com.aimable01.cat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

    @Procedure(name = "Post.getByTitle")
    List<Post> getPostsByTitle(@Param("post_title") String title);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% ORDER BY p.createdAt DESC")
    List<Post> searchPostsByTitle(@Param("keyword") String keyword);
}
