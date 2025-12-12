const jwt = require('jsonwebtoken');
const Servant = require('../models/Servant');

const { JWT_SECRET } = process.env;

const AppError = require('../utils/AppError');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');


async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_MISSING, 401));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_INVALID, 401));
    }

    const token = parts[1];

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_INVALID, 401));
    }

    // Fetch servant from DB
    const servant = await Servant.findById(payload.id).select('+passwordHash');
    if (!servant) {
      return next(new AppError(ERROR_MESSAGES.SERVANT.NOT_FOUND, 401));
    }

    // attach user to request
    req.servant = servant;
    // req.servant = {
    //   id: servant._id,
    //   name: servant.name,
    //   isAdmin: servant.isAdmin,
    //   isAmin: servant.isAmin,
    // };

    next();
  } catch (err) {
    next(new AppError(ERROR_MESSAGES.AUTH.TOKEN_INVALID, 401));
  }
}

function requireAdmin(req, res, next) {
  if (!req.servant || !req.servant.isAdmin) {
    return next(new AppError(ERROR_MESSAGES.AUTH.ADMIN_ONLY, 403));
  }
  next();
}

function requireAmin(req, res, next) {
  if (!req.servant || !req.servant.isAmin) {
    return next(new AppError(ERROR_MESSAGES.AUTH.AMIN_ONLY, 403));
  }
  next();
}

function requireAdminOrAmin(req, res, next) {
  // Ensure req.servant exists and is either an admin or an amin
  if (!req.servant || (!req.servant.isAdmin && !req.servant.isAmin)) {
    return next(new AppError(ERROR_MESSAGES.AUTH.ADMIN_OR_AMIN_ONLY, 403));
  }
  next();
}

module.exports = {
  authenticate,
  requireAdmin,
  requireAmin,
  requireAdminOrAmin
};
