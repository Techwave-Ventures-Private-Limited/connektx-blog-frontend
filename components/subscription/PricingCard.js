'use client';

import { Check, Crown, Loader2 } from 'lucide-react';

/**
 * Reusable pricing card component
 * Can be used on landing pages, modals, or anywhere you need to show plans
 */
export default function PricingCard({
  plan,
  isActive = false,
  isProcessing = false,
  onSubscribe,
  showFeatures = true,
  compact = false,
}) {
  if (!plan) return null;

  const {
    _id,
    name,
    description,
    price,
    currency = 'INR',
    durationInDays,
    features = [],
    hasTrialPeriod,
    trialPeriodDays,
    trialAmount,
    isActive: planIsActive,
  } = plan;

  const handleSubscribe = () => {
    if (onSubscribe && !isActive && !isProcessing) {
      onSubscribe(_id);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300
        ${isActive ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-102'}
        ${compact ? 'max-w-sm' : ''}
      `}
    >
      {/* Header */}
      <div
        className={`
          p-6
          ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold">{name}</h3>
          {isActive && <Crown className="w-6 h-6" />}
        </div>
        {description && (
          <p
            className={`text-sm ${
              isActive ? 'text-blue-100' : 'text-gray-600'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Pricing */}
      <div className="p-6 border-b">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold">
            {currency === 'INR' ? '₹' : currency}
            {price}
          </span>
          <span className="text-gray-500">
            / {durationInDays} days
          </span>
        </div>

        {hasTrialPeriod && !isActive && (
          <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
            🎁 {trialPeriodDays}-day trial for{' '}
            {currency === 'INR' ? '₹' : currency}
            {trialAmount || 1}
          </div>
        )}
      </div>

      {/* Features */}
      {showFeatures && features.length > 0 && (
        <div className={`p-6 ${compact ? 'max-h-48 overflow-y-auto' : ''}`}>
          <h4 className="font-semibold text-gray-900 mb-3">
            {compact ? 'Includes:' : 'What\'s included:'}
          </h4>
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature._id} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">
                  {feature.key || feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Button */}
      <div className="p-6 pt-0">
        {isActive ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : !planIsActive ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Not Available
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
