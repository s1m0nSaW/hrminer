import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import EmployerModel from '../models/Employer.js';

dotenv.config()

const secret = process.env.SECRET

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new EmployerModel({
            name: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            applicants: req.body.applicants,
            positions: req.body.positions,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, secret, {
            expiresIn: '30d',
        });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалoсь зарегистрироваться',
        });
    }
};

export const updatePositions = async (req, res) => {
    try {
        const user = await EmployerModel.findOneAndUpdate({
            _id: req.userId
        }, {
            $set:{
                positions: req.body.positions,
            }
        },{ returnDocument: "after" });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалoсь обновить информацию',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await EmployerModel.findOne({  email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        };

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, secret, {
            expiresIn: '30d',
        });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await EmployerModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};

export const getEmployer = async (req, res) => {
    try {
        const user = await EmployerModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        const { passwordHash, email, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await EmployerModel.find().exec();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти',
        });
    }
}

export const remove = async (req, res) => {
    try {
        EmployerModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пользователь не найден'
                    });
                }

                res.json({
                    success: true
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением',
        });
    }
}