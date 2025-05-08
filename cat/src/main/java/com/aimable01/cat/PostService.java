package com.aimable01.cat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public Page<Post> findAll(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public Post findOne(Integer id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post edit(Integer id, Post post) {
        return postRepository.findById(id).map(existingPost -> {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            return postRepository.save(existingPost);
        }).orElse(null);
    }

    public void delete(Integer id) {
        postRepository.deleteById(id);
    }
}
