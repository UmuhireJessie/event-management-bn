import joi from "joi";

async function AddBookingValidation(data) {
  const schema = joi.object({
    bookedTickets: joi
      .array()
      .items(
        joi.object({
          type: joi.string().required(),
          amount: joi.number().required(),
          bookedSeats: joi.number().required().label("bookedSeats"),
        })
      )
      .required()
      .label("bookedTickets"),
  });

  return await schema.validate(data, {
    abortEarly: false,
  });
}

export default AddBookingValidation;
