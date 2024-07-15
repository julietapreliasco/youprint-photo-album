import Joi from "joi";

const username = Joi.string().alphanum().min(3).max(30).required().messages({
  "string.alphanum":
    "El nombre de usuario solo puede contener letras y números.",
  "string.min": "El nombre de usuario debe tener al menos 3 caracteres.",
  "string.max": "El nombre de usuario no puede tener más de 30 caracteres.",
  "any.required": "El nombre de usuario es obligatorio.",
});

const password = Joi.string().min(6).required().messages({
  "string.min": "La contraseña debe tener al menos 6 caracteres.",
  "any.required": "La contraseña es obligatoria.",
});

export const authSchema = Joi.object({
  username,
  password,
});
