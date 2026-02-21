import { publicApi } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import FeaturedSection from '@/components/FeaturedSection';
import CategoryCard from '@/components/CategoryCard';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'Blog Platform - Latest Articles and Stories',
  description: 'Discover the latest articles, insights, and stories from our expert writers.',
  keywords: 'blog, articles, stories, insights, latest news',
  openGraph: {
    title: 'Blog Platform - Latest Articles and Stories',
    description: 'Discover the latest articles, insights, and stories from our expert writers.',
    type: 'website',
  },
};

async function getHomePageData() {
  try {
    const [blogsRes, featuredRes, categoriesRes] = await Promise.all([
      publicApi.getPublishedBlogs(),
      publicApi.getFeaturedBlogs(),
      publicApi.getCategories(),
    ]);

    return {
      blogs: blogsRes.data.slice(0, 6), // Latest 6 blogs
      featuredBlogs: featuredRes.data.slice(0, 3), // Top 3 featured
      categories: categoriesRes.data,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { blogs: [], featuredBlogs: [], categories: [] };
  }
}

export default async function HomePage() {
  const { blogs, featuredBlogs, categories } = await getHomePageData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
  <Header />

      <main>
        {/* Featured Blogs Section */}
        <section className="relative py-14 mb-8 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 rounded-b-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="0.3" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,133.3C672,107,768,85,864,101.3C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg tracking-tight mb-10 animate-fadein">Featured Blogs</h2>
          <FeaturedSection blogs={featuredBlogs} />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="my-12 border-t border-blue-100" />
        </div>

        {/* Categories Section (same layout as Latest Blogs) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fadein">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-blue-700 tracking-tight">Explore Categories</h2>
            <Link href="/categories" className="text-blue-600 hover:text-blue-800 font-medium">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.slice(0, 3).map((category, idx) => (
              <div key={category.id} className={`animate-fadein ${idx % 2 === 0 ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ animationDelay: `${idx * 0.1 + 0.1}s` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="my-12 border-t border-blue-100" />
        </div>

        {/* Latest Blogs Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-blue-700 tracking-tight">Latest Blogs</h2>
            <Link
              href="/blogs"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, idx) => (
              <div key={blog.id} className={`animate-fadein ${idx % 2 === 0 ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ animationDelay: `${idx * 0.1 + 0.1}s` }}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
