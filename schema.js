const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    description: Joi.string().required(),

    image: Joi.object({
      url: Joi.string().required(),
      filename: Joi.string().required()
    }).optional()

  }).required()
});

module.exports.reviewSchema = Joi.object({
   review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comments: Joi.string().required(),
    }).required()
})



module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string()
            .required()
            .messages({
                "string.empty": "Username cannot be empty.",
                "any.required": "Username is required."
            }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                "string.email": "Please provide a valid email address.",
                "string.empty": "Email cannot be empty.",
                "any.required": "Email is required."
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.min": "Password must be at least 6 characters long.",
                "string.empty": "Password cannot be empty.",
                "any.required": "Password is required."
            })
    }).required()
});
