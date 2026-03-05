import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/blogApi';
import Link from 'next/link';
import Header from '@/components/Header';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }) {
  try {
    const response = await publicApi.getBlogBySlug(params.slug);
    const blog = response.data;
    
    return {
      title: blog.title,
      description: blog.excerpt,
      keywords: blog.title.split(' ').join(', '),
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        type: 'article',
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt,
      },
    };
  } catch (error) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

async function getBlog(slug) {
  try {
    const response = await publicApi.getBlogBySlug(slug);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <article className="w-[80vw] max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <Link 
              href="/blogs" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Blogs
            </Link>

            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
              
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span>{blog.count} views</span>
                </div>
                {blog.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              
              {blog.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed">{blog.excerpt}</p>
              )}
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
