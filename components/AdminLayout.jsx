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
  Briefcase
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  ];

  const handleLogout = () => {
    auth.logout();
    router.push('/admin/login');
  };

  const isActivePage = (href) => {
    return pathname === href || (href !== '/admin' && pathname.startsWith(href));
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
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
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
