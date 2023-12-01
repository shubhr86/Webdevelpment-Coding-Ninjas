import {
  updateUserPasswordRepo,
  userLoginRepo,
  userRegistrationRepo,
} from "./user.repository.js";
import jwt from "jsonwebtoken";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import bcrypt from 'bcrypt';


export const userRegistration = async (req, res, next) => {
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);
  const resp = await userRegistrationRepo({ ...req.body, password });
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "user registeration successful",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

// export const userLogin = async (req, res, next) => {
//   const resp = await userLoginRepo(req.body);
//   if (resp.success) {
//     const token = jwt.sign({ _id: resp.res._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res
//       .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
//       .json({ success: true, msg: "user login successful", token });
//   } else {
//     next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
//   }
// };
export const userLogin = async (req, res, next) => {
  const resp = await userLoginRepo(req.body);

  if (resp.success) {
      const token = jwt.sign({ _id: resp.res._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
      });

      res
          .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
          .json({ success: true, msg: "user login successful", token });
  } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};


export const updateUserPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const resp = await updateUserPasswordRepo(req._id, newPassword, next);
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "password updated successfully",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const userLogout = (req, res, next) => {
  res.clearCookie("jwtToken").json({ success: true, msg: "logout successful" });
};