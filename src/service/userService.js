import bcrypt from "bcrypt";
import { User } from "../database/models";
import { Op } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

const saltRounds = Number(process.env.SALTROUNDS);

class UserSvc {
  static reformatPhoneNumber(phoneNumber) {
    const numericDigits = phoneNumber.replace(/\D/g, "");

    if (numericDigits.length < 9) {
      return "Invalid Phone Number";
    }
    const last9Digits = numericDigits.slice(-9);
    const formattedPhoneNumber = `250${last9Digits}`;
    return formattedPhoneNumber;
  }

  static async register(data, isAdmin=null) {
    data.password = await bcrypt.hash(data.password, saltRounds);
    const { firstName, lastName, email, password, phoneNumber } = data;
    const phoneN = UserSvc.reformatPhoneNumber(phoneNumber);

    if (email || phoneN) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phoneNumber: phoneN }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return { message: "Email already exists" };
        } else {
          return { message: "Phone number already exists" };
        }
      }
    }

    if (phoneN !== "Invalid Phone Number") {
      const user = await User.create({
        firstName,
        lastName,
        email,
        role: isAdmin ? 'admin' : spectator,
        password,
        phoneNumber: phoneN,
      });
      return { data: user };
    }
  }

  static async otProcess(phoneNumber) {
    const user = await User.findOne({ where: { phoneNumber } });
    user.otp = Math.floor(Math.random() * 9000) + 1000;
    const timeout = (process.env.OTP_MINS || 3) * 60 * 1000;
    user.otpExpiration = new Date(Date.now() + timeout);
    await user.save();
    return user.otp;
  }

  static async otProcesss(phoneNumber) {
    const user = await User.findOne({ where: { phoneNumber } });
    user.resetToken = Math.floor(Math.random() * 9000) + 1000;
    const timeout = (process.env.OTP_MINS || 3) * 60 * 1000;
    user.resetTokenExpires = new Date(Date.now() + timeout);
    await user.save();
    return user.resetToken;
  }

  static async isotpValid(phoneNumber, otpCode) {
    const user = await User.findOne({ where: { phoneNumber } });
    if (user.otp !== otpCode) {
      return [false, "Invalid otp code"];
    }
    if (user.otpExpiration < new Date()) {
      return [false, "Otp code has expired"];
    }
    user.otpExpiration = new Date(Date.now() - 10 * 60 * 1000);
    user.isVerified = true;
    user.otp = null;
    await user.save();
    return [true];
  }

  static async verifyResetToken(otpCode, hashedPassword) {
    try {
      const user = await User.findOne({
        where: {
          resetToken: otpCode,
        },
      });
      if (!user) {
        return [false, "Invalid otp code"];
      }
      if (user.resetToken !== otpCode) {
        return [false, "Invalid otp code"];
      }
      if (user.resetTokenExpires < new Date()) {
        return [false, "Otp code has expired"];
      }
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();
      return [true];
    } catch (error) {
      return error;
    }
  }

  static async getAllUsers(pageSize, offset) {
    const totalCount = await User.count();
    const allUsers = await User.findAll({
      limit: pageSize,
      offset: offset,
    });

    return { allUsers, totalCount };
  }

  static async getUserById(userId) {
    const user = await User.findOne({
      where: { userId: userId },
    });
    if (user) {
      return user;
    }
  }

  static async updateUser(fields, userId) {
    const user = await User.findOne({ where: { userId: userId } });
    await user.update(fields);
    return { value: user };
  }

  static async changeUserStatus(userId) {
    const user = await User.findOne({ where: { userId: userId } });
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }
}
export default UserSvc;
