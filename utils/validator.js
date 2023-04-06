import { body } from "express-validator";

export const registerValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({ min: 5}),
]

export const applicantValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('name','Имя должно быть минимум 3 символа').isLength({ min: 3}),
]

export const loginValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Ошибка').isString(),
]