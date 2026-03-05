"use client";


import { publicApi as api } from '@/lib/blogApi';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';

export default function BlogsByCategoryPage() {
  const { categorySlug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogsByCategory = async () => {
      if (!categorySlug) return;

      try {
        setLoading(true);
        setError(null);
        
        // Assuming your API returns { blogs: [], category: {} } or similar
  const response = await api.getBlogsByCategory(categorySlug);
        
        setBlogs(response.data.blogs || response.data);
        setCategory(response.data.category || { name: categorySlug });
      } catch (err) {
        setError(err.message || 'Failed to fetch blogs');
        console.error('Error fetching blogs by category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsByCategory();
  }, [categorySlug]);

  if (loading) {
    return <LoadingScreen message="Loading blogs..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {category?.name || categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        {category?.description && (
          <p className="text-gray-600 text-lg">{category.description}</p>
        )}
        <div className="mt-2 text-sm text-gray-500">
          {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} found
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No blogs found</h3>
          <p className="text-gray-500">There are no articles in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id || blog.slug} blog={blog} />
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
