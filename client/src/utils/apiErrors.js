const readErrorMessage = (error) =>
  String(error?.response?.data?.message || error?.message || '')
    .trim();

const looksLikeInfrastructureError = (message) =>
  /querySrv|getaddrinfo|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT|Mongo|_mongodb\._tcp|server selection|database connection|backend service is temporarily unavailable/i.test(
    String(message || '')
  );

export const getApiErrorMessage = (error, fallbackMessage) => {
  const message = readErrorMessage(error);

  if (!message) {
    return fallbackMessage;
  }

  if (looksLikeInfrastructureError(message)) {
    return fallbackMessage;
  }

  return message;
};

export const getAdminLoginErrorMessage = (error) => {
  const status = Number(error?.response?.status || 0);
  const code = String(error?.code || '').trim().toUpperCase();
  const message = readErrorMessage(error);

  if (!status && ['ERR_NETWORK', 'ECONNREFUSED', 'ECONNRESET', 'ENOTFOUND', 'EAI_AGAIN'].includes(code)) {
    return 'Admin sign-in is unavailable because the server cannot be reached. Make sure the backend is running and the API host is correct.';
  }

  if (!status && ['ECONNABORTED', 'ETIMEDOUT'].includes(code)) {
    return 'Admin sign-in timed out before the server responded. Please try again in a moment.';
  }

  if (!status && looksLikeInfrastructureError(message)) {
    return 'Admin sign-in is unavailable because the server database connection is not healthy. Check the MongoDB connection string, DNS, and network access.';
  }

  if (status === 400) {
    if (/username|password/i.test(message)) {
      return 'Enter a valid admin username and password, then try again.';
    }

    return message || 'The admin login request is incomplete or invalid.';
  }

  if (status === 401) {
    return 'Username or password is incorrect.';
  }

  if (status === 403) {
    return 'This account is signed in but does not have permission to open the admin portal.';
  }

  if (status === 404) {
    return 'Admin login is not available on this server. Check that the admin auth route is deployed correctly.';
  }

  if (status === 408) {
    return 'Admin sign-in timed out. Please try again.';
  }

  if (status === 429) {
    return 'Too many admin login attempts were received. Wait a moment and try again.';
  }

  if ([500, 502, 503, 504].includes(status)) {
    if (looksLikeInfrastructureError(message)) {
      return 'Admin sign-in is temporarily unavailable because the server database connection failed. Check MongoDB and server connectivity, then try again.';
    }

    return 'Admin sign-in is temporarily unavailable because a backend service failed. Please try again shortly.';
  }

  if (/admin access required/i.test(message)) {
    return 'This account does not have admin portal access.';
  }

  if (looksLikeInfrastructureError(message)) {
    return 'Admin sign-in is temporarily unavailable because the backend service is not healthy.';
  }

  return message || 'Admin login failed. Please try again.';
};
