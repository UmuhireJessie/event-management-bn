import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class Jwt {
  static generateToken (data, exp = '1d') {
    return JWT.sign(data, process.env.JWT_SECRET, { expiresIn: exp })
  }

  static verifyToken (token) {
    return JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          const  { phoneNumber }  = JWT.decode(token);
          return { expired: phoneNumber}
        }
        return { error: err }
      }
      return { value: decoded }
    })
  }
}
