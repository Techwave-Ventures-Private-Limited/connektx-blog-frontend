import { appInstance } from './appApi';

// ============================================
// PAYMENT & SUBSCRIPTION API
// ============================================
// This API handles:
// - Plans & Features
// - Subscriptions (with trial periods)
// - One-time purchases
// - Autopay management
// - Payment methods
// ============================================

export const paymentApi = {

  // -------------------------
  // PLANS & FEATURES
  // -------------------------

  /**
   * Get all available payment plans
   * @returns {Promise<Array>} List of plans with features
   */
  getAllPlans: async () => {
    const res = await appInstance.get('/payment/getAllPlans');
    return res.data;
  },

  /**
   * Get a specific plan by ID
   * @param {string} planId - Plan ID
   * @returns {Promise<Object>} Plan details with features
   */
  getPlanById: async (planId) => {
    const res = await appInstance.get(`/payment/plan/${planId}`);
    return res.data;
  },

  /**
   * Get all available features
   * @returns {Promise<Array>} List of features
   */
  getFeatures: async () => {
    const res = await appInstance.get('/payment/features');
    return res.data;
  },


  // -------------------------
  // ACTIVE SUBSCRIPTION
  // -------------------------

  /**
   * Get user's current active subscription
   * @returns {Promise<Object|null>} Active subscription details or null
   */
  getActivePlan: async () => {
    const res = await appInstance.get('/payment/gethighestapplicableplan');
    return res.data;
  },

  /**
   * Get trial status for current subscription
   * @returns {Promise<Object>} Trial status with days remaining, next billing info
   */
  getTrialStatus: async () => {
    const res = await appInstance.get('/payment/subscription/trial-status');
    return res.data;
  },


  // -------------------------
  // SUBSCRIPTIONS (Razorpay)
  // -------------------------

  /**
   * Create a new subscription (with optional trial period)
   * @param {string} planId - Plan ID
   * @param {boolean} enableTrial - Whether to enable trial period (default: true)
   * @returns {Promise<Object>} Subscription details with payment URL
   */
  createSubscription: async (planId, enableTrial = true) => {
    const res = await appInstance.post('/payment/subscription/create', {
      planId,
      enableTrial,
    });
    return res.data;
  },

  /**
   * Cancel active subscription
   * @returns {Promise<Object>} Cancellation confirmation
   */
  cancelSubscription: async () => {
    const res = await appInstance.post('/payment/subscription/cancel');
    return res.data;
  },


  // -------------------------
  // ONE-TIME PURCHASE (Points)
  // -------------------------

  /**
   * Buy a plan using earned points/coins
   * @returns {Promise<Object>} Purchase details
   */
  buyPlanWithPoints: async () => {
    const res = await appInstance.post('/payment/points/basic');
    return res.data;
  },


  // -------------------------
  // AUTOPAY MANAGEMENT
  // -------------------------

  /**
   * Enable autopay for subscription
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Updated subscription
   */
  enableAutopay: async (paymentMethodId) => {
    const res = await appInstance.post('/payment/autopay/enable', {
      paymentMethodId,
    });
    return res.data;
  },

  /**
   * Disable autopay for subscription
   * @returns {Promise<Object>} Updated subscription
   */
  disableAutopay: async () => {
    const res = await appInstance.post('/payment/autopay/disable');
    return res.data;
  },

  /**
   * Get next renewal information
   * @returns {Promise<Object>} Next billing date, amount, plan details
   */
  getRenewalInfo: async () => {
    const res = await appInstance.get('/payment/autopay/renewal-info');
    return res.data;
  },


  // -------------------------
  // PAYMENT METHODS
  // -------------------------

  /**
   * Get saved payment methods
   * @returns {Promise<Array>} List of payment methods
   */
  getPaymentMethods: async () => {
    const res = await appInstance.get('/payment/payment-methods');
    return res.data;
  },

  /**
   * Set default payment method
   * @param {string} methodId - Payment method ID
   * @returns {Promise<Object>} Updated payment method
   */
  setDefaultPaymentMethod: async (methodId) => {
    const res = await appInstance.put('/payment/payment-methods/default', {
      methodId,
    });
    return res.data;
  },
};
