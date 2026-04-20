'use client';

import { useState, useEffect } from 'react';
import { paymentApi } from '@/lib/paymentApi';
import { User, Loader2 } from 'lucide-react';
import PricingCard from '@/components/subscription/PricingCard';

export default function PersonalPlansPage() {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, activePlanRes] = await Promise.all([
        paymentApi.getAllPlans(),
        paymentApi.getActivePlan(),
      ]);

      // Filter for personal plans only
      const personalPlans = (plansRes.plans || []).filter(
        plan => plan.category?.toLowerCase() === 'personal'
      );

      setPlans(personalPlans);
      setActivePlan(activePlanRes.activePlan);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setProcessingPlanId(planId);
      const response = await paymentApi.createSubscription(planId, true);

      if (response.subscription) {
        const options = {
          key: response.subscription.key,
          subscription_id: response.subscription.subscriptionId,
          name: 'ConnektX',
          description: 'Subscription Payment',
          theme: { color: '#3b82f6' },
          callback_url: `${window.location.origin}/subscription`,
          redirect: true,
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      alert(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <a
          href="/subscription"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          ← Back to Subscription
        </a>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personal Plans
          </h1>
          <p className="text-xl text-gray-600">
            Perfect for individuals looking to grow their professional network
          </p>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No personal plans available at the moment.</p>
            <a
              href="/subscription/business"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View Business Plans →
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan._id}
                plan={plan}
                isActive={activePlan?.planId?._id === plan._id}
                isProcessing={processingPlanId === plan._id}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}

        {/* Link to Business Plans */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Looking for team features?</p>
          <a
            href="/subscription/business"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            View Business Plans →
          </a>
        </div>
      </div>
    </div>
  );
}
