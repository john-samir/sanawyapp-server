const jwt = require('jsonwebtoken');
const Servant = require('../models/Servant');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const AppError = require('../utils/AppError');
//Constants
const { ERROR_MESSAGES } = require('../utils/constants');


async function loginServant({ email, password }) {
  const servant = await Servant.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!servant) {
    throw new AppError(ERROR_MESSAGES.AUTH.INVALID_LOGIN, 401);
  }

  const valid = await servant.checkPassword(password);
  if (!valid) {
    throw new AppError(ERROR_MESSAGES.AUTH.INVALID_LOGIN, 401);
  }

  const payload = {
    id: servant._id,
    name: servant.name,
    isAdmin: servant.isAdmin,
    isAmin: servant.isAmin,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    servant: {
      id: servant._id,
      name: servant.name,
      email: servant.email,
      isAdmin: servant.isAdmin,
      isAmin: servant.isAmin,
    }
  };
}

async function logoutServant(servant) {
  // Stateless logout → do nothing
  return true;
}

async function changePassword(servant, currPassword, newPassword) {
  if (!await servant.checkPassword(currPassword)) {
    throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CURRENT_PASSWORD, 401);
  }

  await servant.setPassword(newPassword);
  await servant.save();
}

async function resetPassword(servantId, newPassword) {
  const servant = await Servant.findById(servantId);
  if (!servant) {
    throw new AppError(ERROR_MESSAGES.SERVANT.NOT_FOUND, 404);
  }
  await servant.setPassword(newPassword);
  await servant.save();
}


module.exports = {
  loginServant,
  logoutServant,
  changePassword,
  resetPassword,
};
