import joi from 'joi'

export default function loginValidation (data) {
  const schema = joi.object({
    identifier: joi.string().required().label('Identifier'),
    password: joi.string().required().label('Password')
  })

  return schema.validate(data, {
    abortEarly: false
  })
}
