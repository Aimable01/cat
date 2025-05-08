package com.aimable01.cat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Optional<Post> findByTitle(String title);

    @Query("select s from Post s where s.title=:title")
    List<Post> findTitle(@Param("title") String title);

    @Query(value = "select * from Post", nativeQuery = true)
    List<Post> fall();

    @Procedure(name = "get_posts_by_title")
    List<Post> getPostsByTitle(@Param("post_title") String title);
}
