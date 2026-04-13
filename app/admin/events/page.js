'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi, handleApiError } from '@/lib/blogApi';
import AdminLayout from '@/components/AdminLayout';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminEvents() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleUpdateEvents = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowErrors(false);

    try {
      const response = await adminApi.updateEvents();
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message || 'Failed to update events');
      }
    } catch (err) {
      const errorDetails = handleApiError(err, 'Failed to update events');
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
              Update Events
            </h1>
            <p className="text-lg text-blue-600">
              Scrape and add latest events from StartupNews.fyi
            </p>
          </div>
          <button
            onClick={handleUpdateEvents}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all shadow-lg ${
              loading
                ? 'bg-blue-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
            }`}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Scraping...' : 'Update Events'}
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-50">
          <h2 className="text-xl font-bold text-blue-900 mb-3">How it works</h2>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">1.</span>
              <span>Click the "Update Events" button to start scraping</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">2.</span>
              <span>The system fetches latest events from StartupNews.fyi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">3.</span>
              <span>New events are automatically added to the database</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">4.</span>
              <span>Duplicate events are automatically skipped</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">⏱️</span>
              <span className="text-blue-600 text-sm">This process may take 1-2 minutes. Please don't refresh the page.</span>
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 flex gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Results */}
        {result && (
          <div className="space-y-4">
            {/* Stats Card */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-600" size={28} />
                <h3 className="text-xl font-bold text-green-900">Scraping Completed Successfully</h3>
              </div>
              <p className="text-green-700 mb-6">{result.message}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-green-100">
                  <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Total Found</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{result.stats.totalFound}</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-green-100">
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Newly Inserted</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{result.stats.newlyInserted}</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-green-100">
                  <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wide">Duplicates Skipped</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">{result.stats.duplicatesSkipped}</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-green-100">
                  <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">Errors</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">{result.stats.errors.length}</p>
                </div>
              </div>
            </div>

            {/* Errors List */}
            {result.stats.errors.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6">
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="flex items-center justify-between w-full mb-4 hover:opacity-70 transition-opacity"
                >
                  <h3 className="text-lg font-bold text-yellow-900">
                    Errors ({result.stats.errors.length})
                  </h3>
                  <span className={`transition-transform ${showErrors ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {showErrors && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.stats.errors.map((err, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-yellow-100 text-sm">
                        {err.url && (
                          <p className="text-blue-600 font-mono text-xs mb-1 truncate">
                            {err.url}
                          </p>
                        )}
                        <p className="text-yellow-800">{err.error || err}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Idle State Message */}
        {!result && !error && !loading && (
          <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-8 text-center">
            <p className="text-blue-700 text-lg">
              Click the "Update Events" button above to start scraping events
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
