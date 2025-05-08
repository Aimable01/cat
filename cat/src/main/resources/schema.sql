CREATE OR REPLACE FUNCTION get_posts_by_title(post_title VARCHAR)
RETURNS SETOF post AS $$
BEGIN
RETURN QUERY SELECT * FROM post WHERE title = post_title;
END;
$$ LANGUAGE plpgsql;