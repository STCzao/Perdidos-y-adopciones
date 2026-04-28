export const getResponseRequestId = (response) =>
  response?.headers?.["x-request-id"] ||
  response?.data?.requestId ||
  response?.headers?.["X-Request-Id"] ||
  "";

export const getErrorRequestId = (error) =>
  error?.response?.headers?.["x-request-id"] ||
  error?.response?.data?.requestId ||
  error?.response?.headers?.["X-Request-Id"] ||
  "";

export const withRequestIdMessage = (message, requestId) =>
  requestId ? `${message} (ID: ${requestId})` : message;

export const mapServiceError = (error, fallbackMsg, extra = {}) => ({
  ...error.response?.data,
  success: false,
  msg: error.response?.data?.msg || fallbackMsg,
  errors: error.response?.data?.errors || {},
  status: error.response?.status,
  requestId: getErrorRequestId(error),
  ...extra,
});

export const buildServiceSuccess = (payload = {}) => ({
  success: true,
  ...payload,
});
