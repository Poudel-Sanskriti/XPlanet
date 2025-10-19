'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlanetaryNavigator } from '@/components/PlanetaryNavigator';
import { hasCompletedOnboarding } from '@/lib/userData';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    if (!hasCompletedOnboarding()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <PlanetaryNavigator />;
}
