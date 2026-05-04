export const getBillingPeriodStart = () : Date => {

  const now = new Date();
  const billingStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0); // First day of the month at 00:00:00
  return billingStart;
};