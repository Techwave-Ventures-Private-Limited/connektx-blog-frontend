// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { auth } from '@/lib/auth';
// import { adminApi } from '@/lib/api';
// import AdminLayout from '@/components/AdminLayout';
// import { Save } from 'lucide-react';

// export default function AddCategory() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (!auth.isAuthenticated()) {
//       router.push('/admin/login');
//       return;
//     }
//     setIsAuthenticated(true);
//   }, [router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.name.trim()) {
//       alert('Name is required');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await adminApi.createCategory({
//         ...formData,
//         slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
//       });
//       router.push('/admin/categories');
//     } catch (error) {
//       console.error('Error creating category:', error);
//       alert('Failed to create category. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
//           <p className="text-gray-600">Create a new blog category</p>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//               Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter category name"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               id="description"
//               rows={4}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Brief description of the category"
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save size={18} />
//               {isSubmitting ? 'Creating...' : 'Create Category'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi } from '@/lib/blogApi';
import AdminLayout from '@/components/AdminLayout';
import { Save, Image } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';

export default function AddCategory() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imgUrlInput: '', // URL input field (used for preview and submit)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminApi.createCategory({
        name: formData.name,
        description: formData.description,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        imgUrl: formData.imgUrlInput,
      });
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600">Create a new blog category</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the category"
            />
          </div>

          <div>
            <label htmlFor="imgUrlInput" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="text"
              id="imgUrlInput"
              name="imgUrlInput"
              value={formData.imgUrlInput}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL (Google Drive or direct)"
            />
          </div>

          {/* Category Card Preview */}
          {(formData.imgUrlInput || formData.name) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="relative w-full max-w-sm mx-auto">
                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200 shadow">
                  <ImagePreview
                    imgUrl={formData.imgUrlInput}
                    name={formData.name || 'Category Name'}
                    size="full"
                    shape="rounded-2xl"
                    className="transition-transform duration-300"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h3 className="text-white text-2xl font-extrabold text-center px-4 drop-shadow-lg truncate">
                      {formData.name || 'Category Name'}
                    </h3>
                  </div>
                </div>
              </div>
              {/* Current Preview URL Display */}
              {formData.imgUrlInput && (
                <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                  <span className="text-green-600 font-medium">✓ Preview URL: </span>
                  <span className="text-gray-600 break-all">{formData.imgUrlInput}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
