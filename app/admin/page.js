"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { auth } from '@/lib/adminAuth';
import LoadingScreen from '@/components/LoadingScreen';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import { Calendar, Users, Briefcase, FileText, ArrowUpRight } from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE = `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/analytics`;

// --- HELPER: Transform Backend Data for Recharts ---
const processChartData = (seriesList) => {
  if (!seriesList || seriesList.length === 0) return [];

  const dataMap = {};

  seriesList.forEach((series) => {
    series.data.forEach((point) => {
      const dateLabel = point.label;
      if (!dataMap[dateLabel]) {
        dataMap[dateLabel] = { name: dateLabel };
      }
      dataMap[dateLabel][series.name] = point.count;
    });
  });

  return Object.values(dataMap).sort((a, b) =>
    new Date(a.name).getTime() - new Date(b.name).getTime()
  );
};

// --- COMPONENTS ---

const KPICard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between">
    <div>
      <p className="text-black text-sm font-semibold mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-black">{value ?? "-"}</h3>
    </div>
    <div className={`p-4 rounded-full bg-opacity-10 ${color}`}>
      <Icon size={28} className={color.replace('bg-', 'text-')} />
    </div>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col h-[400px]">
    <h3 className="text-lg font-bold text-black mb-4">{title}</h3>
    <div className="flex-1 w-full min-h-0 text-xs">
      {children}
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function AdminAnalytics() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [interval, setIntervalState] = useState('daily');
  const [dates, setDates] = useState({
    start: "",
    end: ""
  });

  // Check authentication
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  // Hydration fix: Set dates only after mount
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    setDates({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  }, []);

  const [data, setData] = useState({ users: null, jobs: null, posts: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dates.start) return;

    const fetchData = async () => {
      setLoading(true);
      const query = `?start_date=${dates.start}&end_date=${dates.end}&interval=${interval}`;

      try {
        const [usersRes, jobsRes, postsRes] = await Promise.all([
          fetch(`${API_BASE}/users${query}`),
          fetch(`${API_BASE}/jobs${query}`),
          fetch(`${API_BASE}/posts${query}`)
        ]);

        const usersData = await usersRes.json();
        const jobsData = await jobsRes.json();
        const postsData = await postsRes.json();

        // Handle success response format from backend
        setData({
          users: usersData.success ? usersData : null,
          jobs: jobsData.success ? jobsData : null,
          posts: postsData.success ? postsData : null
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setData({ users: null, jobs: null, posts: null });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interval, dates]);

  const userChartData = processChartData(data.users?.charts?.series);
  const jobChartData = processChartData(data.jobs?.charts?.series);
  const postChartData = processChartData(data.posts?.charts?.content_creation);
  const reactionChartData = processChartData(data.posts?.charts?.reactions);

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  if (loading && !data.users) {
    return (
      <AdminLayout>
        <LoadingScreen message="Loading Analytics..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 min-h-screen py-6 px-2 sm:px-0">
        {/* HEADER & FILTERS */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-black mb-2 tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-black font-medium">Real-time platform insights</p>
          </div>

          <div className="flex flex-wrap gap-3 bg-white p-3 rounded-xl border border-gray-300 shadow-md">
            <div className="flex items-center px-3 gap-2 border-r border-gray-300">
              <Calendar size={18} className="text-black" />
              <input
                type="date"
                value={dates.start}
                onChange={(e) => setDates({...dates, start: e.target.value})}
                className="bg-gray-50 text-sm focus:outline-none text-black font-bold w-32 px-2 py-1 rounded border border-gray-300"
              />
              <span className="text-black font-bold">to</span>
              <input
                type="date"
                value={dates.end}
                onChange={(e) => setDates({...dates, end: e.target.value})}
                className="bg-gray-50 text-sm focus:outline-none text-black font-bold w-32 px-2 py-1 rounded border border-gray-300"
              />
            </div>

            <select
              value={interval}
              onChange={(e) => setIntervalState(e.target.value)}
              className="bg-gray-50 text-white text-sm rounded-lg px-3 py-1 focus:outline-none border border-gray-300 font-bold"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </header>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Users"
            value={data.users?.summary?.total_accounts}
            icon={Users}
            color="text-blue-600 bg-blue-600"
          />
          <KPICard
            title="Active Jobs"
            value={data.jobs?.summary?.active_jobs}
            icon={Briefcase}
            color="text-emerald-600 bg-emerald-600"
          />
          <KPICard
            title="Total Posts"
            value={data.posts?.summary?.total_active_posts}
            icon={FileText}
            color="text-violet-600 bg-violet-600"
          />
          <KPICard
            title="Applications"
            value={data.jobs?.summary?.total_applications}
            icon={ArrowUpRight}
            color="text-orange-600 bg-orange-600"
          />
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          {/* GRAPH 1: USERS */}
          <ChartContainer title="User Growth Trends">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6366f1" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6366f1" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e0e7ff', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="Total New Users" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Personal" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="Company" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* GRAPH 2: JOBS */}
          <ChartContainer title="Recruitment Activity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={jobChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6366f1" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6366f1" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e0e7ff', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="Jobs Posted" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Applications Received" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* GRAPH 3: CONTENT */}
          <ChartContainer title="Content Volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6366f1" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6366f1" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e0e7ff', borderRadius: '8px' }} />
                <Bar dataKey="New Posts" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* GRAPH 4: ENGAGEMENT */}
          <ChartContainer title="Engagement & Reactions">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={reactionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6366f1" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6366f1" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e0e7ff', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="Likes Generated" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Comments Generated" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
