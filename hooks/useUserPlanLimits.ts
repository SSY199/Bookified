"use client";

import { useAuth } from "@clerk/nextjs";
import { PLAN_LIMITS } from "@/lib/subscription-constants";
import { tierFromClerkHas } from "@/lib/billing-entitlements";

export function useUserPlanLimits() {
  const { has, isLoaded } = useAuth();
  const tier = tierFromClerkHas(
    has as (p: Record<string, unknown>) => boolean,
    isLoaded,
  );

  return {
    tier,
    limits: PLAN_LIMITS[tier],
    isLoaded,
  };
}
