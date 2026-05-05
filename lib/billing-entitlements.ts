import type { PlanTier } from "./subscription-constants";

/** Clerk Billing entitlements — `has` cast until typings include billing claims. */
export function tierFromClerkHas(
  has: (params: Record<string, unknown>) => boolean,
  isLoaded: boolean,
): PlanTier {
  if (!isLoaded) return "free";
  if (has({ entitlement: "pro" })) return "pro";
  if (has({ entitlement: "standard" })) return "standard";
  return "free";
}
