import { useState } from "react";
import { type PostInput, createPost, updatePost } from "../services/api";

interface PostFormProps {
  postId?: number;
  initialData?: PostInput;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PostForm({
  postId,
  initialData,
  onSuccess,
  onCancel,
}: PostFormProps) {
  const [formData, setFormData] = useState<PostInput>(
    initialData || {
      title: "",
      content: "",
    }
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error("Title and content are required");
      }

      if (postId) {
        await updatePost(postId, formData);
      } else {
        await createPost(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 ease-in-out"
          placeholder="Enter post title"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 ease-in-out resize-none"
          placeholder="Write your post content here"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition duration-200 ease-in-out"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-[1.02]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : postId ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
