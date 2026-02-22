import { publicApi } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'All Blogs',
  description: 'Browse all published articles and blog posts.',
};

async function getBlogs() {
  try {
    const response = await publicApi.getPublishedBlogs();
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
  <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight text-blue-900">
            All Blogs
          </h1>
          <p className="text-xl text-blue-700 font-medium">
            Discover all our published articles and stories
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-2xl border border-blue-50 max-w-xl mx-auto">
            <p className="text-blue-500 text-2xl mb-4">No blogs published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
