import express from "express";
import Users from "../controller/userController";
import signupValidate from "../middleware/signUpValidate";
import { checkUserExist } from "../middleware/checkUser";
import loginValidate from "../middleware/loginValidate";
import otpValidate from "../middleware/otpValidate";
import changePasswordValidate from "../middleware/changePassword";
import isAuthenticated from "../middleware/verifyToken";
import checkRole from "../middleware/checkRole";
import Admin from "../controller/adminController";
import validateUUIDMiddleware from "../middleware/validateUUID";
import passwordValidate from "../middleware/passwordValidate";
import profileValidate from "../middleware/profileValidate";

const router = express.Router();
router.post("/register", signupValidate, checkUserExist, Users.register);
router.post(
  "/registerAdmin",
  isAuthenticated,
  checkRole("admin"),
  signupValidate,
  checkUserExist,
  Admin.registerAdmin
);
router.post("/login", loginValidate, Users.login);
router.post("/verify-otp", otpValidate, Users.verifyotpCode);
router.post("/resend-otp", Users.resendOTP);
router.post("/forgot-password", Users.forgotPassword);
router.post("/reset-password/:otpCode", passwordValidate, Users.resetPassword);
router.get("/profile", isAuthenticated, Users.getProfile);
router.get("/all", isAuthenticated, checkRole("admin"), Admin.getAllUsers);
router.get(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  Admin.getOneUser
);
router.patch(
  "/status/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  Users.changeUserStatus
);
router.patch(
  "/change-password",
  isAuthenticated,
  changePasswordValidate,
  Users.changePassword
);
router.patch(
  "/profiles",
  isAuthenticated,
  profileValidate,
  Users.updateProfile
);
router.patch(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  Admin.updateUser
);
router.delete(
  "/:id",
  validateUUIDMiddleware,
  isAuthenticated,
  checkRole("admin"),
  Admin.deleteUser
);
export default router;
