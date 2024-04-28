import joi from "joi";

export default function otpValidation(data) {
  const Schema = joi.object({
    phoneNumber: joi.string().required().label("phoneNumber"),
    otp: joi.number().required().label("otp"),
  });

  return Schema.validate(data, {
    abortEarly: false,
  });
}
