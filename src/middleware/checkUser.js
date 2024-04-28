import { User } from "../database/models";
import { Op } from 'sequelize';

export const checkUserExist = async (req, res, next) => {
  try {
    const { phoneNumber, email } = req.body;
    if (email || phoneNumber) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phoneNumber }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return res
            .status(400)
            .json({ status: "fail", message: "Email already exists" });
        } else {
          return res
            .status(400)
            .json({ status: "fail", message: "Phone number already exists" });
        }
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};
