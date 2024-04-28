import PasswordValidation from '../validations/passwordValidations'

export default async function passwordValidate (req, res, next) {
  const { body } = req
  const { error } = await PasswordValidation(body)
  if (error) {
    return res.status(400).json({ status: 'fail', message: error.message })
  }
  next()
}
