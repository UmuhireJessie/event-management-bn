import joi from "joi";

async function AddEventValidation(data) {
  const schema = joi.object({
    title: joi.string().min(3).required().label("title"),
    description: joi.string().min(3).required().label("description"),
    eventDate: joi.string().isoDate().required().label("eventDate"),
    location: joi.string().min(3).required().label("location"),
    ticket: joi
      .array()
      .items(
        joi.object({
          type: joi.string().required(),
          amount: joi.number().required(),
          availableSeats: joi.number().required().label("availableSeats"),
        })
      )
      .required()
      .label("ticket"),
  });

  return await schema.validate(data, {
    abortEarly: false,
  });
}

export default AddEventValidation;
