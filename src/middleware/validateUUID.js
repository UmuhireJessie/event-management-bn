import { validate } from 'uuid'

const validateUUIDMiddleware = (req, res, next) => {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid UUID' })
  }
  next()
}

export default validateUUIDMiddleware
