import Joi from "joi";

const photoSchema = Joi.string().uri().required().messages({
  "string.uri": "La foto debe ser una URL válida.",
});

const clientSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "El nombre del cliente debe ser una cadena de texto.",
  }),
  phone: Joi.string()
    .min(8)
    .pattern(/^[0-9+]+$/)
    .required()
    .messages({
      "string.min": "El teléfono debe tener al menos 8 caracteres.",
      "string.pattern.base":
        "El teléfono sólo puede contener números y el carácter '+'.",
      "any.required": "El teléfono del cliente es obligatorio.",
    }),
});

export const createPhotoAlbumSchema = Joi.object({
  photos: Joi.array().items(photoSchema).unique().min(1).required().messages({
    "array.min": "Debe haber al menos una foto en el álbum.",
    "any.required": "Las fotos son obligatorias.",
    "array.unique": "Las fotos deben ser únicas.",
  }),
  client: clientSchema,
});

export const updatePhotoAlbumSchema = Joi.object({
  photos: Joi.array().items(photoSchema).unique().min(1).required().messages({
    "array.min": "Debe haber al menos una foto en el álbum.",
    "any.required": "Las fotos son obligatorias.",
    "array.unique": "Las fotos deben ser únicas.",
  }),
});
