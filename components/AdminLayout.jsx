'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import {
  Home,
  FileText,
  FolderOpen,
  LogOut,
  Menu,
  X,
  BarChart3,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Newspaper
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(['blogs']); // Default: blogs expanded

  const navigation = [
    { name: 'Analytics', href: '/admin', icon: BarChart3 },
    {
      name: 'Blogs',
      icon: FileText,
      items: [
        { name: 'Dashboard', href: '/admin/blogs/dashboard', icon: BarChart3 },
        { name: 'Manage', href: '/admin/blogs', icon: FileText },
        { name: 'Categories', href: '/admin/blogs/categories', icon: FolderOpen },
      ]
    },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  ];

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/admin/login');
  };

  const isActivePage = (href) => {
    // Exact match is always correct
    if (pathname === href) return true;

    // For sub-menu items (like those under Blogs), use exact match only
    // Don't use startsWith for sibling routes
    const knownExactMatchRoutes = [
      '/admin/blogs/dashboard',
      '/admin/blogs/categories'
    ];

    // If current page or href is in known exact match routes, only use exact matching
    if (knownExactMatchRoutes.includes(pathname) || knownExactMatchRoutes.includes(href)) {
      return false;
    }

    // For other routes (like /admin/blogs matching /admin/blogs/add)
    // Use startsWith with trailing slash check
    if (href === '/admin') return false;

    return pathname.startsWith(href + '/');
  };

  return (
  <div className="h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100" style={{ fontFamily: 'Inter, Nunito Sans, Lato, sans-serif' }}>
      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 border-r border-blue-900 shadow-xl flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `} style={{height: '100vh'}}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-blue-800">
          <Link href="/" className="text-xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Admin
          </Link>
          <button
            className="lg:hidden p-2 text-white hover:bg-blue-800 rounded"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.name.toLowerCase());
            const hasSubItems = item.items && item.items.length > 0;

            return (
              <div key={item.name}>
                {/* Parent Item */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.name.toLowerCase())}
                    className="flex items-center justify-between w-full px-4 py-2 text-base font-semibold rounded-lg transition-colors text-blue-100 hover:bg-blue-800 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-2 text-base font-semibold rounded-lg transition-colors
                      ${isActivePage(item.href)
                        ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}

                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`
                            flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                            ${isActivePage(subItem.href)
                              ? 'bg-blue-700 text-white shadow-md'
                              : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                            }
                          `}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <SubIcon className="mr-3 h-4 w-4" />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        {/* Logout */}
        <div className="p-4 border-t border-blue-800 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-base font-semibold text-red-400 rounded-lg hover:bg-blue-800 hover:text-red-200 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-blue-900 border border-blue-800 rounded shadow text-white hover:bg-blue-800"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col items-stretch">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          {children}
        </div>
      </main>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
