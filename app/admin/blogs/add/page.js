'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi, publicApi } from '@/lib/blogApi';
import AdminLayout from '@/components/AdminLayout';
import BlogForm from '@/components/BlogForm';

export default function AddBlog() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await publicApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (blogData) => {
    try {
      console.log('Submitting blog data:', blogData);
      await adminApi.createBlog({
        ...blogData,
        slug: blogData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      });
      console.log('Blog created successfully');
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  };

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Blog</h1>
          <p className="text-gray-600">Create a new blog post</p>
        </div>

        <BlogForm 
          categories={categories}
          onSubmit={handleSubmit}
          submitButtonText="Create Blog"
        />
      </div>
    </AdminLayout>
  );
}
