'use client';

import { useState, useEffect } from 'react';
import { paymentApi } from '@/lib/paymentApi';
import { Briefcase, Loader2 } from 'lucide-react';
import PricingCard from '@/components/subscription/PricingCard';

export default function BusinessPlansPage() {
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

      // Filter for business plans only
      const businessPlans = (plansRes.plans || []).filter(
        plan => plan.category?.toLowerCase() === 'business'
      );

      setPlans(businessPlans);
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
          theme: { color: '#9333ea' },
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Plans
          </h1>
          <p className="text-xl text-gray-600">
            Built for teams and organizations scaling their network
          </p>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No business plans available at the moment.</p>
            <a
              href="/subscription/personal"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View Personal Plans →
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

        {/* Link to Personal Plans */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">For individual professionals?</p>
          <a
            href="/subscription/personal"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            View Personal Plans →
          </a>
        </div>
      </div>
    </div>
  );
}
