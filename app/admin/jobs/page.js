'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/adminAuth';
import { adminApi, handleApiError } from '@/lib/blogApi';
import AdminLayout from '@/components/AdminLayout';
import { Send, AlertCircle, CheckCircle, Plus, Briefcase, MapPin, DollarSign, Edit2, Save, Building2 } from 'lucide-react';

export default function AdminJobs() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'preview', 'saved'
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [companyStatus, setCompanyStatus] = useState(null); // 'saved', 'exists', null
  const [jobStatus, setJobStatus] = useState(null); // 'saved', null

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleExtractJob = async (e) => {
    e.preventDefault();

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

    try {
      console.log('Extracting job from URL:', jobUrl);
      const response = await adminApi.extractJobFromUrl(jobUrl);
      console.log('Extract response:', response.data);

      if (response.data.success) {
        const data = response.data.data;
        // Ensure arrays are initialized
        setExtractedData({
          ...data,
          responsibilities: data.responsibilities || [],
          requirements: data.requirements || [],
          skills: data.skills || [],
          locations: data.locations || []
        });
        setStep('preview');
        setCompanyStatus(null);
        setJobStatus(null);
      } else {
        setError(response.data.message || 'Failed to extract job');
      }
    } catch (err) {
      console.error('Extract error:', err);
      console.error('Error response:', err.response?.data);
      const errorDetails = handleApiError(err, 'Failed to extract job');
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Saving company:', {
        name: extractedData.companyName,
        domain: extractedData.companyDomain
      });
      const response = await adminApi.saveCompany({
        name: extractedData.companyName,
        domain: extractedData.companyDomain
      });
      console.log('Save company response:', response.data);

      if (response.data.success) {
        setCompanyStatus(response.data.isNew ? 'saved' : 'exists');
        setExtractedData({...extractedData, companyId: response.data.companyId});
      } else {
        setError(response.data.message || 'Failed to save company');
      }
    } catch (err) {
      console.error('Save company error:', err);
      console.error('Error response:', err.response?.data);
      const errorDetails = handleApiError(err, 'Failed to save company');
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!extractedData.companyId) {
      setError('Please save the company first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Saving job:', {
        ...extractedData,
        companyId: extractedData.companyId,
        externalApplyLink: jobUrl
      });
      const response = await adminApi.saveJob({
        ...extractedData,
        companyId: extractedData.companyId,
        externalApplyLink: jobUrl
      });
      console.log('Save job response:', response.data);

      if (response.data.success) {
        setJobStatus('saved');
        setStep('saved');
      } else {
        setError(response.data.message || 'Failed to save job');
      }
    } catch (err) {
      console.error('Save job error:', err);
      console.error('Error response:', err.response?.data);
      const errorDetails = handleApiError(err, 'Failed to save job');
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setExtractedData({...extractedData, [field]: value});
  };

  const updateSalaryField = (field, value) => {
    setExtractedData({
      ...extractedData,
      salaryRange: {...extractedData.salaryRange, [field]: value}
    });
  };

  const resetForm = () => {
    setStep('input');
    setJobUrl('');
    setExtractedData(null);
    setError(null);
    setCompanyStatus(null);
    setJobStatus(null);
  };

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 min-h-screen py-8 px-4">

        {/* SECTION 1: Page Title */}
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold text-black mb-2 tracking-tight">
            From URL Extraction
          </h1>
          <p className="text-lg text-black font-medium">Extract job details automatically using AI</p>
        </header>

        {/* SECTION 2: URL Input */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Send size={22} className="text-blue-600" />
            Step 1: Enter Job URL
          </h2>

          <form onSubmit={handleExtractJob} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                placeholder="https://linkedin.com/jobs/view/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                disabled={loading}
                className="flex-1 px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={loading || !jobUrl.trim()}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  loading || !jobUrl.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
                }`}
              >
                <Send size={20} />
                {loading ? 'Extracting...' : 'Extract Details'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={22} />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* SECTION 3: Company Details */}
        {step === 'preview' && extractedData && (
          <>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 size={22} className="text-blue-600" />
                  Step 2: Company Information
                </h2>
                {companyStatus === 'saved' && (
                  <span className="bg-green-500 text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={16} /> Saved
                  </span>
                )}
                {companyStatus === 'exists' && (
                  <span className="bg-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    Already Exists
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3 mb-5">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={22} />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={extractedData.companyName || ''}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 bg-white"
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Company Domain *</label>
                  <input
                    type="text"
                    value={extractedData.companyDomain || ''}
                    onChange={(e) => updateField('companyDomain', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 bg-white"
                    placeholder="example.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveCompany}
                  disabled={loading || companyStatus === 'saved' || companyStatus === 'exists'}
                  className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all ${
                    companyStatus ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  } text-white`}
                >
                  <Building2 size={20} />
                  {loading ? 'Saving...' : companyStatus ? 'Company Saved ✓' : 'Save Company'}
                </button>
              </div>
            </div>

            {/* SECTION 4: Job Details */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase size={22} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Step 3: Job Details</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={extractedData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                    placeholder="e.g. Software Engineer, Product Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Description *</label>
                  <textarea
                    value={extractedData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={Math.max(3, (extractedData.description || '').split('\n').length)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 leading-relaxed bg-white resize-y"
                    placeholder="Brief overview/summary of the role (2-3 paragraphs)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Responsibilities</label>
                  <textarea
                    value={Array.isArray(extractedData.responsibilities)
                      ? extractedData.responsibilities.join('\n')
                      : ''}
                    onChange={(e) => updateField('responsibilities', e.target.value.split('\n'))}
                    onBlur={(e) => {
                      // Remove empty lines only on blur
                      const cleaned = e.target.value.split('\n').filter(r => r.trim());
                      updateField('responsibilities', cleaned);
                    }}
                    rows={Math.max(3, (extractedData.responsibilities || []).length)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 leading-relaxed bg-white resize-y"
                    placeholder="One responsibility per line&#10;- Design and develop APIs&#10;- Collaborate with team members&#10;- Write clean, maintainable code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Requirements</label>
                  <textarea
                    value={Array.isArray(extractedData.requirements)
                      ? extractedData.requirements.join('\n')
                      : ''}
                    onChange={(e) => updateField('requirements', e.target.value.split('\n'))}
                    onBlur={(e) => {
                      // Remove empty lines only on blur
                      const cleaned = e.target.value.split('\n').filter(r => r.trim());
                      updateField('requirements', cleaned);
                    }}
                    rows={Math.max(3, (extractedData.requirements || []).length)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 leading-relaxed bg-white resize-y"
                    placeholder="One requirement per line&#10;- Bachelor's degree in Computer Science&#10;- 3+ years of experience&#10;- Strong communication skills"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Job Type</label>
                    <select
                      value={extractedData.type || 'Full-time'}
                      onChange={(e) => updateField('type', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Work Mode</label>
                    <select
                      value={extractedData.locationType || 'On-site'}
                      onChange={(e) => updateField('locationType', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Experience</label>
                    <select
                      value={extractedData.experienceLevel || 'Entry Level (1-2 years)'}
                      onChange={(e) => updateField('experienceLevel', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Entry Level (1-2 years)">Entry Level (1-2 years)</option>
                      <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
                      <option value="Senior level (5+ years)">Senior level (5+ years)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Locations (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(extractedData.locations) ? extractedData.locations.join(', ') : ''}
                    onChange={(e) => updateField('locations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                    placeholder="Mumbai, Bangalore, Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Skills (comma-separated)</label>
                  <textarea
                    value={Array.isArray(extractedData.skills) ? extractedData.skills.join(', ') : ''}
                    onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 font-medium bg-white resize-y"
                    placeholder="React, Node.js, Python, AWS, MongoDB"
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Salary Range (Optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <input
                        type="number"
                        value={extractedData.salaryRange?.min || ''}
                        onChange={(e) => updateSalaryField('min', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={extractedData.salaryRange?.max || ''}
                        onChange={(e) => updateSalaryField('max', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <select
                        value={extractedData.salaryRange?.currency || 'INR'}
                        onChange={(e) => updateSalaryField('currency', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={extractedData.salaryRange?.period || 'Yearly'}
                        onChange={(e) => updateSalaryField('period', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                      >
                        <option value="Yearly">Yearly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t-2 border-gray-200">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSaveJob}
                  disabled={loading || !companyStatus || jobStatus === 'saved'}
                  className={`px-8 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all ${
                    !companyStatus || jobStatus === 'saved' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 hover:shadow-lg'
                  } text-white`}
                >
                  <Briefcase size={18} />
                  {loading ? 'Saving Job...' : jobStatus === 'saved' ? 'Job Saved ✓' : 'Save Job'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Success */}
        {step === 'saved' && (
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={40} />
              <div>
                <h3 className="text-2xl font-bold text-green-900">Job Added Successfully!</h3>
                <p className="text-green-800 font-medium">The job posting has been saved to the database</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 space-y-3 border border-green-200">
              <h4 className="text-2xl font-bold text-gray-900">{extractedData.title}</h4>
              <div className="flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                <span className="text-lg text-gray-900 font-semibold">{extractedData.companyName}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} />
                Add Another Job
              </button>
            </div>
          </div>
        )}

        {/* Idle State */}
        {step === 'input' && !loading && (
          <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-8 text-center">
            <p className="text-blue-900 text-lg font-medium">
              Paste a job posting URL above and click "Extract Job" to get started
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
