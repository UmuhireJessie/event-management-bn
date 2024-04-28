import bcrypt from "bcrypt";
import UserSvc from "../service/userService";
import { Jwt } from "../utils/jwt";
import { User } from "../database/models";
import sendEmail from "../utils/sendEmail";

const saltRounds = Number(process.env.SALTROUNDS) || 10;

class Users {
  static async register(req, res) {
    try {
      const { data, message } = await UserSvc.register(req.body);
      if (message) {
        return res.status(400).json({
          status: "fail",
          message,
        });
      }
      const { phoneNumber, email, userId } = data;
      if (phoneNumber) {
        const otpCode = await UserSvc.otProcess(phoneNumber);
        const payload = {
          userId,
          email,
          subject: "Account Verification",
          message: `Your OTP is: ${otpCode}`,
        };
        await sendEmail(payload);
        return res.status(200).json({
          status: "success",
          message: "Please check your email for OTP code",
        });
      }
    } catch (error) {
      console.log("Error on registering user: ", error);
      return res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
  static async login(req, res) {
    try {
      const { identifier, password } = req.body;
      let user;
      if (!isNaN(identifier)) {
        user = await User.findOne({
          where: { phoneNumber: UserSvc.reformatPhoneNumber(identifier) },
        });
      } else {
        user = await User.findOne({
          where: { email: identifier },
        });
      }
      if (!user) {
        return res
          .status(404)
          .json({ status: "fail", message: "Account does not exist" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ status: "fail", message: "Incorrect Credentials" });
      }
      if (user.isVerified === false) {
        const phoneNumber = user.phoneNumber;
        const otpCode = await UserSvc.otProcess(phoneNumber);
        const payload = {
          userId: user.userId,
          email,
          subject: "Account Verification",
          message: `Your OPT is: ${otpCode}`,
        };
        await sendEmail(payload);
        return res.status(200).json({
          status: "success",
          message: "Please check your email for OTP code to login",
          phoneNumber,
        });
      }
      if (user.isActive === false) {
        return res.status(400).json({
          status: "fail",
          message:
            "Your account is deactivated please contact system administrator to activate it",
        });
      }

      const token = Jwt.generateToken({
        phoneNumber: user.phoneNumber,
        userId: user.userId,
        role: user.role,
        isLoggedIn: user.isLoggedIn,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      const decodedToken = Jwt.verifyToken(token);
      const { exp } = decodedToken.value;
      const expInMilliseconds = exp * 1000;
      const expirationDate = new Date(expInMilliseconds);
      const formattedExpiration = expirationDate.toLocaleString();
      return res.status(200).json({
        status: "success",
        data: {
          identifier: identifier,
          token,
          expiration: formattedExpiration,
          message: "Successfully logged in",
        },
      });
    } catch (error) {
      console.log("Error on logging in user: ", error);
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async verifyotpCode(req, res) {
    try {
      const otpCode = Number(req.body.otp);
      if (isNaN(otpCode)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid otpCode" });
      }
      const [isValid, message] = await UserSvc.isotpValid(
        req.body.phoneNumber,
        req.body.otp
      );

      if (isValid) {
        const user = await User.findOne({
          where: { phoneNumber: req.body.phoneNumber },
        });
        const token = Jwt.generateToken({
          phoneNumber: user.phoneNumber,
          userId: user.userId,
          role: user.role,
          isLoggedIn: user.isLoggedIn,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });

        const decodedToken = Jwt.verifyToken(token);
        const { exp } = decodedToken.value;
        const expInMilliseconds = exp * 1000;
        const expirationDate = new Date(expInMilliseconds);
        const formattedExpiration = expirationDate.toLocaleString();
        return res.status(200).json({
          status: "success",
          token,
          expiration: formattedExpiration,
          message: "Successfully logged in",
        });
      }
      return res.status(400).json({ status: "fail", message });
    } catch (error) {
      console.log("Error in verifying otp: ", error);
      return res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const { user } = req;
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ status: "fail", message: "Incorrect old password" });
      }
      const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = newHashedPassword;
      if (user.mustChangePassword) {
        user.mustChangePassword = false;
      }
      await user.save();
      return res
        .status(200)
        .json({ status: "success", message: "Password updated successfully" });
    } catch (err) {
      console.log("Error on change password: ", err);
      res.status(500).json({
        status: "error",
        err: err.message,
      });
    }
  }
  static async resendOTP(req, res) {
    try {
      const { phoneNumber } = req.body;
      const user = await User.findOne({ where: { phoneNumber } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const otpCode = await UserSvc.otProcess(phoneNumber);
      const payload = {
        userId: user.userId,
        email,
        subject: "Resending One-Time-Password",
        message: `Your OTP is: ${otpCode}`,
      };
      await sendEmail(payload);
      return res
        .status(200)
        .json({ message: "OTP resent! Please check your email for the code" });
    } catch (error) {
      console.log("Error on resending OTP", error);
      return res.status(500).json({
        error: error.message,
        message: "Error occurred while resending OTP code",
      });
    }
  }
  static async forgotPassword(req, res) {
    try {
      const { phoneNumber } = req.body;
      const user = await User.findOne({ where: { phoneNumber } });
      if (!user) {
        return res
          .status(404)
          .json({ status: "fail", message: "User not found" });
      }
      const otpCode = await UserSvc.otProcesss(phoneNumber);
      const payload = {
        userId: user.userId,
        email,
        subject: "Forgot Password",
        message: `Your OTP is: ${otpCode}`,
      };
      await sendEmail(payload);
      return res.status(200).json({
        status: "success",
        message:
          "OTP sent! Please check your email for the code to reset your password",
      });
    } catch (error) {
      console.log("Error on forgot password: ", error);
      return res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
  static async resetPassword(req, res) {
    try {
      const otpCode = Number(req.params.otpCode);
      if (isNaN(otpCode)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid otpCode" });
      }
      const { newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const [isValid, message] = await UserSvc.verifyResetToken(
        otpCode,
        hashedPassword
      );
      if (isValid) {
        return res
          .status(200)
          .json({ status: "success", message: "Password reset successfully" });
      } else {
        return res.status(400).json({ status: "fail", message });
      }
    } catch (error) {
      console.log("Error on reset password: ", error);
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async changeUserStatus(req, res) {
    try {
      const { id } = req.params;
      const user = await UserSvc.getUserById(id);
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }
      const users = await UserSvc.changeUserStatus(id);
      const statusMessage = users.isActive ? "activated" : "deactivated";
      return res.status(200).json({
        status: "success",
        message: `User ${statusMessage} successfully`,
      });
    } catch (err) {
      console.log("Error on change user status: ", err);
      return res.status(500).json({
        status: "error",
        error: err.message,
      });
    }
  }
  static async getProfile(req, res) {
    try {
      const { userId } = req.user;
      const user = await UserSvc.getUserById(userId);
      return res.status(200).json({ status: "success", data: user });
    } catch (err) {
      console.log("Error on get profile: ", err);
      return res.status(500).json({
        status: "error",
        error: err.message,
      });
    }
  }
  static async updateProfile(req, res) {
    try {
      const { userId } = req.user;
      const { error, value } = await UserSvc.updateUser(req.body, userId);

      if (error) {
        return res.status(400).json({ status: "fail", error });
      }

      return res.status(200).json({
        status: "success",
        data: value,
      });
    } catch (err) {
      console.log("Error on update profile: ", err);
      return res.status(500).json({
        status: "error",
        error: err.message,
      });
    }
  }
}
export default Users;
