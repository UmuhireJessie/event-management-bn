import loginValidation from '../validations/loginValidations'

export default async function loginValidate (req, res, next) {
  const { body } = req
  const { error } = loginValidation(body)
  if (error) {
    return res.status(400).json({ status: 'fail', message: error.message })
  }
  next()
}
