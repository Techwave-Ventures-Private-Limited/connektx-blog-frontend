'use client';

import { useState, useEffect, useMemo } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { publicApi } from '@/lib/blogApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FileText, FolderOpen, Users, Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    featuredBlogs: 0,
    totalCategories: 0,
    totalViews: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [areaChartData, setAreaChartData] = useState([]);
  const [areaChartRange, setAreaChartRange] = useState('1m'); // 1d, 1w, 1m, 1y

  // Memoized filtered area chart data for selected range
  const filteredAreaChartData = useMemo(() => {
    if (!areaChartData.length) return [];
    const now = new Date();
    let cutoff;
    if (areaChartRange === '1d') {
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (areaChartRange === '1w') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (areaChartRange === '1m') {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (areaChartRange === '1y') {
      cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else {
      cutoff = new Date(0);
    }
    return areaChartData.filter(d => new Date(d.date) >= cutoff);
  }, [areaChartData, areaChartRange]);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        publicApi.getBlogs(),
        publicApi.getCategories(),
      ]);

      const blogs = blogsRes.data;
      const publishedBlogs = blogs.filter(blog => blog.published);
      const featuredBlogs = blogs.filter(blog => blog.featured);
      const totalViews = blogs.reduce((sum, blog) => sum + blog.count, 0);

      setStats({
        totalBlogs: blogs.length,
        publishedBlogs: publishedBlogs.length,
        featuredBlogs: featuredBlogs.length,
        totalCategories: categoriesRes.data.length,
        totalViews,
      });

      // Create chart data for blog views
      const chartData = blogs
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(blog => ({
          name: blog.title.length > 20 ? blog.title.substring(0, 20) + '...' : blog.title,
          views: blog.count
        }));
      setChartData(chartData);

      // Area chart data: all blogs, sorted by createdAt
      const areaChartData = blogs
        .map(blog => ({
          date: blog.createdAt,
          views: blog.count,
          title: blog.title.length > 20 ? blog.title.substring(0, 20) + '...' : blog.title
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setAreaChartData(areaChartData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen py-12 px-2 sm:px-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">Admin Dashboard</h1>
            <p className="text-lg text-blue-600">Welcome to your blog admin panel</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg border border-blue-100">
              <div className="flex items-center">
                <FileText className="text-blue-600 mr-3" size={28} />
                <div>
                  <p className="text-sm text-gray-500">Total Blogs</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalBlogs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg border border-green-100">
              <div className="flex items-center">
                <Users className="text-green-600 mr-3" size={28} />
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-3xl font-bold text-green-800">{stats.publishedBlogs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg border border-purple-100">
              <div className="flex items-center">
                <FolderOpen className="text-purple-600 mr-3" size={28} />
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="text-3xl font-bold text-purple-800">{stats.totalCategories}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg border border-orange-100">
              <div className="flex items-center">
                <Eye className="text-orange-600 mr-3" size={28} />
                <div>
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-3xl font-bold text-orange-700">{stats.totalViews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-100 pt-10">
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Top 5 Most Viewed Blogs</h3>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-blue-800">All Blogs: Views Over Time</h3>
              <div className="flex gap-2 text-xs font-semibold">
                <button
                  className={`px-3 py-1 rounded ${areaChartRange === '1d' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                  onClick={() => setAreaChartRange('1d')}
                >1 Day</button>
                <button
                  className={`px-3 py-1 rounded ${areaChartRange === '1w' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                  onClick={() => setAreaChartRange('1w')}
                >1 Week</button>
                <button
                  className={`px-3 py-1 rounded ${areaChartRange === '1m' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                  onClick={() => setAreaChartRange('1m')}
                >1 Month</button>
                <button
                  className={`px-3 py-1 rounded ${areaChartRange === '1y' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                  onClick={() => setAreaChartRange('1y')}
                >1 Year</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredAreaChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const { title, views, date } = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded shadow text-xs">
                            <div className="font-bold text-blue-700 mb-1">{title}</div>
                            <div>Date: <span className="font-semibold">{new Date(date).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })}</span></div>
                            <div>Views: <span className="font-semibold">{views}</span></div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Area type="monotone" dataKey="views" stroke="#3B82F6" fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
