export const getBillingPeriodStart = () : Date => {

  const now = new Date();
  const billingStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0); // First day of the month at 00:00:00
  return billingStart;
};

export type PlanTier = 'free' | 'standard' | 'pro';

export const PLAN_LIMITS = {
  free: {
    maxBooks: 10,
    maxSessionsPerMonth: 5,
    maxMinutesPerSession: 5,
    hasSessionHistory: false,
  },
  standard: {
    maxBooks: 10,
    maxSessionsPerMonth: 100,
    maxMinutesPerSession: 15,
    hasSessionHistory: true,
  },
  pro: {
    maxBooks: 100,
    maxSessionsPerMonth: Infinity, // Use Infinity for unlimited
    maxMinutesPerSession: 60,
    hasSessionHistory: true,
  },
};