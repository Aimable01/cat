package com.aimable01.cat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping()
    public Page<Post> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending

    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return postService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Post findOne(@PathVariable Integer id) {
        return postService.findOne(id);
    }

    @PostMapping()
    public Post save(@RequestBody Post post) {
        return postService.save(post);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Integer id, @RequestBody Post post) {
        return postService.edit(id, post);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        postService.delete(id);
    }
}
