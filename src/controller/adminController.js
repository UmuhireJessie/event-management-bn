import UserSvc from '../service/userService'

class Admin {
  static async registerAdmin(req, res) {
    try {
      const { data, message } = await UserSvc.register(req.body, True);
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
          message: `Your OTP is: ${otpCode} and your Password is ${req.body.password}.\nYou can change the password after verifying your account`,
        };
        await sendSMS(payload);
        return res.status(201).json({
          status: "success",
          message: "Admin created successfully",
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
  static async getAllUsers (req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;

      const { allUsers, totalCount } = await UserSvc.getAllUsers(pageSize, offset);

      return res.status(200).json({
        status: 'success',
        data: allUsers,
        page,
        pageSize,
        total: totalCount
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message })
    }
  }
  static async getOneUser (req, res) {
    try {
      const { id } = req.params
      const user = await UserSvc.getUserById(id)
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        })
      }
      return res.status(200).json({
        status: 'success',
        data: user
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message })
    }
  }
  static async deleteUser (req, res) {
    try {
      const { id } = req.params
      const { userId } = req.user
      const user = await UserSvc.getUserById(id)
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        })
      }
      if (user.role === 'admin' && id === userId) {
        return res.status(200).json({
          status: 'success',
          message: 'Sorry, you can not delete yourself as an admin'
        })
      }
      await user.destroy()
      return res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message })
    }
  }
  static async updateUser (req, res) {
    try {
      const { id } = req.params
      const user = await UserSvc.getUserById(id)
      if (!user) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'User not found' })
      }
      const { error, value } = await UserSvc.updateUser(req.body, id)
      if (error) {
        return res.status(400).json({ status: 'fail', error })
      }
      return res.status(200).json({
        status: 'success',
        data: value
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message })
    }
  }
}
export default Admin
