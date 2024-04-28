import otpValidation from '../validations/otpValidations'

export default async function otpValidate (req, res, next) {
  const { body } = req
  const { error } = otpValidation(body)
  if (error) {
    return res.status(400).json({ status: 'fail', message: error.message })
  }
  next()
}
