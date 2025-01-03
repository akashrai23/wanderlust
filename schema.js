const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().allow('', null) // Validate `url` as a string or allow it to be empty or null
        }).required() // Ensures that `image` is a required object
    }).required() // Ensures that `listing` is a required object

}); 

module.exports.reviewSchema= Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})