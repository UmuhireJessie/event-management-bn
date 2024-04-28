import ChangePasswordValidation from '../validations/changePasswordValidations'

export default async function changePasswordValidate (req, res, next) {
  const { body } = req
  const { error } = await ChangePasswordValidation(body)
  if (error) {
    return res.status(400).json({ status: 'fail', message: error.message })
  }
  next()
}
