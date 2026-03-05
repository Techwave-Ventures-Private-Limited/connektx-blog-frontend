// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { auth } from '@/lib/auth';
// import { adminApi, publicApi } from '@/lib/api';
// import AdminLayout from '@/components/AdminLayout';
// import BlogForm from '@/components/BlogForm';

// export default function EditBlog({ params }) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [initialData, setInitialData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!auth.isAuthenticated()) {
//       router.push('/admin/login');
//       return;
//     }
//     setIsAuthenticated(true);
//     fetchData();
//   }, [router, params.id]);

//   const fetchData = async () => {
//     try {
//       const [blogsRes, categoriesRes] = await Promise.all([
//         publicApi.getBlogs(),
//         publicApi.getCategories(),
//       ]);

//       const blog = blogsRes.data.find(b => b.id === params.id);
//       if (!blog) {
//         router.push('/admin/blogs');
//         return;
//       }

//       setInitialData(blog);
//       setCategories(categoriesRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       router.push('/admin/blogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (blogData) => {
//     try {
//       await adminApi.updateBlog(params.id, {
//         ...blogData,
//         slug: blogData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
//       });
//       router.push('/admin/blogs');
//     } catch (error) {
//       console.error('Error updating blog:', error);
//       throw error;
//     }
//   };

//   if (!isAuthenticated || loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
//           <p className="text-gray-600">Update your blog post</p>
//         </div>

//         <BlogForm 
//           categories={categories}
//           onSubmit={handleSubmit}
//           submitButtonText="Update Blog"
//           initialData={initialData}
//         />
//       </div>
//     </AdminLayout>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi, publicApi } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import BlogForm from '@/components/BlogForm';

export default function EditBlog({ params }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
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
      const [blogsRes, categoriesRes] = await Promise.all([
        publicApi.getBlogs(),
        publicApi.getCategories(),
      ]);

      const blog = blogsRes.data.find(b => b.id === resolvedParams.id);
      if (!blog) {
        router.push('/admin/blogs');
        return;
      }

      setInitialData(blog);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (blogData) => {
    if (!resolvedParams) return;

    try {
      await adminApi.updateBlog(resolvedParams.id, {
        ...blogData,
        slug: blogData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      });
      router.push('/admin/blogs');
    } catch (error) {
      console.log('Error updating blog:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-gray-600">Update your blog post</p>
        </div>

        <BlogForm 
          categories={categories}
          onSubmit={handleSubmit}
          submitButtonText="Update Blog"
          initialData={initialData}
        />
      </div>
    </AdminLayout>
  );
}
