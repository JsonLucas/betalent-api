import joi from 'joi';

export const saleSchema = joi.object({
  quantity: joi.number().integer().min(1).required().messages({
    'number.min': 'The quantity must be at least 1',
  }),
})
