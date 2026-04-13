'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi, handleApiError } from '@/lib/blogApi';
import AdminLayout from '@/components/AdminLayout';
import { Send, AlertCircle, CheckCircle, Plus, Briefcase, MapPin, Users, DollarSign } from 'lucide-react';

export default function AdminJobs() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleAddJob = async (e) => {
    e.preventDefault();

    // Validate URL
    if (!jobUrl.trim()) {
      setError('Please enter a job URL');
      return;
    }

    if (!jobUrl.startsWith('http://') && !jobUrl.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await adminApi.addJobFromUrl(jobUrl);
      if (response.data.success) {
        setResult(response.data);
        setJobUrl(''); // Clear input on success
      } else {
        setError(response.data.message || 'Failed to add job');
      }
    } catch (err) {
      const errorDetails = handleApiError(err, 'Failed to add job');
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <div className="space-y-8 min-h-screen py-12 px-2 sm:px-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">
              Add Job from URL
            </h1>
            <p className="text-lg text-blue-600">
              Extract job details from a posting and add to database
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-50">
          <h2 className="text-xl font-bold text-blue-900 mb-3">Supported Job Boards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-700">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span> LinkedIn
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span> Naukri
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span> Company Careers Pages
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span> Indeed & Other Job Boards
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddJob} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="url"
              placeholder="Paste job posting URL here (e.g., https://linkedin.com/jobs/...)"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none font-medium text-blue-900 placeholder-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="submit"
              disabled={loading || !jobUrl.trim()}
              className={`px-8 py-3 rounded-xl font-semibold text-base transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${
                loading || !jobUrl.trim()
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
              }`}
            >
              <Send size={20} />
              {loading ? 'Extracting...' : 'Add Job'}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </form>

        {/* Success Result */}
        {result && (
          <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h3 className="text-2xl font-bold text-green-900">Job Added Successfully!</h3>
                <p className="text-green-700">{result.message}</p>
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-white rounded-2xl p-6 space-y-4 border border-green-100">
              {/* Title and Company */}
              <div>
                <h4 className="text-2xl font-bold text-blue-900">{result.data.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Briefcase size={18} className="text-blue-600" />
                  <span className="text-lg text-blue-600 font-semibold">
                    {result.data.company.name}
                  </span>
                  {result.data.company.isNewlyCreated && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                      Newly Created
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 font-mono">
                  Domain: {result.data.company.domain}
                </p>
              </div>

              {/* Description Preview */}
              <div>
                <h5 className="font-bold text-blue-900 mb-2">Description Preview</h5>
                <p className="text-gray-700 text-sm line-clamp-3">{result.data.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                {/* Locations */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-blue-600" />
                    <h5 className="font-bold text-blue-900">Locations</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.data.locations.map((loc, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Type & Location Type */}
                <div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Job Type</p>
                      <p className="font-bold text-blue-900">{result.data.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Work Mode</p>
                      <p className="font-bold text-blue-900">{result.data.locationType}</p>
                    </div>
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Experience Level</p>
                  <p className="font-bold text-blue-900">{result.data.experienceLevel}</p>
                </div>

                {/* Salary */}
                {(result.data.salaryRange?.min || result.data.salaryRange?.max) && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign size={18} className="text-green-600" />
                      <p className="text-sm text-gray-600 font-semibold">Salary</p>
                    </div>
                    <p className="font-bold text-green-900">
                      {result.data.salaryRange.currency}{' '}
                      {result.data.salaryRange.min || 'N/A'} -
                      {result.data.salaryRange.max || 'N/A'} {result.data.salaryRange.period}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {result.data.skills.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-bold text-blue-900 mb-3">Required Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.data.skills.map((skill, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add Another Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setResult(null);
                  setJobUrl('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} />
                Add Another Job
              </button>
            </div>
          </div>
        )}

        {/* Idle State */}
        {!result && !loading && (
          <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-8 text-center">
            <p className="text-blue-700 text-lg">
              Paste a job posting URL above and click "Add Job" to extract details using AI
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
