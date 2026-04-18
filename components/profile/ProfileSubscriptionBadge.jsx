'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Crown } from 'lucide-react';

export default function ProfileSubscriptionBadge() {
  const { isSubscribed } = useSubscription();

  if (!isSubscribed) return null;

  return (
    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0D1B2A] border-[1.5px] border-[#FFD700] shadow-lg shadow-yellow-500/35 flex items-center justify-center">
      <Crown className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
    </div>
  );
}
