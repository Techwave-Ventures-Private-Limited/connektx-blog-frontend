'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/adminAuth';
import { publicApi, adminApi } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';

export default function AdminBlogs() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const response = await publicApi.getBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await adminApi.deleteBlog(id);
      fetchBlogs(); // Refresh list
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
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
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">Manage Blogs</h1>
            <p className="text-lg text-blue-600">Create, edit, and manage your blog posts</p>
          </div>
          <Link
            href="/admin/blogs/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg font-semibold text-base transition-all"
          >
            <Plus size={20} />
            Add Blog
          </Link>
        </div>

        {loading ? (
          <LoadingScreen message="Loading blogs..." />
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl border border-blue-50">
            <p className="text-blue-500 text-xl mb-4">No blogs yet</p>
            <Link
              href="/admin/blogs/add"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg font-semibold text-base transition-all"
            >
              Create Your First Blog
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white shadow-2xl rounded-3xl overflow-hidden border border-blue-50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-100">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Created By</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-blue-50 transition">
                        {/* Image thumbnail column */}
                        <td className="px-6 py-4 whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center">
                            <ImagePreview
                              imgUrl={blog.thumbnail}
                              name={blog.title}
                              size="small"
                              shape="rounded-lg"
                              className="shadow border border-gray-200 bg-white"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 w-2/5">
                          <div className="flex items-center">
                            <div className="min-w-0 flex-1">
                              <div className="text-base font-semibold text-blue-900 flex items-center gap-2 truncate">
                                <span className="truncate">{blog.title}</span>
                                {blog.featured && <Star className="text-yellow-500 flex-shrink-0" size={16} />}
                              </div>
                              <div className="text-xs text-gray-400 truncate">{blog.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            blog.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={16} />
                            {blog.count}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {blog.createdBy || 'Admin'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="View Blog"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              href={`/admin/blogs/edit/${blog.id}`}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                              title="Edit Blog"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(blog.id, blog.title)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete Blog"
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
            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-blue-900 truncate">{blog.title}</h3>
                        {blog.featured && <Star className="text-yellow-500 flex-shrink-0" size={16} />}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{blog.slug}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      blog.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Views</span>
                      <div className="flex items-center gap-1 text-blue-900 font-medium">
                        <Eye size={16} />
                        {blog.count}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Created By</span>
                      <span className="text-gray-700 font-medium">{blog.createdBy || 'Admin'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block">Created At</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Actions</span>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Blog"
                      >
                        <Eye size={20} />
                      </Link>
                      <Link
                        href={`/admin/blogs/edit/${blog.id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="Edit Blog"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id, blog.title)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Blog"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
