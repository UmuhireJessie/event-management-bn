import joi from "joi";
import { joiPasswordExtendCore } from "joi-password";

const joiPassword = joi.extend(joiPasswordExtendCore);

async function SignUpValidation(data) {
  const schema = joi.object({
    firstName: joi.string().min(3).required().label("firstName"),
    lastName: joi.string().min(3).required().label("lastName"),
    email: joi.string().email().label("email"),
    phoneNumber: joi.number().required().label("phoneNumber"),
    role: joi.string().label("role"),
    password: joiPassword
      .string()
      .min(8) // Minimum length of 8 characters
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"
        )
      ) // At least one uppercase letter, one lowercase letter, one digit, and one special character
      .label("password")
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
        "any.required": "Password is required",
      }),
  });

  return await schema.validate(data, {
    abortEarly: false,
  });
}

export default SignUpValidation;
