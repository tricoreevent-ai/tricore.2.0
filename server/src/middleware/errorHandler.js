import { getMongoAvailabilityMessage, isMongoConnectivityError } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const shouldMaskServerMessage = (message) =>
  /SSL routines|tlsv1 alert|server selection|Could not connect to any servers|topology|querySrv|getaddrinfo|ENOTFOUND|EAI_AGAIN|_mongodb\._tcp|Mongo/i.test(
    String(message || '')
  );

export const errorHandler = (err, _req, res, _next) => {
  const connectivityFailure = isMongoConnectivityError(err);
  const statusCode = connectivityFailure ? 503 : err.statusCode || 500;
  const isOperationalClientError = err instanceof ApiError && statusCode < 500;
  const message = connectivityFailure
    ? getMongoAvailabilityMessage()
    : isOperationalClientError
      ? err.message || 'Request failed.'
      : statusCode >= 500
        ? 'A backend service is temporarily unavailable. Please try again shortly and check the server logs if the issue continues.'
        : shouldMaskServerMessage(err.message)
          ? 'Request failed because a backend service is temporarily unavailable.'
          : err.message || 'Internal server error.';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: statusCode < 500 ? err.details || null : null
  });
};
