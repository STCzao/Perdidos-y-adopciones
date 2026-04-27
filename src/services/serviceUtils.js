export const mapServiceError = (error, fallbackMsg, extra = {}) => ({
  success: false,
  msg: error.response?.data?.msg || fallbackMsg,
  errors: error.response?.data?.errors || {},
  status: error.response?.status,
  ...error.response?.data,
  ...extra,
});

export const buildServiceSuccess = (payload = {}) => ({
  success: true,
  ...payload,
});
