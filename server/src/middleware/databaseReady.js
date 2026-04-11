import { getDbStatus, getMongoAvailabilityMessage } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const requireDatabaseReady = (req, res, next) => {
  const dbStatus = getDbStatus();

  if (dbStatus.readyState === 1) {
    return next();
  }

  res.set('Retry-After', '5');

  return next(
    new ApiError(503, getMongoAvailabilityMessage(), {
      database: dbStatus,
      path: req.originalUrl || req.url || ''
    })
  );
};
