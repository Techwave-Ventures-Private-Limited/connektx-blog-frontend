'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Crown } from 'lucide-react';

/**
 * Feature Gate Component
 * Wraps features that require subscription
 * Shows upgrade prompt if user doesn't have access
 */

// Map features to their plan types
const FEATURE_PLAN_TYPE = {
  // Personal plan features
  job_applications: 'personal',
  advanced_job_search: 'personal',
  unlimited_job_browsing: 'personal',
  user_search: 'personal',

  // Business plan features (add as needed)
  company_profile: 'business',
  analytics: 'business',
  job_posting: 'business',
};

export default function FeatureGate({
  featureKey,
  children,
  fallback = null,
  showUpgradePrompt = true
}) {
  const { hasFeature, loading, isSubscribed, isExpired } = useSubscription();

  // While loading, show children (optimistic)
  if (loading) {
    return <>{children}</>;
  }

  // Check if user has the feature OR is subscribed and not expired (fallback for missing feature keys)
  const hasAccess = hasFeature(featureKey) || (isSubscribed && !isExpired());

  if (hasAccess) {
    return <>{children}</>;
  }

  // If no access, show fallback or upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  // Determine redirect URL based on feature type
  const planType = FEATURE_PLAN_TYPE[featureKey] || 'personal';
  const redirectUrl = planType === 'business'
    ? '/subscription/business'
    : '/subscription/personal';

  // Default upgrade prompt
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none opacity-50">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <a
          href={redirectUrl}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 text-sm font-bold hover:scale-105 transition-transform"
        >
          <Crown className="w-4 h-4" />
          Upgrade to {planType === 'business' ? 'Business' : 'Premium'}
        </a>
      </div>
    </div>
  );
}
