import { useState, useEffect } from "react";
import {
  type Post,
  getPosts,
  deletePost,
  searchPostsByTitle,
  getPostsByTitleUsingProcedure,
} from "../services/api";
import PostForm from "./PostForm";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUsingProcedure, setIsUsingProcedure] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    if (!searchTerm) {
      fetchPosts();
    }
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getPosts(currentPage - 1, postsPerPage);
      setPosts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      if (searchTerm) {
        handleSearch(); // Re-perform the search if filtering
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const data = isUsingProcedure
        ? await getPostsByTitleUsingProcedure(searchTerm)
        : await searchPostsByTitle(searchTerm);
      setPosts(data);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchPosts();
  };

  if (editingPost) {
    return (
      <PostForm
        postId={editingPost.id}
        initialData={editingPost}
        onSuccess={() => {
          setEditingPost(null);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          searchTerm ? handleSearch() : fetchPosts();
        }}
        onCancel={() => setEditingPost(null)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <select
            value={isUsingProcedure ? "procedure" : "jpql"}
            onChange={(e) =>
              setIsUsingProcedure(e.target.value === "procedure")
            }
            className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="jpql">JPQL Search</option>
            <option value="procedure">Stored Procedure</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? "No posts found matching your search"
              : "No posts available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchTerm && !isLoading && posts.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white rounded-md">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
