import "server-only";

import { auth } from "@clerk/nextjs/server";
import { PLAN_LIMITS, type PlanTier } from "./subscription-constants";
import { tierFromClerkHas } from "./billing-entitlements";

export async function getUserPlanTier(): Promise<PlanTier> {
  const { has } = await auth();
  return tierFromClerkHas(has as (p: Record<string, unknown>) => boolean, true);
}

export async function getPlanLimits() {
  const tier = await getUserPlanTier();
  return PLAN_LIMITS[tier];
}
