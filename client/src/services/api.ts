import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
}

export interface PostInput {
  title: string;
  content: string;
  userId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get<PaginatedResponse<Post>>(
    `/posts?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getPost = async (id: number) => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (post: PostInput) => {
  const response = await api.post<Post>("/posts", post);
  return response.data;
};

export const updatePost = async (id: number, post: PostInput) => {
  const response = await api.put<Post>(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: number) => {
  await api.delete(`/posts/${id}`);
};
