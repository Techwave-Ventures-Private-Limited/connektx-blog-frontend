import fs from 'fs';
import path from 'path';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // 1. AUTOMATICALLY GET STATIC ROUTES
  // This looks at your 'app' folder and finds every 'page.tsx' or 'page.js'
  const getStaticRoutes = () => {
    const appDirectory = path.join(process.cwd(), 'app');
    const files = fs.readdirSync(appDirectory, { recursive: true });
    
    return files
      .filter(file => file.endsWith('page.tsx') || file.endsWith('page.js'))
      .map(file => {
        // Remove 'page.tsx' and handle the root directory
        let route = file.replace(/\\/g, '/').replace(/\/page\.(tsx|js)$/, '').replace(/^page\.(tsx|js)$/, '');
        
        // Filter out dynamic routes (folders with [brackets]) and admin routes
        if (route.includes('[') || route.startsWith('admin') || route.includes('api')) {
          return null;
        }
        
        return {
          url: `${baseUrl}${route.startsWith('/') ? route : '/' + route}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        };
      })
      .filter(Boolean); // Remove null entries
  };

  // 2. GET DYNAMIC BLOG ROUTES
  let blogEntries = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/published`);
    if (response.ok) {
      const blogs = await response.json();
      blogEntries = blogs.map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Sitemap dynamic fetch failed:", error);
  }

  return [...getStaticRoutes(), ...blogEntries];
}