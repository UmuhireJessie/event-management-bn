import joi from "joi";

async function PasswordValidation(data) {
  const schema = joi.object({
    newPassword: joi
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

export default PasswordValidation;
