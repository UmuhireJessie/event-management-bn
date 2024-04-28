import { User } from '../database/models'
import { Jwt } from '../utils/jwt'

async function isAuthenticated (req, res, next) {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Missing Authentication Token' })
    }
    const token = authorization.split(' ')[1]
    try {
      const decodedToken = Jwt.verifyToken(token)
      if (decodedToken.expired !== undefined){
        const phone = decodedToken.expired
        User.findOne({
          where: { phoneNumber: phone }
        }).then(async (user) => {
          if (user) {
            await user.update({ isLoggedIn: false });
          }
        });
        return res.status(401).json({
          status: 'fail',
          message: 'Unauthorized Access'
        });
      }
      const { phoneNumber } = decodedToken.value
      const user = await User.findOne({
        where: { phoneNumber }
      })
      if (!user) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'Unauthorized Access' })
      }
      req.user = user
      next()
    } catch (err) {
      console.log(err)
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication Error'
      })
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', error: error.message })
  }
}

export default isAuthenticated
