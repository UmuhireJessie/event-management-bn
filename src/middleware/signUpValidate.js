import SignUpValidation from '../validations/signupValidations'

export default async function signupValidate (req, res, next) {
  const { body } = req
  const { error } = await SignUpValidation(body)

  if (error) {
    const errorMessage = error.details.map(err => err.message).join(' ')
    return res.status(400).json({ status: 'fail', message: errorMessage })
  }
  next()
}
