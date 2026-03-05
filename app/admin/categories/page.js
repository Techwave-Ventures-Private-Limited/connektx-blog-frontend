'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import ImagePreview from '@/components/ImagePreview';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/adminAuth';
import { publicApi, adminApi } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await adminApi.deleteCategory(id);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }



  return (
    <AdminLayout>
      <div className="space-y-8 min-h-screen py-12 px-2 sm:px-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">Manage Categories</h1>
            <p className="text-lg text-blue-600">Create and manage blog categories</p>
          </div>
          <Link
            href="/admin/categories/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg font-semibold text-base transition-all"
          >
            <Plus size={20} />
            Add Category
          </Link>
        </div>

        {loading ? (
          <LoadingScreen message="Loading categories..." />
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl border border-blue-50">
            <p className="text-blue-500 text-xl mb-4">No categories yet</p>
            <Link
              href="/admin/categories/add"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg font-semibold text-base transition-all"
            >
              Create Your First Category
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-blue-50">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-blue-50 transition">
                      {/* Image thumbnail column */}
                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <div className="flex items-center justify-center">
                          <ImagePreview
                            imgUrl={category.imgUrl}
                            name={category.name}
                            size="small"
                            shape="rounded-lg"
                            className="shadow border border-gray-200 bg-white"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-semibold text-blue-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-400">{category.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{category.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
