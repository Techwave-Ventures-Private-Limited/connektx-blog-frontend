'use client';

import { useState, useEffect } from 'react';
import { paymentApi } from '@/lib/paymentApi';
import { Crown, Check, Loader2, Clock, X, ArrowRight, User, Briefcase } from 'lucide-react';

export default function SubscriptionPage() {
  const [activePlan, setActivePlan] = useState(null);
  const [trialStatus, setTrialStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const activePlanRes = await paymentApi.getActivePlan();
      setActivePlan(activePlanRes.activePlan);

      // Load trial status if there's an active subscription
      if (activePlanRes.activePlan) {
        try {
          const trialRes = await paymentApi.getTrialStatus();
          setTrialStatus(trialRes.trialStatus);
        } catch (err) {
          console.log('No trial info available');
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await paymentApi.cancelSubscription();
      setShowCancelModal(false);
      loadData();
      alert('Subscription cancelled successfully');
    } catch (error) {
      console.error('Cancel failed:', error);
      alert(error.response?.data?.message || 'Failed to cancel subscription');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If user has active subscription, show subscription details view
  if (activePlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscription</h1>
            <p className="text-gray-600">Manage your current subscription and billing</p>
          </div>

          {/* Current Subscription Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Current Plan</p>
                  <h2 className="text-3xl font-bold">{activePlan.planId?.name}</h2>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                activePlan.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {activePlan.status === 'active' ? '✓ Active' : activePlan.status}
              </span>
            </div>

            {/* Plan Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Valid Until</p>
                <p className="text-xl font-bold">{formatDate(activePlan.endDate)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Next Billing</p>
                <p className="text-xl font-bold">
                  {activePlan.nextBillingDate ? formatDate(activePlan.nextBillingDate) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Trial Status */}
            {trialStatus?.isInTrial && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <p className="font-semibold">Trial Period Active</p>
                </div>
                <p className="text-blue-100 text-sm">
                  {trialStatus.daysRemaining} days remaining • Next charge: ₹{trialStatus.nextBillingAmount} on {formatDate(trialStatus.nextBillingDate)}
                </p>
              </div>
            )}

            {/* Auto-renewal Status */}
            {activePlan.isAutoRenew && (
              <div className="flex items-center gap-2 text-green-200">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">Auto-renewal enabled</span>
              </div>
            )}
          </div>

          {/* Plan Features */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {activePlan.planId?.features?.map((feature) => (
                <div key={feature._id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">{feature.key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Options */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upgrade Your Plan</h3>
            <p className="text-gray-600 mb-6">
              Explore more plans to get additional features and benefits
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="/subscription/personal"
                className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Personal Plans</p>
                    <p className="text-sm text-gray-600">For individuals</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
              </a>

              <a
                href="/subscription/business"
                className="flex items-center justify-between p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Business Plans</p>
                    <p className="text-sm text-gray-600">For teams</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              <X className="w-5 h-5" />
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Cancel Subscription</h3>
                <button onClick={() => setShowCancelModal(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features immediately.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // No active subscription - show plan category selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the plan category that fits your needs
          </p>
        </div>

        {/* Plan Category Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Personal Plans Card */}
          <a
            href="/subscription/personal"
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Personal</h2>
              <p className="text-blue-100">For individual professionals</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Perfect for solo users</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Grow your network</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Access premium features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Trial periods available</span>
                </li>
              </ul>
              <div className="flex items-center justify-between text-blue-600 font-semibold group-hover:text-blue-700">
                <span>View Personal Plans</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
              </div>
            </div>
          </a>

          {/* Business Plans Card */}
          <a
            href="/subscription/business"
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
          >
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Business</h2>
              <p className="text-purple-100">For teams and organizations</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Team collaboration</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Custom solutions</span>
                </li>
              </ul>
              <div className="flex items-center justify-between text-purple-600 font-semibold group-hover:text-purple-700">
                <span>View Business Plans</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
              </div>
            </div>
          </a>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Not sure which plan is right for you?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
              Compare all plans
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
