import AddBookingValidation from '../validations/bookingValidations'

export default async function addBookingMiddleware (req, res, next) {
  const { body } = req
  const { error } = await AddBookingValidation(body)

  if (error) {
    const errorMessage = error.details.map(err => err.message).join(' ')
    return res.status(400).json({ status: 'fail', message: errorMessage })
  }
  next()
}
