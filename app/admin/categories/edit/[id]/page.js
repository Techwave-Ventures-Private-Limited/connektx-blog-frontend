"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi, publicApi } from '@/lib/blogApi';
import AdminLayout from '@/components/AdminLayout';
import CategoryForm from '@/components/CategoryForm';

export default function EditCategory({ params }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState(null);

  useEffect(() => {
    const initializeParams = async () => {
      const unwrappedParams = await params;
      setResolvedParams(unwrappedParams);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [router, resolvedParams]);

  const fetchData = async () => {
    if (!resolvedParams) return;
    try {
      const categoriesRes = await publicApi.getCategories();
      const category = categoriesRes.data.find(c => c.id === resolvedParams.id);
      if (!category) {
        router.push('/admin/categories');
        return;
      }
      setInitialData(category);
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (categoryData) => {
    if (!resolvedParams) return;
    try {
      console.log('Submitting updated category data:', categoryData);
      console.log(resolvedParams.id);
      await adminApi.updateCategory(resolvedParams.id, {
        ...categoryData,
        slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      });
      console.log('Updated category data:', categoryData);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  if (!resolvedParams || !isAuthenticated || loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-600">Update your category</p>
        </div>
        <CategoryForm 
          onSubmit={handleSubmit}
          submitButtonText="Update Category"
          initialData={initialData}
        />
      </div>
    </AdminLayout>
  );
}
