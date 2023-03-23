import BusinessModel from "../models/Business.js";

export const getAll = async (req,res) => {
    try {
        const bizs = await BusinessModel.find().exec();

        res.json(bizs);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти',
        });
    }
}

export const getOne = async (req,res) => {
    try {
        const business = await BusinessModel.find({ _id: req.params.id}).exec();

        res.json(business);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти',
        });
    }
}

export const create = async (req,res) => {
    try {
        const doc = new BusinessModel({
            bizName: req.body.bizName,
            bizType: req.body.bizType,
            bizPrice: req.body.bizPrice,
            sellPrice: req.body.sellPrice,
            maxProfit: req.body.maxProfit,
            minProfit: req.body.minProfit,
            risk: req.body.risk,
            requiredEnergy: req.body.requiredEnergy,
            requiredTime: req.body.requiredTime,
            imageUrl: req.body.imageUrl,
        });

        const business = await doc.save();

        res.json(business);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать',
        });
    }
}

export const update = async (req,res) => {
    try {
        await BusinessModel.updateOne({
            _id: req.params.id
        },{
            bizName: req.body.bizName,
            bizType: req.body.bizType,
            bizPrice: req.body.bizPrice,
            sellPrice: req.body.sellPrice,
            maxProfit: req.body.maxProfit,
            minProfit: req.body.minProfit,
            risk: req.body.risk,
            requiredEnergy: req.body.requiredEnergy,
            requiredTime: req.body.requiredTime,
            imageUrl: req.body.imageUrl,
        });

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить',
        });
    }
}

export const remove = async (req,res) => {
    try {
        BusinessModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err){
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить',
                    });
                }

                if (!doc){
                    return res.status(404).json({
                        message: 'Бизнес не найден'
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