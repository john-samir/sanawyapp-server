const authService = require('../services/authService');
const { successResponse } = require('../utils/helpers');

//Constants
const { SUCCESS_MESSAGES } = require('../utils/constants');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginServant({ email, password });
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logoutServant(req.servant);
    return successResponse(res, { message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currPassword, newPassword } = req.body;
    await authService.changePassword(req.servant, currPassword, newPassword);
    return successResponse(res, { message: SUCCESS_MESSAGES.AUTH.PASSWORD_CHANGE_SUCCESS });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  logout,
  changePassword
};
