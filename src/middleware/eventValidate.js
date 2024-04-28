import AddEventValidation from '../validations/eventValidations'

export default async function addEventMiddleware (req, res, next) {
  const { body } = req
  const { error } = await AddEventValidation(body)

  if (error) {
    const errorMessage = error.details.map(err => err.message).join(' ')
    return res.status(400).json({ status: 'fail', message: errorMessage })
  }
  next()
}
