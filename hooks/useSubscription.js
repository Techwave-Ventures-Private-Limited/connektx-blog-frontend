import { useState, useEffect, useCallback } from 'react';
import { paymentApi } from '@/lib/paymentApi';

/**
 * Custom hook for managing subscription state
 * Similar to mobile app's subscription-store.ts
 */
export function useSubscription() {
  const [activePlan, setActivePlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialStatus, setTrialStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load active subscription
  const loadSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentApi.getActivePlan();
      const plan = response.activePlan;

      setActivePlan(plan);
      setIsSubscribed(!!plan);

      // Load trial status if subscription exists
      if (plan) {
        try {
          const trialRes = await paymentApi.getTrialStatus();
          setTrialStatus(trialRes.trialStatus);
        } catch (err) {
          // Trial status might not exist for all subscriptions
          setTrialStatus(null);
        }
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setError(err.response?.data?.message || 'Failed to load subscription');
      setActivePlan(null);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear subscription state
  const clearSubscription = useCallback(() => {
    setActivePlan(null);
    setIsSubscribed(false);
    setTrialStatus(null);
  }, []);

  // Check if user has a specific feature
  const hasFeature = useCallback((featureKey) => {
    if (!activePlan || !activePlan.planId) return false;

    const features = activePlan.planId.features || [];
    const feature = features.find(f => f.key === featureKey);

    return feature?.value === true;
  }, [activePlan]);

  // Check if subscription is expired
  const isExpired = useCallback(() => {
    if (!activePlan) return true;

    const endDate = new Date(activePlan.endDate);
    return endDate < new Date();
  }, [activePlan]);

  // Get days remaining
  const daysRemaining = useCallback(() => {
    if (!activePlan) return 0;

    const endDate = new Date(activePlan.endDate);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }, [activePlan]);

  // Check if in trial period
  const isInTrial = useCallback(() => {
    return trialStatus?.isInTrial || activePlan?.isInTrial || false;
  }, [trialStatus, activePlan]);

  // Get trial days remaining
  const trialDaysRemaining = useCallback(() => {
    return trialStatus?.daysRemaining || 0;
  }, [trialStatus]);

  // Subscribe to a plan
  const subscribe = useCallback(async (planId, enableTrial = true) => {
    try {
      const response = await paymentApi.createSubscription(planId, enableTrial);

      if (response.subscription?.shortUrl) {
        // Return the payment URL for the caller to handle
        return response.subscription;
      }

      throw new Error('No payment URL received');
    } catch (err) {
      console.error('Subscription failed:', err);
      throw err;
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    try {
      await paymentApi.cancelSubscription();
      await loadSubscription(); // Reload to get updated state
      return true;
    } catch (err) {
      console.error('Cancel failed:', err);
      throw err;
    }
  }, [loadSubscription]);

  // Enable autopay
  const enableAutopay = useCallback(async (paymentMethodId) => {
    try {
      await paymentApi.enableAutopay(paymentMethodId);
      await loadSubscription(); // Reload to get updated state
      return true;
    } catch (err) {
      console.error('Enable autopay failed:', err);
      throw err;
    }
  }, [loadSubscription]);

  // Disable autopay
  const disableAutopay = useCallback(async () => {
    try {
      await paymentApi.disableAutopay();
      await loadSubscription(); // Reload to get updated state
      return true;
    } catch (err) {
      console.error('Disable autopay failed:', err);
      throw err;
    }
  }, [loadSubscription]);

  // Load subscription on mount
  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  return {
    // State
    activePlan,
    isSubscribed,
    trialStatus,
    loading,
    error,

    // Computed values
    hasFeature,
    isExpired,
    daysRemaining,
    isInTrial,
    trialDaysRemaining,

    // Actions
    loadSubscription,
    clearSubscription,
    subscribe,
    cancelSubscription,
    enableAutopay,
    disableAutopay,
  };
}
