import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js'
import ProfModel from '../models/Prof.js';

export const register = async (req, res) => {
    try {
        const profession = await ProfModel.findOne({ _id: req.body.profId });

        const doc = new UserModel({
            firstName: req.body.firstName,
            photo100: req.body.photo100,
            userId: req.body.userId,
            prof: profession.profName,
            salary: profession.salary,
            age: profession.age,
            children: profession.childCount,
            house: profession.house,
            car: profession.car,
            expenses: profession.expenses,
        });

        const user = await doc.save();

        res.json({user});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалoсь зарегистрироваться',
        });
    }
};

export const newGame = async (req, res) => {
    try {
        let params = new URLSearchParams(req.params.params);
        let id = params.get("vk_user_id")
        const profession = await ProfModel.findOne({ _id: req.body.profId });

        const user = await UserModel.findOneAndUpdate({
            userId: id
        }, {$set:{
            prof: profession.profName,
            salary: profession.salary,
            age: profession.age,
            children: profession.childCount,
            house: profession.house,
            car: profession.car,
            expenses: profession.expenses,
            workTime: 8,
            balance: 500,
            debts: 0,
            rent: [],
            bizs: [],
            carsharing:{
                status: false,
                date: 0,
            },
            deposit: {
                amount: 0,
                date: 0,
            },
            onGame: true,
            credits: [],
            energy: 100,
            time: 10,
            maxEnergy: 100,
            energizer: 0,
            freeEnergizerOn: true,
            greetingIn: [],
            greetingOut: [],
            disabled: [],
        }},{ returnDocument: "after" });

        if(user){res.json(user);}

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось начать новую игру',
        });
    }
};

export const update = async (req, res) => {
    try {
        const user = await UserModel.updateOne({
            _id: req.params.id
        }, {
            firstName: req.body.firstName,
            photo100: req.body.photo100,
            prof: req.body.prof,
            workTime: req.body.workTime,
            salary: req.body.salary,
            userId: req.body.userId,
            balance: req.body.balance,
            debts: req.body.debts,
            age: req.body.age,
            children: req.body.children,
            house: req.body.house,
            car: req.body.car,
            carsharing: req.body.carsharing,
            rent: req.body.rent,
            bizs: req.body.bizs,
            deposit: req.body.deposit,
            datePoint: req.body.datePoint,
            freeEnergizer: req.body.freeEnergizer,
            freeEnergizerCount: req.body.freeEnergizerCount,
            onGame: req.body.onGame,
            credits: req.body.credits,
            record: req.body.record,
            expenses: req.body.expenses,
            energy: req.body.energy,
            time: req.body.time,
            maxEnergy: req.body.maxEnergy,
            energizer: req.body.energizer,
            freeEnergizerOn: req.body.freeEnergizerOn,
            lifesCount: req.body.lifesCount,
            greetingIn: req.body.greetingIn,
            greetingOut: req.body.greetingOut,
            promoter: req.body.promoter,
            disabled: req.body.disabled,
        });

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ userId: req.body.userId });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', {
            expiresIn: '30d',
        });

        res.json({
            user,
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
        let params = new URLSearchParams(req.params.params);
        let id = params.get("vk_user_id")
        const user = await UserModel.findOne({ userId: id });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        res.json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find().exec();

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
        UserModel.findOneAndDelete(
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